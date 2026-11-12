#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AADALA.MA — jurisprudence ingestion (additive, gated).

Reads Moroccan court-decision PDFs from a source directory, deduplicates them,
normalises the Arabic text layer, and keeps only sentences that pass an
Arabic-plausibility gate. Emits data/jurisprudence.json for the RAG layer.

The gate is data-driven, not a blocklist: a character-bigram model is trained on
the clean statutory corpus already shipped in data/legal-index.json, and a
sentence is rejected when too many of its tokens are implausible under that
model (the signature of a broken PDF font map / OCR pass).

Usage:
  python scripts/ingest-jurisprudence.py --source "C:\\path\\to\\pdfs"
  python scripts/ingest-jurisprudence.py --source ... --report   # dry run only

Requires: pypdf  (pip install pypdf)
No network access. Never writes to data/legal-index.json.
"""

import argparse
import json
import math
import os
import re
import sys
import unicodedata
from collections import Counter

try:
    from pypdf import PdfReader
except ImportError:
    sys.exit("pypdf is required: pip install pypdf")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX = os.path.join(ROOT, "data", "legal-index.json")
OUT = os.path.join(ROOT, "data", "jurisprudence.json")

AR = r"\u0621-\u064A"
AR_RE = re.compile(f"[{AR}]")
WORD_RE = re.compile(f"[{AR}]{{2,}}")
COMPACT_RE = re.compile(f"[{AR}]{{16,}}")          # absurdly long unspaced run
MIXED_RE = re.compile(f"[{AR}][A-Za-z0-9]|[A-Za-z0-9][{AR}]")
CONTROL_RE = re.compile(r"[\u0000-\u0008\u000B\u000C\u000E-\u001F]")
TATWEEL = "\u0640"
DIAC = re.compile(r"[\u064B-\u065F\u0670]")

# --- gate tuning -------------------------------------------------------------
TOKEN_MIN_LOGPROB = -7.6   # mean bigram log-prob below this = unreadable fragment
MAX_REMOVED_RATIO = 0.35   # drop a sentence when >35% of its characters had to be excised
MIN_KEEP_WORDS = 120       # a decision below this after gating is dropped entirely
MIN_KEEP_RATIO = 0.45      # ...or below this share of its original words

COURTS = {
    "فاس": "المحكمة التجارية بفاس",
    "طنجة": "المحكمة التجارية بطنجة",
    "وجدة": "المحكمة التجارية بوجدة",
    "مكناس": "المحكمة التجارية بمكناس",
    "الرباط": "المحكمة التجارية بالرباط",
    "الدار البيضاء": "المحكمة التجارية بالدار البيضاء",
}
TOPICS = [
    ("بنكي وقرض", ["البنك", "القرض", "الائتمان", "الكفيل", "الكفالة", "الرهن", "الفوائد"]),
    ("شيك وكمبيالة", ["الشيك", "الكمبيالة", "التظهير"]),
    ("شركات", ["الشركة", "المساهمين", "التصفية", "المدير", "السجل التجاري"]),
    ("كراء تجاري", ["الكراء", "المكتري", "المكري", "السومة"]),
    ("عقار", ["العقار", "التحفيظ", "الرسم العقاري"]),
    ("مسطرة", ["الاختصاص", "الاستئناف", "التبليغ", "الأداء", "الدعوى"]),
]


def norm(s: str) -> str:
    s = unicodedata.normalize("NFKC", s)
    s = s.replace(TATWEEL, "")
    s = DIAC.sub("", s)
    s = CONTROL_RE.sub(" ", s)
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r" *\n *", "\n", s)
    return re.sub(r"\n{3,}", "\n\n", s).strip()


def tokens(text: str):
    return WORD_RE.findall(text)


def train_bigram():
    with open(INDEX, encoding="utf-8") as f:
        raw = json.load(f)
    counts = Counter()
    for chunk in raw:
        t = norm(chunk.get("x", ""))
        for tok in tokens(t):
            padded = "\u0002" + tok + "\u0003"
            for a, b in zip(padded, padded[1:]):
                counts[a + b] += 1
    vocab = Counter()
    for tok in tokens(norm("".join(c.get("x", "") for c in raw))):
        vocab[tok] += 1
    return counts, vocab


def token_score(tok: str, counts: Counter, total: int) -> float:
    padded = "\u0002" + tok + "\u0003"
    if len(padded) < 3:
        return 0.0
    s = 0.0
    for a, b in zip(padded, padded[1:]):
        c = counts.get(a + b, 0)
        s += math.log((c + 1) / (total + 100000))
    return s / (len(padded) - 1)


def is_bad_token(tok: str, counts, total) -> bool:
    if MIXED_RE.search(tok):
        return True
    if len(tok) > 22:
        return True
    if len(tok) <= 4:
        return False          # short words carry too little signal
    return token_score(tok, counts, total) < TOKEN_MIN_LOGPROB


def is_broken_chunk(ch: str, counts, total) -> bool:
    """True for a whitespace-delimited fragment that cannot be read as Arabic:
    Arabic glued to digits/Latin, an implausible unspaced run, or a token whose
    character bigrams are far below anything the statutory corpus produces."""
    if MIXED_RE.search(ch) or len(ch) > 22:
        return True
    core = re.sub(rf"^[^{AR}]+|[^{AR}]+$", "", ch)
    if len(core) >= 5 and not re.search(r"[A-Za-z0-9]", core):
        return token_score(core, counts, total) < TOKEN_MIN_LOGPROB
    return False


def split_sentences(text: str):
    # PDF text layers wrap mid-sentence: join soft line breaks first, then split
    # on real sentence punctuation and blank-line paragraph breaks.
    joined = re.sub(r"(?<!\n)\n(?!\n)", " ", text)
    joined = re.sub(r"\n{2,}", "\n", joined)
    parts = re.split(r"(?<=[.؟!؛])\s+|\n+", joined)
    return [re.sub(r"\s+", " ", p).strip() for p in parts if p.strip()]


def excise(sent: str, counts, total):
    """Replace unreadable fragments with an explicit […] marker.

    Never silently rewrites: the reader sees that the source itself was
    damaged at that point. Returns (text, removed_chars, total_chars).
    """
    out, removed = [], 0
    for ch in sent.split():
        if is_broken_chunk(ch, counts, total):
            removed += len(ch)
            if not out or out[-1] != "[…]":
                out.append("[…]")
        else:
            out.append(ch)
    return " ".join(out), removed, len(sent)


def clean_decision(text: str, counts, total):
    kept, dropped = [], 0
    for sent in split_sentences(text):
        clean, removed, size = excise(sent, counts, total)
        words = len(tokens(clean))
        if words < 5 or removed / max(1, size) > MAX_REMOVED_RATIO:
            dropped += 1
            continue
        kept.append(re.sub(r"\s+", " ", clean))
    return kept, dropped


def detect_court(text: str) -> str:
    for key, name in COURTS.items():
        if key in text[:400]:
            return name
    return "محكمة تجارية (غير محددة في النص)"


def detect_topic(text: str) -> str:
    best, score = "تجاري عام", 0
    for name, words in TOPICS:
        s = sum(text.count(w) for w in words)
        if s > score:
            best, score = name, s
    return best


def grab(pat, text, default=""):
    m = re.search(pat, text)
    return re.sub(r"\s+", " ", m.group(1)).strip() if m else default


def chunk(sentences, size=760, hard_max=3):
    out, cur = [], ""
    for s in sentences:
        if cur and len(cur) + len(s) + 1 > size:
            out.append(cur)
            cur = s
        else:
            cur = (cur + " " + s).strip()
    if cur:
        out.append(cur)
    if len(out) > hard_max:
        out = out[: hard_max - 1] + [" ".join(out[hard_max - 1:])]
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--source", required=True, help="directory containing the decision PDFs")
    ap.add_argument("--report", action="store_true", help="print the report, do not write data/jurisprudence.json")
    ap.add_argument("--min-jaccard", type=float, default=0.7)
    ap.add_argument("--max-mb", type=float, default=10.0, help="skip PDFs larger than this (guards against stray big files)")
    args = ap.parse_args()

    counts, _ = train_bigram()
    total = sum(counts.values())
    print(f"bigram model: {total:,} transitions from data/legal-index.json")

    pdfs = sorted(
        f for f in os.listdir(args.source) if f.lower().endswith(".pdf")
    )
    decisions, skipped = [], []

    for name in pdfs:
        size_mb = os.path.getsize(os.path.join(args.source, name)) / 1_048_576
        if size_mb > args.max_mb:
            skipped.append({"file": name, "reason": f"larger than --max-mb ({size_mb:.1f} MB)"})
            continue
        print("reading", name, flush=True)
        try:
            reader = PdfReader(os.path.join(args.source, name))
            raw = "".join((p.extract_text() or "") for p in reader.pages)
        except Exception as e:  # corrupt/encrypted file — report, never crash the batch
            skipped.append({"file": name, "reason": f"unreadable: {e}"})
            continue
        text = norm(raw)
        if len(tokens(text)) < MIN_KEEP_WORDS:
            skipped.append({"file": name, "reason": "no usable text layer (scanned image?)", "words": len(tokens(text))})
            continue

        kept, dropped = clean_decision(text, counts, total)
        orig_words = len(tokens(text))
        kept_words = len(tokens(" ".join(kept)))
        if kept_words < MIN_KEEP_WORDS or kept_words / max(1, orig_words) < MIN_KEEP_RATIO:
            skipped.append({
                "file": name,
                "reason": "failed quality gate",
                "words_before": orig_words,
                "words_after": kept_words,
                "kept_ratio": round(kept_words / max(1, orig_words), 3),
            })
            continue

        body = "\n".join(kept)
        decisions.append({
            "sourceFile": name,
            "court": detect_court(text),
            "date": grab(r"الصادر\s*بتاريخ\s*([\d\s/\-]{6,14})", text),
            "caseNo": grab(r"ملف\s*عدد\s*([^\n]{0,26})", text),
            "appealNo": grab(r"رقم\s*([\d\s]{1,10})", text),
            "topic": detect_topic(text),
            "pages": len(reader.pages),
            "wordsBefore": orig_words,
            "wordsAfter": kept_words,
            "sentencesDropped": dropped,
            "text": body,
            "chunks": chunk(kept),
            "verified": False,
        })

    # --- deduplicate on 4+ letter token sets (keep the cleaner copy) ----------
    def tset(d):
        return set(re.findall(f"[{AR}]{{4,}}", d["text"]))

    unique = []
    for d in decisions:
        dup = None
        for u in unique:
            a, b = tset(d), tset(u)
            if a and b and len(a & b) / len(a | b) >= args.min_jaccard:
                dup = u
                break
        if dup:
            if d["wordsAfter"] > dup["wordsAfter"]:
                unique.remove(dup)
                unique.append(d)
                print(f"dedupe: {d['sourceFile']} replaces {dup['sourceFile']}")
            else:
                print(f"dedupe: {d['sourceFile']} is a duplicate of {dup['sourceFile']}")
            continue
        unique.append(d)

    unique.sort(key=lambda d: (d["court"], d["date"]))
    for i, d in enumerate(unique, 1):
        d["id"] = f"juris-{i:02d}"
        d["elisions"] = d["text"].count("[…]")
    payload = {
        "meta": {
            "kind": "jurisprudence",
            "verified": False,
            "note": "اجتهاد قضائي — مقتطفات من قرارات محاكم تجارية. ليست نصوصًا قانونية ملزمة، ولم تُراجع بشريًا بعد.",
            "gate": {
                "minTokenLogProb": TOKEN_MIN_LOGPROB,
                "maxRemovedRatio": MAX_REMOVED_RATIO,
                "minKeepRatio": MIN_KEEP_RATIO,
                "minKeptWords": MIN_KEEP_WORDS,
                "elisionMarker": "[…]",
            },
        },
        "decisions": unique,
        "skipped": skipped,
    }

    kept_words = sum(d["wordsAfter"] for d in unique)
    kept_chunks = sum(len(d["chunks"]) for d in unique)
    print(f"decisions kept: {len(unique)} | skipped: {len(skipped)} | words: {kept_words:,} | chunks: {kept_chunks}")
    for s in skipped:
        print("  SKIP", s)

    if args.report:
        print("report mode: nothing written")
        return
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=1)
    print("wrote", OUT)


if __name__ == "__main__":
    main()

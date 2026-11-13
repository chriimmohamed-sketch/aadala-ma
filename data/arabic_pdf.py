# -*- coding: utf-8 -*-
"""Arabic PDF text recovery helpers.

The uploaded PDFs are laid out visually (RTL glyphs stored left-to-right), so a
naive extractor returns every line mirrored: "39.08 مقر نوناقلا" instead of
"القانون رقم 39.08".  Reversing the line restores logical order, but numeric
runs must be pre-mirrored so they survive the reversal intact.
"""
from __future__ import annotations

import re
import unicodedata

NUMERIC_RUN = re.compile(r"[0-9\u0660-\u0669][0-9\u0660-\u0669.,:/\u066B\u066C-]*")

COMMON_WORDS = [
    "المادة", "القانون", "المغرب", "المملكة", "الفصل", "الباب", "الحقوق",
    "العقود", "المحكمة", "المحاكم", "القضاء", "الظهير", "قانون", "في", "من",
    "على", "إلى", "التي", "الذي", "هذا", "هذه", "أو", "أن", "كما", "تم",
    "الملكية", "العقارية", "الرسمية", "الجريدة",
]


def _mirror_numbers(line: str) -> str:
    """Reverse every numeric run so that a later full-line reversal restores it."""
    return NUMERIC_RUN.sub(lambda m: m.group(0)[::-1], line)


def unmirror_line(line: str) -> str:
    """Turn one visually-ordered RTL line into logical order."""
    if not line.strip():
        return line
    return _mirror_numbers(line)[::-1]


def normalize_arabic(text: str) -> str:
    """Fold presentation forms and unify common Arabic variants."""
    text = unicodedata.normalize("NFKC", text)
    # Merge reversed ligature artefacts produced by visual-order extraction.
    text = text.replace("اأ", "الأ").replace("اإ", "الإ").replace("اآ", "الآ")
    text = text.replace("لأا", "الا")
    text = text.replace("\u200f", "").replace("\u200e", "")
    text = re.sub(r"[\u0640]+", "", text)  # tatweel
    text = re.sub(r"[ \t]+", " ", text)
    return text.strip()


def score_text(text: str) -> int:
    hits = 0
    for word in COMMON_WORDS:
        hits += len(re.findall(r"(?<![\u0600-\u06FF])" + word + r"(?![\u0600-\u06FF])", text))
    return hits


def recover(text: str) -> str:
    """Normalize + unmirror a block of extracted text."""
    lines = text.splitlines()
    joined = "\n".join(lines)
    raw_score = score_text(normalize_arabic(joined))
    flipped = "\n".join(unmirror_line(ln) for ln in lines)
    flip_score = score_text(normalize_arabic(flipped))
    chosen = flipped if flip_score >= raw_score else joined
    out = []
    for line in chosen.splitlines():
        line = normalize_arabic(line)
        if line:
            out.append(line)
        elif out and out[-1] != "":
            out.append("")
    return "\n".join(out)


def confidence(text: str) -> float:
    """0..1 heuristic: share of Arabic letters plus common-word density."""
    if not text:
        return 0.0
    arabic = len(re.findall(r"[\u0600-\u06FF]", text))
    ratio = arabic / max(len(text), 1)
    words = len(text.split())
    density = score_text(text) / max(words, 1)
    return round(min(1.0, ratio * 0.6 + min(density, 0.4)), 3)


if __name__ == "__main__":
    sample = "39.08 مقر نوناقلا ،ةينيعلا قوقحلا ةنودمب قلعتملا .هميمتتو هرييغت مت امك"
    print(unmirror_line(sample))
    print(recover(sample))

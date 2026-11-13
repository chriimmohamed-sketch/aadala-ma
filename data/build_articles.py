# -*- coding: utf-8 -*-
"""Build article-level datasets from the uploaded PDFs.

Two extraction paths:
  * text-layer  : pypdf + visual-order recovery (clean PDFs)
  * ocr         : Windows.Media.Ocr page dumps in data/ocr/<doc>/ (broken fonts)

Outputs:
  data/legal-sources/articles/<doc-id>.json   (full articles, lazy-loaded by the site)
  data/legal-sources/articles/index.json      (manifest: counts, quality)
"""
from __future__ import annotations

import json
import re
import sys
from collections import Counter
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from arabic_pdf import confidence, recover, score_text  # noqa: E402

BASE = Path(__file__).resolve().parent / "legal-sources"
OCR = Path(__file__).resolve().parent / "ocr"
OUT = BASE / "articles"
TODAY = date.today().isoformat()

DOCS = [
    {"id": "loi-onc-ar", "file": "loi-onc-ar.pdf", "kind": "text", "marker": "الفصل", "labels": ["الفصل"]},
    {"id": "39-08-code-droits-reels", "file": "39-08-code-droits-reels.pdf", "kind": "text", "marker": "المادة", "labels": ["المادة"]},
    {"id": "code-droits-reels", "file": "code-droits-reels.pdf", "kind": "text", "marker": "المادة", "labels": ["المادة"]},
    {"id": "code-penal-maroc", "file": "code-penal-maroc.pdf", "kind": "ocr", "marker": "المادة", "labels": ["المادة", "الفصل"]},
    {"id": "constitution-marocaine-2011-ar", "file": "constitution-marocaine-2011-ar.pdf", "kind": "ocr", "marker": "الفصل", "labels": ["الفصل"]},
    {"id": "dahir-immatriculation-fonciere", "file": "dahir-immatriculation-fonciere.pdf", "kind": "ocr", "marker": "الفصل", "labels": ["الفصل", "المادة"]},
]

AR_DIGITS = str.maketrans("٠١٢٣٤٥٦٧٨٩", "0123456789")
HEADER_TAIL = r"(?:\s*مكرر)?"
UNIT_WORDS = {
    "الاول": 1, "الحادي": 1, "الحاديه": 1, "الواحد": 1, "الواحده": 1,
    "الاولي": 1, "الاوليه": 1,
    "الثاني": 2, "الثانيه": 2, "الثالث": 3, "الثالثه": 3,
    "الرابع": 4, "الرابعه": 4, "الخامس": 5, "الخامسه": 5,
    "السادس": 6, "السادسه": 6, "السابع": 7, "السابعه": 7,
    "الثامن": 8, "الثامنه": 8, "التاسع": 9, "التاسعه": 9,
    "العاشر": 10, "العاشره": 10,
}
TENS_WORDS = {
    "العشرون": 20, "العشرين": 20, "الثلاثون": 30, "الثلاثين": 30,
    "الاربعون": 40, "الاربعين": 40, "الخمسون": 50, "الخمسين": 50,
    "الستون": 60, "الستين": 60, "السبعون": 70, "السبعين": 70,
    "الثمانون": 80, "الثمانين": 80, "التسعون": 90, "التسعين": 90,
}
def _flexletters(word: str) -> str:
    """Make a literal Arabic word hamza/teh-marbuta tolerant for OCR text."""
    out = []
    for ch in word:
        if ch == "ا":
            out.append("[اأإآ]")
        elif ch == "ة":
            out.append("[ةه]")
        else:
            out.append(re.escape(ch))
    return "".join(out)


UNIT_PATTERN = "|".join(flexletters for flexletters in map(_flexletters, sorted(UNIT_WORDS, key=len, reverse=True)))
TENS_PATTERN = "|".join(map(_flexletters, sorted(TENS_WORDS, key=len, reverse=True)))
TEN_WORD = _flexletters("عشر")
ORDINAL_NUM = (
    rf"(?:{UNIT_PATTERN})(?:\s+و?\s*(?:{TEN_WORD}|(?:{TENS_PATTERN})))?|(?:{TENS_PATTERN})"
)
LONE_ALEF = r"(?<![\u0600-\u06FF])ا(?![\u0600-\u06FF])"
NUM = rf"(?:[0-9]+(?:\s*[-.]\s*[0-9]+)*|{ORDINAL_NUM}|{LONE_ALEF})"
TAIL_WITH_FOOTNOTE = r"(?:\s*مكرر(?:\s*[0-9]+)?)?\s*"


def header_patterns(labels: list[str]):
    alts = "|".join(labels)
    num = NUM + r"(?![\u0600-\u06FF])"
    plain = re.compile(
        rf"^(?:(?P<type1>{alts})\s*(?P<num1>{num})"
        rf"|(?P<num2>{num})\s*(?P<type2>{alts})){TAIL_WITH_FOOTNOTE}$"
    )
    inline = re.compile(
        rf"^(?:(?P<type1>{alts})\s*(?P<num1>{num})"
        rf"|(?P<num2>{num})\s*(?P<type2>{alts})){TAIL_WITH_FOOTNOTE}(?P<rest>\S.*)$"
    )
    return plain, inline


def arabic_ordinal(label: str) -> int | None:
    """Parse 'الرابع والأربعون' -> 44, 'الحادي عشر' -> 11, 'الأول' -> 1."""
    text = label.strip()
    text = text.replace("أ", "ا").replace("إ", "ا").replace("آ", "ا").replace("ة", "ه")
    text = text.replace("ى", "ي").replace("ئ", "ي")
    text = text.replace(" و", " ")
    tokens = [t for t in text.split() if t and t != "و"]
    if not tokens:
        return None
    values = []
    for token in tokens:
        if token in UNIT_WORDS:
            values.append(UNIT_WORDS[token])
        elif token in TENS_WORDS:
            values.append(TENS_WORDS[token])
        elif token in ("عشر", "عشرة"):
            values.append(10)
        else:
            return None
    if len(values) == 1:
        return values[0]
    if len(values) == 2:
        low, high = sorted(values)
        if high == 10 and low < 10:
            return 10 + low
        if high >= 20 and low < 10:
            return high + low
    return None
SECTION_RE = re.compile(r"^(الكتاب|الباب|القسم|الفرع|الجزء|التمهيد|فصل تمهيدي)\b")
PAGE_NO = re.compile(r"^[-\s]*[0-9]{1,4}[-\s]*$")
FOOTNOTE = re.compile(r"^[0-9]{1,3}\s*-\s+\S")

BOILERPLATE = {
    "الأمانة العامة للحكومة",
    "مركز الدراسات و أبحاث السياسة الجنائية",
    "مركز الدراسات وأبحاث السياسة الجنائية",
    "مجموعة النصوص القانونية المتعلقة بنظام التحفيظ العقاري",
    "المملكة المغربية",
    "وزارة العدل",
    "مديرية التشريع",
}


def clean_line(line: str) -> str:
    line = line.translate(AR_DIGITS)
    line = line.replace("\ufffd", "")
    line = re.sub(r"\s+", " ", line).strip(" \u200f\u200e")
    return line


def read_text_pages(pdf_path: Path) -> list[list[str]]:
    from pypdf import PdfReader

    reader = PdfReader(str(pdf_path))
    pages = []
    for page in reader.pages:
        try:
            text = recover(page.extract_text() or "")
        except Exception:  # noqa: BLE001
            text = ""
        pages.append(text.splitlines())
    return pages


def read_ocr_pages(folder: Path) -> list[list[str]]:
    """OCR lines come out with reversed word order and mirrored punctuation."""
    pages = []
    for path in sorted(folder.glob("*.txt")):
        raw = path.read_text(encoding="utf-8", errors="replace").splitlines()
        fixed = []
        for line in raw:
            stripped = line.lstrip()
            if stripped.startswith("("):
                # footnote marker line, e.g. "()4 إذا كان..."
                continue
            words = line.split()
            if not words:
                continue
            # leading/trailing punctuation belongs to the sentence, not a word
            lead = ""
            while words and words[0] and words[0][0] in ".:،؛":
                lead += words.pop(0)[0]
            trail = ""
            while words and words[-1] and words[-1][-1] in ".:،؛":
                trail = words.pop()[-1] + trail
            line = " ".join(reversed(words))
            fixed.append((line + trail).replace("  ", " ").strip())
        pages.append(fixed)
    return pages


def repeated_lines(pages: list[list[str]]) -> set[str]:
    counter: Counter[str] = Counter()
    for lines in pages:
        for line in {clean_line(x) for x in lines if x.strip()}:
            counter[line] += 1
    threshold = max(3, int(len(pages) * 0.3))
    return {line for line, n in counter.items() if n >= threshold and len(line) < 90}


def strip_page_furniture(pages: list[list[str]]) -> list[list[str]]:
    repeated = repeated_lines(pages) | BOILERPLATE
    cleaned = []
    for lines in pages:
        kept = []
        for idx, raw in enumerate(lines):
            line = clean_line(raw)
            if not line:
                continue
            if line in repeated:
                continue
            if PAGE_NO.match(line):
                continue
            if idx < 2 and line in BOILERPLATE:
                continue
            kept.append(line)
        cleaned.append(kept)
    return cleaned


def split_number(label: str) -> list[int]:
    nums = [int(x) for x in re.findall(r"[0-9]+", label)]
    # hyphenated labels with a 5+ digit chunk are footnote glue ("1-417108" == 417-1)
    if len(nums) > 1:
        nums = [n if len(str(n)) < 5 else int(str(n)[:3]) for n in nums]
    return nums


def normalize_label(label: str) -> str:
    """'1 - 65' -> '65-1' ; 'الرابع والأربعون' -> '44' ; '15' -> '15'."""
    label = label.strip()
    if label == "ا":
        return "1"
    words = arabic_ordinal(label)
    if words is not None:
        return str(words)
    nums = split_number(label)
    if not nums:
        return ""
    if len(nums) == 1:
        return str(nums[0])
    nums = sorted(nums, reverse=True)
    return "-".join(str(n) for n in nums)


CROSS_REF = re.compile(
    r"^(?:من\s+القانون|من\s+الظهير|السالف|المذكور|المشار|الأولى|الفريدة|السابق)"
)


def walk(pages: list[list[str]], labels: list[str], marker: str) -> tuple[list[dict], list[dict]]:
    header_re, header_inline_re = header_patterns(labels)
    sections: list[str] = []
    articles: list[dict] = []
    current = None
    last_number = 0
    corrections = []

    def close(page_no: int):
        nonlocal current
        if not current:
            return
        body = "\n".join(current["_lines"]).strip()
        body = re.sub(r"\n{3,}", "\n\n", body)
        if body:
            current["text"] = body
            articles.append(current)
        current = None

    for page_index, lines in enumerate(pages):
        page_no = page_index + 1
        for line in lines:
            match = header_re.match(line)
            rest = None
            im = None
            if not match:
                im = header_inline_re.match(line)
                if im:
                    raw = im.group("rest")
                    if raw.lstrip().startswith("."):
                        # footnote marker glued to the number: "الفصل 140 .من القانون"
                        im = None
                    else:
                        rest0 = raw.lstrip(" :؛،.-–—")
                        if (
                            re.search(r"[\w\u0600-\u06FF0-9]", rest0)
                            and not rest0.startswith("(")
                            and not CROSS_REF.match(rest0)
                        ):
                            match, rest = im, rest0
                        else:
                            im = None
            if match:
                ctype = match.group("type1") or match.group("type2") or marker
                label = (match.group("num1") or match.group("num2") or "").strip()
                number = normalize_label(label)
                if not number:
                    continue
                prefix = line[: len(line) - len(rest)] if rest and im else (
                    line[: len(line) - len(im.group("rest"))] if im else line
                )
                bis = "مكرر" in prefix
                # dot labels are footnote contamination ("الفصل2.15" = art. 2 + note 15)
                if "." in label:
                    first = split_number(label)[0]
                    number = str(first)
                    rest = None
                # sequence repair: footnote digits glued to the number ("515" after 4)
                base = number.split("-")[0]
                if "-" not in number and last_number and len(base) >= 3:
                    nxt = last_number + 1
                    if base.startswith(str(nxt)) and int(base) > last_number + 30:
                        corrections.append({"page": page_no, "raw": number, "fixed": str(nxt)})
                        number = str(nxt)
                        base = number
                    elif base.startswith(str(last_number)) and int(base) > last_number:
                        corrections.append({"page": page_no, "raw": number, "fixed": str(last_number)})
                        number = str(last_number)
                        base = number
                if bis:
                    number = number + "-مكرر"
                    base = base.split("-")[0]
                if current and number == current["article_number"]:
                    # same article continued after a page break / footnote line
                    current["page_to"] = page_no
                    if rest:
                        current["_lines"].append(rest)
                    continue
                if "-" in number and not bis:
                    try:
                        if int(base) < last_number - 1:
                            corrections.append({"page": page_no, "raw": number, "note": "bis label"})
                    except ValueError:
                        pass
                close(page_no)
                current = {
                    "article_number": number,
                    "raw_label": label,
                    "label": ctype,
                    "section": sections[-1] if sections else None,
                    "page_from": page_no,
                    "page_to": page_no,
                    "_lines": [],
                }
                if base.isdigit():
                    last_number = max(last_number, int(base))
                if rest:
                    current["_lines"].append(rest)
                continue
            if SECTION_RE.match(line) and len(line) < 90 and not line.endswith(("؛", "،", ".")):
                close(page_no)
                sections.append(line)
                if len(sections) > 6:
                    sections.pop(0)
                continue
            if current:
                current["_lines"].append(line)
                current["page_to"] = page_no
    close(len(pages))
    # keep only non-empty, meaningful articles
    result = []
    for art in articles:
        text = art.pop("text", "")
        if len(text) < 25:
            continue
        art["order_index"] = len(result) + 1
        art["text"] = text
        art["confidence"] = confidence(text)
        art.pop("_lines", None)
        result.append(art)
    # unique keys (numbering can legitimately repeat: dahir vs code, "مكرر")
    seen: Counter[str] = Counter()
    for art in result:
        seen[art["article_number"]] += 1
        art["key"] = (
            art["article_number"]
            if seen[art["article_number"]] == 1
            else f"{art['article_number']}--{seen[art['article_number']]}"
        )
    return result, corrections


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = {"generated": TODAY, "method_note": "", "documents": []}
    for doc in DOCS:
        pdf = BASE / doc["file"]
        if doc["kind"] == "ocr":
            folder = OCR / {"code-penal-maroc": "penal", "constitution-marocaine-2011-ar": "constitution",
                            "dahir-immatriculation-fonciere": "dahir"}.get(doc["id"], doc["id"])
            pages = read_ocr_pages(folder)
            method = "windows-ocr-ar"
        else:
            pages = read_text_pages(pdf)
            method = "pdf-text-layer"
        pages = strip_page_furniture(pages)
        articles, corrections = walk(pages, doc["labels"], doc["marker"])
        payload = {
            "document_id": doc["id"],
            "source_file": doc["file"],
            "extraction_method": method,
            "generated": TODAY,
            "page_count": len(pages),
            "article_count": len(articles),
            "corrections": corrections[:40],
            "articles": articles,
        }
        (OUT / f"{doc['id']}.json").write_text(
            json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8"
        )
        avg = round(sum(a["confidence"] for a in articles) / max(len(articles), 1), 3)
        manifest["documents"].append(
            {
                "document_id": doc["id"],
                "extraction_method": method,
                "article_count": len(articles),
                "page_count": len(pages),
                "avg_confidence": avg,
                "file": f"data/legal-sources/articles/{doc['id']}.json",
            }
        )
        print(f"{doc['id']:38s} method={method:14s} pages={len(pages):4d} articles={len(articles):5d} conf={avg}")

    manifest["method_note"] = (
        "استخراج آلي من ملفات PDF المرفوعة: طبقة نصية (pypdf) عند توفرها، "
        "أو OCR عربي (Windows.Media.Ocr) عندما يكون ترميز الخط تالفا. "
        "النص المستخرج غير مدقق ولا يحتج به إلا بعد مطابقته مع الجريدة الرسمية."
    )
    (OUT / "index.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")

    js = (
        "// Generated article manifest (see data/build_articles.py)\n"
        "const ArticlesDB = " + json.dumps(manifest, ensure_ascii=False, indent=2) + ";\n"
        "if (typeof window !== \"undefined\") window.ArticlesDB = ArticlesDB;\n"
    )
    (Path(__file__).resolve().parent.parent / "assets" / "js" / "articles-db.js").write_text(js, encoding="utf-8")
    print("manifest written:", OUT / "index.json")


if __name__ == "__main__":
    main()

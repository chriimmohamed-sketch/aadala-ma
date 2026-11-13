# -*- coding: utf-8 -*-
"""Compare text-extraction quality across PDFs and libraries.

Output: data/extraction-report.json
"""
import json
import re
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent / "legal-sources"
FILES = [
    "39-08-code-droits-reels.pdf",
    "code-droits-reels.pdf",
    "code-droits-reels-2.pdf",
    "dahir-immatriculation-fonciere.pdf",
    "code-penal-maroc.pdf",
    "constitution-marocaine-2011-ar.pdf",
    "loi-onc-ar.pdf",
    "bo-7437-ar.pdf",
]

ARABIC = re.compile(r"[\u0600-\u06FF]")
PRESENTATION = re.compile(r"[\uFB50-\uFEFF]")
COMMON = ["المادة", "القانون", "المغرب", "في", "من", "على", "أو", "التي", "هذا", "حق"]


def score(text):
    letters = ARABIC.findall(text)
    pres = PRESENTATION.findall(text)
    total = len(text) or 1
    hits = sum(len(re.findall(r"(?<![\u0600-\u06FF])" + w + r"(?![\u0600-\u06FF])", text)) for w in COMMON)
    art = len(re.findall(r"(?<![\u0600-\u06FF])المادة(?![\u0600-\u06FF])", text))
    art2 = len(re.findall(r"(?<![\u0600-\u06FF])(?:الماد[ةه]|ماد[ةه])\s*[0-9\u0660-\u0669]", text))
    return {
        "chars": len(text),
        "arabic_letters": len(letters),
        "arabic_ratio": round(len(letters) / total, 3),
        "presentation_forms": len(pres),
        "common_word_hits": hits,
        "mabada_markers": art,
        "article_number_markers": art2,
    }


def pypdf_text(path):
    from pypdf import PdfReader

    reader = PdfReader(str(path))
    return "\n".join((p.extract_text() or "") for p in reader.pages[:8])


def pdfminer_text(path):
    from pdfminer.high_level import extract_text as pm_extract

    return pm_extract(str(path), page_numbers=list(range(8)))


report = {}
only = sys.argv[1] if len(sys.argv) > 1 else None
for name in FILES:
    if only and only not in name:
        continue
    path = BASE / name
    if not path.exists():
        report[name] = {"error": "missing"}
        continue
    row = {}
    for lib, fn in (("pypdf", pypdf_text), ("pdfminer", pdfminer_text)):
        try:
            text = fn(path)
            row[lib] = score(text)
            row[lib + "_sample"] = text[:400]
        except Exception as exc:  # noqa: BLE001
            row[lib] = {"error": f"{type(exc).__name__}: {exc}"}
    report[name] = row

out = Path(__file__).resolve().parent / "extraction-report.json"
out.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
for name, row in report.items():
    print("=" * 70)
    print(name)
    for lib in ("pypdf", "pdfminer"):
        print(" ", lib, row.get(lib))
    print("  sample:", (row.get("pdfminer_sample") or row.get("pypdf_sample") or "")[:220].replace("\n", " "))

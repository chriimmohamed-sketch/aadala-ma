# -*- coding: utf-8 -*-
"""Per-page readability scan: data/page-scores.json"""
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from arabic_pdf import recover, score_text  # noqa: E402
from pypdf import PdfReader  # noqa: E402

BASE = Path(__file__).resolve().parent / "legal-sources"
NAMES = [p.name for p in sorted(BASE.glob("*.pdf"))]

out = {}
for name in NAMES:
    reader = PdfReader(str(BASE / name))
    pages = []
    for i, page in enumerate(reader.pages):
        try:
            text = recover(page.extract_text() or "")
        except Exception as exc:  # noqa: BLE001
            text = ""
        arabic = len(re.findall(r"[\u0600-\u06FF]", text))
        total = max(len(text), 1)
        pages.append(
            {
                "page": i + 1,
                "chars": len(text),
                "arabic": arabic,
                "ratio": round(arabic / total, 3),
                "hits": score_text(text),
            }
        )
    good = [p for p in pages if p["hits"] >= 6 and p["ratio"] >= 0.5]
    out[name] = {
        "page_count": len(pages),
        "good_pages": len(good),
        "good_ratio": round(len(good) / max(len(pages), 1), 3),
        "pages": pages,
    }
    print(f"{name:38s} pages={len(pages):4d} readable={len(good):4d} ({len(good)/max(len(pages),1):.0%})")

(Path(__file__).resolve().parent / "page-scores.json").write_text(
    json.dumps(out, ensure_ascii=False), encoding="utf-8"
)

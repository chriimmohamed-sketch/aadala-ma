# -*- coding: utf-8 -*-
"""Dump recovered text for one PDF (debug helper).

Usage: python data/dump_text.py <file.pdf> [pages]
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from arabic_pdf import recover  # noqa: E402
from pypdf import PdfReader  # noqa: E402

BASE = Path(__file__).resolve().parent / "legal-sources"
name = sys.argv[1]
pages = int(sys.argv[2]) if len(sys.argv) > 2 else 4
start = int(sys.argv[3]) if len(sys.argv) > 3 else 0
reader = PdfReader(str(BASE / name))
print("pages:", len(reader.pages))
for i in range(start, min(start + pages, len(reader.pages))):
    print("\n" + "=" * 30, "PAGE", i + 1, "=" * 30)
    print(recover(reader.pages[i].extract_text() or ""))

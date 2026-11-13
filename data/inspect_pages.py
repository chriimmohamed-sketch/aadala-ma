# -*- coding: utf-8 -*-
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_articles import read_text_pages, strip_page_furniture

pages = strip_page_furniture(read_text_pages(Path(__file__).resolve().parent / "legal-sources" / "loi-onc-ar.pdf"))
print("pages", len(pages))
for pg in [38, 39, 79, 80, 204, 205, 207, 208, 245, 246]:
    print("===== PAGE", pg + 1)
    for i, line in enumerate(pages[pg][:16]):
        print("  ", i, line[:120])

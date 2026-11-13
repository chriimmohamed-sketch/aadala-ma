# -*- coding: utf-8 -*-
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_articles as B

root = Path(__file__).resolve().parent
for name, pages_wanted in [
    ("39-08-code-droits-reels.pdf", [40]),
    ("code-penal-maroc.pdf", []),
]:
    print("#####", name)
    if name.startswith("39-08"):
        pages = B.strip_page_furniture(B.read_text_pages(root / "legal-sources" / name))
        for pg in pages_wanted:
            print("== page", pg + 1)
            for i, line in enumerate(pages[pg][:18]):
                print("  ", i, line[:110])
    else:
        pages = B.strip_page_furniture(B.read_ocr_pages(root / "ocr" / "penal"))
        for pg in [5, 6, 10, 144, 145, 146]:
            print("== page", pg + 1)
            for i, line in enumerate(pages[pg][:14]):
                print("  ", i, line[:110])

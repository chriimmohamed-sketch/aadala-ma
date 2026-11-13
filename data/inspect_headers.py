# -*- coding: utf-8 -*-
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_articles as B

pages = B.strip_page_furniture(B.read_text_pages(Path(__file__).resolve().parent / "legal-sources" / "loi-onc-ar.pdf"))
targets = {"140", "27", "949", "1"}
for pi, lines in enumerate(pages):
    for line in lines:
        m = B.HEADER_RE.match(line) or B.HEADER_INLINE_RE.match(line)
        if not m:
            continue
        label = (m.group("num1") or m.group("num2") or "").strip()
        num = B.normalize_label(label)
        if num in targets or label.split()[0].startswith(tuple(targets)):
            print(pi + 1, "|", num, "|", line[:120])

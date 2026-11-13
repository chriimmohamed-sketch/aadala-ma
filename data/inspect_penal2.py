# -*- coding: utf-8 -*-
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_articles as B

pages = B.strip_page_furniture(B.read_ocr_pages(Path(__file__).resolve().parent / "ocr" / "penal"))
header_re, inline_re = B.header_patterns(["المادة", "الفصل"])
print("=== matches with full context for pages 60-170 that map to small numbers")
for pi, lines in enumerate(pages):
    pg = pi + 1
    if pg not in {61, 67, 87, 99, 101, 128, 132, 141, 145, 156, 167, 169, 199, 207, 262, 331, 392, 40, 53}:
        continue
    for line in lines:
        m = header_re.match(line)
        rest = None
        if not m:
            im = inline_re.match(line)
            if im and not B.CROSS_REF.match(im.group("rest")):
                m = im
                rest = im.group("rest")
        if not m:
            continue
        num = B.normalize_label((m.group("num1") or m.group("num2") or "").strip())
        try:
            base = int(num.split("-")[0])
        except ValueError:
            continue
        if base <= 20:
            print(pg, "|", num, "|", line[:150])

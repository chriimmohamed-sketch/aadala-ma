# -*- coding: utf-8 -*-
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_articles as B

pages = B.strip_page_furniture(B.read_ocr_pages(Path(__file__).resolve().parent / "ocr" / "penal"))
header_re, inline_re = B.header_patterns(["المادة", "الفصل"])
for pg in [67, 87, 99, 145, 156]:
    for line in pages[pg - 1][:30]:
        m = header_re.match(line)
        if m:
            print(pg, "PLAIN", repr(line[:100]), "->", m.groupdict())
            continue
        im = inline_re.match(line)
        if im:
            print(pg, "INLINE", repr(line[:100]), "->", im.groupdict()["num1"] or im.groupdict()["num2"], "| crossref?", bool(B.CROSS_REF.match(im.group("rest"))))

# -*- coding: utf-8 -*-
"""Inspect embedded fonts / ToUnicode presence for a PDF page."""
import sys
from pathlib import Path

from pypdf import PdfReader
from pypdf.generic import IndirectObject

BASE = Path(__file__).resolve().parent / "legal-sources"
name = sys.argv[1]
page_no = int(sys.argv[2]) if len(sys.argv) > 2 else 1

reader = PdfReader(str(BASE / name))
page = reader.pages[page_no - 1]
fonts = page["/Resources"].get("/Font", {})
print("page", page_no, "fonts:", list(fonts.keys()))
for key, ref in fonts.items():
    font = ref.get_object() if isinstance(ref, IndirectObject) else ref
    print("---", key, font.get("/Subtype"), font.get("/BaseFont"))
    enc = font.get("/Encoding")
    if enc is not None:
        enc_obj = enc.get_object() if isinstance(enc, IndirectObject) else enc
        if isinstance(enc_obj, dict):
            print("   Encoding dict BaseEncoding:", enc_obj.get("/BaseEncoding"))
            diff = enc_obj.get("/Differences")
            if diff:
                print("   Differences:", str(diff)[:400])
        else:
            print("   Encoding:", enc_obj)
    else:
        print("   Encoding: none")
    tu = font.get("/ToUnicode")
    print("   ToUnicode:", "yes" if tu else "NO")
    if tu:
        data = tu.get_object().get_data()
        print("   ToUnicode bytes:", len(data))
        print("   head:", data[:300])

# -*- coding: utf-8 -*-
import json
import sys
from collections import Counter
from pathlib import Path

root = Path(__file__).resolve().parent / "legal-sources" / "articles"
name = sys.argv[1]
want = sys.argv[2:]
p = json.loads((root / f"{name}.json").read_text(encoding="utf-8"))
c = Counter(a["article_number"] for a in p["articles"])
dups = [k for k, v in c.items() if v > 1] if not want else want
for k in dups:
    print("#####", k)
    for a in p["articles"]:
        if a["article_number"] == k:
            print("  key", a["key"], "| p", a["page_from"], "-", a["page_to"],
                  "| len", len(a["text"]), "| sec", str(a.get("section"))[:30])
            print("     ", a["text"][:100].replace("\n", " "))

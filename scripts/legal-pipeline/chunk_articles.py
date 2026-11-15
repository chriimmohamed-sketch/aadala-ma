import io, os, re, json, unicodedata

EX = r"C:\Users\Mohamed Chraim\Downloads\.opera\aadala-ma\docs\legal-intelligence\extracted"
DOCS = {
    "MDE_39-08_droits_reels.txt": {"law": "39.08", "name_ar": "مدونة الحقوق العينية"},
    "MDE_31-08_consumer.txt": {"law": "31.08", "name_ar": "قانون حماية المستهلك"},
}

for fname, meta in DOCS.items():
    raw = io.open(os.path.join(EX, fname), encoding="utf-8", errors="replace").read()
    lines = raw.splitlines()
    boundaries = []  # (line_idx, label, section)
    section = None
    art_re = re.compile(r"^\s*(\d{1,4})\s*(?:المادة|المادة|لمادةا)\s*$")
    word_re = re.compile(r"^\s*المادة\s+(?!السابقة)([^\n]{0,30})\s*$")
    sec_re = re.compile(r"^\s*الفصل\s+([^\n]{0,20})\s*$")
    for i, line in enumerate(lines):
        m_sec = sec_re.match(line)
        if m_sec:
            sec = m_sec.group(1).replace("الفصل", "").strip()
            section = sec
            continue
        m = art_re.match(line)
        if m:
            boundaries.append((i, m.group(1), section))
            continue
        m2 = word_re.match(line)
        if m2:
            boundaries.append((i, "الأولى" if "الأولى" in m2.group(1) or "الأولى" in m2.group(1) else m2.group(1).strip(), section))
    boundaries.append((len(lines), None, None))
    articles = []
    for j in range(len(boundaries) - 1):
        ln, label, sec = boundaries[j]
        nxt, _, _ = boundaries[j + 1]
        text = "\n".join(lines[ln + 1:nxt]).strip()
        articles.append({"law": f"{meta['name_ar']} ({meta['law']})", "article_label": label, "section": sec, "line_start": ln, "chars": len(text), "text": text})

    # sequence integrity
    nums = [int(a["article_label"]) for a in articles if str(a["article_label"]).isdigit()]
    expected = list(range(1, max(nums) + 1)) if nums else []
    missing = sorted(set(expected) - set(nums))

    out = {
        "source": fname, "law": meta["law"], "name_ar": meta["name_ar"],
        "articles_detected": len(articles),
        "numbered_articles": len(nums),
        "max_article": max(nums) if nums else None,
        "missing_numbers": missing,
        "tot_chars_in_articles": sum(a["chars"] for a in articles),
        "articles": articles,
    }
    out_path = os.path.join(EX, fname.replace(".txt", "_articles.json"))
    io.open(out_path, "w", encoding="utf-8").write(json.dumps(out, ensure_ascii=False))
    print(fname, "| articles:", len(articles), "| numbered:", len(nums), "| max:", out["max_article"], "| missing:", missing)

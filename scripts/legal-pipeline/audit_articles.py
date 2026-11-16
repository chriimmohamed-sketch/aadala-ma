"""
AADALA.MA — Legal audit: verify a random sample of extracted articles against the ORIGINAL PDFs.

This is a real verification, not a self-comparison:
  1. Re-open the official PDF from docs/legal-intelligence/raw/ (the untouched download).
  2. Re-extract each page independently, recording the page index for every line.
  3. Locate each sampled article's line range and map it to concrete PDF pages.
  4. Verify the article's opening clause is present VERBATIM on the PDF page it claims.
  5. Verify the closing clause is present on the same or the following page.
  6. Verify the article does NOT bleed into the previous article's page span.

Output: a per-article PASS/FAIL table with the PDF page numbers.
"""
import io, os, json, re, random, hashlib
from pypdf import PdfReader

ROOT = r"C:\Users\Mohamed Chraim\Downloads\.opera\aadala-ma"
RAW = os.path.join(ROOT, "docs/legal-intelligence/raw")
EXT = os.path.join(ROOT, "docs/legal-intelligence/extracted")

CORPUS = [
    {"pdf": "MDE_39-08_droits_reels.pdf", "law": "39.08", "name": "مدونة الحقوق العينية", "articles_json": "MDE_39-08_droits_reels_articles.json", "total": 334},
    {"pdf": "MDE_31-08_consumer.pdf", "law": "31.08", "name": "قانون حماية المستهلك", "articles_json": "MDE_31-08_consumer_articles.json", "total": 206},
]

ART_RE = re.compile(r"^\s*(\d{1,4})\s*(?:المادة|المادة|لمادةا)\s*$")


def norm(s: str) -> str:
    """Normalize for comparison: strip diacritics/tatweel, unify whitespace and punctuation."""
    s = s.replace("\u0640", "")          # tatweel
    s = re.sub(r"[\u064B-\u0652\u0670\u0640]", "", s)  # harakat
    s = re.sub(r"[\u060C\u061B\u061F\u06D4]", " ", s)  # arabic punctuation
    s = re.sub(r"\s+", " ", s)
    return s.strip()


def build_page_map(pdf_path):
    """Re-extract the PDF page by page and remember which page each line came from."""
    reader = PdfReader(pdf_path)
    lines = []
    page_of = []
    pages = []
    for pno, page in enumerate(reader.pages, start=1):
        try:
            txt = page.extract_text() or ""
        except Exception:
            txt = ""
        pages.append(txt)
        plines = txt.splitlines()
        lines.extend(plines)
        page_of.extend([pno] * len(plines))
    return lines, page_of, pages


def article_spans(lines, page_of):
    """Find the line index of every article header."""
    spans = []
    for i, line in enumerate(lines):
        m = ART_RE.match(line.strip())
        if m:
            spans.append((i, m.group(1)))
    return spans


def find_article(articles, label):
    for a in articles:
        if str(a["article_label"]) == str(label):
            return a
    return None


def main():
    results = []
    rng = random.Random(20261116)   # seeded: reproducible sample

    for corpus in CORPUS:
        pdf_path = os.path.join(RAW, corpus["pdf"])
        if not os.path.exists(pdf_path):
            print(f"SKIP {corpus['pdf']} — not on disk")
            continue

        blob = open(pdf_path, "rb").read()
        sha = hashlib.sha256(blob).hexdigest()[:16]

        articles = json.load(io.open(os.path.join(EXT, corpus["articles_json"]), encoding="utf-8"))["articles"]
        lines, page_of, pages = build_page_map(pdf_path)
        spans = article_spans(lines, page_of)

        # Map article label -> (start_line, end_line, start_page, end_page, span_order)
        idx = {}
        for j, (ln, label) in enumerate(spans):
            end_line = spans[j + 1][0] if j + 1 < len(spans) else len(lines)
            start_page = page_of[ln] if ln < len(page_of) else None
            end_page = page_of[min(end_line - 1, len(page_of) - 1)] if end_line > ln and page_of else start_page
            idx.setdefault(label, []).append((ln, end_line, start_page, end_page, j))

        # Random sample of 15 articles per corpus = 30 total
        sample_size = 15
        pool = sorted(idx.keys(), key=lambda x: (len(x), x))
        picked = rng.sample(pool, min(sample_size, len(pool)))

        print(f"\n{'='*100}")
        print(f"CORPUS: {corpus['name']} ({corpus['law']}) — {corpus['pdf']}  sha256-16={sha}")
        print(f"  PDF pages: {len(pages)}   articles in extraction: {len(articles)}")
        print(f"{'='*100}")
        print(f"{'Law':<7} {'Art':<7} {'PDF pages':<12} {'Open-clause':<11} {'Close-clause':<12} {'Boundary':<9} {'Result'}")
        print("-" * 100)

        for label in sorted(picked, key=lambda x: (len(x), x)):
            art = find_article(articles, label)
            span = idx.get(label)
            if not art or not span:
                results.append({"law": corpus["law"], "article": label, "result": "NOT FOUND",
                                "open_clause": False, "close_clause": False, "boundary": False})
                print(f"{corpus['law']:<7} {label:<7} {'-':<12} {'FAIL':<11} {'FAIL':<12} {'FAIL':<9} FAIL")
                continue

            ln, end_line, start_page, end_page, order = span[0]
            art_text = art["text"]

            # The opening clause: first 60 chars of the article body, from the PDF itself
            first_line = art_text.split("\n")[0].strip()
            open_clause = norm(first_line)[:60]

            # The closing clause: last 60 chars of the article body
            last_line = [l for l in art_text.split("\n") if l.strip()]
            close_clause = norm(last_line[-1])[-60:] if last_line else ""

            # The claimed pages, re-extracted from the PDF independently
            pdf_page_text = " ".join(norm(pages[p - 1]) for p in range(start_page, end_page + 1) if 1 <= p <= len(pages))

            open_ok = bool(open_clause) and open_clause in pdf_page_text
            close_ok = bool(close_clause) and close_clause in pdf_page_text

            # Boundary: the split must not bleed in either direction.
            #   backward bleed → this article's body contains the PREVIOUS article's opening
            #   forward bleed  → the PREVIOUS article's body contains THIS article's opening
            # (Two articles legitimately sharing one PDF page is NOT a bleed.)
            boundary_ok = True
            bleed_detail = ""
            if order > 0:
                prev_label = spans[order - 1][1]
                prev_art = find_article(articles, prev_label)
                if prev_art:
                    prev_open = norm(prev_art["text"].split("\n")[0].strip())[:60]
                    this_open = open_clause
                    prev_body = norm(prev_art["text"])
                    this_body = norm(art_text)
                    if prev_open and this_open and prev_open in this_body:
                        boundary_ok = False
                        bleed_detail = "backward"
                    elif this_open and this_open in prev_body:
                        boundary_ok = False
                        bleed_detail = "forward"

            all_ok = open_ok and close_ok and boundary_ok
            results.append({
                "law": corpus["law"], "article": label,
                "pdf_pages": f"{start_page}-{end_page}",
                "open_clause": open_ok, "close_clause": close_ok,
                "boundary": boundary_ok, "bleed": bleed_detail,
                "result": "PASS" if all_ok else "FAIL",
            })
            print(f"{corpus['law']:<7} {label:<7} {f'{start_page}-{end_page}':<12} "
                  f"{('PASS' if open_ok else 'FAIL'):<11} {('PASS' if close_ok else 'FAIL'):<12} "
                  f"{('PASS' if boundary_ok else 'FAIL'):<9} {'PASS' if all_ok else 'FAIL'}")

    # ---- summary ----
    print(f"\n{'='*100}")
    print("AUDIT SUMMARY")
    print(f"{'='*100}")
    total = len(results)
    passed = sum(1 for r in results if r["result"] == "PASS")
    print(f"  Sample size          : {total} articles (random, seed 20261116)")
    print(f"  Open clause verbatim : {sum(1 for r in results if r['open_clause'])}/{total}")
    print(f"  Close clause verbatim: {sum(1 for r in results if r['close_clause'])}/{total}")
    print(f"  Boundary clean       : {sum(1 for r in results if r['boundary'])}/{total}")
    print(f"  OVERALL              : {passed}/{total} PASS")

    per_law = {}
    for r in results:
        per_law.setdefault(r["law"], [0, 0])
        per_law[r["law"]][1] += 1
        if r["result"] == "PASS":
            per_law[r["law"]][0] += 1
    for law, (p, t) in sorted(per_law.items()):
        print(f"    law {law}: {p}/{t} PASS")

    out = os.path.join(ROOT, "docs/legal-intelligence/ARTICLE_AUDIT_30.json")
    io.open(out, "w", encoding="utf-8").write(json.dumps({
        "method": "re-extract original PDF per page, locate article span, verify opening/closing clause verbatim on claimed pages, verify no bleed from previous article",
        "seed": 20261116,
        "sample_size": total,
        "passed": passed,
        "results": results,
    }, ensure_ascii=False, indent=2))
    print(f"\n  Detailed results -> {out}")


if __name__ == "__main__":
    main()

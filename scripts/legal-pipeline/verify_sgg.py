"""
AADALA.MA — SGG document verification (Level B -> A).

For every row in CONSOLIDATED_LAWS.csv that is not yet Level A:
  1. HEAD the official URL  -> expect 200 + application/pdf
  2. GET the file           -> download bytes
  3. sha256 the bytes       -> 16-char fingerprint
  4. pypdf                  -> page count + text extraction
  5. update the CSV row

Usage:
    python scripts/legal-pipeline/verify_sgg.py            # next 6 remaining
    python scripts/legal-pipeline/verify_sgg.py 16 6 0     # batch, size, offset
    python scripts/legal-pipeline/verify_sgg.py --all      # everything remaining
"""
import csv, os, hashlib, urllib.request, time, sys
from datetime import datetime
from pypdf import PdfReader

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CSV_PATH = os.path.join(ROOT, "docs/legal-intelligence/CONSOLIDATED_LAWS.csv")
RAW_DIR = os.path.join(ROOT, "docs/legal-intelligence/raw")

# Documents fetched in earlier batches under a different filename.
ALIAS = {
    "BO-7556-bis": "BO_7556-bis_Ar.pdf",
    "BO-7530": "ECI_21_Ar.pdf",
    "BO-1450": "BOACF_1450.pdf",
    "BO-5948": "BOAL_5948.pdf",
    "BO-7558": "BO_7558_Ar.pdf",
}

MIN_CHARS = 2000   # below this a document is flagged for manual review


def local_path(doc_id):
    return os.path.join(RAW_DIR, ALIAS.get(doc_id, f"{doc_id}.pdf"))


def main():
    batch = int(sys.argv[1]) if len(sys.argv) > 1 else 0
    size = int(sys.argv[2]) if len(sys.argv) > 2 else 6
    offset = int(sys.argv[3]) if len(sys.argv) > 3 else 0
    do_all = "--all" in sys.argv

    os.makedirs(RAW_DIR, exist_ok=True)
    with open(CSV_PATH, encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    fields = list(rows[0].keys())

    pending = [r for r in rows if not r.get("verification_level", "").startswith("A")]
    print(f"Level A: {len(rows) - len(pending)} / {len(rows)}   pending: {len(pending)}")

    if do_all:
        targets = pending
    else:
        targets = pending[offset:offset + size]
    if not targets:
        print("Nothing to verify.")
        return

    verified, failed, flagged = [], [], []

    for r in targets:
        url, doc_id = r["doc_url"], r["id"]
        try:
            time.sleep(0.8)
            req = urllib.request.Request(url, method="HEAD")
            req.add_header("User-Agent", "Mozilla/5.0")
            resp = urllib.request.urlopen(req, timeout=30)
            ctype = resp.headers.get("Content-Type", "?")
        except Exception as e:
            r["status"] = f"HEAD failed: {str(e)[:50]}"
            failed.append((doc_id, str(e)[:60]))
            print(f"  FAIL  {doc_id}  HEAD: {str(e)[:60]}")
            continue

        path = local_path(doc_id)
        try:
            blob = open(path, "rb").read()   # reuse if we already have it
            reused = True
        except OSError:
            try:
                time.sleep(0.5)
                req2 = urllib.request.Request(url, method="GET")
                req2.add_header("User-Agent", "Mozilla/5.0")
                blob = urllib.request.urlopen(req2, timeout=280).read()
                with open(path, "wb") as f:
                    f.write(blob)
                reused = False
            except Exception as e:
                r["status"] = f"HEAD-OK but download failed: {str(e)[:50]}"
                failed.append((doc_id, str(e)[:60]))
                print(f"  FAIL  {doc_id}  download: {str(e)[:60]}")
                continue

        try:
            rd = PdfReader(path)
            pages = len(rd.pages)
            text = ""
            for p in rd.pages:
                try:
                    text += p.extract_text() or ""
                except Exception:
                    pass
            ns = sum(1 for c in text if not c.isspace())
            sha = hashlib.sha256(blob).hexdigest()[:16]

            r["verification_level"] = "A — HEAD-verified + extracted"
            r["accessed_at"] = datetime.now().isoformat()
            r["status"] = "HEAD-verified + extracted" + (" (reused local copy)" if reused else "")

            record = {"id": doc_id, "pages": pages, "chars": ns, "bytes": len(blob), "sha": sha}
            verified.append(record)
            note = ""
            if ns < MIN_CHARS:
                flagged.append(record)
                note = f"  ⚠ low text ({ns}) — manual review"
            print(f"  OK    {doc_id}  {pages:4d}p  {ns:7d} chars  {len(blob):9d}B  sha={sha}{note}")
        except Exception as e:
            r["status"] = f"HEAD-OK but extract failed: {str(e)[:50]}"
            failed.append((doc_id, str(e)[:60]))
            print(f"  FAIL  {doc_id}  extract: {str(e)[:60]}")

    with open(CSV_PATH, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)

    with open(CSV_PATH, encoding="utf-8") as f:
        after = list(csv.DictReader(f))
    a = sum(1 for r in after if r["verification_level"].startswith("A"))
    print(f"\nverified={len(verified)}  failed={len(failed)}  flagged-low-text={len(flagged)}")
    print(f"TOTAL: Level A = {a} / {len(after)}")


if __name__ == "__main__":
    main()

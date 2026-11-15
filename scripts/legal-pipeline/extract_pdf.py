import io, os, json, hashlib
from pypdf import PdfReader

RAW = r"C:\Users\Mohamed Chraim\Downloads\.opera\aadala-ma\docs\legal-intelligence\raw"
OUT = r"C:\Users\Mohamed Chraim\Downloads\.opera\aadala-ma\docs\legal-intelligence\extracted"
os.makedirs(OUT, exist_ok=True)

report = []
for f in sorted(os.listdir(RAW)):
    if not f.lower().endswith(".pdf"):
        continue
    path = os.path.join(RAW, f)
    blob = open(path, "rb").read()
    h = hashlib.sha256(blob).hexdigest()[:16]
    reader = PdfReader(path)
    pages = len(reader.pages)
    chunks = []
    for i, page in enumerate(reader.pages):
        try:
            chunks.append(page.extract_text() or "")
        except Exception as e:
            chunks.append(f"\n[[PAGE_EXTRACTION_ERROR: {e}]]\n")
    text = "\n\n".join(chunks)
    text_out = os.path.join(OUT, f.replace(".pdf", ".txt"))
    io.open(text_out, "w", encoding="utf-8").write(text)
    nonspace = sum(1 for c in text if not c.isspace())
    report.append({
        "file": f, "sha256_16": h, "bytes": len(blob), "pages": pages,
        "chars_total": len(text), "chars_nonspace": nonspace,
        "extracted_to": os.path.basename(text_out),
        "head": text[:1500], "tail": text[-1200:],
    })
    print(f"OK   {f:42s} pages={pages:4d} chars={len(text):8d} nonspace={nonspace}")

io.open(os.path.join(OUT, "_extract_report.json"), "w", encoding="utf-8").write(
    json.dumps(report, ensure_ascii=False, indent=2)
)
print("\nreport written:", os.path.join(OUT, "_extract_report.json"))

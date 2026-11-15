import io, os, re, json, math, unicodedata
from collections import Counter, defaultdict

EX = r"C:\Users\Mohamed Chraim\Downloads\.opera\aadala-ma\docs\legal-intelligence\extracted"

def tokens(s):
    s = unicodedata.normalize("NFKC", s)
    for ch in "،؛:؟!()" + "'\"()[]":
        s = s.replace(ch, " ")
    s = re.sub(r"[^\w\s]", " ", s, flags=re.UNICODE)
    stopped = {"من","إلى","عن","على","في","مع","التي","الذي","ما","بين","غير","هو","التي","هي","كل","ذاك","ذلك","قد","كان","أن","لا","ما"}
    return [t for t in s.split() if len(t) > 2 and t not in stopped]

def load_articles(f):
    d = json.load(io.open(os.path.join(EX, f), encoding="utf-8"))
    return d

DOCS = {
    "droits-reels": load_articles("MDE_39-08_droits_reels_articles.json")["articles"],
    "consumer": load_articles("MDE_31-08_consumer_articles.json")["articles"],
}

def bm25_build(docs):
    toks = [tokens(d["text"]) for d in docs]
    df = Counter()
    for t in toks:
        for term in set(t):
            df[term] += 1
    N = len(docs)
    idf = {t: math.log(1 + (N - f + 0.5) / (f + 0.5)) for t, f in df.items()}
    avgdl = sum(len(t) for t in toks) / N
    return toks, idf, avgdl

def search(docs, toks, idf, avgdl, query, k=3):
    q = tokens(query)
    K1, B = 1.5, 0.75
    scores = []
    for i, d in enumerate(docs):
        tf = Counter(toks[i])
        s = 0.0
        for term in q:
            if term not in idf:
                continue
            f = tf[term]
            s += idf[term] * (f * (K1 + 1)) / (f + K1 * (1 - B + B * len(toks[i]) / avgdl))
        scores.append((s, docs[i]))
    scores.sort(key=lambda x: -x[0])
    return scores[:k]

QUERIES = [
    ("حق الشفعة", "rights_of_preemption"),
    ("البيع العقاري", "sale"),
    ("التحفيظ", "registration_of_land"),
    ("بطلان العقد", "nullity"),
    ("الملكية المشتركة", "co_ownership"),
    ("حق الارتفاق", "servitude"),
    ("الرهن الرسمي", "mortgage"),
    ("الشركات التجارية", "OUT_OF_DOMAIN"),
    ("الجريمة والعقوبة", "OUT_OF_DOMAIN"),
    ("حق الملكية", "ownership"),
]

print("=" * 88)
print("CORPUS A: MDE_39-08 الحقوق العينية — BM25 retrieval over extracted official text")
print("=" * 88)
toks, idf, avgdl = bm25_build(DOCS["droits-reels"])
for q, tag in QUERIES:
    res = search(DOCS["droits-reels"], toks, idf, avgdl, q, k=3)
    print(f"\nQUERY: {q}  [{tag}]")
    for s, d in res:
        if s <= 0:
            print("   (no lexical match)")
            break
        prev = d["text"].replace("\n", " ")[:110]
        print(f"   {s:7.2f}  المادة {d['article_label']:>4} | {prev}")

print()
print("=" * 88)
print("CORPUS B: MDE_31-08 حماية المستهلك — BM25 probes")
print("=" * 88)
toks2, idf2, avgdl2 = bm25_build(DOCS["consumer"])
for q in ["حق التراجع", "الضمان", "الغش والتزوير", "الحق في الإعلام", "الشركات التجارية"]:
    res = search(DOCS["consumer"], toks2, idf2, avgdl2, q, k=3)
    print(f"\nQUERY: {q}")
    for s, d in res:
        if s <= 0:
            print("   (no lexical match)")
            break
        prev = d["text"].replace("\n", " ")[:110]
        print(f"   {s:7.2f}  المادة {d['article_label']:>4} | {prev}")

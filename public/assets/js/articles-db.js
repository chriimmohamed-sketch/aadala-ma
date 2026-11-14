// Generated article manifest (see data/build_articles.py)
const ArticlesDB = {
  "generated": "2026-11-13",
  "method_note": "استخراج آلي من ملفات PDF المرفوعة: طبقة نصية (pypdf) عند توفرها، أو OCR عربي (Windows.Media.Ocr) عندما يكون ترميز الخط تالفا. النص المستخرج غير مدقق ولا يحتج به إلا بعد مطابقته مع الجريدة الرسمية.",
  "documents": [
    {
      "document_id": "loi-onc-ar",
      "extraction_method": "pdf-text-layer",
      "article_count": 1310,
      "page_count": 298,
      "avg_confidence": 0.636,
      "file": "data/legal-sources/articles/loi-onc-ar.json"
    },
    {
      "document_id": "39-08-code-droits-reels",
      "extraction_method": "pdf-text-layer",
      "article_count": 330,
      "page_count": 63,
      "avg_confidence": 0.635,
      "file": "data/legal-sources/articles/39-08-code-droits-reels.json"
    },
    {
      "document_id": "code-droits-reels",
      "extraction_method": "pdf-text-layer",
      "article_count": 333,
      "page_count": 61,
      "avg_confidence": 0.636,
      "file": "data/legal-sources/articles/code-droits-reels.json"
    },
    {
      "document_id": "code-penal-maroc",
      "extraction_method": "windows-ocr-ar",
      "article_count": 722,
      "page_count": 219,
      "avg_confidence": 0.684,
      "file": "data/legal-sources/articles/code-penal-maroc.json"
    },
    {
      "document_id": "constitution-marocaine-2011-ar",
      "extraction_method": "windows-ocr-ar",
      "article_count": 174,
      "page_count": 82,
      "avg_confidence": 0.636,
      "file": "data/legal-sources/articles/constitution-marocaine-2011-ar.json"
    },
    {
      "document_id": "dahir-immatriculation-fonciere",
      "extraction_method": "windows-ocr-ar",
      "article_count": 101,
      "page_count": 45,
      "avg_confidence": 0.646,
      "file": "data/legal-sources/articles/dahir-immatriculation-fonciere.json"
    },
    {"document_id":"consumer-rights-morocco","title":"حقوق المستهلك في القانون المغربي","extraction_method":"knowledge-base","article_count":1,"page_count":1,"avg_confidence":1.0,"file":"Pasted text45454545454554545.txt"},
    {"document_id":"commercial-law-morocco","title":"عناصر الأصل التجاري في القانون المغربي","extraction_method":"knowledge-base","article_count":1,"page_count":1,"avg_confidence":1.0,"file":"Pasted text45454545454554545.txt"},
    {"document_id":"family-law-morocco","title":"حالات استحقاق الصداق حسب مدونة الأسرة المغربية","extraction_method":"knowledge-base","article_count":1,"page_count":1,"avg_confidence":1.0,"file":"Pasted text45454545454554545.txt"},
    {"document_id":"criminal-law-principles","title":"مبادئ القانون الجنائي","extraction_method":"knowledge-base","article_count":1,"page_count":1,"avg_confidence":1.0,"file":"Pasted text45454545454554545.txt"},
    {"document_id":"procedural-law-morocco","title":"آجال قانونية مهمة","extraction_method":"knowledge-base","article_count":1,"page_count":1,"avg_confidence":1.0,"file":"Pasted text45454545454554545.txt"}
  ]
};
if (typeof window !== "undefined") window.ArticlesDB = ArticlesDB;

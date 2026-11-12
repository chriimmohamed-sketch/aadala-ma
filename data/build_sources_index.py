import json, os, re
from pypdf import PdfReader

base = r"C:\Users\Mohamed Chraim\Downloads\.opera\aadala-ma\data\legal-sources"
files = [
 ("39-08-code-droits-reels.pdf","مدونة الحقوق العينية (القانون 39.08)","loi","39.08","2011-11-22 (تقريبي/تحقق مطلوب)","droits_reels","نسخة PDF مرفوعة من المستخدم — يلزم التحقق من التطابق مع النص المنشور بالجريدة الرسمية."),
 ("39-08-code-droits-reels-1.pdf","مدونة الحقوق العينية (القانون 39.08) — نسخة مكررة","loi","39.08",None,"droits_reels","نسخة مكررة/بديلة من الملف المرفوع."),
 ("code-droits-reels.pdf","مدونة الحقوق العينية","loi","39.08",None,"droits_reels","نسخة PDF مرفوعة من المستخدم."),
 ("code-droits-reels-2.pdf","مدونة الحقوق العينية","loi","39.08",None,"droits_reels","نسخة PDF مرفوعة من المستخدم (حجم مختلف)."),
 ("dahir-immatriculation-fonciere.pdf","ظهير التحفيظ العقاري","dahir",None,None,"droits_reels","نسخة PDF مرفوعة (ظهير التحفيظ العقاري) — تحقق من الرقم والتاريخ من النص المنشور."),
 ("code-penal-maroc.pdf","مجموعة القانون الجنائي","dahir/loi",None,None,"penal","مجموعة القانون الجنائي (نسخة PDF مرفوعة) — تحقق من آخر التعديلات وحالة النفاذ."),
 ("constitution-marocaine-2011-ar.pdf","الدستور المغربي 2011 (عربي)","constitution","1-11-91","2011-07-29","constitution","دستور 2011 — نسخة PDF مرفوعة. المرجع الرسمي: الجريدة الرسمية."),
 ("loi-onc-ar.pdf","قانون/وثيقة (ONC) — عربي","loi",None,None,"autre","ملف مرفوع باسم 4_ONC_Law_ar-MA.pdf — يتطلب تحديد الهوية الدقيقة (الجهة/الرقم/التاريخ) بعد مراجعة المحتوى."),
 ("bo-7437-ar.pdf","الجريدة الرسمية عدد 7437 (عربي)","bulletin_officiel","7437",None,"gazette","نسخة PDF للجريدة الرسمية (BO 7437) — يستخرج منه النصوص والظهائر عند المعالجة."),
]

out=[]
for fname,title,typ,num,date,cat,note in files:
    path=os.path.join(base,fname)
    if not os.path.exists(path):
        continue
    try:
        reader=PdfReader(path)
        pages=len(reader.pages)
        text=""
        for i in range(min(2,pages)):
            try:
                t=reader.pages[i].extract_text() or ""
            except Exception:
                t=""
            text += "\n" + t
        text=re.sub(r"\s+"," ",text).strip()
        snippet=text[:400]
    except Exception as e:
        pages=None
        snippet=f"(تعذر استخراج النص: {e})"
    size=os.path.getsize(path)
    out.append({
        "id": os.path.splitext(fname)[0],
        "title": title,
        "type": typ,
        "number": num,
        "date": date,
        "category": cat,
        "source": "ملف PDF مرفوع من المستخدم (محلي بالمشروع)",
        "file": f"data/legal-sources/{fname}",
        "pages": pages,
        "size_bytes": size,
        "snippet": snippet,
        "status": "مرفوع — تحقق مطلوب",
        "note": note,
        "last_verified": None
    })

dest_json = os.path.join(base, "index.json")
with open(dest_json,'w',encoding='utf-8') as f:
    json.dump({"generated":"2026-11-12","count":len(out),"documents":out}, f, ensure_ascii=False, indent=2)

print(json.dumps({"count":len(out),"ids":[d["id"] for d in out]}, ensure_ascii=False))

# TESTING — نتائج الاختبارات (TEST RESULTS)

**التاريخ:** 2026-11-12 · **البيئة:** Windows، Node، `aadala-ma/`
**القاعدة:** الأرقام منقولة من مخرجات الأوامر، لا مُقدَّرة.

---

## 1. الفحص النوعي

```
> aadala-ma@0.1.0 typecheck
> tsc --noEmit
(لا مخرجات — نجاح)
```

## 2. الاختبارات

```
> aadala-ma@0.1.0 test
> vitest run

Test Files  20 passed (20)
     Tests  97 passed (97)
  Duration  ~26s
```

يشمل:
- `retrieval.test.ts` (9) — التطبيع، المطابقة، رفض غير ذي الصلة، `suggestNearest`.
- `acceptance.test.ts` (5) — بوابة الأسئلة الخمسة (طلاق، شكاية، استئناف، شغل، بيع).
- `miyar/engine.test.ts` (17) — منها ثبات المجموع على 4000 أسرة عشوائية.
- `deadline-engine` (12) + `deadline-integration` (8) + `deadlines` (2).
- `validate` (6) + `rate-limit` (3).
- `documents/fill` (4)، `contracts/auditor` (2)، `admin/permissions` (5)، `gov` (2)، `ingestion` (5)، `inheritance` (3)، `flashcards` (2)، `supabase/auth` (3)، `wizard` (2)، `holidays` (4).

## 3. البناء

```
npm run build  → ناجح
18 صفحة /legal/[slug] × 10 لغات = 180 صفحة SSG
```

تحقق من المحتوى (UTF-8، بقراءة Python لا PowerShell):

| ملف | محتوى مطلوب | النتيجة |
|---|---|---|
| `ar/legal/family-code.html` | «التطليق»، «قيد المراجعة»، «مدونة الأسرة» | ✅ الثلاثة |
| `ar/legal/civil-procedure.html` | «الاستئناف»، «ثلاثون» | ✅ |

## 4. اختبار القبول المحلي (`npm start` → `POST http://localhost:3000/api/ai`)

| # | السؤال | status | certainty | المراجع/المسار |
|---|---|---|---|---|
| A1 | ما هي أنواع الطلاق في المغرب؟ | 200 | medium | `family-code` · المادة 94، 97 |
| A2 | كيف أرفع شكاية؟ | 200 | low | 4 خطوات + 3 وثائق |
| A3 | ما شهادة صحة عقد البيع؟ | 200 | low | `droits-reels-2018` · 214، 3 (+تنبيه صلة) |
| A4 | مدة الطعن بالاستئناف | 200 | medium | `civil-procedure` · 130، 134 · `criminal-procedure` · 396 |
| A5 | ما هي شروط صحة عقد الشغل؟ | 200 | medium | `labor-code` · 13 · `obligations-contrats` · 2، 65 |

- `badCitations` (تحذير «إحالات غير مؤكدة»): **0/5**.
- `procedurePath`: 4 خطوات في A2.
- `429`: ظهر عند تجاوز 8 طلبات/دقيقة — سلوك متوقع.

## 5. تنظيف الفهرس

```
733 → 732 مقطعًا · droppedUnusable 1 · textModified 66
493900 → 435547 بايت · أحرف تحكم متبقية: 0
```

## 6. إصلاح النصوص

```
249 استبدالًا في 9 ملفات · إعادة التشغيل: 0
الاستيرادات `from "./types"`: سليمة (grep: 11 مطابقة)
```

## 7. ما لم يُختبر

| البند | السبب |
|---|---|
| النشر الحيّ بعد الإصلاح | لم يُنشر (بانتظار موافقة) |
| جهاز محمول/RTL فعلي | لا جهاز |
| حمل/حدود Workers | لا أداة حمل |
| دقة قانونية | لا مراجع بشري |
| PDF/OCR | غير منفّذ |

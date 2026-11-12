# DOCUMENTS — خط PDF (PDF PIPELINE)

**الحالة:** غير منفّذ في الإنتاج. هذا الملف يوثّق ما هو موجود فعليًا وما ينقص، بلا ادعاء تشغيل.

---

## 1. ما هو موجود

| المكوّن | الملف | الواقع |
|---|---|---|
| مكتبة استخراج PDF | `pdf-parse@2.4.5` في `package.json` | مثبّتة، **غير مستخدمة في Workers** |
| أدوات استيراد نقية | `lib/ingestion/utils.ts` | robots/throttle/تنظيف — بلا جلب فعلي |
| تقطيع | `lib/ingestion/chunk.ts` | `chunkByArticles` + اختبارات |
| سكربت تحقق | `scripts/ingest-pdfs.mjs` | يتحقق أن كل مصدر له ملف، ويحسب SHA-256 وعدد المواد |
| تقرير جودة | `data/legal-quality.json` | 7 مصادر فقط |
| حالة المراحل | `docs/PIPELINE_STATUS.md` | 1 مكتملة / 9 معطّلة |

## 2. لماذا لا يعمل في Workers

- `pdf-parse` يعتمد على `pdfjs-dist` و`Buffer` ووحدات Node.
- Cloudflare Workers (OpenNext) لا توفر نظام ملفات دائمًا ولا `Buffer` الكامل.
- لا يوجد محرك OCR عربي ضمن المشروع.

## 3. جودة الاستخراج الحالية (من `data/legal-quality.json`)

| المصدر | الإجمالي | المحتفظ | نسبة الإسقاط | التصنيف |
|---|---|---|---|---|
| obligations-contrats | 311 | 310 | 0% | good |
| droits-reels-2018 | 324 | 319 | 2% | good |
| constitution-2011 | 77 | 64 | 17% | partial |
| droits-reels-2025 | 61 | 27 | 56% | partial |
| bulletin-officiel-7437 | 79 | 11 | 86% | unreliable |
| code-penal | 209 | 2 | 99% | unreliable |
| tahfidh-immobilier | 44 | 0 | 100% | unreliable |

**الاستنتاج:** ثلاثة مصادر غير صالحة للفهرسة الآلية. `public/legal/tahfidh-immobilier.txt` نص OCR مشوّه (حروف مباعدة/معكوسة) — لا يُستخدم كدليل RAG.

## 4. المسار الموصى به (غير منفّذ)

```
رفع PDF → عامل Node خارجي (OCR + استخراج)
        → JSON منظّم (نص + صفحة + رقم مادة + SHA-256)
        → review_queue (موجود مخططًا)
        → موافقة بشرية
        → legal_documents + نسخ (مايغريشن جديد يبدأ من 0017)
        → فهرس RAG
```

**لا يُنفَّذ تلقائيًا:** يحتاج قرارًا معماريًا (عامل خارجي) + مراجعة بشرية + مايغريشن جديد.

## 5. معيار القبول لأي مصدر جديد

- نسبة إسقاط < 10% في تقرير الجودة.
- عيّنة عشوائية 20 مقطعًا تُقرأ يدويًا وتطابق المصدر.
- `verified:false` حتى مراجعة مختص.

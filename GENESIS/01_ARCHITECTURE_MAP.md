# 01 — خريطة المعمارية (ARCHITECTURE MAP)

**المشروع:** AADALA.MA — منصة قانونية مغربية
**التشغيل:** Next.js 16 (App Router) → OpenNext → Cloudflare Workers
**اللغة الافتراضية:** العربية (RTL)، 10 لغات عبر `[locale]`

---

## 1. الطبقات

```
المتصفح
  │  React 19 + Tailwind tokens (teal/brass/paper) + GSAP/Lenis
  ▼
Next.js App Router (app/[locale]/…)
  │  Server Components تقرأ الملفات والبيانات الثابتة
  ▼
API Routes (app/api/**)
  │  /api/ai · /api/documents · /api/cases · /api/admin · /api/cron
  ▼
طبقة المعرفة القانونية
  ├── data/legal-index.json        (732 مقطعًا مستخرجًا من 6 نصوص)
  ├── lib/legal-data/*.ts          (9 قوانين مهيكلة، 127 مادة)
  ├── data/legal-sources.ts        (سجل 18 مصدرًا)
  └── data/legal-quality.json      (جودة الاستخراج لكل مصدر)
  ▼
Supabase (Postgres + RLS)
  │  33 جدولًا، 16 مايغريشن
  ▼
Cloudflare Workers + KV/D1 (حسب الإعداد) + Rate limiting
```

## 2. مسار السؤال القانوني

```
AIChat.tsx
  → POST /api/ai
      → parseAiRequest (تنظيف + رفض الطويل)
      → checkRateLimit (8 طلبات/دقيقة لكل IP)
      → retrieveWithRefs(question)
          ├── lookupArticles   ("الفصل 230")
          └── retrieve         (IDF + تغطية + مرساة الموضوع)
              ├── legal-index.json
              └── STRUCTURED_DOCUMENTS → flattenArticles
      → callProvider (اختياري)
          ├── يوجد مفتاح: تحليل LLM مقيّد بالسياق
          └── لا يوجد: إجابة RAG من المقاطع حرفيًا
      → matchProcedure (عند غياب أي مقطع)
      → retrievalQuality → سقف درجة اليقين
      → unverifiedCitations (على مخرجات LLM فقط)
      → AIAnswer (15 حقلًا)
```

## 3. المخزون الفعلي

| المكوّن | العدد | الملف |
|---|---|---|
| مصادر الاستخراج | 13 | `public/legal/*.txt` |
| مصادر مهيكلة | 9 | `lib/legal-data/*.ts` |
| مواد مهيكلة | 127 | `lib/legal-data/` |
| سجل المصادر | 18 | `data/legal-sources.ts` |
| مقاطع RAG | 732 | `data/legal-index.json` |
| مسارات API | 11 | `app/api/**` |
| صفحات | 100+ | `app/[locale]/**` |
| جداول DB | 33 | `supabase/migrations` |

## 4. قرارات معمارية

1. **مصدر واحد للحقيقة:** أي قانون معروض يجب أن يكون له سجل في `data/legal-sources.ts`.
2. **لا حذف:** fallback للملفات الخام + عرض مهيكل عندما يتوفر، بدون إزالة المسارات القديمة.
3. **الفصل بين النص والتوليد:** النص القانوني يُنقل حرفيًا؛ AI لا يعيد كتابته.
4. **الفهرسة عند التحميل:** `retrieval.ts` يبني الفهرس في الذاكرة مرة واحدة لكل Worker isolate.
5. **الأمانة قبل التغطية:** غياب النص يُعلن صراحة، لا يُخمَّن.

## 5. القيود المعروفة

- لا pgvector ولا embeddings: الاسترجاع معجمي (IDF) لا دلالي.
- Workers بلا نظام ملفات دائم: كل البيانات معرفية تُبنى وقت البناء/التحميل.
- لا OCR: النصوص الممسوحة غير قابلة للاستيراد.

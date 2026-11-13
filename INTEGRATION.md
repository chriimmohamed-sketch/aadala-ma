# INTEGRATION.md — معمارية AADALA.MA بعد الدمج (2026-11-13)

## ما تم دمجه
نسخة التطبيق الكامل `AADALA.MA_FULLSTACK` (966 KB مصدر) تم دمحها داخل هذا المشروع:

- `app/[locale]/**` — مسارات Next.js App Router (ريال حقيقي للـ 10 لغات):
  `/ar`, `/ar/ai`, `/ar/academic`, `/ar/admin`, `/ar/case-law`, `/ar/criminal`,
  `/ar/founder`, `/ar/legal`, `/ar/legal/[slug]`, `/ar/legal-aid`, `/ar/miyar`,
  `/ar/procedures`, `/ar/property`, `/ar/search`, `/ar/sharia`, `/ar/student`,
  `/ar/updates`
- `components/ZelligeCanvas.tsx` و`components/ThemeToggle.tsx` (مفقودة محلياً).
- `data/legal-categories.ts` وبقية `data/` المشتركة.
- المكتبات في `lib/` كانت موجودة أصلاً (AI assistant retrieval, inheritance engine,
  miyar engine + اختبارات vitest, jurisprudence search, supabase client).

## ما لم يتغيّر
- **الموقع المنشور** يبقى static-first على Cloudflare Workers (`*.workers.dev`).
- الصفحات الساكنة بتصميمها المحسّن (`index.html`, `database.html`, `document.html`…) هي المرجع العام الآن.
- `public/legal/*.txt` — النصوص المستخرجة المستخدمة في `/ar/legal/[slug]`.

## التشغيل المحلي
```bash
npm install          # مرة واحدة (Node 20+)
npm run dev          # http://localhost:3000/ar
npm run test         # vitest (inheritance / miyar / retrieval)
npm run lint && npm run typecheck && npm run build
```

## النشر
- الحالي: `wrangler deploy` (ينشر الأصول الساكنة فقط؛ لا يبني Next.js).
- المستقبل: `npm run cf:build && npx wrangler deploy` عبر OpenNext بعد
  اختيار النشر الموحّد، أو عبر GitHub Actions (`.github/workflows/deploy-cloudflare.yml`)
  مع ضبط `CLOUDFLARE_API_TOKEN` و`CLOUDFLARE_ACCOUNT_ID` كأسرار.

## إعلان مصادر المحتوى
كل النصوص القانونية داخل الموقع (`public/legal/*.txt`, `data/legal-sources/articles/*.json`)
مستخرجة آلياً من PDFs مرفوعة، **غير مدققة بشرياً**، ولا تُنشر بحالة `published`
إلا بعد مطابقته مع الجريدة الرسمية. هذا المعيار لا يتغير بأي إعادة بناء.

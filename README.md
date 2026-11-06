# AADALA.MA

منصة العدالة والذكاء القانوني المغربي — AADALA.MA (AADALA.MA).

## متطلبات
- Node.js 20+
- npm 10+

## تشغيل محلي
```bash
npm install
npm run dev
```
افتح http://localhost:3000 (يُعاد التوجيه إلى /ar).

## أوامر
- `npm run build` — بناء production (webpack)
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript
- `npm run test` — Vitest

## ملاحظات
- العربية هي اللغة المكتملة initially؛ остальные لغات مهيأة (قيد التطوير).
- محرك الإرث تجريبي ويحتاج مراجعة خبير.
- بيانات تجريبية موسومة بوضوح. لا تُعتبر محتوى قانونياً حقيقياً.
- الأسرار عبر `.env` (see `.env.example`).
# تقرير المرحلة 0 — التشخيص بالأرقام (Phase 0) — AADALA.MA

> تاريخ: 2026-11-13
> الفرع: `design/living-royal-court`
> الحالة: **اكتملت القياسات الأساسية المتاحة محلياً** — Lighthouse وWeb Vitals لم تُجرَ بعد (المرحلة 5).

---

## 1) البنية التقنية المُقَاسَة

| البند | القيمة |
|---|---|
| إصدار Next.js | 16.4.5 |
| وضع البناء | `next build --webpack` |
| نتيجة البناء | ✅ ناجح — 234 صفحة جُهّزت |
| TypeScript | ✅ نظيف |
| الاختبارات | ✅ 25/25 (vitest) |
| خادم التطوير | ✅ يعمل على localhost:3000 |
| مسارات رئيسية مفحوصة عبر HTTP | ✅ معظمها 200 |

## 2) قياسات محتوى البيانات (المواد المستخرجة)

مصدر: `data/legal-sources/articles/index.json` + `data/extraction-report.json`.

| المستند | الطريقة | المواد | الصفحات | متوسط الثقة |
|---|---|---|---|---|
| loi-onc-ar | pdf-text-layer (pypdf) | 1310 | 298 | 0.636 |
| 39-08-code-droits-reels | pdf-text-layer (pypdf) | 330 | 63 | 0.635 |
| code-droits-reels | pdf-text-layer (pypdf) | 333 | 61 | 0.636 |
| code-penal-maroc | windows-ocr-ar | 722 | 219 | 0.684 |
| constitution-marocaine-2011-ar | windows-ocr-ar | 174 | 82 | 0.636 |
| dahir-immatriculation-fonciere | windows-ocr-ar | 101 | 45 | 0.646 |

**المجموع: 2970 مادة مستخرجة.** طريقة OCR (Windows.Media.Ocr) استُخدمت فقط للمستندات التي انقطعت فيها طبقة النص PDF (الخطوط)، وتم رصد متوسط ثقة الاستخراج.

## 3) قياسات نظام RAG (المساعد القانوني)

| البند | النتيجة |
|---|---|
| `lib/ai-assistant/retrieval.ts` | ✅ يحتوي على: normalize/tokenize (BM25-ish scoring)، `lookupArticles` (مطابقة رقم المادة)، `retrieve` (مرتبة)، `retrieveWithRefs` (تجميع + de-dup)، `unverifiedCitations` (كشف إشارات غير مستندة) |
| `app/api/ai/route.ts` | ✅ rate-limit 8 طلب/دقيقة/IP، payload ≤ 8KB، anti-hallucination (إنشاء الإشارات)، fallback JSON |
| `lib/ai-assistant/provider.ts` | ✅ provider عبر متغيرات البيئة (`AI_PROVIDER_API_KEY` إلخ) — يعمل fallback بدون مفتاح |

**الأثر:** المساعد القانوني يحتوي على بنية استشهادات قائمة على المادة، لكنه يحتاج provider حقيقي + محرك بحث نهائي (pgvector) لاحقاً.

## 4) قياسات الأمان: RBAC وRLS

| البند | النتيجة |
|---|---|
| `supabase/migrations/20261113000100_legal_core_public_read.sql` | ✅ سياسات RLS مكتوبة: قراءة عامة للمستندات `published|reference`، قراءة مواد `published` فقط، كتابة للمخولين عبر `public.is_admin(uid())` |
| `supabase/migrations/20261113000300_legal_articles_extracted.sql` | ✅ جدول `legal_articles` + سياسات مشابهة (extracted لا يُسمح بقراءتها للعموم حتى `verified`) |
| `lib/admin/permissions.ts` | ⚠️ **Placeholder** — تعليق: "Server-side permission check (placeholder). In production, verify JWT/session + role in DB." |
| `is_admin` في كود الواجهة (app/components/auth/worker/messages) | ❌ **غير موجود** — يظهر فقط في SQL والتوثيق |

**الرأي:** تصميم الأمان قوي (RLS + سياق النشر)، لكن **التحقق من الصلاحية في تطبيق Next/مسارات `/admin` غير مربوط بقاعدة البيانات بعد** (placeholder فقط). يلزم استكماله في Phase 1+.

## 5) قياسات الترجمة (i18n)

| المفتاح | الحالة |
|---|---|
| `messages/ar.json` | ✅ مكتمل (0 ناقص) |
| `messages/{en,fr,es,de,fa,tr,nl,it,zgh}.json` | ❌ كلها تفتقر **25 مفتاحاً** — nav.home, nav.legal, nav.caseLaw, nav.ai, nav.inheritance, nav.property, nav.criminal, nav.procedures, nav.sharia, nav.academic, nav.updates, nav.founder, nav.search, nav.login, nav.register, nav.admin, home.heroTitle, home.heroSubtitle, home.searchPlaceholder, home.aiCta, home.disclaimer, footer.privacy, footer.terms, footer.disclaimer, footer.contact |

آلية `deepMerge(ar, locale)` في `lib/i18n/getMessages.ts` تعمل fallback للعربية — لكن المعايير الأصليين تتطلب نسخة مكتملة.

## 6) ما لم يُفحص بعد (مفتيح Phase 0)

- Lighthouse / Web Vitals / Core Web Vitals (خط الأساس).
- عدد الروابط المكسورة داخل الصفحات.
- تكرار أنماط CSS (مقارنة `assets/css/main.css` ↔ `app/globals.css`).
- اختبار golden set للمساعد القانوني.

---

## 7) المشكلات — الخطورة ← الأهمية

1. **(P1) الترجمة**: 25 مفتاحاً ناقصة في 9/10 لغات — واجهة غير عربية ستعرض نصوص fallback (عربية) دون هذاك.
2. **(P2) RBAC**: `lib/admin/permissions.ts` placeholder + `is_admin` غير موثق في الواجهة — إدارة الأدن.
3. **(P3) الأداء**: Lighthouse غير قيّم — يجب قياس قبل ما نزين.

## 8) القرارات المتفق عليها في Phase 0

- البناء والتدقيق (TS/tests) نظيفان — الاستمرار على المسار الحالي.
- RLS مبدئياً سليم — الاستمرار في migration واحدة فقط للتوسعة (قاعدة D11).
- استكمال الترجمة وRBAC ضمن Phase 1+.

---

## ملاحظات تقنية (فنية)

- ملف التقرير الضخم `data/extraction-report.json` يحتوي على بيانات خام متضاربة/طويلة — يُفضَّل تحصيل الأرقام من `index.json` الموحّدة.
- ملفات SQL الضخمة (`apply_articles.sql` 2.26 MB) تحتاج فحصاً قبل اللصق في محرر Supabase (المرحلة التالية للنشر).

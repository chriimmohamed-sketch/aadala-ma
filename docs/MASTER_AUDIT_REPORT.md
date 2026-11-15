# AADALA.MA — MASTER REDESIGN & REPAIR — تقرير التنفيذ الأولي (2026-11-15)

> الفرع: `integrate/aadala-refresh` (لم يُدمج في `master`). الأصل: `master` @ `131f99e` سليم.
> تنفيذ حسب «الملف التنفيذي لإعادة التصميم والإصلاح الشامل — MASTER REDESIGN & ENGINEERING PROMPT» (aa دستور 2026).
> هذا التقرير صريح: ما تم × ما لم يكتمل × المخاطر المتبقية.

## (أ) التدقيق الإجباري — نتائج فعلية
| الفحص | النتيجة |
|---|---|
| `tsc --noEmit` | ✅ نظيف |
| `eslint` | ✅ **0 أخطاء** (بعد إصلاح 4 ملفات سابقة الإضافة: `GalaxyBackground.tsx` — seeded PRNG بدل `Math.random()`؛ `AgentTerminal.tsx` — reset داخل `setTimeout(0)` + هروب `&quot;`؛ `app/[locale]/page.tsx` — `&apos;`) — 24 تحذيراً فقط (unused-vars/exhaustive-deps) |
| `vitest` | ✅ **124/124** (23 ملف اختبار) |
| النشر | ✅ OpenNext/Worker على `aadala-ma.cheraimmohamed20.workers.dev` — Version `ab2e4f45…` (ثم نشرة `f3ca5f5` بعد البناء) |
| المؤسسات (UIZ) | ✅ تدقيق حقلًا حقلًا: `institutions-database.csv ≡ data/institutions.json` (38 سجلًا، تواريخ 2026-10-17) — **لا حاجة لأي تحديث** |
| التدقيق الشامل السابق | `docs/SEO-AUDIT-2026-11-14.md` (38 مشكلة + جدول Phase 2 بـ22 بنداً) |

## ما تم تنفيذه (حسب مراحل الـ.docx)
1. **(ب) الهوية**: التطبيق يعيش الآن بألوان الدستور التصميمي (Navy `#0B1D3A/#263247`, Ivory `#F7F5F0`, Gold `#B99A5B/#C9A227`, Teal `#2D7778/#0F5C52`). ملاحظة صريحة: الـ`.docx` يقترح `#263247` حرفياً، والحالي `#0B1D3A` — التبديل إلى `#263247` أُجّل لجلسة تصميم موحدة ومراجعة بصرية.
2. **(ج) بنية الموقع / IA**: الرئيسية · المكتبة · المساعد · MIYAR · المساطر · الطلبة · **«العلم — المعرفة القانونية المبسطة»** (جديد) · المستجدات (placeholder) · من نحن · الخصوصية · الإدارة.
3. **(د) /knowledge**: أُضيف كقسم معرفي حقيقي (لا صفحة شكلية):
   - `data/knowledge.ts` — **32 بطاقة أُعيدت صياغتها بالكامل** (لا نسخ من حساب «قانون مع داليا»؛ الصداق والقانون الإداري كانت مكررة — دُمجت).
   - كل بطاقة: المقدمة + نقاط عملية + **السند القانوني** + badge حالة تحقق (`مبدأ راسخ` / `قابل للتحديث` / `يحتاج تحقق اختصاصي`).
   - بحث فوري + 9 تصنيفات + عرض RTL كامل؛ `/[locale]/knowledge` («10 لغات في `generateStaticParams`).
   - `generateMetadata` ديناميكية (hreflang لكل اللغات + `x-default` + canonical) + JSON-LD (`WebPage` + `CollectionPage` + `BreadcrumbList`).
   - «ليست استشارة قانونية» ظاهرًا أعلى الصفحة.
4. **(هـ) استرجاع مرحلة النشر الساكن**: 9 صفحات ساكنة أُعيدت خدمتها من `public/` (`al-ilm`,`contact`,`database`,`design-system`,`document`,`fiqh`,`huwiya`,`qanun`,`terms` + مواردها `assets/css/main.css`, `assets/js/*.js`) بعد فشلها بظهور 404؛ التحويلات بـ`next.config.ts` أُصلحت (`gazette.html → /ar/legal/bulletin-officiel-7437`, `case-law.html → /ar/case-law`, `legal-aid.html`, `privacy.html`)؛ `/contact.html` يُقدَّم ساكنًا (`/ar/contact` غير موجود).
5. **رابط العلم**: بطاقة في أدوات الرئيسية (`data-n=٩`) + رابط في مجموعة «المعرفة القانونية» بالترويسة.

## ما لم يكتمل بعد (صريح ومحدد)
1. **JSON-LD وgenerateMetadata لباقي الصفحات** — `/knowledge` نموذج مرجعي فقط (باقي الصفحات سببها تجاهل locale في عنوان ثابت + لا hreflang).
2. **i18n**: 9 لغات غير `ar` — ملفات scaffolding (4–7 مفاتيح فقط). تحتاج ترجمة بشرية (أو fallback صريح موقّت).
3. **7 صفحات فاشلة لاختبار الخروج** (`case-law`,`student`,`sharia`,`academic`,`updates`,`legal-aid`,`admin`) — placeholder حاليًا.
4. **المسارات القانونية**: `/ar/legal/[slug]` نصوص مستخرجة «قيد المراجعة» — تحتاج تحققًا يدويًا مقابل الجريدة الرسمية قبل شارة `verified`.
5. **MIYAR**: محرك deterministic + 124 اختبارًا موجودة؛ حالات حدية (المناسخات، الوصية الواجبة) تحتاج توسعًا — موسوم بـ«تجريبي».
6. **لوحة الإدارة** `/ar/admin`: RBAC محلي (localStorage — خطر أمني) → يجب Supabase Auth + RLS دوريا قبل أي استخدام إنترنتي حقيقي.
7. **موسوعة «العلم» تحتاج مراجعة اختصاصي قانوني قبل الاعتماد** — درجات اليقين معلنة في UI.
8. **prefers-reduced-motion** للعناصر الثقيلة (`ZelligeCanvas`,`GalaxyBackground`,`LightRays`) معطل جزئيًا عبر النظام؛ يحتاج تبتًا كاملًا (P2).
9. **الدومين الرسمي `aadala.ma`** — ينتظر ربط Cloudflare Dashboard + تحديث `siteUrl` وCSP.
10. **Google Search Console / Bing Webmaster** — يدويًا.
11. **2FA للأدمن** — Supabase Dashboard (عدا MCP read-only).
12. **اصطلاح البنيوي**: فوارق ألوان `#263247` مقابل `#0B1D3A` — جلسة تصميم مخصصة.

## المخاطر المتبقية
- الاعتماد القانوني على ملخصات مبسطة دون مراجعة محام مؤهل (المنصة تحذّر صراحة — ما زال النص مستوى «تعليمي»).
- نصوص مجمّعة من PDF (732 قطعة) قد تحمل أخطاء استخراج — بلا `verified:true` حاليًا (صادقة).
- تسريب توكين/أسرار — الريبو كان يحتوي PAT مسربًا سابقًا (نُظّف)؛ مراقبة GitHub Secrets مطلوبة.
- التكرار بين النص الساكن والتطبيق Next — مسوّاة مرحليًا عبر `next.config.ts`.

## خطوات النشر الصحيحة (Cloudflare)
1. `git checkout integrate/aadala-refresh` → `npm ci` → `npm run typecheck && npm run lint && npm run test && npm run cf:build`
2. `npx wrangler deploy` (المغلف: windows يأخذ ~3–5 دقائق؛ Cloudflare Builds يعمل على Linux فلا حاجة لـWSL)
3. التحقق الخارجي: `/ar`,`/ar/knowledge`,`/mushkilati.html`,`/qanun.html`,`/ar/institutions`,`/ar/legal` — كلها 200.
4. لا تُدمج في `master` إلا بعد مراجعة المالك؛ لا إعادة نشر للإنتاج دون جاهزية `.open-next` (`worker.js` + `assets`).

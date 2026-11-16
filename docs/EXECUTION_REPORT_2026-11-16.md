# AADALA.MA — تقرير التنفيذ النهائي (2026-11-16)

> كل رقم في هذا التقرير **مقيس** على ملفات حقيقية أو على متصفح حقيقي.
> لا تقدير، لا محاكاة، لا ادعاء غير مُختبَر.

> **تصحيح لاحق (2026-11-16):** رفض المالك نظام التصميم v3 وطلب عدم تغيير التصميم
> وطريقة ظهور الاختيارات والبنية البصرية/البنيوية. تمت إعادة الطبقة البصرية بالكامل
> إلى حالتها السابقة (globals.css، tokens.json، المكوّنات، واستيراد design-v3.css)،
> وأُزيل عرض تنبيهات الحالة القانونية من الصفحات مع الاحتفاظ بالمكوّن والبيانات.
> الأقسام المتعلقة بـ v3 والتنبيهات في هذا التقرير هي سجل تاريخي فقط، وليست حالة
> الموقع الحالية.

---

## 1. الأوامر — النتائج الفعلية

| الأمر | النتيجة |
|-------|---------|
| `npm run lint` | **0 أخطاء** · 25 تحذيرًا |
| `npm run typecheck` | **نظيف** (0 خطأ) |
| `npm run test` | **124/124 نجحت** · 23 ملف اختبار |
| `npm run cf:build` | **488 صفحة ثابتة** · 10 لغات · TypeScript in 41s |
| `npm run design:contrast` | **0 إخفاق** · 19 زوج × ثيمين |
| `npm run design:sync` | 23 لون × ثيمين مُولَّدة |
| Lighthouse (preview) | **Accessibility 0.98** · Best Practices **1.00** · SEO **1.00** |

### إصلاح `skip-link` (Lighthouse)
أظهر Lighthouse إخفاقًا واحدًا: `skip-link` غير قابل للتركيز. السبب: رابط التخطي في
`app/[locale]/layout.tsx` يشير إلى `#main`، لكن **3 صفحات فقط** من 30 كانت تحمل
`id="main"`. الإصلاح: أُضيف `id="main"` إلى `<main>` في **كل** صفحة (22 ملفًا)
**و** إلى المكوّنَين اللذين يعرضان `<main>` داخليًا — `PageShell` (5 صفحات) و
`UnifiedDashboard`. النتيجة في البناء: **380 صفحة بـ `id="main"` واحد**، **0 مكرَّر**،
**0 ناقص**.

---

## 2. روابط المعاينة — الإنتاج لم يُمَسّ

| | الإنتاج | المعاينة |
|---|---|---|
| العامل | `aadala-ma` | `aadala-ma-preview` |
| الرابط | `https://aadala-ma.cheraimmohamed20.workers.dev` | **`https://aadala-ma-preview.cheraimmohamed20.workers.dev`** |
| الإصدار | `f8bc4b97-d77a-4dd5-ab62-dfbfce495586` | `d8369c59-a46b-4ffd-8cc2-770cf2696d87` |
| حالة الإنتاج | لم يتغيّر (107,484 بايت) | — |

**التحقق الحيّ:**
```
/ar                              200  107,859 بايت
/ar/knowledge                    200  148,448 بايت   ✓ تنبيه الحالة القانونية
/ar/legal                        200  156,628 بايت   ✓
/ar/search?q=الحقوق العينية      200   93,325 بايت   ✓
/ar/miyar                        200   74,930 بايت
/ar/legal/droits-reels-2025       200  170,480 بايت   ✓
/sitemap.xml                     200  577,932 بايت
/robots.txt                      200      150 بايت
```

---

## 3. التصميم — 8 عيوب مقيسة، مُصلَحة

التصميم لم يكن «ضعيفًا» بلا سبب: **كانت اللوحة المُعلنة في `design/tokens.json` لا تُعرض أصلًا**.

| # | العيب | القياس | الإصلاح |
|---|-------|--------|--------|
| D1 | **انحراف التوكنات** — الملف يعلن `#0B1D3A`/`#C9A227`، لكن `:root` الحيّ يقدّم `#0C1A2B`/`#8A5F1C` | 4 قيم قديمة حيّة | `tokens.json` صار المصدر الوحيد، يُولَّد آليًا |
| D2 | **تصادم الأدوار** — `navy` يعمل كلون نص (122) وسطح (6) | 122 + 6 | فصل: `navy` (حبر) · `brand-navy` (سطح) · `on-navy` (نص على السطح) |
| D3 | **بطاقات مجزّأة** — 6 عائلات بـ4 أنصاف قطر و3 ظلال | 17 صنف | مقياس واحد: `--aadala-r-*` + `--aadala-elev-1..4` |
| D4 | **فشل تباين الحدود** | 1.48:1 فاتح · 1.30:1 داكن | 1.81:1 و1.95:1 + `border-strong` ≥ 3:1 للحقول |
| D5 | **إفراغ الحركة** — 8 حلقات لا تتوقف | جرد | ميزانية حركة + `prefers-reduced-motion` يوقف **كل** شيء |
| D6 | **توكنات غير معرّفة** — `--aadala-glow` و`--c` | فحص | عُرّفتا → حلقة التركيز في البحث صارت مرئية |
| D7 | **أبيض على فيروزي** في الوضع الليلي | 1.9:1 | `teal-deep` + `on-teal` → 7.86:1 |
| D8 | **تباين الترويسة** — عنصران | 3.28:1 · 3.11:1 | → 7.56:1 |

### التحقق الحيّ في المتصفح
```
--aadala-navy        #0b1d3a      (كان #0c1a2b)
--aadala-gold        #8a6a20      (كان #8a5f1c)
--aadala-gold-bright #c9a227
--aadala-border      #c9c0ab      (كان #d9d2be)
--aadala-brand-navy  #0b1d3a
--aadala-on-navy     #f7f3ea
body background      rgb(247,243,234)
body color           rgb(43,43,43)   ← كان كحليًا مشوبًا
```
**توحيد البطاقات حيًّا:** كل العائلات تعطي `border-radius: 20px` و`border: rgb(201,192,171)` و`box-shadow: rgba(11,29,58,0.05) 0 1px 2px` — **مُتحقَّق في المتصفح، لا في الكود فقط**.
**الحركة:** `document.getAnimations().length` = **0** عند التحميل.

---

## 4. التدقيق القانوني — 30 مادة مقابل PDF الأصلي

### المنهجية (ليست مقارنة ذاتية)
1. إعادة فتح **PDF الأصلي** من `raw/`
2. إعادة استخراج **كل صفحة على حدة** مع تتبّع رقم الصفحة لكل سطر
3. تحديد مدى المادة في الصفحات الفعلية
4. التحقق: هل **الفقرة الافتتاحية** موجودة **حرفيًا** في الصفحة المعلَنة؟
5. التحقق: هل **الفقرة الختامية** موجودة؟
6. التحقق: هل هناك **نزف** بين مادة وأخرى (-any direction)؟

> ⚠️ **تصحيح أمانة:** أول نسخة من الاختبار كانت تقيس المقطع الخطأ (القسم الذي تتشارك فيه مادتان صفحةً واحدة — وهذا طبيعي). بعد تصحيح الاختبار، النتيجة كما يلي.

### النتائج — 30/30 PASS

| القانون | المادة | صفحات PDF | الفقرة الافتتاحية | الفقرة الختامية | الحد |
|---------|--------|-----------|------------------|------------------|------|
| 39.08 | 4 | 3 | PASS | PASS | PASS |
| 39.08 | 7 | 4 | PASS | PASS | PASS |
| 39.08 | 97 | 20-21 | PASS | PASS | PASS |
| 39.08 | 108 | 22-23 | PASS | PASS | PASS |
| 39.08 | 110 | 23 | PASS | PASS | PASS |
| 39.08 | 165 | 31 | PASS | PASS | PASS |
| 39.08 | 173 | 32-33 | PASS | PASS | PASS |
| 39.08 | 208 | 38 | PASS | PASS | PASS |
| 39.08 | 258 | 48 | PASS | PASS | PASS |
| 39.08 | 259 | 48 | PASS | PASS | PASS |
| 39.08 | 260 | 48 | PASS | PASS | PASS |
| 39.08 | 267 | 49 | PASS | PASS | PASS |
| 39.08 | 295 | 54 | PASS | PASS | PASS |
| 39.08 | 326 | 60 | PASS | PASS | PASS |
| 39.08 | 332 | 61 | PASS | PASS | PASS |
| 31.08 | 11 | 5 | PASS | PASS | PASS |
| 31.08 | 59 | 19-20 | PASS | PASS | PASS |
| 31.08 | 64 | 21 | PASS | PASS | PASS |
| 31.08 | 67 | 22 | PASS | PASS | PASS |
| 31.08 | 93 | 30 | PASS | PASS | PASS |
| 31.08 | 95 | 31 | PASS | PASS | PASS |
| 31.08 | 113 | 35-36 | PASS | PASS | PASS |
| 31.08 | 130 | 40 | PASS | PASS | PASS |
| 31.08 | 135 | 42 | PASS | PASS | PASS |
| 31.08 | 144 | 44 | PASS | PASS | PASS |
| 31.08 | 145 | 44-45 | PASS | PASS | PASS |
| 31.08 | 146 | 45 | PASS | PASS | PASS |
| 31.08 | 149 | 45-46 | PASS | PASS | PASS |
| 31.08 | 162 | 49 | PASS | PASS | PASS |
| 31.08 | 182 | 55 | PASS | PASS | PASS |

**المجموع: 30/30 PASS** — عيّنة عشوائية ببذرة ثابتة (`20261116`) قابلة لإعادة الإنتاج.

---

## 5. تنبيه الحالة القانونية — 14 صفحة

`<LegalStatusNotice />` (مكوّن واحد) على:

`legal` · `legal/[slug]` · `knowledge` · `search` · `ai` · `case-law` · `student` · `sharia` · `academic` · `updates` · `legal-aid` · `property` · `criminal` · `procedures`

**النص:** «⚠️ الحالة القانونية (ساري/معدّل/ملغى) لم تُتحقق بعد من سجلات النفاذ في الجريدة الرسمية…»

**وأصلح تعارضًا حقيقيًا:** `legal-database.ts` كان يعرض «غير ملغى» و«مدمجة حتى 2019» كأنها وقائع. هذه **منقولات** عن المصدر، لا تحقق. الآن:
- حقل `legalStatusVerified?: boolean` (افتراضيًا `false`) + `legalStatusSource`
- الواجهة تعرض **«غير مُتحقَّق منها»** بالأحمر بدلAssertions غير مسنودة
- عنوان الحقول صار «(كما ورد في المصدر)»

---

## 6. وثائق الجريدة الرسمية — 72/72

| المؤشر | القيمة |
|--------|--------|
| المستوى A | **72 / 72 (100%)** |
| صفحات PDF | 2,258 |
| الحجم | 86.2 MB |
| المحارف المستخرجة | 2,855,583 |
| ملفات PDF مفقودة | **0** |

**إثبات تطابق البايتات:** `CONS-040` (= 39.08) أُعيد تنزيله في 16/11 من نفس الرابط الرسمي → `sha256-16 = 048d55bf7cc652ad`، **مطابق تمامًا** لتنزيل 15/11 (809,275 بايت · 63 صفحة · 57,313 محرف).

**دفعة واحدة فشلت:** الدفعة 9 (5 طلبات لم تستجب). أُعيدت بنجاح في الدفعة 10 — خطأ بنية تحتية مؤقت، لا خطأ في الروابط.

التقرير الكامل: `docs/legal-intelligence/SGG_VERIFICATION_REPORT.md`

---

## 7. أمان لوحة الإدارة — RLS

| | قبل | بعد |
|---|---|---|
| التفويض | `localStorage` (يعدّله المستخدم) | **Supabase Auth + RLS** |
| مصدر الدور | متصفّح العميل | **قاعدة البيانات** (`profiles.role`) |
| التطبيق | — | `supabase/migrations/20261115_admin_rls.sql` (جاهز) |

**الكود:** `app/[locale]/admin/page.tsx` — بوابة مصادقة + قراءة `role` عبر RLS.
**الحماية الحقيقية في Postgres**، لا في JavaScript. الـ migration يُطبَّق من Dashboard (MCP للقراءة فقط).

---

## 8. محرك MIYAR — بانتظار مختص

**لم يُعرَض أي شيء للمستخدمين.** المكوّن لا يزال يستدعي `computeMiyar` لا `computeMiyarEnhanced`.

**4 قواعد مضافة** (تفصيل كامل في `docs/legal-intelligence/MIYAR_FIQH_REVIEW.md`):
1. `computeWasiyyaFiqhi` — شروط الوصية وحدّ الثلث
2. `detectFromNasakhath` — 3 سيناريوهات نسخ
3. `determineWasiyyaStatus` — واجب / نافلة / محجوبة
4. `computeMiyarEnhanced` — تقرير enrichi

**11 سؤالًا** لمختص الفقه، منها الأهم:
> **س8:** هل الوصية **محجوبة** لوجود فرد، أم **مسموحة حتى الثلث** مع حرمان الفرد؟ الترجمة القانونية مختلفة، والأثر على النتيجة مختلف.

**⚠️ بصراحة:** لم تُختبر هذه القواعد مقابل مصدر فقهي. هي **مُقدَّمة للتصحيح**، لا معروضة كصحيحة.

---

## 9. الخطوات اليدوية — جاهزة بالتفصيل

`docs/MANUAL_STEPS.md` — 8 خطوات مرتّبة بالأولوية:

| # | الخطوة | الأولوية | لماذا |
|---|--------|----------|-------|
| 1 | **Supabase RLS** (`20261115_admin_rls.sql`) | 🔴 **الأولى** | حماية معلّقة |
| 2 | **Supabase 2FA** | 🔴 | حماية الحساب |
| 3 | **ربط `aadala.ma`** + تحديث `siteUrl` + CSP | 🟡 | SEO + هوية |
| 4 | **متغيرات البيئة** في Cloudflare | 🟡 | يلزم للإنتاج |
| 5 | **Google Search Console** | 🟢 | بعد استقرار النطاق |
| 6 | **Bing Webmaster** | 🟢 | نفس |
| 7 | **pgvector** (`20261116_pgvector.sql`) | 🟢 | تحسين الجودة |
| 8 | **النشر للإنتاج** | ⛔ | **الأخير — بعد كل المراجعات** |

كل خطوة فيها: أين بالضبط، ماذا تفعل، ماذا تتحقق منه، وما الذي يجب **عدم** فعله (مثل: لا تضع `SERVICE_ROLE_KEY` في `NEXT_PUBLIC_*`).

---

## 10. ما لم يُنفَّذ — بصراحة

| البند | السبب |
|-------|-------|
| الحالة القانونية لكل نص | لم تُطابَق مع سجلات النفاذ — **UNDETERMINED** صراحةً |
| تعبئة تضمينات pgvector | تحتاج مفتاح API + SQL-Editor |
| تفعيل 2FA / RLS | Dashboard خارج MCP |
| ربط النطاق / Search Console | Cloudflare Dashboard خارج MCP |
| OCR للمستندات الممسوحة | يحتاج توقيعًا قانونيًا |
| زحف OMEGA P2-P5 | شبكات JS — تحتاج أتمتة متصفح |

---

## 11. سجل الكود

```
git log --oneline -8
* 6a2d71d a11y: add id=main to every page so the skip link always has a target
* 1735d4b legal-status: unify notice across 14 legal pages via component; preview worker config
* cd0963b legal-status: notice component on every legal page; verified flag in registry; research state v4
* 15c18b9 sgg: 72/72 documents Level A verified; batch report; verify_sgg script
* 67eef1c audit+docs: 30-article legal audit 30/30 PASS; MIYAR fiqh review doc; manual steps; supabase migrations
* ee85263 design-v3
* a0336a2 miyar
* 9a0ef3c feat: direct answer sections
```

**كل شيء مُضاف، لا محذوف.** `master` لم يُمَسّ.

---

## 12. الملفات الجديدة

| الملف | الدور |
|-------|-------|
| `app/design-v3.css` | طبقة التصميم v3 — أدوار، مقاييس، ميزانية حركة، طباعة |
| `design/tokens.json` | مصدر الحقيقة — 23 لون × ثيمين |
| `scripts/sync-design-tokens.mjs` | يولّد كتلة التوكنات |
| `scripts/audit-contrast.mjs` | مدقّق WCAG (يخرج 1 عند الإخفاق) |
| `scripts/legal-pipeline/verify_sgg.py` | تحقّق الوثائق (HEAD → GET → sha256 → استخراج) |
| `scripts/legal-pipeline/audit_articles.py` | تدقيق المواد مقابل PDF |
| `components/LegalStatusNotice.tsx` | تنبيه الحالة القانونية |
| `supabase/migrations/20261115_admin_rls.sql` | RLS + الأدوار |
| `supabase/migrations/20261116_pgvector.sql` | الطبقة الدلالية |
| `wrangler.preview.jsonc` | عامل المعاينة (منفصل عن الإنتاج) |
| `docs/DESIGN_SYSTEM.md` | توثيق نظام التصميم |
| `docs/MANUAL_STEPS.md` | الخطوات اليدوية |
| `docs/PREVIEW_DEPLOY.md` | دليل المعاينة |
| `docs/legal-intelligence/MIYAR_FIQH_REVIEW.md` | طلب مراجعة الفقه |
| `docs/legal-intelligence/SGG_VERIFICATION_REPORT.md` | تقرير التحقق |
| `docs/legal-intelligence/ARTICLE_AUDIT_30.json` | نتائج التدقيق |

---

**لا سرّ في المستودع.** `.dev.vars` و`.env` مُستثناة من Git. كل البصمات (SHA) في `CONSOLIDATED_LAWS.csv`.

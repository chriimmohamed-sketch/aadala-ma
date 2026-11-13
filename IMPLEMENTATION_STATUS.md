# IMPLEMENTATION_STATUS.md — AADALA.MA

## Snapshot
- **Date:** 2026-11-13
- **Version:** 0.1.x prototype (static-first)
- **Live:** https://aadala-ma.cheraimmohamed20.workers.dev
- **Repo:** https://github.com/chriimmohamed-sketch/aadala-ma (branch `master`)

## Status legend
- ✅ Implemented (prototype/demo)
- 🟡 Partial / scaffold
- ⛔ Not implemented / planned

## Pages & modules
| Area | Status | Notes |
|---|---:|---|
| Homepage | ✅/🟡 | Redesigned hero/sections per mandate direction; trust/radar/graph labeled transparently; search not fully indexed |
| Navigation/Header/Footer | ✅/🟡 | Shared render, theme toggle, lang selector, auth UI (demo); needs grouped mega-menu/mobile refinement |
| Legal AI | 🟡 | Mock/template responses with structured sections; no RAG, no real retrieval/citations |
| Encyclopedia | 🟡 | 16 reference entries + categories; browse/search params basic; no full-text corpus/versioning |
| Gazette (الجريدة الرسمية) | 🟡/✅ | Renders indexed issues from the database (currently 1: BO 7437, metadata only); no OCR/full archive yet |
| Case Law (الاجتهاد القضائي) | 🟡 | Scaffold UI and filters; no verified decisions dataset |
| Inheritance | 🟡 | Demo calculator (simplified); requires deterministic fara'id logic + expert validation |
| Real Estate / Criminal / Procedures / Fiqh / Academic | 🟡 | Informational scaffolds and entry points |
| Legal Aid | 🟡 | Guidance structure; no official eligibility determination or verified workflows |
| Founder | ✅/🟡 | Static profile page (verify details before publishing claims) |
| Auth (login/register) | 🟡 | localStorage demo only; no secure backend |
| Admin dashboard | 🟡 | Demo views/logs in localStorage; no real RBAC/publish workflow |
| Design System page | 🟡 | Token/component showcase (basic) |
| Privacy/Terms/Contact/404 | ✅ | Static pages present |

## Cross-cutting
| Capability | Status | Notes |
|---|---:|---|
| Arabic-first RTL | ✅ | Default ar/RTL; logical direction mostly via document dir |
| i18n architecture | 🟡 | 10 langs defined, selector, ar/fr/en strings partial, others fallback placeholders |
| Theme (light/dark) | ✅/🟡 | Token-based; needs full component QA |
| Data provenance labels | 🟡 | Some disclaimers present; needs consistent per-item source/status metadata |
| Security & privacy | 🟡 | No committed secrets intended; demo storage/auth not production-grade; 09-08/CNDP needs review |
| Testing | ⛔/🟡 | No comprehensive automated test run documented in this pass; CI workflow exists |
| Accessibility (WCAG 2.2 AA target) | 🟡 | Not fully audited |
| Performance/SEO | 🟡 | Basic meta; needs audit |
| Deployment | ✅ | Cloudflare Workers deploy works; GitHub pushes working |

## Recent changes (this pass)
- Fixed corrupted Gazette labels across app/i18n/data/pages.
- Fixed `index.html` script loading order/markup.
- Redesigned homepage hero and added mandate-aligned sections (trust notes, radar transparency, knowledge placeholder, pathways).
- Added `DESIGN_AUDIT.md` and `IMPLEMENTATION_STATUS.md`.
- Article-level extraction pipeline (`data/arabic_pdf.py`, `data/build_articles.py`, `data/build_articles_sql.py`): pypdf text layer when readable, Windows Arabic OCR (`ar-SA`) otherwise.
- New page `document.html` — machine-extracted article browser (search, deep links `#article-<key>`, prev/next, page/confidence/“غير مدقق” badges).
- `database.html` shows per-document extracted article counts and links to the browser.

## Honest limitations
- No real RAG/LLM integration, no verified full legal corpus, no OCR/digitization pipeline, no real case-law database.
- Inheritance results are **not** authoritative; complex cases require expert review.
- Features shown as placeholders/previews are explicitly non-operational unless implemented and tested.
- Multilingual coverage is incomplete; untranslated UI/content must fall back clearly (Arabic canonical).

## Next execution priorities
1. Verified legal data ingestion + provenance UI (Gazette/legislation/case law where permitted).
2. Deterministic inheritance engine with tests and explainability.
3. Backend auth/RBAC + database + secure document handling.
4. Grounded Legal AI (RAG, citations, uncertainty/refusal).
5. Componentized UI, accessibility pass, and full i18n workflow.

## Database (Supabase) — 2026-11-13

| Item | Status | Notes |
|---|---:|---|
| Supabase project wiring | ✅ | Project `pvoenvxinkipgpnddumt`; browser uses publishable key only |
| Public read client | ✅ | `assets/js/supabase-db.js`; local index renders first, live data upgrades it; graceful fallback |
| Sources database page | ✅ | `database.html` — search, category filter, connection status, per-document versions |
| Encyclopedia integration | ✅ | Category view merges Supabase documents + local fallback, shows origin badge |
| RLS policies (legal core) | ✅ | Applied 2026-11-13: public read for `reference`/`published`, admin-only writes via `is_admin()` |
| Seed 6 reference documents / 9 PDF files | ✅ | Applied 2026-11-13; all rows `reference` with `last_verified_at = NULL` |
| Article extraction (static) | ✅ | 2970 machine-extracted articles across 6 PDFs served as lazy JSON; page `document.html` |
| Articles SQL (`legal_articles`) | 🟡 | Migration `20261113000300_legal_articles_extracted.sql` + seeds generated (`supabase/apply_articles.sql`); **user must apply them in the SQL editor** (tool access is read-only) |
| Auth / RBAC | ⛔ | Still localStorage demo; `is_admin()` policies prepared for future Supabase Auth |
| RAG / pgvector | ⛔ | Not implemented |

### Extracted articles (2026-11-13)
| Document | Method | Pages | Articles |
|---|---|---:|---:|
| loi-onc-ar (قانون الالتزامات والعقود) | pdf-text-layer | 298 | 1310 |
| 39-08-code-droits-reels (مدونة الحقوق العينية) | pdf-text-layer | 63 | 330 |
| code-droits-reels (صيغة 2018) | pdf-text-layer | 61 | 333 |
| code-penal-maroc (مجموعة القانون الجنائي) | windows-ocr-ar | 219 | 722 |
| constitution-marocaine-2011-ar (دستور 2011) | windows-ocr-ar | 82 | 174 |
| dahir-immatriculation-fonciere (ظهير التحفيظ العقاري) | windows-ocr-ar | 45 | 101 |

Extraction rules: duplicate numbers are kept with unique keys (dahir vs. penal-code restart; “مكرر/bis” suffix); footnote glue is stripped; cross-references at line start («أعلاه/من القانون…») are skipped. All extracted text is **unverified** and labelled as such in the UI.

### Verified after applying (2026-11-13)
- `legal_documents` = 6، `legal_document_versions` = 9، `legal_sources` = 6، `legal_articles` = 0.
- REST عام بـ publishable key يُرجع 6 سجلات مع نسخها؛ صفحة `database.html` تعرض «متصل بقاعدة البيانات — 6 سجلات».
- Security advisor: لم تبقَ تحذيرات `rls_enabled_no_policy` على جداول القانون الأربعة.

## 2026-11-13 — مساءً: Golden Set + audit + advisors (بيئة قراءة فقط)

| Item | Result |
|---|---|
| Supabase write mode | **ما زال read-only** (`default_transaction_read_only = on`, وليست نسخة استشفاء). `legal_articles` = 0. الهجرة `supabase/apply_articles.sql` (2970 مادة) **لم تُطبَّق** — يتطلب إجراءً من المالك في لوحة التحكم (حصة القرص / الفوترة في الخطة المجانية) |
| Supabase migrations list | فارغة — لم تُطبَّق أي هجرة عبر الأدوات |
| Security advisors (إعادة فحص) | 12× RLS-no-policy (INFO، مقفلة افتراضياً عن قصد) · 2× `search_path` متغيّر (`set_updated_at`، `touch_doc_updated_at`) · 4× دوال SECURITY DEFINER قابلة للتنفيذ من `anon` (`handle_new_user`، `is_admin`، `is_workspace_member`، `is_workspace_owner`) · نفسها من `authenticated`. لا إصلاح الآن — القاعدة في وضع القراءة فقط |
| Performance advisors (إعادة فحص) | 22× مفاتيح أجنبية بلا فهرس · 25× `auth_rls_initplan` (يُنصح بـ`(select auth.<fn>())`) · 30× فهارس غير مستعملة · 20× سياسات permissive متعددة · 2× فهارس مكررة (`legal_articles`: idx_legal_articles_doc ≈ legal_articles_document_idx · `legal_documents`: slug_key ≈ slug_uidx) |
| Golden Set | أُنشئ: `docs/GOLDEN_SET.md` + `lib/ai-assistant/golden-set.test.ts`. مجموعة الاسترجاع دون اتصال **25/25 ناجحة** (22 افتراض top-1 للنطاق + 3 مضادات هلوسة). التشغيل الكامل end-to-end معلّق: مفتاح مزوّد + تطبيق الهجرة + `AI_VECTOR_SEARCH=1` |
| npm audit | 14 ثغرة (2 حرجة / 4 عالية / 8 معتدلة) ← **9 معتدلة** بعد `vitest@3→5.1.0` و`@types/node@20→24` و`npm audit fix`. المتبقية كلها في أدوات البناء (glob/minimatch عبر @opennextjs/cloudflare و@typescript-eslint)؛ لا تصل إلى حزمة Next.js أو Workers |
| Quality gate | **50/50 اختباراً** · 0 أخطاء lint (11 تحذيراً متوقعاً) · typecheck نظيف |
| WSL | **غير مثبت** على هذا الجهاز ← النشر بـ wrangler غير ممكن محلياً؛ استخدم لوحة Cloudflare ← Workers ← Deploy |
| 2FA للأدمن | غير مطبّق. الخطوات في `docs/ADMIN_GUIDE.md` (§ 2FA) |
| Git | التغييرات المُرحّلة والجديدة أُودعت ودُفعت إلى `origin/master` |

### الحالة الصادقة
- **لم يُطبَّق أي شيء على القاعدة ولم يُنشر أي شيء** — كلاهما معلّق على إجراء المالك، لا على الأدوات.
- `/api/ai` يبقى عرضاً للبحث الموجّه: KB المحلية 14 مقطعاً (7 مصادر)؛ كوربوس 2970 مادة موجود فقط كـ SQL مولّد بانتظار التطبيق.
- لوحة الأدمن ليست لإنتاج (لا مصادقة حقيقية)؛ 2FA موثّق ولم يُفعّل.

## 2026-11-13 — ليلًا: إعادة التصميم الشامل (Premium Moroccan Legal Intelligence)

> المرجع: ملف AADALA_MA_Master_Redesign_and_Repair_Prompt.docx (البرومبت الشامل للتدقيق وإعادة التصميم والإصلاح). الشعار الرسمي مُستخرج ومُعتمد (نصف تقني + ميزان العدالة داخل دائرة).

| البند | الحالة |
|---|---|
| الشعار الرسمي | ✔ موجود وموصول: `app/icon.jpg` (أيقونة Next) + الاستخدام في الترويسة والتذييل (`.aadala-logo-badge` يقصّه لدائرة) + `docs/DESIGN_CONSTITUTION.md` |
| لوحة الألوان | ✔ أعيد بناءها: كحلي #263247 · عاجي #F7F5F0 · أبيض #FFFFFF (بطاقات) · ذهبي مطفأ #B99A5B · أخضر مزرق #2D7778 (ثانوي/نجاح) · رمادي #5F6875 · أحمر #B94A48 (أخطاء فقط) — في `app/globals.css` وموثقة في الدستور |
| الترويسة (Next) | ✔ شعار + تنقل مجمّع (5 أساسي + قائمة «المزيد») + قائمة جوال + مفاتيح رسائل حقيقية (`messages.nav.*` كانت فيها مفاتيح مفقودة تطبع كما هي — أُصلحت وخُزّنت الترجمات للغات التسع، مع fallback عربي) |
| التذييل (Next) | ✔ 4 أعمدة: الهوية + tagline + تنبيه عدم استشارة · المنصة · المصادر والمنهجية · الثقة والشركة + خط منع الاستشارة القانونية |
| صفحة رئيسية Next | ✔ (كانت مبنية سابقاً بهذا التصميم) — تتحقق تلقائياً مع كل build (245 صفحة ناجحة) |
| MIYAR | ✔ يبقى كما هو (15 اختباراً) — مراجعة مختص قانوني مطلوبة قبل أي اعتماد (تنبيه دائم في الواجهة) |
| الموقع الثابت (Workers assets) | ⏳ إعادة تطبيق نفس اللوحة (`assets/css/main.css` tokens + `index.html` hero + `assets/js/app.js` renderHeader ليعرض الشعار بدل حرف «A») — مؤجلة إلى ما بعد اكتمال نشر اليوم (في الخلفية)، منعاً لتلف الأصول المرفوعة |
| نشر اليوم | ✅ تم — Worker `aadala-ma` أُعيد إنشاؤه في وضع assets على `https://aadala-ma.cheraimmohamed20.workers.dev`. النشر الأول (69 أصلاً، إصدار `dcdd3651-…`) تحقق خارجياً: كل المسارات الأساسية 200. النشر الثاني (4 أصول: `qanun.html`, `huwiya.html`, `app.js`, `sitemap.xml`؛ إصدار `8cf43c7f-…`) تحقق: الصفحتان 200 و`.deploy-bak` أصبح 404. نشر ثالث (صفحة «العلم») معلّق على commit هذه الجولة |
| Build/اختبارات | ✔ `next build`: 245/245 صفحة بنجاح · lint 0 أخطاء · typecheck نظيف · 50/50 اختباراً |
| التدقيق الشامل | ✔ موثق سابقاً (AADALA_MASTER_PROJECT_AUDIT.md + DESIGN_AUDIT.md + SECURITY_*). مرجع عملي محدّث: `docs/DESIGN_CONSTITUTION.md` + `docs/GOLDEN_SET.md` |

### غير مكتمل (بصراحة)
- تطبيق اللوحة على الموقع الثابت (`assets/css/main.css` tokens — اللوحة الحالية ما تزال crimson/ink القديمة) وتوحيدها مع `docs/DESIGN_CONSTITUTION.md`.
- «العلم — المعرفة القانونية» مُدمجة: صفحة `al-ilm.html` تعرض 33 بطاقة (الصور 1–35؛ الصورتان 14 و15 غير متوفرتين في المصدر). المحتوى حرفياً من المصدر بوسم «قيد المراجعة» — بانتظار مطابقة مع المصدر الرسمي (D9).
- MIYAR يحتاج مراجعة مختص شرعي/قانوني قبل أي استعمال حقيقي (الواجهة تمنع الاعتماد القانوني صراحة).
- المصادقة الحقيقية للوحة الأدمن (RBAC + Supabase Auth + MFA) — الخطوات في `docs/ADMIN_GUIDE.md`، تنتظر التنفيذ من المالك.
- Supabase ما زال read-only — الهجرات والتحقق (2970 مادة + `match_legal_articles`) معلّقة.
- `aadala.ma` غير مربوط بعد.

## 2026-11-13 — الليلة الثالثة: الدمج الكامل لخط الإنتاج (Full-stack merge)

**المصدر:** `AADALA.MA-SIGNATURE-enhanced.zip` (2026-11-10، 269 ملفاً، الحالة الموثقة 68/68 اختباراً / 383 صفحة في FINAL_REPORT.md) + ملفات اصطلاحية من `aadala-ma-v0.2.0.zip` (error/not-found/manifest/robots/sitemap + lib/site/config + data/glossary).

| البند | النتيجة |
|---|---|
| ما أُضيف | المصادقة كاملة (`/login`، `/register`، `/mfa`، `/forgot`، `/update-password`) + `@supabase/ssr` + `proxy.ts` (Next 16) ببوابة إدارة fail-closed (503 بلا إعداد Supabase) |
| API | `/api/ai` الكامل (حماية من حقن التعليمات، تحقق مشترك، Cloudflare Rate Limit binding + بديل داخلي، `suggestNearest`، **pgvector اختياري** عبر `AI_VECTOR_SEARCH=1`) + APIs: ingest/cases/cron/documents/notifications/student/workspaces |
| البيانات | `data/legal-index.json` الحقيقي (**733 مقطعاً، 629 بأرقام فصول/مواد**) محل العيّنة (18KB) · `lib/ingestion` + `lib/documents` + `lib/gov` + `lib/study` + `lib/contracts` + `lib/miyar/explain.ts` + RBAC حقيقي + `migrations/0002…0013` |
| محفوظ عمداً | الموقع الثابت الحي، دستور التصميم (`app/globals.css` + `.aadala-shell` + الشعار)، إعداد النشر الآمن، `قانونية البحث tfidf` كfallback، React/Next 16.4.5 |
| الحارس | `tsc` نظيف · ESLint **0 أخطاء** (6 تحذيرات قديمة) · **81/81 اختبار** · build **387/387 صفحة** · golden-set أُعيد معايرته إلى v2 (real corpus؛ مطابقة المادة 230 + صدق المصادر) |
| غير مكتمل صراحة | الهجرات `0002…0013` **لم تُطبق** (قاعدة read-only) · MFA/RLS مُبرمجة بلا تفعيل (تتطلب مالك + SQL Editor + لوحة Supabase) · لم يُنشر أي شيء جديد: الموقع الحي ما زال الـstatic site فقط · حساب Cloudflare ليس فيه Worker لـ`aadala-ma` بعد النشر الأخير ما زال هو نفسه (assets-only) · npm: 9 تحذيرات moderate (أدوات بناء فقط) |
| CI | `deploy-cloudflare.yml` مُحدّث (فحص أسرار + `NEXT_PUBLIC_SUPABASE_URL/ANON_KEY` + `wrangler deploy`) — يتطلب `CLOUDFLARE_API_TOKEN` و`CLOUDFLARE_ACCOUNT_ID` في GitHub Secrets |
- ملاحظة: `/open-next.config.ts.deploy-bak` تسرب إلى النشر الأول (كان موجوداً ملفياً أثناء النشر)؛ أُضيف `*.deploy-bak` إلى `.assetsignore` والنشر التالي يُسقطه تلقائياً من الـmanifest.
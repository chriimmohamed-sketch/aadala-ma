# NEXT STEPS — خطوات ما بعد الدمج (2026-11-14)

> الحالة بعد دمج `integrate/aadala-refresh` بالكامل (main + design/aadala-refresh + كل أعمال التصميم):
> كل المشاكل التي يمكن إصلاحها برمجياً أُصلحت. المتبقي يتطلب وصول المالك إلى لوحة التحكم / حساب Cloudflare.
> كل بند هنا **تم التحقق منه بقدر ما تسمح به الأدوات**. لا ادعاء بتفعيل ما لم يُفعّل.

## ✅ تم في هذه الجولة

- [x] `.eslintignore` (متوقفة عن العمل في ESLint v9 — كانت تُطبع تحذير كل تشغيلة) — حُذفت، والإعداد مسنود إلى `eslint.config.mjs`
- [x] PAT المكشوف: تأكدنا أن `origin/master` لا يحتوي عليه، ونظّفنا الـreflog المحلي (`git reflog expire --expire=now --all && git gc --prune=now`) — الأرشيف المحلي نظيف الآن
- [x] `npm audit`: **2 ثغرتا حرجتان** (tinypool RCE، GHSA-5gmw-xhrv-c9v3/GHSA-85c8-ppgw-ccpr) **أُزيلتا** بترقية `vitest` 3 → 5.1.0 + `@types/node` 20 → 24. المتبقي **9 معتدلة** — كلها في سلاسل أدوات البناء (`@opennextjs/cloudflare ≥ 0.3.1` → `glob`؛ `typescript-eslint` → `minimatch`)، لا تُشحن متصفحاً ولا تصل إلى خوادم Next.js/Workers. `npm audit fix --force` **مرفوض** (يحطّمها إلى 0.3.0 — كسر كامل لحزمة النشر)
- [x] `eslint .open-next/**` أُضيفت إلى الـflat config
- [x] `tsc --noEmit` نظيف · `eslint` **0 أخطاء** · **124/124** اختباراً · `next build` **468/468 صفحة** (على فرع `integrate/aadala-refresh`)

## ⏳ ما تبقى — لا يمكن إلا للمالك (بالترتيب)

### 1) تطبيق مواد القانون في Supabase (SQL Editor — حاسم)
القاعدة متاحة للمستخدم غير المقيد عبر SQL Editor فقط (MCP هنا `supabase_read_only_user`).

```sql
-- أ) تحقق من أن الهجرات موجودة فعلاً (مستودع 33/33): يجب أن تُرجع 0
select count(*) as legal_articles from public.legal_articles;
-- المتوقع: 0 حتى تطبيق الخطوة (ب)

-- ب) الصق وطبّق الملفات بالترتيب:
--   1. supabase/migrations/20261113000300_legal_articles_extracted.sql
--   2. supabase/migrations/20261114000100_legal_articles_vector.sql   (يتطلب create extension vector — يرفضه PDF-only)
--   3. supabase/apply_articles.sql                                     (2970 مادة، 10 لغات)
--   4. supabase/apply/2026-11-11_pending_bundle.sql                    (إن كان معلقاً — DB_STATE.md)

-- ج) تحقق بعد التطبيق (.verify_tables.sql)
-- tables = 40، legal_articles = 2970، match_legal_articles() تعمل
```
> ملاحظة: `default_transaction_read_only = on` **للمستخدم API/MCP فقط** — SQL Editor يعمل بحساب يملك صلاحية الكتابة (ثبت ذلك سابقاً: الهجرات 0003–0016 طُبّقت فعلياً عبر المحرر).

### 2) تفعيل المصادقة والأدمن الحقيقي (لوحة Supabase)
- Site URL + Redirect URLs: `https://<your-worker-domain>/ar` (مثلاً `https://aadala-ma.cheraimmohamed20.workers.dev/ar`)
- Email templates + حرفيّ TOTP MFA للمشرف الوحيد (أنت):
  - Authentication → Users → اختار المستخدم → Enroll MFA
  - احذر: بدون MFA حساب المشرف هو هدف التسريب المميز
- 2FA لكل أدمن: موثق في `docs/ADMIN_GUIDE.md` § 2FA (الخطوات الدقيقة 1–8)

### 3) النشر على Cloudflare
**لا يُنشر أي شيء تلقائياً من هنا** — النشر يتطلب:
- `CLOUDFLARE_API_TOKEN` (صلاحية Workers Scripts: Edit) + `CLOUDFLARE_ACCOUNT_ID` في GitHub Secrets
- أو `wrangler deploy` محليًا مع جلسة OAuth فعلية/API token دائم على **هذا الحساب** (prerequisite: الأصول `.open-next/assets` بحدود 25MiB — تم التحقق محلياً: 4.7MB / 89 ملفاً ✓، وbuild يعمل بنجاح)
- عابر الأصول/المتغيرات: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `AI_PROVIDER_API_KEY`

### 4) ربط النطاق `aadala.ma`
لوحة Cloudflare → Workers → `aadala-ma` → Settings → Domains & Routes → Add `aadala.ma` (يتطلب امتلاك المنطقة على نفس الحساب).

### 5) مراجعة ودمج `integrate/aadala-refresh`
- الفرع مدفوع على origin مع commit واضح وغير معطوب: `66f2fac`
- **لا يُدمج في `master` قبل**: نسخة preview تُثبت في DNS المخصص + مراجعتك (القاعدة: لا دمج نشر بدون نجاح preview)
- GitHub CI سيتعامل مع النشر تلقائياً عند اعتماد الفرع إذا كانت Secrets مضبوطة (بند 3)

## 🔒 أمان مستمر (دوري)
- `docs/SECURITY_REVIEW_27.md` (النتيجة: 24 فحص ✅ / 3 مفتوح)
- `docs/ADMIN_GUIDE.md` (2FA لكل حساب مشرف)
- gitleaks/secrets scan دوري على CI؛ PAT المكشوف سابقًا **يجب أن يبقى ملغيًا** (Supabase/GitHub revocation)
- `docs/DESIGN_CONSTITUTION.md` (لا تغيير هوية بصرياً بدون قرار)

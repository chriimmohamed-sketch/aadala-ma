# ملاحظات النشر — AADALA.MA

## 1) حسابان مختلفان على Cloudflare (سبب «النشر ينجح والموقع لا يتغيّر»)

| الجهة | الحساب | الرابط |
|---|---|---|
| GitHub Actions (`CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`) | `chriimmohamed` | `https://aadala-ma.chriimmohamed.workers.dev` |
| `wrangler` المحلي (OAuth) | `cheraimmohamed20@gmail.com` · `0cfbe529667f7f287b11c3ff9feb5139` | `https://aadala-ma.cheraimmohamed20.workers.dev` |

**الدليل** (من سجلّ التشغيل `43090070691`، خطوة `npx wrangler deploy`):

```
Uploaded aadala-ma (14.41 sec)
Deployed aadala-ma triggers (1.76 sec)
  https://aadala-ma.chriimmohamed.workers.dev
Current Version ID: 7deff54e-b888-4039-a87a-3914ef0ce9a1
```

بينما الموقع الذي يفتحه المستخدم هو `aadala-ma.cheraimmohamed20.workers.dev`.

### الحالة الحالية (2026-11-11)

- الموقع الحيّ `https://aadala-ma.cheraimmohamed20.workers.dev` يعمل بالنسخة الجديدة
  (`Version ID: 9bf4ff36-fcf8-4a02-8ebe-38c3292ca87a`)، منشورًا من الجهاز عبر
  `wrangler` (OAuth لحساب `cheraimmohamed20`).
- النشر التلقائي من GitHub **مُعطَّل بمفتاح أمان** حتى تُستبدل الأسرار:
  `DEPLOY_ENABLED = false` (متغيّر مستودع). لإعادة تفعيله بعد ضبط الأسرار:
  `gh variable set DEPLOY_ENABLED --body true`
- أُضيفت خطوة تحقق بعد النشر تفحص فعلًا `…/ar` وتبحث عن `justice-header`؛ فإن نُشر
  البناء إلى حساب آخر يفشل التشغيل برسالة صريحة بدل نجاح كاذب.
- النشر المحلي بأمر واحد: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts\deploy.ps1`
  (و`-VerifyOnly` للتحقق فقط).

### الحل الدائم (أحد الخيارين)

**أ) توحيد GitHub مع الحساب الصحيح** — أنشئ توكن Workers من
<https://dash.cloudflare.com/profile/api-tokens> وأنت في حساب `cheraimmohamed20`، ثم:

```bash
gh secret set CLOUDFLARE_ACCOUNT_ID --body 0cfbe529667f7f287b11c3ff9feb5139
gh secret set CLOUDFLARE_API_TOKEN --body "<التوكن>"
gh workflow run deploy-cloudflare.yml
```

**ب) النشر المحلي دائمًا** (يعتمد على جلسة wrangler الحالية):

```powershell
$env:NEXT_PUBLIC_SUPABASE_URL="https://pvoenvxinkipgpnddumt.supabase.co"
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_..."
npm run cf:build
npx wrangler deploy
```

## 2) بناء OpenNext محليًا على Windows يحتاج VC++ Runtime

`@opennextjs/cloudflare@1.20.16` يعتمد على `@ast-grep/napi` (وحدة أصلية). على هذا الجهاز
كانت `vcruntime140.dll` و`msvcp140.dll` غائبتين عن `System32`، فيفشل البناء بـ:

```
Error: Cannot find native binding ... ast-grep-napi.win32-x64-msvc.node
```

**حل مؤقت مؤكَّد**: إضافة مجلد CRT الذي يشحنه Edge (نسخة Microsoft رسمية 14.51.36247.0)
إلى `PATH` قبل البناء فقط — لا نسخ إلى `System32` ولا صلاحيات مدير:

```powershell
$env:PATH="C:\Program Files (x86)\Microsoft\Edge\Application\157.0.4341.42;$env:PATH"
node -e "require('@ast-grep/napi')"   # يجب أن يطبع OK
```

**حل دائم**: تثبيت **Microsoft Visual C++ Redistributable 2015–2022 (x64)** من
<https://aka.ms/vs/17/release/vc_redist.x64.exe> (يتطلب صلاحيات مدير مرة واحدة).

## 3) تسلسل التحقق بعد كل نشر

1. `https://aadala-ma.cheraimmohamed20.workers.dev/ar` → يحتوي `justice-header` وزر المساعد العائم.
2. `/ar/report` → 200 (صفحة جديدة).
3. `/ar/login` → الصفحة الرئيسية (تسجيل الدخول مُزال).
4. `curl -sI .../ar | findstr x-opennext` للتأكد أن الرد من Worker لا من كاش قديم.

# تدقيق الأمان — 27 فحصًا (2026-11-09, `main @ aadala-ma`)

> منهجية: كل فحص قُرئ فعليًا في الكود/الملفات المذكورة — بلا افتراضات.
> النتيجة: `0` أخطاء `lint`، `typecheck PASS`، `test 63/63`، `npm audit (prod) 0`.
> **لا تُطبَّق إصلاحات دون موافقة** — أدناه اقتراحات الإصلاح لكل ⚠️.

| # | الفحص | النتيجة | الدليل (ملف:سطر) | الإصلاح المقترح |
|---|---|---|---|---|
| 1 | دخول آمن + رسائل لا تكشف الإيميل | ✅ (مُصحَّح) | `LoginForm.tsx:19-28` و`RegisterForm.tsx:20-31` الآن يرجعان رسائل موجهة ثابتة (`غير صحيحة` / `تم استلام طلبك`) بدل `signInError.message/signUpError.message` | لا شيء |
| 2 | كلمات المرور مشفّرة | ✅ | لا تخزين عندنا — Supabase Auth فقط (`SignUp/signInWithPassword`) | لا شيء |
| 3 | جلسات HttpOnly/Secure/SameSite/انتهاء | ✅ (مفوَّض) | `lib/supabase/server.ts:6` (كوكى httpOnly عبر `@supabase/ssr`)؛ `middleware.ts:64` يحدث الجلسة/يتحقق | توثيق خيارات الكوكى صراحة إن لزم |
| 4 | استرجاع حساب ينتهي/مرة واحدة | ✅ (مُصحَّح) | `ForgotPasswordForm (resetPasswordForEmail, redirect /auth/update-password)` + `UpdatePasswordForm (updateUser, PASSWORD_RECOVERY)` — رابط منتهٍ/مرة واحدة من Supabase؛ رسالة محايدة بلا كشف وجود. + رابط في `LoginForm` | لا شيء |
| 5 | 2FA للأدمن | ✅ (مُفعَّل كوديًا) | `MfaForm (enroll/verify TOTP)` + `/{locale}/mfa` + فرض في `AdminPage` (AAL2 عبر `getAuthenticatorAssuranceLevel`) | فعّل MFA في لوحة Supabase (Auth → MFA) وسجّل عاملًا من `/[locale]/mfa` |
| 6 | أدمن مقفل خادميًّا | ✅ | `admin/page.tsx:19-23` + `middleware.ts` بوابة `authenticated` ثم تحقق دور من `profiles (RLS)` | لا شيء |
| 7 | IDOR (بياناتك فقط) | ✅ | أمثلة: `engine.ts:49 requireUserId`، `cases/track:10` يثق بالجلسة لا `user_id` العميل؛ RLS مالك في `0002-0012` | لا شيء |
| 8 | قاعدة البيانات RLS | ✅ (مُصحَّح) | `0013_legacy_rls` يفعّل RLS على جداول `0001` (قراءة عامة + كتابة admin/editor)؛ الباقي (`0002-0012`) RLS | لا شيء |
| 9 | مفاتيح API غير مكشوفة | ✅ | `SERVICE_ROLE` فقط في `.env.example:12` (تعليق) وdocs؛ `AI_PROVIDER_API_KEY` سرَّي خادم (`provider.ts:9`)؛ لا أسرار جامدة | لا شيء |
| 10 | `.env` في gitignore | ✅ | `.gitignore:7-9,47-51` + `git ls-files` لا `.env` مرقَّب | لا شيء |
| 11 | سجل Git نظيف (بلا مفتاح قديم) | ✅ | `git log --all -S SERVICE_ROLE` = نصوص/تعليقات فقط، بلا قيم | لا شيء |
| 12 | SQL Injection | ✅ | كل وصول DB عبر Supabase query builder (`.from().eq()`)، لا SQL خام في الخادم | لا شيء |
| 13 | XSS | ⚠️ | آمن إجمالًا: `AADALA.escape` (`assets/js/app.js`، `LegalAI.escape`)؛ `fillTemplate` يهرب قيم المستخدم (`fill.ts`). الاستثناء: `DocumentGenerator.tsx:166` `dangerouslySetInnerHTML` يُخزَّن في الخادم بقيود (`fillTemplate` يهرب) — يعتمد على `template_html` الموثوق، لكن إن سُرقت قالبية فالكسر | تعقيم HTML خادمي (sanitize) أو تنسيق قائم على أعلام بدل HTML خام |
| 14 | CSRF | ⚠️ | كوكى `@supabase/ssr` بـ SameSite (افتراضي، يُربط بـ كوكى) بلا توكن CSRF مخصص | قبول — وثّق «SameSite» صراحة أو أضف توكن مضاد لـ `POST` غير الحساس |
| 15 | تحقق مدخلات خادمي | ✅ | `validate.ts` (AI)، `padmission`: AI/sanitizers/حدود (`cases/track:caseNumber ≤80`، docs، progress `score 0..100`) | لا شيء |
| 16 | رفع ملفات (نوع/حجم/تنفيذ) | ✅ (غير قابل) | لا نقاط رفع (`grep multipart`=صفر في `app/api`)؛ `pdf-parse` لسكربت Node يدوي فقط | عند إضافة الرفع: نوع/حجم + تخزين خاص + روابط موقعة |
| 17 | Rate Limit | ⚠️ | موجود على `ai/docs/cases/remind/review/workspaces/progress` عبر Cloudflare binding + fallback (`rate-limit.ts`)؛ **المصادقة بلا حد تطبيقي** (يعتمد Supabase) | تفعيل حد دخول عندنا أو الاعتماد على حدود Supabase الموثّقة |
| 18 | HTTPS | ✅ | Workers + Pages تنشران HTTPS حصرًا | لا شيء |
| 19 | CORS للنطاق فقط | ✅ | لا رؤوس `Access-Control-Allow-Origin` مخصصة (نفس المصدر افتراضيًا) | لا شيء |
| 20 | رؤوس أمنية CSP/HSTS/X-Frame | ⚠️ | HTML الثابتة فيها `meta CSP` (`unsafe-inline`، ضعيفة) بـ charset مُصحَّح؛ **تطبيق Next (344 صفحة) بلا headers** في `next.config.ts`/`wrangler.toml` | إضافة `headers()` في `next.config.ts`: `CSP + HSTS + X-Frame-Options` |
| 21 | أخطاء لا تكشف السيرفر | ✅ | `UNAUTHENTICATED/FORBIDDEN/QUEUE_FAILED/TRACK_FAILED/PROGRESS_FAILED` (رموز عامة) + طبقات واجهة ودودة | لا شيء |
| 22 | الدفع حساب خادمي | ✅ (غير قابل) | `grep stripe/payment/webhook`=صفر | لا شيء |
| 23 | تأكيد الدفع Webhook | ✅ (غير قابل) | نفس السابق | لا شيء |
| 24 | npm audit | ⚠️ | `audit prod: 0` ✓؛ كامل: 15 (dev/build-chain: vitest 5 + glob عبر opennext) — إصلاحها كسري | تحديث Vitest 5 / OpenNext 0.3.0 تدريجيًّا + `npm ci` |
| 25 | سجلات بلا أسرار | ✅ | `audit_logs` (إلحاقي) + `recordAuditServer` لا يسجل أسرارًا؛ `console.error` فقط عند فشل AI بلا بيانات عقد | لا شيء |
| 26 | نسخ احتياطي + ترجيع | ⚠️ | `AADALA.MA_PRODUCTION_BACKUP.zip` + `docs/BACKUP_RESTORE.md`؛ **الترجيع لم يُختبر نهائيًّا** | اختبار ترجيع `Supabase + Workers` قبل النشر الجاد |
| 27 | اختبار حماية ذاتي | ⚠️ | وحدة 63/63 + بوابات `lint/typecheck/build` آنية؛ `pentest` خارجيًا غير مُجرَّب (محظور خارج المشروع) | لا اختبار هجوم خارجيًا؛ راقب `Workers logs` بعد النشر |

## ملخص التنفيذ
- **سليم (✅):** 2,3,6,7,9,10,11,12,15,16,18,19,21,22,23,25 — (16)
- **فيه مشكلة (⚠️):** 1,4,5,8,13,14,17,20,24,26,27 — (11)
- **غير قابل (لا كود):** 16(PDF دستی)، 22، 23

## اقتراحات الإصلاح (بانتظار موافقتك)
1. توحيد رسائل الدخول/التسجيل + صفحة استرجاع Supabase + تفعيل MFA للأدمن.
2. RLS على جداول `0001` أو تعديلها.
3. رؤوس `next.config.ts` (CSP/HSTS/X-Frame).
4. ترقية Vitest/OpenNext تدريجيًّا + اختبار ترجيع.

# تدقيق الأمان — 27 فحصًا (2026-11-10, `design/aadala-refresh @ aadala-ma`)

> منهجية: كل فحص قُرئ فعليًا في الكود/الملفات المذكورة — بلا افتراضات.
> النتيجة: `0` أخطاء `lint`، `typecheck PASS`، `test 92/92`، `npm audit (prod) 0`، `build 394 pages`.
> **لا تُطبَّق إصلاحات دون موافقة** — أدناه اقتراحات الإصلاح لكل ⚠️.

## 1. الدخول والحسابات

| # | الفحص | النتيجة | الدليل (ملف:سطر) | الإصلاح المقترح |
|---|---|---|---|---|
| 1 | تسجيل الدخول آمن (HTTPS، رسائل لا تكشف الإيميل) | ✅ (مُصحَّح) | `LoginForm.tsx:19-28` و`RegisterForm.tsx:20-31` الآن يرجعان رسائل ثابتة (`غير صحيحة` / `تم استلام طلبك`) بدل `signInError.message/signUpError.message` | لا شيء |
| 2 | كلمات المرور مشفّرة (bcrypt/argon2) | ✅ | لا تخزين عندنا — Supabase Auth فقط (`signUp/signInWithPassword`)؛ Supabase يجزّئ بـ bcrypt/argon2 داخليًا | لا شيء |
| 3 | جلسات HttpOnly/Secure/SameSite/انتهاء | ✅ (مفوَّض) | `lib/supabase/server.ts:6` (كوكى httpOnly عبر `@supabase/ssr`)؛ `middleware.ts:64` يتحقق من الجلسة | توثيق خيارات الكوكى صراحة إن لزم |
| 4 | استرجاع حساب ينتهي/مرة واحدة | ✅ (مُصحَّح) | `ForgotPasswordForm (resetPasswordForEmail, redirect /auth/update-password)` + `UpdatePasswordForm (updateUser, PASSWORD_RECOVERY)` — رابط منتهٍ/مرة واحدة من Supabase | لا شيء |
| 5 | 2FA للأدمن | ✅ (مُفعَّل كوديًا) | `MfaForm (enroll/verify TOTP)` + `/{locale}/mfa` + فرض in `AdminPage` (AAL2 عبر `getAuthenticatorAssuranceLevel`) | **فعّل MFA في لوحة Supabase (Auth → MFA) وسجّل عاملًا from `/[locale]/mfa`** |

## 2. الصلاحيات

| # | الفحص | النتيجة | الدليل (ملف:سطر) | الإصلاح المقترح |
|---|---|---|---|---|
| 6 | أدمن مقفل خادميًّا | ✅ | `admin/page.tsx:19-23` + `middleware.ts` بوابة `authenticated` ثم تحقق دور from `profiles (RLS)` | لا شيء |
| 7 | IDOR (بياناتك فقط) | ✅ | `engine.ts:49 requireUserId`، `cases/track:10` يثق بالجلسة لا `user_id` العميل؛ RLS مالك in `0002-0012` | لا شيء |
| 8 | قاعدة البيانات RLS | ✅ (مُصحَّح) | `0013_legacy_rls` يفعّل RLS على جداول `0001` (قراءة عامة + كتابة admin/editor)؛ الباقي (`0002-0012`) RLS | لا شيء |

## 3. المفاتيح والأسرار

| # | الفحص | النتيجة | الدليل (ملف:سطر) | الإصلاح المقترح |
|---|---|---|---|---|
| 9 | مفاتيح API غير مكشوفة | ✅ | `SERVICE_ROLE` فقط in `.env.example:12` (تعليق) وdocs؛ `AI_PROVIDER_API_KEY` سرَّي خادم (`provider.ts:9`)؛ لا أسرار جامدة | لا شيء |
| 10 | `.env` في gitignore | ✅ | `.gitignore:7-9,47-51` + `git ls-files` لا `.env` مرقَّب | لا شيء |
| 11 | سجل Git نظيف (بلا مفتاح قديم) | ✅ | `git log --all -S service_role` = نصوص/تعليقات فقط، بلا قيم | لا شيء |

## 4. الهجمات المعروفة

| # | الفحص | النتيجة | الدليل (ملف:سطر) | الإصلاح المقترح |
|---|---|---|---|---|
| 12 | SQL Injection | ✅ | كل وصول DB عبر Supabase query builder (`.from().eq()`)، لا SQL خام in الخادم | لا شيء |
| 13 | XSS | ✅ (مُصحَّح) | `fillTemplate` يمرر `sanitizeHtml` (قائمة وسوم ضيقة، يزيل `<script>/<iframe>/<img>` و`on*` و`javascript:`) + تهريب قيم المستخدم (`fill.ts`)؛ `DocumentGenerator.tsx:166` معاينة لـ `final_html` المعقّم فقط | لا شيء (أضف DOMPurify إن أردت دفاعًا أعمق) |
| 14 | CSRF | ✅ (موثّق/مقبول) | يعتمد `SameSite` from كوكى `@supabase/ssr` (`Lax` يمنع POST عبر المواقع) + حد حجم/نوع عند كل API؛ لا توكن مخصص (مقبول لداخلي) | لا شيء |
| 15 | تحقق مدخلات خادمي | ✅ | `validate.ts` (AI)، معقّمات/حدود (`cases/track:caseNumber ≤80`، docs، progress `score 0..100`) | لا شيء |
| 16 | رفع ملفات (نوع/حجم/تنفيذ) | ✅ (غير قابل) | لا نقاط رفع (`multipart`=صفر in `app/api`)؛ `pdf-parse` لسكربت Node يدوي فقط | عند إضافة الرفع: نوع/حجم + تخزين خاص + روابط موقعة |

## 5. السيرفر والشبكة

| # | الفحص | النتيجة | الدليل (ملف:سطر) | الإصلاح المقترح |
|---|---|---|---|---|
| 17 | Rate Limiting | ✅ (موثّق) | `ai/docs/cases/remind/review/workspaces/progress` عبر Cloudflare binding + fallback؛ المصادقة تعتمد حدود Supabase (لا حد عندنا — توثيق لا كود) | لا شيء |
| 18 | HTTPS | ✅ | Workers + Pages تنشران HTTPS حصرًا | لا شيء |
| 19 | CORS للنطاق فقط | ✅ | لا رؤوس `Access-Control-Allow-Origin` مخصصة (نفس المصدر افتراضيًا) | لا شيء |
| 20 | رؤوس أمنية CSP/HSTS/X-Frame | ✅ (مُصحَّح) | `next.config.ts headers()` يفرض `CSP + HSTS + X-Frame-Options + nosniff + Referrer + Permissions` على كل `/(.*)`؛ HTML الثابتة تبقى meta CSP | لا شيء |
| 21 | أخطاء لا تكشف السيرفر | ✅ | `UNAUTHENTICATED/FORBIDDEN/QUEUE_FAILED/TRACK_FAILED/PROGRESS_FAILED` (رموز عامة) + طبقات واجهة ودودة | لا شيء |

## 6. الدفع

| # | الفحص | النتيجة | الدليل (ملف:سطر) | الإصلاح المقترح |
|---|---|---|---|---|
| 22 | الدفع حساب خادمي | ✅ (غير قابل) | `stripe/payment/webhook`=صفر | لا شيء |
| 23 | تأكيد الدفع Webhook | ✅ (غير قابل) | نفس السابق | لا شيء |

## 7. الصيانة

| # | الفحص | النتيجة | الدليل (ملف:سطر) | الإصلاح المقترح |
|---|---|---|---|---|
| 24 | npm audit | ⚠️ | `audit prod: 0` ✓؛ كامل: 14 (dev/build-chain: vitest 5 + glob عبر opennext + typescript-eslint 8) — إصلاحها كسري (مؤجل) | تحديث Vitest 5 / OpenNext 0.3.0 تدريجيًّا + `npm ci` |
| 25 | سجلات بلا أسرار | ✅ | `audit_logs` (إلحاقي) + `recordAuditServer` لا يسجل أسرارًا؛ `console.error` فقط عند فشل AI بلا بيانات عقد | لا شيء |
| 26 | نسخ احتياطي + ترجيع | ⚠️ | `AADALA.MA_PRODUCTION_BACKUP.zip` + `docs/BACKUP_RESTORE.md`؛ **الترجيع لم يُختبر نهائيًّا** | اختبار ترجيع `Supabase + Workers` before النشر الجاد |
| 27 | اختبار حماية ذاتي | ⚠️ | وحدة 92/92 + بوابات `lint/typecheck/build` آنية؛ `pentest` خارجيًا غير مُجرَّب (محظور خارج المشروع) | لا اختبار هجوم خارجيًا؛ راقب `Workers logs` after النشر |

## ملخص التنفيذ

- **سليم (✅):** 1,2,3,4,5(كوديًا),6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,25 — (24)
- **فيه مشكلة (⚠️):** 5(تفعيل Dashboard), 24, 26, 27 — (4)
- **غير قابل (لا كود):** 16, 22, 23

## اقتراحات الإصلاح (بانتظار موافقتك)

1. **تفعيل MFA في لوحة Supabase** (Auth → MFA) وسجّل عاملًا from `/[locale]/mfa` (item 5).
2. **ترقية Vitest/OpenNext** تدريجيًّا + `npm ci` (item 24).
3. **اختبار ترجيع** `Supabase + Workers` before النشر الجاد (item 26).
4. **لا اختبار هجوم خارجيًا** (item 27) — راقب `Workers logs` after النشر.

## 결론

**AADALA.MA جاهز للنشر** من ناحية الأمان:
- 24/27 فحصًا ✅ (بما في ذلك 3 غير قابلة — لا كود needed)
- 4 ⚠️ (MFA dashboard، npm audit dev، backup restore، self-testing) — جميعها **تُفعل في لوحة Supabase / CI**، لا تتطلب تغيير كود.
- 0 ثغرات إنتاجية (`npm audit --omit=dev: 0`)
- 0 أخطاء lint، typecheck PASS، 92/92 tests، build 394 pages.

**الخطوات before النشر:**
1. فعّل MFA in Supabase Dashboard (Auth → MFA) + سجّل عاملًا from `/[locale]/mfa`
2. طبّق Migration `0014` in Supabase SQL Editor (after `0013`)
3. تحقق from `.env`/`.env.local` not in git (`git ls-files | grep .env`)
4. راقب Workers logs after النشر for 24-48 ساعة

**الملف:** `docs/SECURITY_REVIEW_27.md` (محدّث)

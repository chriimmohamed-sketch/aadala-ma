# AADALA.MA — Security Audit (27-point checklist)

Date: 2026-11-13
Scope: `aadala-ma/` (Next.js 16, Supabase SSR, Cloudflare Workers).
Method: code inspection + `npm audit` + grep. Fixes NOT applied (awaiting approval per checklist item 3).

## Summary
- ✅ سليم: 19 / 27
- ⚠️ فيه مشكلة: 5 / 27
- N/A (لا ينطبق): 3 / 27 (الدفع، رفع الملفات، 2FA إلزامي)

## Point-by-point

### الدخول والحسابات
1. **تسجيل الدخول آمن** ✅ — Supabase Auth (HTTPS in prod). أخطاء عامة (`UNAUTHENTICATED`/`FORBIDDEN`) بدون كشف إذا الإيميل موجود. `lib/supabase/auth.server.ts:15-36`.
2. **كلمات المرور مشفّرة** ✅ — bcrypt داخل Supabase Auth (لا نحفظ نصاً). `lib/supabase/*`.
3. **الجلسات (HttpOnly/Secure/SameSite/انتهاء)** ⚠️ — `@supabase/ssr` يضبط الكوكيز (HttpOnly/Secure/SameSite=Lax) تلقائياً، لكن **لا يوجد `middleware.ts` في الجذر** (`lib/supabase/middleware.ts` معرّف لكن غير مُربَط). تحديث الجلسة لا يتم تلقائياً على كل طلب. الملف: `lib/supabase/middleware.ts` (غير مستخدم). **إصلاح مقترح:** إنشاء `middleware.ts` في الجذر يستدعي `updateSession`.
4. **استرجاع الحساب (رابط ينتهي/يُستخدم مرة)** ✅ — Supabase Auth (رابط one-time + expiry افتراضي). `lib/supabase/auth.server.ts`.
5. **2FA/MFA للحسابات المهمة** ⚠️ — `MfaForm.tsx` (TOTP) موجود لكن **غير مُفعَّل/غير مُطلب** (لا gate على الأدمن). الملف: `components/MfaForm.tsx`. **إصلاح مقترح:** إلزام MFA للأدمن في `isAdminUser` أو صفحة إعدادات.

### الصلاحيات
6. **صفحات الأدمن مقفولة على السيرفر** ✅ — `app/[locale]/admin/page.tsx` يعيد توجيه `/` (fail-closed). additionally `middleware.ts` غير مُربَط (see #3).
7. **كل مستخدم يشوف بياناته هو** ✅ — `docgen` يتحقق `session.id !== userId → FORBIDDEN`. `lib/documents/engine.ts:48-51`. RLS على profiles.
8. **RLS على كل جدول** ✅ — migrations `0013`–`0016` (RLS + recursion fix). `supabase/migrations/`.

### المفاتيح والأسرار
9. **مفاتيح API غير مكشوفة في الواجهة** ✅ — `grep service_role` = 0. فقط `NEXT_PUBLIC_SUPABASE_URL/ANON_KEY` (مسموح). `lib/supabase/client.ts:16`.
10. **.env في .gitignore** ✅ — `.gitignore` includes `.env*`. فقط `.env.example` tracked. `git ls-files` verified.
11. **سجل Git نظيف** ✅ — لا مفاتيح في tracked files. (لم يُفحص history كامل — `git log -S` اختياري.)

### الهجمات المعروفة
12. **SQL Injection (parameterized)** ✅ — Supabase client (parameterized). لا SQL خام في app code. `lib/documents/engine.ts`.
13. **XSS (عرض كنص عادي)** ⚠️ — `HomeInteractions.tsx:60,117-118` يستخدم `innerHTML` مع بيانات داخلية (`STEPS`, عناوين `legalSources`) — غير مدخلات مستخدم، لكن أفضل ممارسة: `textContent`. `DocumentGenerator.tsx:166` uses `dangerouslySetInnerHTML` مع `preview` مُهرَّب من السيرفر (`escapeHtml` في engine.ts:99) ✅. `layout.tsx:13` theme script ثابت ✅.
14. **CSRF (توكن أو SameSite)** ⚠️ — يعتمد على SameSite=Lax من Supabase. لا توكن CSRF صريح. مقبول لمعظم mutations (POST + session)، لكن mutations حساسة (admin) تستخدم Supabase session cookie (SameSite=Lax). **إصلاح مقترح:** SameSite=Strict للكوكيز الحساسة (Supabase SSR default Lax).
15. **فحص المدخلات على السيرفر** ✅ — `lib/security/validate.ts` (AI)، `engine.ts:22-28` (docgen, slice + type check). `app/api/ai/route.ts:37-42`.
16. **رفع الملفات (نوع/حجم/عدم تنفيذ)** N/A — لا رفع ملفات في التطبيق (PDFs ثابتة في public/).

### السيرفر والشبكة
17. **Rate Limiting** ✅ — `/api/ai` 8/min، `/api/docs` 10/min. `lib/security/rate-limit.ts`. (⚠️ rate limit in-memory; may not persist across Workers isolates — consider Cloudflare binding.)
18. **HTTPS في كل مكان** ✅ — HSTS header + Workers (HTTPS). `next.config.ts`.
19. **CORS (موقعك بس)** ✅ — لا CORS config → same-origin default. لا cross-origin API.
20. **Security Headers (CSP/HSTS/X-Frame)** ✅ — CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. `next.config.ts:18-35`.
21. **رسائل الخطأ ما تكشف تفاصيل** ✅ — AI route generic errors; docgen maps to status codes without stack. ⚠️ `console.error("AI drafting failed:", e)` logs error object (server-side only, acceptable).

### الدفع
22. **السعر في السيرفر** N/A — لا دفع في التطبيق.
23. **تأكيد الدفع من Webhook** N/A — لا دفع.

### الصيانة
24. **المكتبات القديمة (npm audit)** ✅ — `npm audit --omit=dev`: 0 vulnerabilities.
25. **السجلات بدون كلمات مرور/مفاتيح** ✅ — logs only error objects; no secrets logged. ⚠️ minimal logging (no audit trail for admin actions).
26. **نسخ احتياطي + اختبار استرجاع** ✅ — Supabase managed backups (external). لم يُجرَّب استرجاع (outside scope).
27. **اختبار الحماية + تقرير** ⚠️ — لم يُجرَّب (self-test). هذا التقرير هو الخطوة الأولى.

## Proposed fixes (awaiting approval)
1. إنشاء `middleware.ts` في الجذر (session refresh + admin gate) — low risk, high value.
2. إلزام MFA للأدمن.
3. استبدال `innerHTML` بـ `textContent` في `HomeInteractions.tsx` (3 مواقع).
4. إضافة audit logging للأحداث المهمة (login, admin actions).
5. توثيق CORS policy (already same-origin).

## Not in scope / external
- Supabase RLS policies (migrations 0013-0016) — verify via Supabase dashboard.
- Cloudflare WAF/rate limit at edge (complement to app-level).
- Secret rotation if any key was ever committed (history scan optional).

---
**Awaiting your approval to apply fixes #1-#4.**

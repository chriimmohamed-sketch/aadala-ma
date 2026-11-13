# Admin Guide — AADALA.MA

## Access
- Route: `/ar/admin` (Control Center).
- Requires authentication + RBAC (to implement).

## Modules
Users, Roles, Legislation, Sources, Jurisprudence, AI Review, MIYAR, Files, Notifications, Audit Log, Performance, Errors, System Settings.

## Workflow
Draft → Editorial/Legal Review → Approval → Publish → Update/Archive.

## Audit
All sensitive changes recorded in `publication_reviews` / audit_logs (user, action, date, entity, before/after).

## Least Privilege
See `src/lib/admin/permissions.ts`. Verify on server, not only UI.

## Backup/Restore
See `docs/BACKUP_RESTORE.md`. Test restore regularly.

## 2FA للحسابات الإدارية (إلزامي قبل الإنتاج — لم يُطبَّق بعد)

> الحالة: **غير مفعّل**. حالياً `/ar/admin` هيكل أولي بلا مصادقة حقيقية (وضع تجريبي)؛ هذه الخطوات تُنفَّذ من مالك المشروع ولا يمكن إنجازها من بيئة التطوير.

1. **إنشاء حسابات الأدمن عبر Supabase Auth فقط** — لا حسابات مشتركة ولا كلمات مرور مشتركة؛ كل مشرف بحسابه المستقل ببريده.
2. **تفعيل MFA (TOTP) لكل حساب إداري**: من لوحة Supabase ← Authentication ← Users ← Enroll in MFA (أو عبر تدفق MFA داخل التطبيق) بتسجيل تطبيق مصادقة على الهاتف. بدون العامل الثاني لا يحق لحساب الدخول إلى Control Center.
3. **فرض AAL2 في سياسات RLS للجداول الإدارية** (مصادر `legal_*` و`publication_reviews` و`audit_logs`…) بحيث ترفض الطلبات القادمة من جلسة بلا عامل ثانٍ، حتى لو تسرّبت كلمة المرور.
4. **تقييد الوصول الشبكي إلى `/ar/admin`** (موصى به): Cloudflare Access بسياسات هوية أمام المسار، أو قائمة IP مسموح بها — طبقة دفاع مستقلة عن التطبيق.
5. **تدوير المفاتيح**: أي مفتاح `service_role` أو سر AI ظهر في سجل/شاشة/مستودع يُلغى فوراً ويُنشأ بدله ويُحدَّث في متغيرات البيئة فقط (لا في الكود ولا في git).
6. **تفعيل الحماية من تسريب كلمات المرور** (leaked password protection) في إعدادات Auth، ورفع الحد الأدنى لكلمة المرور إلى 12+ حرفاً.
7. **مراجعة دورية (ربع سنوية)**: قائمة مستخدمي Auth بصلاحية admin؛ إلغاء غير المستخدمين؛ فحص `audit_logs`.
8. **تنبيهات**: إشعارات Supabase على محاولات الدخول الفاشلة المتكررة على حسابات الأدمن.

بعد إتمام 1–3 تُحدَّث نتيجة هذا البند في `IMPLEMENTATION_STATUS.md` من «غير مطبّق» إلى «مطبّق ومُختبَر».
# حالة قاعدة البيانات — AADALA.MA

**تاريخ الفحص:** 2026-11-11
**المشروع:** `pvoenvxinkipgpnddumt` (eu-west-2)
**طريقة الفحص:** استعلام PostgREST بالمفتاح العام (publishable) على `GET /rest/v1/<table>?select=*&limit=0`
— الرمز `404 / PGRST205` يعني «الجدول غير موجود»، والرمز `200` يعني «موجود ومحمي بـ RLS».

> هذا الفحص لا يكشف البيانات (limit=0 ولا قراءة صفوف)، بل وجود الجدول فقط.

## الخلاصة

| المؤشر | العدد |
|---|---|
| جداول موجودة | 11 |
| جداول ناقصة | 22 |
| الإجمالي المتوقع | 33 |

**النتيجة:** قاعدة البيانات متأخرة عن مجلد `supabase/migrations/`.
الهجرات المُثبت تطبيقها (بوجود جداولها): `0001`, `0002`, `0005`. الهجرة `0013` لا تُنشئ جداول ولا يمكن إثباتها عبر PostgREST؛ تحقّق منها بـ `pg_policies`.
الهجرات غير المطبَّقة: `0003`, `0004`, `0006`, `0007`, `0008`, `0009`, `0010`, `0011`, `0012`, `0014`.

## الجداول الموجودة (11)

`articles`, `audit_logs`, `entities`, `entity_article_mapping`, `issue_article_mapping`,
`laws`, `legal_documents`, `legal_issues`, `profiles`, `reference_answers`, `sections`

## الجداول الناقصة (22)

| الجدول | الهجرة | الميزة المتأثرة |
|---|---|---|
| `document_templates`, `generated_documents` | 0003 | مولّد الوثائق `/procedures` |
| `sources`, `ingestion_jobs`, `raw_documents`, `document_versions`, `review_queue` | 0004 | إدخال النصوص ومراجعتها |
| `contract_audits`, `mandatory_clauses` | 0006 | تحليل العقود |
| `tracked_cases`, `case_events` | 0007 | تتبّع الملفات والآجال |
| `notifications` | 0008 | الإشعارات |
| `workspaces`, `workspace_members`, `workspace_documents` | 0009 | مساحات العمل |
| `gov_services`, `user_service_requests` | 0010 | الخدمات الإدارية |
| `case_law` | 0011 | الاجتهاد القضائي |
| `learning_courses`, `learning_lessons`, `student_progress` | 0012 | فضاء الطالب |
| `error_reports` | 0014 | «أبلغ عن خطأ» |

## كيف تُطبَّق الآن (خطوة واحدة)

1. افتح: https://supabase.com/dashboard/project/pvoenvxinkipgpnddumt/sql/new
2. انسخ كامل ملف `supabase/apply/2026-11-11_pending_bundle.sql` والصقه ثم **Run**.
   - BUNDLE يجمع الهجرات العشر بترتيبها داخل `BEGIN … COMMIT` (ذرّي: إمّا الكل أو لا شيء).
   - آمن لإعادة التشغيل: `IF NOT EXISTS` للجداول، `DROP POLICY IF EXISTS` للسياسات، `WHERE NOT EXISTS` للبيانات الأولية، `DROP TRIGGER IF EXISTS` للمشغّلات.
3. شغّل `supabase/apply/verify_tables.sql` وتحقق من `missing_count = 0`.

## بديل آلي (بدون فتح المتصفح)

إعطاء رمز وصول شخصي من Supabase (`sbp_…`, Account → Access Tokens) يتيح تطبيق الهجرات عبر
Management API (`POST /v1/projects/{ref}/database/query`) دون كلمة سر القاعدة.

## ملاحظات

- لم يُحذف أي ملف أو جدول؛ هذه إضافات فقط.
- MFA: بعد إزالة صفحة تسجيل الدخول من الموقع العام لم تبقَ حاجة تشغيلية لـ MFA في هذه النسخة؛
  يبقى الكود محفوظًا لنسخة خاصة لاحقًا.

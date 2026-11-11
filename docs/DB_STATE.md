# حالة قاعدة البيانات — AADALA.MA

**آخر تحديث:** 2026-11-11 (بعد تطبيق الهجرات الناقصة)
**المشروع:** `pvoenvxinkipgpnddumt` (eu-west-2)
**طريقة الفحص:** استعلام PostgREST بالمفتاح العام (publishable) على `GET /rest/v1/<table>?select=*&limit=0`
— الرمز `404 / PGRST205` يعني «الجدول غير موجود»، والرمز `200` يعني «موجود ومحمي بـ RLS».
لا تُقرأ أي صفوف في هذا الفحص (`limit=0`).

## الخلاصة

| المؤشر | قبل | بعد |
|---|---|---|
| جداول موجودة من 33 | 11 | **33** |
| جداول ناقصة | 22 | **0** |
| جداول بأخطاء RLS (500) | 3 | **0** |
| صفوف أولية مشوّشة (mojibake) | 6 | **0** |

## ما طُبِّق فعليًا

| الهجرة | الحالة | الأثر |
|---|---|---|
| `0001`, `0002`, `0005` | مطبَّقة سابقًا | الجداول الأساسية + `profiles` + `legal_documents` |
| `0003`, `0004`, `0006`–`0012`, `0014` | **طُبِّقت 2026-11-11** | 22 جدولًا (وثائق، إدخال، عقود، ملفات، إشعارات، مساحات عمل، خدمات، اجتهاد، تعلّم، بلاغات) |
| `0013` | مطبَّقة سابقًا | سياسات RLS القديمة |
| `0015` | **جديدة 2026-11-11** | إصلاح `42P17 infinite recursion` في سياسات `workspace_*` |
| `0016` | **جديدة 2026-11-11** | إصلاح النصوص العربية المشوّشة في بيانات `document_templates` و`sources` الأولية |

## الأدلّة (استعلام تحقّق داخل SQL Editor)

```sql
select
  (select count(*) from public.sources where position('§' in name) > 0) as bad_sources,          -- 0
  (select count(*) from public.document_templates where position('§' in title) > 0) as bad_templates, -- 0
  (select count(*) from public.sources) as sources_total,            -- 4
  (select count(*) from public.document_templates) as templates_total, -- 2
  (select count(*) from pg_tables where schemaname='public') as tables_total, -- 40
  (select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
     where n.nspname='public' and p.proname like 'is_workspace%') as helper_fns; -- 2
```

وعيّنة حيّة عبر REST: `document_templates` تُرجع الآن `الوعد بالبيع العقاري` و`إنذار بالإخلاء`
مع `required_fields` عربية سليمة (`اسم البائع`, `اسم المشتري`, …).

## الملفات المساعدة (جديدة، لا تعدّل الهجرات الأصلية)

| الملف | الوظيفة |
|---|---|
| `supabase/apply/2026-11-11_pending_bundle.sql` | الهجرات العشر مجمّعة داخل `BEGIN … COMMIT` |
| `supabase/apply/build-bundle.ps1` | يعيد بناء الحزمة من `supabase/migrations/` بترميز UTF-8 صحيح |
| `supabase/apply/set-clipboard.ps1` | ينسخ ملف SQL إلى الحافظة بترميز UTF-8 (يتجنّب تشويه ANSI) |
| `supabase/apply/verify_tables.sql` | تحقّق من الجداول والسياسات |

## درسان مستفادان

1. **PowerShell 5.1 يقرأ UTF-8 بلا BOM كـ ANSI.** لذلك `Get-Content -Raw` شوّه العربية عند بناء الحزمة.
   الحل: `[System.IO.File]::ReadAllText($path, $utf8NoBom)` — وهو ما يفعله `build-bundle.ps1` الآن.
2. **سياسة RLS التي تستعلم من جدولها نفسه** تُنتج `42P17 infinite recursion`. الحل: دوال
   `SECURITY DEFINER` + `search_path` مثبَّت (كما في `0015`).

## ما تبقّى (يدوي، خارج نطاق قاعدة البيانات)

- لم تُشغَّل اختبارات end-to-end على نموذج «أبلغ عن خطأ» بمستخدم حقيقي.
- `MFA` غير مطلوب في النسخة العامة الحالية بعد إزالة تسجيل الدخول؛ يبقى الكود محفوظًا.
- النسخ الاحتياطي/الاستعادة لم يُختبرا من طرف إلى طرف.

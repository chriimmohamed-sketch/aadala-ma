# قوالب الوثائق الذكية (FEATURE 2) — Document Templates

## ما هو
طبقة قاعدة بيانات: `document_templates` (قوالب قابلة للملء) + `generated_documents` (وثائق المستخدم) مع RLS.

## المايغريشن
`supabase/migrations/0003_document_templates.sql`

### تطبيق يدوي (مطلوب حتى يتوفر `database_write`)
في Supabase SQL Editor (المشروع `pvoenvxinkipgpnddumt`):
1. شغّل `0001_init.sql` ثم `0002_auth_rls.sql` (إن لم تُطبّق بعد)
2. شغّل `0003_document_templates.sql`

> لم يُطبَّق تلقائيًا — لا يزال ينتظر التطبيق اليدوي.

## جدولان
- `document_templates`: `title/category/legal_basis/required_fields/template_html/is_active` — قراءة عامة للقوالب النشطة.
- `generated_documents`: ملكية المستخدم فقط (`user_id = auth.uid()`).

## قوالب أولية (مسودات تجريبية)
- `الوعد بالبيع العقاري` — الحقول: البائع/المشتري/الوصف/الثمن/التسبيق/التاريخ
- `إنذار بالإخلاء` — الحقول: المكري/المكتري/العنوان/السبب/الأجل/التاريخ

**تنبيه صدق:** `legal_basis` في القالبين *مقترح* (`39.08 م.4` / `ف.692`) — لم يُتحقق من النص الرسمي هنا؛ تحقق قبل أي اعتماد. القوالب **مسودات قابلة للتحرير**، ليست وثائق رسمية.

## ما لم يُبنَ بعد (متعمَّد)
واجهة التوليد الديناميكية (نموذج من `required_fields` + معاينة `final_html` + طباعة PDF) — تُبنى فوق هذا الأساس في دورة قادمة.

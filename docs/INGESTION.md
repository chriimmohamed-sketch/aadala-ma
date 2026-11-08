# بنية الاستيراد والمراجعة — 0004

## المايغريشن
`supabase/migrations/0004_ingestion.sql`

جداول: `sources / ingestion_jobs / raw_documents / document_versions / review_queue`.

### تطبيق يدوي (مطلوب)
في Supabase SQL Editor (المشروع `pvoenvxinkipgpnddumt`):
1. `0001_init.sql` → `0002_auth_rls.sql` → `0003_document_templates.sql` (إن لم تُطبق)
2. `0004_ingestion.sql`

> لم يُطبق تلقائيًا — ينتظر التطبيق اليدوي.

## توصيفات ملصقة بالمخطط الأصلي
- `legal_documents` و`legal_source_type` لا وجود لهما في المشروع — لذا `legal_document_id` بلا FK هنا. عندما تُربط النتيجة بـ `articles` أضف الـ FK لاحقًا.
- السياسات الملصقة استعملت أدوارًا غير موجودة (`super_admin`/`reviewer`) — صُحّحت إلى (`admin`، `legal_reviewer`، `legal_editor`) الموجودة في `profiles`.
- `selectors` البذرية **عناصر نائبة غير مُتحقق منها** حول المواقع الحية — لا تعتمد عليها للسحب دون تحقق يدوي واحترام `robots.txt` وشروط الاستخدام.

## ما لم يُبنَ بعد (متعمَّد)
لا يوجد كود زاحف — الاستيراد الحالي يبقى `scripts/ingest-pdfs.mjs` (يدوي، مع احترام حقوق النشر) حتى يُخترع قارئ مصرح به + مراجعة بشرية.

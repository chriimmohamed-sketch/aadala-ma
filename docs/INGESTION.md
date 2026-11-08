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

## سجل المصادر (`lib/ingestion/sources.ts`)
`CRAWL_RULES` (تأخير 2.5s، تسلسلي، يحترم robots، `userAgent` يشير إلى صفحة على نطاقنا الفعلي) + `OFFICIAL_SOURCES` الأربعة بنفس الأسماء/العناوين، لكن **كل `verified: false`** و`selectors` عناوين نائبة لم تُتحقق من المواقع الحية. لا تستعملها للسحب الآلي دون تحقق يدوي وشروط الموقع.

## أدوات نقية فقط (`lib/ingestion/utils.ts`)
`hashContent/extractLinks/parseRobotsDisallow/isPathAllowed` — لا شبكة ولا DB. أُدرجت من الزاحف الملصق للمفيد منها؛ رُفض `safeFetch/crawl` (جلب تلقائي لمواقع رسمية بلا إذن مُثبت + `Buffer/pdf-parse` لا تُشغَّل في Workers) — يبقى الاستيراد اليدوي هو القناة الوحيدة.

## تجزئة المواد (`lib/ingestion/chunk.ts`)
`chunkByArticles` — تجزئة نقية على المادة/الفصل. **النشر/الاعتماد/التضمين** (`approveAndPublish`, `text-embedding-3-small → legal_documents`) لم يُدرج: لا جدول `legal_documents` ولا `pgvector` ولا مزوّد تضمين معتمد، والتصدير الآلي بعد المراجعة يحتاج تصميمًا أمنيًا ورتبًا (`legal_reviewer`) أولًا.

## مراجعة الإدارة (`/api/admin/ingest/*`)
- `GET /api/admin/ingest/queue` — صف الانتظار (يتطلب `legal_reviewer/legal_editor/admin`، جلسة RLS)
- `POST /api/admin/ingest/review` — `{rawId,status,reason?}` تغيير حالة فقط (`approved/rejected/needs_revision`) + سجل تدقيق. **لا نشر لـ `legal_documents`** ولا زاحف ولا `SERVICE_ROLE_KEY` (كان في الملصق).

## cron (`/api/cron/ingest`)
جرعة كرون مجدولة مرفوضة بالسياسة: `GET` يتحقق من `CRON_SECRET` إن وُجد ثم يرجع `501 CRON_CRAWL_DISABLED` دائمًا. لا زاحف، لا `SERVICE_ROLE_KEY`، لا `vercel.json` (النشر على Workers لا Vercel). الاستيراد يبقى يدويًا عبر `scripts/ingest-pdfs.mjs`.

## خريطة الضمانات (ادعاء ملصق ↔ كود فعلي)
| الادعاء | الحالة | الدليل |
|---|---|---|
| `robots.txt` يُقرأ/يُخزَّن/يُحترم قبل كل طلب | **إعداد فقط** | `CRAWL_RULES.respectRobotsTxt=true` + `utils.parseRobotsDisallow/isPathAllowed`؛ لا يوجد جلب/تخزين حي (`sources.robots_txt` عمود فقط) |
| معدل 2.5s وأبطأ حسب Crawl-delay | **قيمة مضبوطة** | `CRAWL_RULES.minDelayMs=2500`؛ لا يوجد throttle فعلي (لا طلبات) |
| `User-Agent` صريح + تواصل | **نعم** | `sources.ts` — يشير إلى صفحة `privacy` على نطاقنا، لا بريد مختلَق |
| `content_hash` يمنع إعادة التخزين | **مخطط + يدوي حي** | `raw_documents UNIQUE(url,content_hash)` + `hashContent` + `ingest-pdfs` يمنع التكرار ببصمة |
| مراجعة بشرية — لا نشر تلقائي | **نعم** | `POST /review` يبدّل الحالة فقط؛ لا كتابة في `legal_documents` |
| تتبعية `source_url/name/reviewed_by` | **مخطط فقط** | أعمدة موجودة في `0004`؛ لا إدخال حي بعد |
| `document_versions` تاريخ كامل | **مخطط فقط** | جدول موجود؛ لا كود يكتب فيه |
| `status='paused'` يوقف المصدر فورًا | **مخطط فقط** | Enum يضم `paused`؛ لا كود يفحصه (لا زاحف) |

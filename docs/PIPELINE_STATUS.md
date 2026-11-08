# حالة خط الاستيراد (PIPELINE STATUS) — 1→10

| # | مرحلة مقترحة | الحالة | الواقع |
|---|---|---|---|
| 1 | CRON 02:00 يومياً | ❌ معطّل | `/api/cron/ingest` يرجع `501 CRON_CRAWL_DISABLED`؛ لا `vercel.json` (Workers لا Vercel) |
| 2 | robots + throttle | ⚠️ أدوات فقط | `lib/ingestion/utils` (نقي) + `CRAWL_RULES`؛ لا جلب |
| 3 | اكتشاف/سحب صفحات/PDF | ❌ لا | `selectors` كلها `verified:false`؛ الاستيراد يدوي فقط |
| 4 | `raw_documents` + hash | ⚠️ مخطط فقط | جدول `0004` + تجزئة `chunk` + تقليل التكرار عبر `content_hash(col)`؛ بلا إدراج حي |
| 5 | `review_queue` | ⚠️ مخطط فقط | جدول + سياسات؛ لا إدخال تلقائي |
| 6 | موافقة/رفض بشري | ⚠️ حالة فقط | `POST /api/admin/ingest/review` يبدّل الحالة + تدقيق؛ **لا نشر** |
| 7 | `DocumentProcessor` + embeddings | ❌ لا | `chunkByArticles` فقط؛ لا `legal_documents` ولا `pgvector` ولا مزوّد تضمين |
| 8 | `legal_documents` + versions | ❌ لا | الجدول غير موجود؛ قصة التعديل غير مبنية |
| 9 | `AadalaEngine` من `legal_documents` | ❌ لا | الاسترجاع الحالي TF-IDF من `legal-index.json` |
| 10 | إجابة مع مصدر رسمي | ⚠️ جزئي | AADALA AI يقدّم بطاقات ثقة + روابط للمكتبة (P0-2) — لكن من الفهرس لا من DB حي |

## لماذا لا يُفعَّل كما هو
- **شروط/أذونات:** لم تُسجَّل شروط `sgg.gov.ma`/`adala.justice.gov.ma`/`juriscassation.cspj.ma`/`cndp.ma` ولا سجل سياسات `robots.txt` لكل مضيف، و`selectors` مخمّنة (`verified:false`).
- **بيئة:** `Buffer/pdf-parse` لا تُشغَّل في Workers (النشر على Cloudflare)؛ يلزم عامل Node خارجي.
- **امتياز:** `SERVICE_ROLE_KEY` يتجاوز RLS؛ لا نستعمله (جلسة + أدوار حقيقية بدلًا منه).
- **تكلفة/إثبات:** التضمين (`text-embedding-3-small`) مزوّد جديد/تكلفة؛ قبل اعتماده يلزم `legal_documents` + `pgvector` + تقييم.

## مسار التفعيل الآمن (إن أردته)
1. توثيق شروط كل موقع + التقاط `robots.txt` (يدوي، موثَّق في `sources.notes`).
2. تحقق بشري من كل `selectors` في المتصفح وقلب `verified:true` واحدًا واحدًا.
3. عامل Node (خارج Workers) يستعمل `utils` فقط + إدراج `raw_documents/review_status=pending`.
4. مايغريشن `legal_documents` + `pgvector` + مراجع بشري (`legal_reviewer`) للنشر.
5. هايبرد (TF-IDF + متجه) بمقياس تقييم قبل التحويل من الفهرس.

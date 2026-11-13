# قاعدة بيانات AADALA.MA (Supabase)

المشروع: `pvoenvxinkipgpnddumt` — `https://pvoenvxinkipgpnddumt.supabase.co`

## 1. الوضع الحالي

- الواجهة تقرأ من قاعدة البيانات عبر **مفتاح publishable** فقط (لا يوجد أي مفتاح خدمة في المتصفح).
- الجداول الأساسية جاهزة في المخطط: `legal_documents`, `legal_document_versions`, `legal_articles`, `legal_sources`.
- **RLS مفعّل** على هذه الجداول، لكنه لا يملك سياسات بعد، لذلك القراءة العامة تُرجع صفراً حتى تُطبَّق المهاجرة.
- ملفات المهاجرة جاهزة في `supabase/migrations/`، وملف التطبيق بضغطة واحدة: **`supabase/apply_all.sql`**.

## 2. تطبيق المهاجرة (مطلوب مرة واحدة)

اتصال الأداة الحالي بقاعدة البيانات **للقراءة فقط**، لذلك يجب تطبيق SQL من لوحة تحكم Supabase:

1. افتح: `https://supabase.com/dashboard/project/pvoenvxinkipgpnddumt/sql/new`
2. انسخ كامل محتوى `supabase/apply_all.sql` والصقه.
3. اضغط **Run**.
4. تحقق من النتيجة بالاستعلامات في القسم 5.

> الملف آمن لإعادة التشغيل: السياسات تُحذف وتُعاد، والبيانات تُحدَّث عبر `ON CONFLICT` دون تكرار.

## 3. نموذج الحالات (Status) — شفافية

| الحالة | المعنى | الظهور العام |
|---|---|---|
| `draft` | مسودة داخلية | لا |
| `review` | قيد المراجعة | لا |
| `reference` | **بيانات وصفية** لوثيقة لم تُدقَّق بايت-ببايت مقابل الجريدة الرسمية | نعم (metadata فقط) |
| `published` | نص مدقق بشرياً | نعم (مع نصوص المواد) |
| `archived` | محتفظ به خارج القوائم | لا |

- نصوص المواد (`legal_articles`) **لا تُعرض للعامة إلا** إذا كانت الوثيقة الأم `published`.
- كل الوثائق المرفوعة حالياً `reference` و`last_verified_at = NULL` — وهو تمثيل صادق لوضعها.

## 4. الواجهة

| الملف | الدور |
|---|---|
| `assets/js/sources-db.js` | فهرس محلي مرفق (fallback فوري) |
| `assets/js/supabase-db.js` | عميل قراءة Supabase + دمج تلقائي مع الفهرس المحلي |
| `database.html` | جدول/بحث/تفاصيل + حالة الاتصال والإحصاءات |
| `encyclopedia.html` | يعرض وثائق كل مجال من القاعدة بعد المزامنة |

سلوك التحميل: تُعرض البيانات المحلية فوراً، ثم تُستبدل/تُحدَّث بسجلات Supabase عند نجاح الطلب. عند الفشل تظهر رسالة سبب واضحة ويبقى الفهرس المحلي.

## 5. استعلامات تحقق

```sql
-- السياسات
select tablename, policyname, cmd from pg_policies
where schemaname = 'public'
  and tablename in ('legal_documents','legal_document_versions','legal_articles','legal_sources')
order by 1,2;

-- البيانات
select slug, official_title, status, category, page_count, last_verified_at
from public.legal_documents order by official_title;

select d.slug, count(v.*) as versions
from public.legal_documents d
left join public.legal_document_versions v on v.document_id = d.id
group by d.slug order by 1;
```

اختبار القراءة العامة (publishable key):

```
GET https://pvoenvxinkipgpnddumt.supabase.co/rest/v1/legal_documents?select=slug,official_title,status
apikey: sb_publishable_...
```

يجب أن يرجع 6 سجلات بعد التطبيق.

## 6. الخطوات التالية (غير منفذة)

- استخراج نص المواد وتقسيمها (`legal_articles`) بعد تدقيق بشري.
- نشر الوثائق المدققة بحالة `published` فقط.
- نقل المصادقة إلى Supabase Auth وربط الأدوار بجدول `profiles`.
- تفعيل pgvector/RAG للبحث الدلالي.

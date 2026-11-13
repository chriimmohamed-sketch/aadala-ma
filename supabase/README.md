# قاعدة بيانات AADALA.MA (Supabase)

المشروع: `pvoenvxinkipgpnddumt` — `https://pvoenvxinkipgpnddumt.supabase.co`

## 1. الوضع الحالي

- الواجهة تقرأ من قاعدة البيانات عبر **مفتاح publishable** فقط (لا يوجد أي مفتاح خدمة في المتصفح).
- الجداول الأساسية جاهزة في المخطط: `legal_documents`, `legal_document_versions`, `legal_articles`, `legal_sources`.
- **تم تطبيق المهاجرة في 2026-11-13** من لوحة Supabase: سياسات RLS للقراءة العامة مفعّلة، والبيانات المرجعية مزروعة (6 وثائق، 9 نسخ ملفات، 6 مصادر).
- الملفات محفوظة في `supabase/migrations/`، وملف التطبيق بضغطة واحدة: `supabase/apply_all.sql` (لإعادة التطبيق أو على مشروع جديد).

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

## 3.5 المواد المستخرجة آلياً (استخراج 2026-11-13)

تم استخراج المواد آلياً من الملفات المرفوعة وتجهيز ملفات SQL جاهزة للتطبيق:

- المهاجرة: `supabase/migrations/20261113000300_legal_articles_extracted.sql`
- البذور: `supabase/seed/articles_<slug>.sql` (6 ملفات)
- **ملف التطبيق بضغطة واحدة: `supabase/apply_articles.sql`**

### كيف تطبّقها (مطلوب مرة واحدة)

1. افتح: `https://supabase.com/dashboard/project/pvoenvxinkipgpnddumt/sql/new`
2. انسخ **كامل** محتوى `supabase/apply_articles.sql` والصقه.
3. اضغط **Run** وانتظر انتهاء التنفيذ (قد يستغرق أقل من دقيقة).
4. تحقق بالاستعلامات أدناه.

> آمن لإعادة التشغيل: المهاجرة تحذف السياسة وتضيف الأعمدة بـ `if not exists`، والبذور تحذف المواد ذات `status = 'extracted'` قبل إعادة إدراجها. لا تلمس أي مادة `verified`.

ما تضيفه المهاجرة: أعمدة `status/extraction_method/confidence/page_from/page_to/section/language/updated_at`، فهرسان، وسياسة قراءة عامة للمواد ذات `extracted` أو `verified` التابعة لوثائق `reference` أو `published`.

عدد المواد الجاهزة للإدراج: **2970** (loi-onc-ar 1310، 39.08 330، code-droits-reels 333، code-penal-maroc 722، constitution 174، dahir-immatriculation-fonciere 101).

تحقق بعد التطبيق:

```sql
select d.slug, a.status, count(*)
from public.legal_articles a
join public.legal_documents d on d.id = a.document_id
group by 1,2 order by 1,2;

select slug, count(*) as n
from public.legal_articles a
join public.legal_documents d on d.id = a.document_id
group by slug order by slug;
```

> النصوص المستخرجة آلةً وغير مدققة؛ لا تتحول إلى `verified` إلا بمراجعة بشرية ضد الجريدة الرسمية. العرض العام على الموقع يتماشى مع ذلك دائماً.

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

## 6. الخطوات التالية

- تطبيق `supabase/apply_articles.sql` من لوحة Supabase (جاهز — يحتاج صلاحيات écriture من حسابك).
- تدقيق بشري للمواد المستخرجة (تحويل `extracted` → `verified`) ونشر الوثائق المدققة بحالة `published` فقط.
- نقل المصادقة إلى Supabase Auth وربط الأدوار بجدول `profiles`.
- تفعيل pgvector/RAG للبحث الدلالي.

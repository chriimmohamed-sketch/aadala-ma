-- AADALA.MA - ONE-PASTE SETUP (RLS + public reference seed)
-- Paste this whole file into Supabase Dashboard > SQL Editor and run once.
-- Safe to re-run: policies are dropped/recreated, seeds use ON CONFLICT.

-- AADALA.MA — Legal core: public-read RLS + reference metadata columns
-- Date: 2026-11-13
--
-- Status vocabulary used by the platform (documented, not enforced by a check
-- constraint so that future editorial states can be added without a migration):
--   draft     -> internal only, never public
--   review    -> internal review, never public
--   reference -> public *metadata* index for a source document that has NOT been
--                byte-for-byte verified against the official publication
--   published -> verified text, publicly readable
--   archived  -> retained but not shown in public listings
--
-- Public readers (anon / authenticated) may read:
--   * legal_documents with status in ('published','reference')
--   * legal_document_versions belonging to those documents
--   * legal_articles belonging to 'published' documents only (article text is
--     never exposed for unverified 'reference' documents)
--   * legal_sources (public register of source files)
-- All writes stay admin-only through public.is_admin(auth.uid()).

alter table public.legal_documents
  add column if not exists category text,
  add column if not exists language text default 'ar',
  add column if not exists page_count integer,
  add column if not exists summary text,
  add column if not exists metadata jsonb default '{}'::jsonb;

create unique index if not exists legal_documents_slug_uidx
  on public.legal_documents (slug);

create unique index if not exists legal_document_versions_doc_label_uidx
  on public.legal_document_versions (document_id, version_label);

-- ---------------------------------------------------------------------------
-- legal_documents
-- ---------------------------------------------------------------------------
drop policy if exists legal_documents_public_read on public.legal_documents;
create policy legal_documents_public_read
  on public.legal_documents
  for select
  to anon, authenticated
  using (status in ('published', 'reference'));

drop policy if exists legal_documents_admin_write on public.legal_documents;
create policy legal_documents_admin_write
  on public.legal_documents
  for all
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- legal_document_versions
-- ---------------------------------------------------------------------------
drop policy if exists legal_document_versions_public_read on public.legal_document_versions;
create policy legal_document_versions_public_read
  on public.legal_document_versions
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.legal_documents d
      where d.id = legal_document_versions.document_id
        and d.status in ('published', 'reference')
    )
  );

drop policy if exists legal_document_versions_admin_write on public.legal_document_versions;
create policy legal_document_versions_admin_write
  on public.legal_document_versions
  for all
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- legal_articles (text is only public for verified/published documents)
-- ---------------------------------------------------------------------------
drop policy if exists legal_articles_public_read on public.legal_articles;
create policy legal_articles_public_read
  on public.legal_articles
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.legal_documents d
      where d.id = legal_articles.document_id
        and d.status = 'published'
    )
  );

drop policy if exists legal_articles_admin_write on public.legal_articles;
create policy legal_articles_admin_write
  on public.legal_articles
  for all
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- legal_sources (public register of source files)
-- ---------------------------------------------------------------------------
drop policy if exists legal_sources_public_read on public.legal_sources;
create policy legal_sources_public_read
  on public.legal_sources
  for select
  to anon, authenticated
  using (true);

drop policy if exists legal_sources_admin_write on public.legal_sources;
create policy legal_sources_admin_write
  on public.legal_sources
  for all
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Helpful covering indexes for public listings
create index if not exists legal_documents_status_idx on public.legal_documents (status);
create index if not exists legal_documents_category_idx on public.legal_documents (category);
create index if not exists legal_articles_document_idx on public.legal_articles (document_id);


-- AADALA.MA — Seed public reference metadata for the 9 uploaded PDF sources
-- Date: 2026-11-13
--
-- IMPORTANT PROVENANCE NOTE
-- These rows describe PDF copies uploaded by the project owner. They are NOT
-- byte-for-byte verified against the official Bulletin Officiel (sgg.gov.ma).
-- Therefore all documents are seeded with status = 'reference' (public metadata,
-- no article text exposed) and last_verified_at = NULL. Promote a document to
-- 'published' only after a documented review by a legal reviewer.

insert into public.legal_sources (slug, title, type, description, file_path)
values
  ('constitution-marocaine-2011-ar', 'دستور المملكة المغربية 2011', 'constitution',
   'نسخة PDF مرفوعة من المستخدم — تحقق مطلوب مقابل الجريدة الرسمية عدد 5964 مكرر.',
   'data/legal-sources/constitution-marocaine-2011-ar.pdf'),
  ('code-penal-maroc', 'مجموعة القانون الجنائي', 'code',
   'نسخة PDF مرفوعة (وزارة العدل — مديرية التشريع) — تحقق من آخر التعديلات.',
   'data/legal-sources/code-penal-maroc.pdf'),
  ('39-08-code-droits-reels', 'القانون 39.08 — مدونة الحقوق العينية', 'loi',
   'نسخة PDF مرفوعة (صيغة موطدة) — 4 نسخ ملفات؛ يلزم التحقق من التطابق مع النص المنشور.',
   'data/legal-sources/39-08-code-droits-reels.pdf'),
  ('dahir-immatriculation-fonciere', 'ظهير التحفيظ العقاري', 'dahir',
   'نسخة PDF مرفوعة (9 رمضان 1331 / 12 أغسطس 1913) — تحقق من التعديلات اللاحقة.',
   'data/legal-sources/dahir-immatriculation-fonciere.pdf'),
  ('loi-onc-ar', 'قانون الالتزامات والعقود (DOC)', 'loi',
   'الملف المرفوع 4_ONC_Law_ar-MA.pdf هو قانون الالتزامات والعقود (صيغة محينة 2019).',
   'data/legal-sources/loi-onc-ar.pdf'),
  ('bo-7437-ar', 'الجريدة الرسمية — العدد 7437', 'bulletin_officiel',
   'نسخة PDF لعدد من الجريدة الرسمية — يلزم تحديد تاريخ النشر واستخراج النصوص.',
   'data/legal-sources/bo-7437-ar.pdf')
on conflict (slug) do update
  set title = excluded.title,
      type = excluded.type,
      description = excluded.description,
      file_path = excluded.file_path;

insert into public.legal_documents
  (slug, official_title, doc_type, number, issue_date, publication_date,
   publication_source, effective_date, status, source_url, usage_rights,
   last_verified_at, verified_by, category, language, page_count, summary, metadata)
values
  ('constitution-marocaine-2011-ar',
   'دستور المملكة المغربية لسنة 2011',
   'constitution', '1-11-91', '2011-07-29', null,
   'الجريدة الرسمية عدد 5964 مكرر (تحقق)', null, 'reference',
   'https://www.sgg.gov.ma',
   'نسخة PDF مرفوعة للاستعمال المرجعي؛ حقوق النشر للجهة المصدرة. النص الرسمي هو المنشور بالجريدة الرسمية.',
   null, null, 'constitution', 'ar', 82,
   'الدستور المغربي 2011 — مرجع دستوري. البيانات الوصفية أولية ولم تُدقق آلياً مقابل النص الرسمي.',
   '{"provenance":"uploaded_pdf","verification":"pending","primary_file":"data/legal-sources/constitution-marocaine-2011-ar.pdf"}'::jsonb),

  ('code-penal-maroc',
   'مجموعة القانون الجنائي',
   'code', null, '1962-11-26', null,
   'الجريدة الرسمية (تحقق)', null, 'reference',
   'https://www.sgg.gov.ma',
   'نسخة PDF مرفوعة للاستعمال المرجعي؛ تحقق من آخر التعديلات قبل الاعتماد.',
   null, null, 'penal', 'ar', 219,
   'مجموعة القانون الجنائي (نسخة وزارة العدل — مديرية التشريع). البيانات الوصفية أولية.',
   '{"provenance":"uploaded_pdf","verification":"pending","primary_file":"data/legal-sources/code-penal-maroc.pdf"}'::jsonb),

  ('39-08-code-droits-reels',
   'القانون رقم 39.08 المتعلق بمدونة الحقوق العينية',
   'loi', '39.08', '2011-11-22', null,
   'الجريدة الرسمية (تحقق)', null, 'reference',
   'https://www.sgg.gov.ma',
   'نسخة PDF مرفوعة (صيغة موطدة 2025) للاستعمال المرجعي؛ يلزم التحقق من التطابق.',
   null, null, 'droits_reels', 'ar', 63,
   'مدونة الحقوق العينية — 4 نسخ PDF مرفوعة (نسختان متطابقتان). البيانات الوصفية أولية.',
   '{"provenance":"uploaded_pdf","verification":"pending","duplicate_files":4,"primary_file":"data/legal-sources/39-08-code-droits-reels.pdf"}'::jsonb),

  ('dahir-immatriculation-fonciere',
   'الظهير الشريف المتعلق بالتحفيظ العقاري',
   'dahir', null, '1913-08-12', null,
   'الجريدة الرسمية (تحقق)', null, 'reference',
   'https://www.sgg.gov.ma',
   'نسخة PDF مرفوعة للاستعمال المرجعي؛ تحقق من صيغ التعديل.',
   null, null, 'droits_reels', 'ar', 45,
   'ظهير التحفيظ العقاري (9 رمضان 1331 — 12 أغسطس 1913) مع التعديلات. البيانات الوصفية أولية.',
   '{"provenance":"uploaded_pdf","verification":"pending","primary_file":"data/legal-sources/dahir-immatriculation-fonciere.pdf"}'::jsonb),

  ('loi-onc-ar',
   'قانون الالتزامات والعقود (صيغة محينة 2019)',
   'loi', null, '1913-08-12', null,
   'الجريدة الرسمية (تحقق)', null, 'reference',
   'https://www.sgg.gov.ma',
   'نسخة PDF مرفوعة للاستعمال المرجعي؛ تحقق من التعديلات اللاحقة.',
   null, null, 'civil', 'ar', 298,
   'قانون الالتزامات والعقود — صيغة محينة بتاريخ 26 أغسطس 2019. الملف الأصلي: 4_ONC_Law_ar-MA.pdf.',
   '{"provenance":"uploaded_pdf","verification":"pending","original_filename":"4_ONC_Law_ar-MA.pdf","primary_file":"data/legal-sources/loi-onc-ar.pdf"}'::jsonb),

  ('bo-7437-ar',
   'الجريدة الرسمية — العدد 7437',
   'bulletin_officiel', '7437', null, null,
   'المطبعة الرسمية — الرباط', null, 'reference',
   'https://www.sgg.gov.ma',
   'نسخة PDF مرفوعة لعدد من الجريدة الرسمية؛ حقوق النشر للمطبعة الرسمية.',
   null, null, 'gazette', 'ar', 81,
   'عدد من الجريدة الرسمية (7437) — يلزم تحديد تاريخ النشر واستخراج النصوص.',
   '{"provenance":"uploaded_pdf","verification":"pending","primary_file":"data/legal-sources/bo-7437-ar.pdf"}'::jsonb)
on conflict (slug) do update
  set official_title = excluded.official_title,
      doc_type = excluded.doc_type,
      number = excluded.number,
      issue_date = excluded.issue_date,
      publication_source = excluded.publication_source,
      status = excluded.status,
      source_url = excluded.source_url,
      usage_rights = excluded.usage_rights,
      category = excluded.category,
      language = excluded.language,
      page_count = excluded.page_count,
      summary = excluded.summary,
      metadata = excluded.metadata,
      updated_at = now();

-- One version row per uploaded file (4 files exist for the droits réels code).
insert into public.legal_document_versions
  (document_id, version_label, is_original, published_at, notes, source_file)
select d.id, v.version_label, v.is_original, null, v.notes, v.source_file
from (values
  ('constitution-marocaine-2011-ar', 'PDF مرفوع — النسخة الوحيدة', true,
   'نسخة مرفوعة؛ لم تُدقق مقابل الجريدة الرسمية.',
   'data/legal-sources/constitution-marocaine-2011-ar.pdf'),
  ('code-penal-maroc', 'PDF مرفوع — النسخة الوحيدة', true,
   'نسخة وزارة العدل (مديرية التشريع)؛ تحقق من آخر تعديل.',
   'data/legal-sources/code-penal-maroc.pdf'),
  ('39-08-code-droits-reels', 'PDF مرفوع — صيغة موطدة 2025', true,
   'نسخة موطدة؛ تحقق من التطابق.',
   'data/legal-sources/39-08-code-droits-reels.pdf'),
  ('39-08-code-droits-reels', 'PDF مرفوع — نسخة مطابقة (ملف 1)', false,
   'نسخة مكررة بنفس الحجم (809,275 بايت).',
   'data/legal-sources/39-08-code-droits-reels-1.pdf'),
  ('39-08-code-droits-reels', 'PDF مرفوع — صيغة محينة 2018', false,
   'نسخة محينة بتاريخ 12 مارس 2018 (61 صفحة).',
   'data/legal-sources/code-droits-reels.pdf'),
  ('39-08-code-droits-reels', 'PDF مرفوع — نسخة ممسوحة/بجودة مختلفة', false,
   'نسخة 61 صفحة بحجم 2.79MB؛ نص مستخرج بجودة أدنى.',
   'data/legal-sources/code-droits-reels-2.pdf'),
  ('dahir-immatriculation-fonciere', 'PDF مرفوع — النسخة الوحيدة', true,
   'نسخة مرفوعة؛ تحقق من التعديلات.',
   'data/legal-sources/dahir-immatriculation-fonciere.pdf'),
  ('loi-onc-ar', 'PDF مرفوع — صيغة محينة 2019', true,
   'الملف الأصلي 4_ONC_Law_ar-MA.pdf؛ تحقق من الهوية والمرجع.',
   'data/legal-sources/loi-onc-ar.pdf'),
  ('bo-7437-ar', 'PDF مرفوع — العدد 7437', true,
   'نسخة عدد الجريدة الرسمية؛ يلزم تحديد التاريخ.',
   'data/legal-sources/bo-7437-ar.pdf')
) as v(slug, version_label, is_original, notes, source_file)
join public.legal_documents d on d.slug = v.slug
on conflict (document_id, version_label) do update
  set notes = excluded.notes,
      source_file = excluded.source_file;

-- Point current_version_id at the primary version of each document.
update public.legal_documents d
   set current_version_id = v.id,
       updated_at = now()
  from public.legal_document_versions v
 where v.document_id = d.id
   and v.is_original = true
   and (d.current_version_id is distinct from v.id);

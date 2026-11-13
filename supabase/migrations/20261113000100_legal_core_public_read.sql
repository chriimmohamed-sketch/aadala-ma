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

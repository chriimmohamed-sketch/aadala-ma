-- 20261113000300_legal_articles_extracted.sql
-- Adds provenance/status metadata to extracted article text and exposes
-- machine-extracted articles for reference documents (clearly labelled in UI).

alter table if exists public.legal_articles
  add column if not exists status text not null default 'extracted',
  add column if not exists extraction_method text,
  add column if not exists confidence numeric(4,3),
  add column if not exists page_from integer,
  add column if not exists page_to integer,
  add column if not exists section text,
  add column if not exists language text not null default 'ar',
  add column if not exists updated_at timestamptz not null default now();

alter table if exists public.legal_articles
  drop constraint if exists legal_articles_status_check;
alter table if exists public.legal_articles
  add constraint legal_articles_status_check
  check (status in ('extracted', 'verified', 'archived'));

create index if not exists legal_articles_document_order_idx
  on public.legal_articles (document_id, order_index);
create index if not exists legal_articles_document_number_idx
  on public.legal_articles (document_id, article_number);

drop policy if exists legal_articles_public_read on public.legal_articles;
create policy legal_articles_public_read on public.legal_articles
for select using (
  status in ('extracted', 'verified')
  and exists (
    select 1 from public.legal_documents d
    where d.id = legal_articles.document_id
      and d.status in ('reference', 'published')
  )
);

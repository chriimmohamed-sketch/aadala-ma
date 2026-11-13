-- 20261114000100_legal_articles_vector.sql
-- Phase 1 (BAA): pgvector embeddings + HNSW index + Arabic FTS + similarity search
-- Adds machine-readable embedding column to legal_articles, backfills verified metadata,
-- and exposes match_legal_articles() for the RAG backend.

create extension if not exists vector;

alter table if exists public.legal_articles
  add column if not exists last_verified_at timestamptz,
  add column if not exists verified_by text;

alter table if exists public.legal_articles
  add column if not exists embedding vector(1024);

create index if not exists legal_articles_embedding_hnsw
  on public.legal_articles
  using hnsw (embedding vector(1024))
  with (m: 16, ef_search: 40);

create index if not exists legal_articles_content_tsv
  on public.legal_articles
  using gin (to_tsvector('arabic', coalesce(public.legal_articles.content, '')));

create or replace function public.match_legal_articles(
  query_embedding vector(1024),
  match_count integer default 5,
  filter_document_id uuid default null
)
returns table (
  id uuid,
  document_id uuid,
  article_number text,
  title text,
  content text,
  similarity float
)
language plpgsql
as $$
  select
    a.id,
    a.document_id,
    a.article_number,
    a.title,
    a.content,
    1 - (a.embedding <=> query_embedding) as similarity
  from public.legal_articles a
  where a.embedding is not null
    and (filter_document_id is null or a.document_id = filter_document_id)
  order by a.embedding <=> query_embedding
  limit least(greatest(coalesce(match_count, 5), 1), 20);
$$;

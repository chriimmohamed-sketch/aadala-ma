-- AADALA.MA — pgvector semantic layer for the legal corpus
-- 2026-11-16
--
-- Purpose: BM25 (lexical) retrieval cannot answer natural legal questions.
--   "كيف أشتري عقارًا بالمشاركة" does not lexically match "بيع بالمشاركة".
-- This migration adds a semantic layer over the verified 540-article corpus.
--
-- Apply from Supabase Dashboard → SQL Editor (the MCP connector is read-only).
--
-- Dimension note:
--   1024 assumes intfloat/multilingual-e5-large (or multilingual-e5-base).
--   If you choose a model with different dimensions, change ALL THREE places:
--     1. vector(1024) in the table
--     2. the HNSW index
--     3. the function signature
--   A mismatch causes: "expected 1024 dimensions, not 768".

-- ==========================================================================
-- 1. Extension
-- ==========================================================================
create extension if not exists vector with schema extensions;

-- ==========================================================================
-- 2. Chunk table
-- ==========================================================================
create table if not exists public.legal_chunks (
  id bigserial primary key,
  law text not null,                    -- '39.08' | '31.08' | ...
  law_name_ar text,                     -- 'مدونة الحقوق العينية'
  article_label text,                   -- '298' | 'الأولى'
  section text,                         -- 'الفصل الثاني' ...
  body text not null,
  embedding extensions.vector(1024),
  source_url text,                      -- the official URL it came from
  source_sha256 text,                   -- proof of which file this was
  page_from integer,
  page_to integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.legal_chunks is
  'Article-level chunks from verified official sources, with embeddings for semantic retrieval.';

-- Deduplicate on re-ingest: the same article from the same file is one row.
create unique index if not exists legal_chunks_identity
  on public.legal_chunks (law, article_label, coalesce(source_sha256, ''));

-- ==========================================================================
-- 3. HNSW index — fastest for approximate nearest-neighbour search
-- ==========================================================================
create index if not exists legal_chunks_embedding_idx
  on public.legal_chunks
  using hnsw (embedding extensions.vector_cosine_ops);

-- Text search fallback (for hybrid retrieval)
create index if not exists legal_chunks_body_fts
  on public.legal_chunks
  using gin (to_tsvector('simple', body));

-- ==========================================================================
-- 4. Semantic match function
-- ==========================================================================
create or replace function public.match_legal_chunks(
  query_embedding extensions.vector(1024),
  match_threshold float default 0.45,
  match_count int default 10,
  filter_law text default null
)
returns table (
  id bigint,
  law text,
  law_name_ar text,
  article_label text,
  section text,
  body text,
  source_url text,
  page_from integer,
  page_to integer,
  similarity float
)
language sql stable
as $$
  select
    c.id,
    c.law,
    c.law_name_ar,
    c.article_label,
    c.section,
    c.body,
    c.source_url,
    c.page_from,
    c.page_to,
    1 - (c.embedding <=> query_embedding) as similarity
  from public.legal_chunks c
  where 1 - (c.embedding <=> query_embedding) > match_threshold
    and (filter_law is null or c.law = filter_law)
  order by c.embedding <=> query_embedding
  limit greatest(1, least(match_count, 50));
$$;

comment on function public.match_legal_chunks is
  'Semantic search over verified legal articles. similarity is cosine similarity (0..1).';

-- ==========================================================================
-- 5. Hybrid search — semantic + lexical, ranked together
--    Use this for the /ar/search page: lexical alone misses paraphrases,
--    semantic alone can drift. Combining them is more reliable.
-- ==========================================================================
create or replace function public.hybrid_search_legal(
  query_embedding extensions.vector(1024),
  query_text text default null,
  match_threshold float default 0.45,
  match_count int default 10,
  filter_law text default null
)
returns table (
  id bigint,
  law text,
  law_name_ar text,
  article_label text,
  section text,
  body text,
  source_url text,
  similarity float,
  rank_score float
)
language sql stable
as $$
  with semantic as (
    select
      c.id, c.law, c.law_name_ar, c.article_label, c.section, c.body, c.source_url,
      1 - (c.embedding <=> query_embedding) as similarity
    from public.legal_chunks c
    where 1 - (c.embedding <=> query_embedding) > match_threshold
      and (filter_law is null or c.law = filter_law)
  ),
  lexical as (
    select
      c.id,
      ts_rank_cd(
        to_tsvector('simple', c.body),
        plainto_tsquery('simple', query_text)
      ) as rank
    from public.legal_chunks c
    where query_text is not null
      and length(trim(query_text)) > 0
      and to_tsvector('simple', c.body) @@ plainto_tsquery('simple', query_text)
      and (filter_law is null or c.law = filter_law)
  )
  select
    s.id, s.law, s.law_name_ar, s.article_label, s.section, s.body, s.source_url,
    s.similarity,
    (s.similarity * 0.7 + coalesce(l.rank, 0) * 0.3)::float as rank_score
  from semantic s
  left join lateral (
    select rank from lexical where lexical.id = s.id
  ) l on true
  order by rank_score desc
  limit greatest(1, least(match_count, 50));
$$;

-- ==========================================================================
-- 6. RLS — public read, admin write
-- ==========================================================================
alter table public.legal_chunks enable row level security;

drop policy if exists "Public read legal chunks" on public.legal_chunks;
create policy "Public read legal chunks" on public.legal_chunks
  for select
  using (true);

drop policy if exists "Admins manage legal chunks" on public.legal_chunks;
create policy "Admins manage legal chunks" on public.legal_chunks
  for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ==========================================================================
-- 7. updated_at trigger
-- ==========================================================================
create or replace function public.touch_legal_chunks_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists legal_chunks_touch_updated_at on public.legal_chunks;
create trigger legal_chunks_touch_updated_at
  before update on public.legal_chunks
  for each row execute function public.touch_legal_chunks_updated_at();

-- ==========================================================================
-- 8. Verification (run after applying, before ingesting)
-- ==========================================================================
-- a) extension present:
--      select extname from pg_extension where extname = 'vector';
-- b) table present:
--      \d public.legal_chunks
-- c) functions present:
--      select proname from pg_proc where proname in ('match_legal_chunks','hybrid_search_legal');
-- d) empty corpus is expected at this point:
--      select count(*) from public.legal_chunks;   -- 0
-- e) after ingestion (540 articles):
--      select law, count(*) from public.legal_chunks group by law;
--      -- expect 334 for 39.08 and 206 for 31.08

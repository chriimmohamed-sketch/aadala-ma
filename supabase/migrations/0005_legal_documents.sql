-- ============================================================
-- AADALA.MA — 0005 legal_documents (publish target, NO embeddings yet)
-- Run in Supabase SQL Editor (project pvoenvxinkipgpnddumt), after 0001-0004.
-- NOTE: legal_documents + pgvector + embeddings provider are NOT built yet.
--       This table is the minimal publish target for the future manual review flow.
--       `match_legal_documents` (pgvector / text-embedding-3-small) is DEFERRED:
--       retrieval today is TF-IDF (lib/ai-assistant/retrieval) — see docs/INGESTION.md.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.legal_documents (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_type TEXT CHECK (source_type IN ('code','decree','law','case_law','constitution','circular')),
  reference_number TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_legal_docs_source ON public.legal_documents(source_type);
CREATE INDEX IF NOT EXISTS idx_legal_docs_ref ON public.legal_documents(reference_number);

ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "legal_docs_public_read" ON public.legal_documents;
CREATE POLICY "legal_docs_public_read" ON public.legal_documents FOR SELECT USING (true);
-- Writes: server-side only via reviewer flow (future). No public insert policy.

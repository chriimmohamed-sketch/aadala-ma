-- ============================================================
-- AADALA.MA — 0011 Case Law (schema only, NO pgvector/embeddings yet)
-- Table: case_law
-- Run in Supabase SQL Editor (project pvoenvxinkipgpnddumt), after 0001-0010.
-- NOTE: `embedding vector(1536)` + ivfflat from the pasted draft are DEFERRED:
--       retrieval today is TF-IDF; no embeddings provider approved.
--       Only VERIFIED decisions may be published (status='published').
-- ============================================================

CREATE TABLE IF NOT EXISTS public.case_law (
  id BIGSERIAL PRIMARY KEY,
  case_number TEXT,
  court TEXT NOT NULL,
  decision_date DATE,
  legal_principle TEXT,
  full_text TEXT,
  related_articles TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','verified','published')),
  source_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_case_law_court ON public.case_law(court, decision_date DESC);

ALTER TABLE public.case_law ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "case_law_public_published" ON public.case_law;
CREATE POLICY "case_law_public_published" ON public.case_law FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "case_law_admin_manage" ON public.case_law;
CREATE POLICY "case_law_admin_manage" ON public.case_law FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id::text = auth.uid()::text AND role IN ('admin','legal_editor','legal_reviewer')));

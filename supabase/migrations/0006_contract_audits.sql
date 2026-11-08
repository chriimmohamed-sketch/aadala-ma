-- ============================================================
-- AADALA.MA — 0006 Contract Audits (schema only, no upload/AI)
-- Tables: contract_audits, mandatory_clauses
-- Run in Supabase SQL Editor (project pvoenvxinkipgpnddumt), after 0001-0005.
-- NOTE: No uploader, no extractor, no risk scoring yet — tables alone are inert.
--       Storing user contracts is sensitive (Law 09.08/CNDP): owner-only RLS, no public read.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.contract_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  original_filename TEXT,
  contract_type TEXT CHECK (contract_type IN ('lease','employment','nda','sale')),
  extracted_clauses JSONB DEFAULT '[]',
  risk_findings JSONB DEFAULT '[]',
  overall_risk TEXT CHECK (overall_risk IN ('low','medium','high','critical')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mandatory_clauses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_type TEXT NOT NULL,
  clause_category TEXT NOT NULL,
  legal_basis TEXT,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audits_user ON public.contract_audits(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mandatory_type ON public.mandatory_clauses(contract_type, clause_category);

ALTER TABLE public.contract_audits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "audits_owner_only" ON public.contract_audits;
CREATE POLICY "audits_owner_only" ON public.contract_audits FOR ALL
  USING (user_id::text = auth.uid()::text);

ALTER TABLE public.mandatory_clauses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "mandatory_public_read" ON public.mandatory_clauses;
CREATE POLICY "mandatory_public_read" ON public.mandatory_clauses FOR SELECT USING (true);
-- Writes: admin only via future reviewer flow (no public insert policy).

-- ============================================================
-- AADALA.MA — 0014 Error Reports (insert-only public, admin read)
-- Run in Supabase SQL Editor (project pvoenvxinkipgpnddumt), after 0001-0013.
-- Anonymous may INSERT; only admin/reviewer may SELECT/UPDATE.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.error_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  error_type TEXT NOT NULL,
  location TEXT,
  problem TEXT NOT NULL,
  suggestion TEXT,
  source_url TEXT,
  contact_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.error_reports ENABLE ROW LEVEL SECURITY;
-- Everyone (including anon) may file a report.
DROP POLICY IF EXISTS "reports_public_insert" ON public.error_reports;
CREATE POLICY "reports_public_insert" ON public.error_reports FOR INSERT
  WITH CHECK (true);
-- Reads/updates: staff only.
DROP POLICY IF EXISTS "reports_staff_rw" ON public.error_reports;
CREATE POLICY "reports_staff_rw" ON public.error_reports FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id::text = auth.uid()::text AND role IN ('admin','legal_reviewer','legal_editor')));

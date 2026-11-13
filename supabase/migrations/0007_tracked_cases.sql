-- ============================================================
-- AADALA.MA — 0007 Tracked Cases (schema only, no UI/API yet)
-- Tables: tracked_cases, case_events
-- Run in Supabase SQL Editor (project pvoenvxinkipgpnddumt), after 0001-0006.
-- Case files are sensitive personal data — owner-only RLS, no public read.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.tracked_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  case_number TEXT NOT NULL,
  court_name TEXT,
  case_type TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','closed','appealed')),
  last_hearing_date DATE,
  next_hearing_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, case_number)
);

CREATE TABLE IF NOT EXISTS public.case_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES public.tracked_cases(id) ON DELETE CASCADE,
  event_type TEXT CHECK (event_type IN ('hearing','judgment','postponement','filing')),
  event_date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cases_user ON public.tracked_cases(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cases_next ON public.tracked_cases(next_hearing_date) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_events_case ON public.case_events(case_id, event_date);

ALTER TABLE public.tracked_cases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "cases_owner_only" ON public.tracked_cases;
CREATE POLICY "cases_owner_only" ON public.tracked_cases FOR ALL
  USING (user_id::text = auth.uid()::text);

ALTER TABLE public.case_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "events_case_owner" ON public.case_events;
CREATE POLICY "events_case_owner" ON public.case_events FOR ALL
  USING (EXISTS (SELECT 1 FROM public.tracked_cases c WHERE c.id = case_id AND c.user_id::text = auth.uid()::text));

-- updated_at (reuse helper from 0002; recreate idempotently)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
DROP TRIGGER IF EXISTS trg_cases_updated_at ON public.tracked_cases;
CREATE TRIGGER trg_cases_updated_at BEFORE UPDATE ON public.tracked_cases
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

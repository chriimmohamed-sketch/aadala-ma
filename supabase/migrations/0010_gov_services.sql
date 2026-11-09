-- ============================================================
-- AADALA.MA — 0010 Gov Services directory (schema only, no verified seeds)
-- Tables: gov_services, user_service_requests
-- Run in Supabase SQL Editor (project pvoenvxinkipgpnddumt), after 0001-0009.
-- NOTE: No seed rows — gov URLs are NEVER hallucinated; add only official verified URLs (https, .gov.ma).
-- ============================================================

CREATE TABLE IF NOT EXISTS public.gov_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  provider TEXT,
  url TEXT CHECK (url IS NULL OR url ~ '^https://'),
  description TEXT,
  requires_auth BOOLEAN DEFAULT false,
  api_available BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.gov_services(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'initiated' CHECK (status IN ('initiated','submitted','completed')),
  reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gov_cat ON public.gov_services(category);
CREATE INDEX IF NOT EXISTS idx_req_user ON public.user_service_requests(user_id, created_at DESC);

ALTER TABLE public.gov_services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "gov_public_read" ON public.gov_services;
CREATE POLICY "gov_public_read" ON public.gov_services FOR SELECT USING (true);

ALTER TABLE public.user_service_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "req_owner_only" ON public.user_service_requests;
CREATE POLICY "req_owner_only" ON public.user_service_requests FOR ALL
  USING (user_id::text = auth.uid()::text);

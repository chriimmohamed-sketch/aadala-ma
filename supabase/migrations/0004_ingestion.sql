-- ============================================================
-- AADALA.MA — 0004 Ingestion & Review Infrastructure (safe subset)
-- Tables: sources, ingestion_jobs, raw_documents, document_versions, review_queue
-- Run in Supabase SQL Editor (project pvoenvxinkipgpnddumt)
-- Requires: 0001_init.sql + 0002_auth_rls.sql.
-- NOTE: legal_documents/legal_source_type do NOT exist in this project.
--       legal_document_id is kept as a plain BIGINT with NO FK (link to articles when mapped).
--       Roles use the real profile roles: admin, legal_editor, legal_reviewer, user.
--       Seed selectors are PLACEHOLDERS — not verified against live sites.
--       NO crawler code is included; manual PDF ingestion (scripts/ingest-pdfs.mjs) remains the only path.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
  CREATE TYPE public.source_status AS ENUM ('active','paused','blocked','deprecated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE public.job_status AS ENUM ('queued','running','success','failed','partial');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE public.review_status AS ENUM ('pending','approved','rejected','needs_revision');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  base_url TEXT NOT NULL,
  source_type TEXT NOT NULL,
  crawl_delay_ms INT DEFAULT 2000,
  max_pages_per_run INT DEFAULT 50,
  respect_robots BOOLEAN DEFAULT true,
  selectors JSONB DEFAULT '{}',
  status public.source_status DEFAULT 'active',
  last_crawled_at TIMESTAMPTZ,
  last_success_at TIMESTAMPTZ,
  robots_txt TEXT,
  robots_fetched_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ingestion_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES public.sources(id) ON DELETE CASCADE,
  job_status public.job_status DEFAULT 'queued',
  urls_discovered INT DEFAULT 0,
  urls_fetched INT DEFAULT 0,
  urls_failed INT DEFAULT 0,
  documents_created INT DEFAULT 0,
  documents_updated INT DEFAULT 0,
  error_log JSONB DEFAULT '[]',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  triggered_by UUID REFERENCES public.profiles(id)
);
CREATE INDEX IF NOT EXISTS idx_jobs_source_status ON public.ingestion_jobs(source_id, job_status);

CREATE TABLE IF NOT EXISTS public.raw_documents (
  id BIGSERIAL PRIMARY KEY,
  source_id UUID REFERENCES public.sources(id),
  job_id UUID REFERENCES public.ingestion_jobs(id),
  url TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  raw_html TEXT,
  extracted_text TEXT,
  metadata JSONB DEFAULT '{}',
  published_date DATE,
  detected_reference TEXT,
  review_status public.review_status DEFAULT 'pending',
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  legal_document_id BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(url, content_hash)
);
CREATE INDEX IF NOT EXISTS idx_raw_pending ON public.raw_documents(review_status, created_at) WHERE review_status = 'pending';

CREATE TABLE IF NOT EXISTS public.document_versions (
  id BIGSERIAL PRIMARY KEY,
  legal_document_id BIGINT NOT NULL,
  version_number INT NOT NULL,
  content TEXT NOT NULL,
  change_summary TEXT,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(legal_document_id, version_number)
);

CREATE TABLE IF NOT EXISTS public.review_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  raw_document_id BIGINT REFERENCES public.raw_documents(id) ON DELETE CASCADE,
  priority INT DEFAULT 5,
  assigned_to UUID REFERENCES public.profiles(id),
  assigned_at TIMESTAMPTZ,
  sla_deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(raw_document_id)
);

-- RLS (real roles only)
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "sources_admin_only" ON public.sources;
CREATE POLICY "sources_admin_only" ON public.sources FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id::text = auth.uid()::text AND role = 'admin'));

ALTER TABLE public.ingestion_jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "jobs_admin_only" ON public.ingestion_jobs;
CREATE POLICY "jobs_admin_only" ON public.ingestion_jobs FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id::text = auth.uid()::text AND role = 'admin'));

ALTER TABLE public.raw_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "raw_reviewer_only" ON public.raw_documents;
CREATE POLICY "raw_reviewer_only" ON public.raw_documents FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id::text = auth.uid()::text AND role IN ('legal_reviewer','legal_editor','admin')));

ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "versions_admin_only" ON public.document_versions;
CREATE POLICY "versions_admin_only" ON public.document_versions FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id::text = auth.uid()::text AND role IN ('legal_reviewer','legal_editor','admin')));

ALTER TABLE public.review_queue ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "queue_reviewer_only" ON public.review_queue;
CREATE POLICY "queue_reviewer_only" ON public.review_queue FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id::text = auth.uid()::text AND role IN ('legal_reviewer','legal_editor','admin')));

-- Seed (idempotent; selectors UNVERIFIED placeholders)
INSERT INTO public.sources (name, base_url, source_type, crawl_delay_ms, selectors)
SELECT 'الجريدة الرسمية — الأمانة العامة للحكومة', 'https://www.sgg.gov.ma', 'law', 3000, '{"bulletin_list":"a[href*=\"Bulletin\"]","pdf_link":"a[href$=\".pdf\"]"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE name = 'الجريدة الرسمية — الأمانة العامة للحكومة');
INSERT INTO public.sources (name, base_url, source_type, crawl_delay_ms, selectors)
SELECT 'البوابة القانونية — وزارة العدل', 'https://adala.justice.gov.ma', 'code', 2500, '{"article_container":"div.article-content","law_title":"h1.law-title"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE name = 'البوابة القانونية — وزارة العدل');
INSERT INTO public.sources (name, base_url, source_type, crawl_delay_ms, selectors)
SELECT 'الاجتهاد القضائي — محكمة النقض', 'https://juriscassation.cspj.ma', 'case_law', 3000, '{"decision_body":"div.arrêt","case_number":"span.numero"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE name = 'الاجتهاد القضائي — محكمة النقض');
INSERT INTO public.sources (name, base_url, source_type, crawl_delay_ms, selectors)
SELECT 'الهيئة الوطنية لحماية المعطيات الشخصية', 'https://www.cndp.ma', 'circular', 3000, '{"main_content":"article.post"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE name = 'الهيئة الوطنية لحماية المعطيات الشخصية');

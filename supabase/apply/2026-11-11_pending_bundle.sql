-- ============================================================
-- AADALA.MA - PENDING DATABASE MIGRATIONS (single paste bundle)
-- Project: pvoenvxinkipgpnddumt
-- Generated: 2026-11-11 from supabase/migrations/ (originals untouched)
-- Why: audit via PostgREST showed 22 of 33 tables missing.
-- Already applied: 0001, 0002, 0005, 0013 (verified by live API).
-- This bundle: 0003, 0004, 0006-0012, 0014 (in order, idempotent, atomic).
-- Safe to re-run: tables use IF NOT EXISTS, policies DROP IF EXISTS,
-- seeds use WHERE NOT EXISTS, triggers DROP IF EXISTS.
-- Run in: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run
-- ============================================================

BEGIN;

-- ============ 0003_document_templates.sql ============
-- ============================================================
-- AADALA.MA â€” 0003 Smart Document Templates (FEATURE 2)
-- Tables: document_templates, generated_documents
-- Run in Supabase SQL Editor (project pvoenvxinkipgpnddumt)
-- Requires: 0002_auth_rls.sql applied first.
-- NOTE: legal_basis is "ظ…ظ‚طھط±ط­" â€” طھط­ظ‚ظ‚ ظ…ظ† ط§ظ„ظ†طµ ط§ظ„ط±ط³ظ…ظٹ ظ‚ط¨ظ„ ط§ظ„ط§ط¹طھظ…ط§ط¯.
--       Templates are editable drafts, NOT official documents.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
BEGIN
  CREATE TYPE public.doc_category AS ENUM (
    'real_estate', 'employment', 'family', 'commercial', 'civil', 'criminal'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category public.doc_category NOT NULL,
  description TEXT,
  legal_basis TEXT,
  template_html TEXT NOT NULL,
  required_fields JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.generated_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.document_templates(id) ON DELETE SET NULL,
  title TEXT,
  filled_data JSONB,
  final_html TEXT,
  ai_additions TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','final','archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_templates_active ON public.document_templates(category, is_active);
CREATE INDEX IF NOT EXISTS idx_docs_user ON public.generated_documents(user_id, created_at DESC);

-- RLS
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "templates_public_read" ON public.document_templates;
CREATE POLICY "templates_public_read" ON public.document_templates FOR SELECT USING (is_active = true);

ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "docs_owner_only" ON public.generated_documents;
CREATE POLICY "docs_owner_only" ON public.generated_documents FOR ALL USING (user_id::text = auth.uid()::text);

-- updated_at
CREATE OR REPLACE FUNCTION public.touch_doc_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS trg_docs_touch ON public.generated_documents;
CREATE TRIGGER trg_docs_touch BEFORE UPDATE ON public.generated_documents
  FOR EACH ROW EXECUTE FUNCTION public.touch_doc_updated_at();

-- Seed (idempotent by title â€” drafts, expert review required)
INSERT INTO public.document_templates (title, category, description, legal_basis, required_fields, template_html)
SELECT 'ط§ظ„ظˆط¹ط¯ ط¨ط§ظ„ط¨ظٹط¹ ط§ظ„ط¹ظ‚ط§ط±ظٹ', 'real_estate',
  'ظˆط¹ط¯ ط¨ط§ظ„ط¨ظٹط¹ ظ„ط¹ظ‚ط§ط± ظ…ط­ظپط¸ ط£ظˆ ظپظٹ ط·ظˆط± ط§ظ„طھط­ظپظٹط¸. ظٹظ†ط¸ظ… ط§ظ„ط¹ظ„ط§ظ‚ط© ظ‚ط¨ظ„ ط§ظ„ط¹ظ‚ط¯ ط§ظ„ظ†ظ‡ط§ط¦ظٹ. (ظ…ط³ظˆط¯ط© طھط¬ط±ظٹط¨ظٹط© â€” طھط­ظ‚ظ‚ ظ…ظ† ط§ظ„ظ†طµ ط§ظ„ط±ط³ظ…ظٹ.)',
  'ط§ظ„ظ…ط§ط¯ط© 4 ظ…ظ† ط§ظ„ظ‚ط§ظ†ظˆظ† ط±ظ‚ظ… 39.08 ط§ظ„ظ…طھط¹ظ„ظ‚ ط¨ظ…ط¯ظˆظ†ط© ط§ظ„ط­ظ‚ظˆظ‚ ط§ظ„ط¹ظٹظ†ظٹط© (ظ…ظ‚طھط±ط­ â€” طھط­ظ‚ظ‚ ظ…ظ† ط§ظ„ظ†طµ ط§ظ„ط±ط³ظ…ظٹ)',
  '[
    {"name":"seller_name","label":"ط§ط³ظ… ط§ظ„ط¨ط§ط¦ط¹","type":"text","required":true},
    {"name":"buyer_name","label":"ط§ط³ظ… ط§ظ„ظ…ط´طھط±ظٹ","type":"text","required":true},
    {"name":"property_desc","label":"ظˆطµظپ ط§ظ„ط¹ظ‚ط§ط±","type":"textarea","required":true},
    {"name":"price","label":"ط§ظ„ط«ظ…ظ† ط§ظ„ط¥ط¬ظ…ط§ظ„ظٹ (ط¯ط±ظ‡ظ…)","type":"number","required":true},
    {"name":"advance","label":"ظ…ط¨ظ„ط؛ ط§ظ„طھط³ط¨ظٹظ‚ (ط¯ط±ظ‡ظ…)","type":"number","required":true},
    {"name":"date","label":"طھط§ط±ظٹط® ط§ظ„طھظˆظ‚ظٹط¹","type":"date","required":true}
  ]'::jsonb,
  '<div class="doc-content"><h1 style="text-align:center;">ظˆط¹ط¯ ط¨ط§ظ„ط¨ظٹط¹ ط§ظ„ط¹ظ‚ط§ط±ظٹ</h1><p><strong>ط§ظ„ط·ط±ظپ ط§ظ„ط£ظˆظ„ (ط§ظ„ط¨ط§ط¦ط¹):</strong> ط§ظ„ط³ظٹط¯(ط©) {{seller_name}}</p><p><strong>ط§ظ„ط·ط±ظپ ط§ظ„ط«ط§ظ†ظٹ (ط§ظ„ظ…ط´طھط±ظٹ):</strong> ط§ظ„ط³ظٹط¯(ط©) {{buyer_name}}</p><p>ط¨ظ…ظˆط¬ط¨ ظ‡ط°ط§ ط§ظ„ط¹ظ‚ط¯طŒ ظٹظ„طھط²ظ… ط§ظ„ط·ط±ظپ ط§ظ„ط£ظˆظ„ ط¨ط¨ظٹط¹ ط§ظ„ط¹ظ‚ط§ط± ط§ظ„ظ…ظˆطµظˆظپ ظƒط§ظ„طھط§ظ„ظٹ: {{property_desc}} ط¥ظ„ظ‰ ط§ظ„ط·ط±ظپ ط§ظ„ط«ط§ظ†ظٹطŒ ط¨ط«ظ…ظ† ط¥ط¬ظ…ط§ظ„ظٹ ظ‚ط¯ط±ظ‡ <strong>{{price}} ط¯ط±ظ‡ظ…</strong>طŒ ظ…ط¹ ط£ط¯ط§ط، طھط³ط¨ظٹظ‚ ظ‚ط¯ط±ظ‡ <strong>{{advance}} ط¯ط±ظ‡ظ…</strong>.</p><div style="background:#fff3cd; padding:10px; border-right:4px solid #ffc107; margin:20px 0;"><strong>ظ…ظ„ط§ط­ط¸ط© ظ‚ط§ظ†ظˆظ†ظٹط© ظ‡ط§ظ…ط©:</strong> ط·ط¨ظ‚ط§ظ‹ ظ„ظ„ظ…ط§ط¯ط© 4 ظ…ظ† ط§ظ„ظ‚ط§ظ†ظˆظ† 39.08طŒ ظٹط¬ط¨ ط£ظ† ظٹطھظ… ظ‡ط°ط§ ط§ظ„ظˆط¹ط¯ ظپظٹ ظ…ط­ط±ط± ط±ط³ظ…ظٹ ط£ظˆ ظ…ط­ط±ط± ط«ط§ط¨طھ ط§ظ„طھط§ط±ظٹط® ظٹط­ط±ط±ظ‡ ظ…ط­ط§ظ… ظ…ظ‚ط¨ظˆظ„ ظ„ظ„طھط±ط§ظپط¹ ط£ظ…ط§ظ… ظ…ط­ظƒظ…ط© ط§ظ„ظ†ظ‚ط¶طŒ طھط­طھ ط·ط§ط¦ظ„ط© ط§ظ„ط¨ط·ظ„ط§ظ†. (طھط­ظ‚ظ‚ ظ…ظ† ط§ظ„ظ†طµ ط§ظ„ط±ط³ظ…ظٹ.)</div><p>ط­ظڈط±ط± ط¨ظ€ ............... ط¨طھط§ط±ظٹط® {{date}}.</p><div style="display:flex; justify-content:space-between; margin-top:50px;"><span>طھظˆظ‚ظٹط¹ ط§ظ„ط¨ط§ط¦ط¹</span><span>طھظˆظ‚ظٹط¹ ط§ظ„ظ…ط´طھط±ظٹ</span></div></div>'
WHERE NOT EXISTS (SELECT 1 FROM public.document_templates WHERE title = 'ط§ظ„ظˆط¹ط¯ ط¨ط§ظ„ط¨ظٹط¹ ط§ظ„ط¹ظ‚ط§ط±ظٹ');

INSERT INTO public.document_templates (title, category, description, legal_basis, required_fields, template_html)
SELECT 'ط¥ظ†ط°ط§ط± ط¨ط§ظ„ط¥ط®ظ„ط§ط،', 'real_estate',
  'ط¥ظ†ط°ط§ط± ظ‚ط§ظ†ظˆظ†ظٹ ظ„ظ„ظ…ظƒطھط±ظٹ ط¨ط§ظ„ط¥ط®ظ„ط§ط، ط¨ط³ط¨ط¨ ط¹ط¯ظ… ط§ظ„ط£ط¯ط§ط، ط£ظˆ ط§ظ„ط¥ط®ظ„ط§ظ„ ط¨ط§ظ„ط§ظ„طھط²ط§ظ…ط§طھ. (ظ…ط³ظˆط¯ط© طھط¬ط±ظٹط¨ظٹط© â€” طھط­ظ‚ظ‚ ظ…ظ† ط§ظ„ظ†طµ ط§ظ„ط±ط³ظ…ظٹ.)',
  'ظ‚ط§ظ†ظˆظ† ط§ظ„ط§ظ„طھط²ط§ظ…ط§طھ ظˆط§ظ„ط¹ظ‚ظˆط¯ (ط§ظ„ظپطµظ„ 692) (ظ…ظ‚طھط±ط­ â€” طھط­ظ‚ظ‚ ظ…ظ† ط§ظ„ظ†طµ ط§ظ„ط±ط³ظ…ظٹ)',
  '[
    {"name":"landlord_name","label":"ط§ط³ظ… ط§ظ„ظ…ظƒط±ظٹ","type":"text","required":true},
    {"name":"tenant_name","label":"ط§ط³ظ… ط§ظ„ظ…ظƒطھط±ظٹ","type":"text","required":true},
    {"name":"address","label":"ط¹ظ†ظˆط§ظ† ط§ظ„ط¹ظ‚ط§ط± ط§ظ„ظ…ظƒطھط±ظ‰","type":"text","required":true},
    {"name":"reason","label":"ط³ط¨ط¨ ط§ظ„ط¥ط®ظ„ط§ط، (ط¹ط¯ظ… ط§ظ„ط£ط¯ط§ط،طŒ ط¥ظ„ط®)","type":"textarea","required":true},
    {"name":"deadline","label":"ط£ط¬ظ„ ط§ظ„ط¥ط®ظ„ط§ط، (ط£ظٹط§ظ…)","type":"number","required":true},
    {"name":"date","label":"طھط§ط±ظٹط® ط§ظ„ط¥ظ†ط°ط§ط±","type":"date","required":true}
  ]'::jsonb,
  '<div class="doc-content"><h1 style="text-align:center;">ط¥ظ†ط°ط§ط± ط¨ط§ظ„ط¥ط®ظ„ط§ط،</h1><p><strong>ظ…ظ†:</strong> ط§ظ„ط³ظٹط¯(ط©) {{landlord_name}} (ط§ظ„ظ…ظƒط±ظٹ)</p><p><strong>ط¥ظ„ظ‰:</strong> ط§ظ„ط³ظٹط¯(ط©) {{tenant_name}} (ط§ظ„ظ…ظƒطھط±ظٹ)</p><p>ط£ظˆط¬ظ‡ ط¥ظ„ظٹظƒظ… ظ‡ط°ط§ ط§ظ„ط¥ظ†ط°ط§ط± ط§ظ„ظ‚ط§ظ†ظˆظ†ظٹ ظ„ظ„ط¥ط®ظ„ط§ط، ظ…ظ† ط§ظ„ط¹ظ‚ط§ط± ط§ظ„ظƒط§ط¦ظ† ط¨ظ€: {{address}}طŒ ظˆط°ظ„ظƒ ظ„ظ„ط³ط¨ط¨ ط§ظ„طھط§ظ„ظٹ: {{reason}}.</p><p>ظˆط¹ظ„ظٹظ‡طŒ ظٹط±ط¬ظ‰ ظ…ظ†ظƒظ… ط¥ط®ظ„ط§ط، ط§ظ„ط¹ظ‚ط§ط± ظˆطھط³ظ„ظٹظ…ظ‡ ط®ط§ظ„ظٹط§ظ‹ ظ…ظ† ط§ظ„ط´ظˆط§ط؛ظ„ ط¯ط§ط®ظ„ ط£ط¬ظ„ <strong>{{deadline}} ظٹظˆظ…ط§ظ‹</strong> ظ…ظ† طھط§ط±ظٹط® ط§ظ„طھظˆطµظ„ ط¨ظ‡ط°ط§ ط§ظ„ط¥ظ†ط°ط§ط±طŒ ظˆط¥ظ„ط§ ط³ط£ط¶ط·ط± ط¢ط³ظپط§ظ‹ ظ„ط§طھط®ط§ط° ظƒط§ظپط© ط§ظ„ط¥ط¬ط±ط§ط،ط§طھ ط§ظ„ظ‚ط§ظ†ظˆظ†ظٹط© ط§ظ„ظ„ط§ط²ظ…ط©.</p><p>ط­ظڈط±ط± ط¨طھط§ط±ظٹط® {{date}}.</p><p style="margin-top:50px;">طھظˆظ‚ظٹط¹ ط§ظ„ظ…ظƒط±ظٹ</p></div>'
WHERE NOT EXISTS (SELECT 1 FROM public.document_templates WHERE title = 'ط¥ظ†ط°ط§ط± ط¨ط§ظ„ط¥ط®ظ„ط§ط،');


-- ============ 0004_ingestion.sql ============
-- ============================================================
-- AADALA.MA â€” 0004 Ingestion & Review Infrastructure (safe subset)
-- Tables: sources, ingestion_jobs, raw_documents, document_versions, review_queue
-- Run in Supabase SQL Editor (project pvoenvxinkipgpnddumt)
-- Requires: 0001_init.sql + 0002_auth_rls.sql.
-- NOTE: legal_documents/legal_source_type do NOT exist in this project.
--       legal_document_id is kept as a plain BIGINT with NO FK (link to articles when mapped).
--       Roles use the real profile roles: admin, legal_editor, legal_reviewer, user.
--       Seed selectors are PLACEHOLDERS â€” not verified against live sites.
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
SELECT 'ط§ظ„ط¬ط±ظٹط¯ط© ط§ظ„ط±ط³ظ…ظٹط© â€” ط§ظ„ط£ظ…ط§ظ†ط© ط§ظ„ط¹ط§ظ…ط© ظ„ظ„ط­ظƒظˆظ…ط©', 'https://www.sgg.gov.ma', 'law', 3000, '{"bulletin_list":"a[href*=\"Bulletin\"]","pdf_link":"a[href$=\".pdf\"]"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE name = 'ط§ظ„ط¬ط±ظٹط¯ط© ط§ظ„ط±ط³ظ…ظٹط© â€” ط§ظ„ط£ظ…ط§ظ†ط© ط§ظ„ط¹ط§ظ…ط© ظ„ظ„ط­ظƒظˆظ…ط©');
INSERT INTO public.sources (name, base_url, source_type, crawl_delay_ms, selectors)
SELECT 'ط§ظ„ط¨ظˆط§ط¨ط© ط§ظ„ظ‚ط§ظ†ظˆظ†ظٹط© â€” ظˆط²ط§ط±ط© ط§ظ„ط¹ط¯ظ„', 'https://adala.justice.gov.ma', 'code', 2500, '{"article_container":"div.article-content","law_title":"h1.law-title"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE name = 'ط§ظ„ط¨ظˆط§ط¨ط© ط§ظ„ظ‚ط§ظ†ظˆظ†ظٹط© â€” ظˆط²ط§ط±ط© ط§ظ„ط¹ط¯ظ„');
INSERT INTO public.sources (name, base_url, source_type, crawl_delay_ms, selectors)
SELECT 'ط§ظ„ط§ط¬طھظ‡ط§ط¯ ط§ظ„ظ‚ط¶ط§ط¦ظٹ â€” ظ…ط­ظƒظ…ط© ط§ظ„ظ†ظ‚ط¶', 'https://juriscassation.cspj.ma', 'case_law', 3000, '{"decision_body":"div.arrأھt","case_number":"span.numero"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE name = 'ط§ظ„ط§ط¬طھظ‡ط§ط¯ ط§ظ„ظ‚ط¶ط§ط¦ظٹ â€” ظ…ط­ظƒظ…ط© ط§ظ„ظ†ظ‚ط¶');
INSERT INTO public.sources (name, base_url, source_type, crawl_delay_ms, selectors)
SELECT 'ط§ظ„ظ‡ظٹط¦ط© ط§ظ„ظˆط·ظ†ظٹط© ظ„ط­ظ…ط§ظٹط© ط§ظ„ظ…ط¹ط·ظٹط§طھ ط§ظ„ط´ط®طµظٹط©', 'https://www.cndp.ma', 'circular', 3000, '{"main_content":"article.post"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE name = 'ط§ظ„ظ‡ظٹط¦ط© ط§ظ„ظˆط·ظ†ظٹط© ظ„ط­ظ…ط§ظٹط© ط§ظ„ظ…ط¹ط·ظٹط§طھ ط§ظ„ط´ط®طµظٹط©');


-- ============ 0006_contract_audits.sql ============
-- ============================================================
-- AADALA.MA â€” 0006 Contract Audits (schema only, no upload/AI)
-- Tables: contract_audits, mandatory_clauses
-- Run in Supabase SQL Editor (project pvoenvxinkipgpnddumt), after 0001-0005.
-- NOTE: No uploader, no extractor, no risk scoring yet â€” tables alone are inert.
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


-- ============ 0007_tracked_cases.sql ============
-- ============================================================
-- AADALA.MA â€” 0007 Tracked Cases (schema only, no UI/API yet)
-- Tables: tracked_cases, case_events
-- Run in Supabase SQL Editor (project pvoenvxinkipgpnddumt), after 0001-0006.
-- Case files are sensitive personal data â€” owner-only RLS, no public read.
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


-- ============ 0008_notifications.sql ============
-- ============================================================
-- AADALA.MA â€” 0008 Notifications (schema only, no UI/API yet)
-- Table: notifications
-- Run in Supabase SQL Editor (project pvoenvxinkipgpnddumt), after 0001-0007.
-- Owner-only RLS; action_url/metadata are hints, not commands.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info','deadline','hearing','warning','success')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  archived BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifs_user ON public.notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifs_unread ON public.notifications(user_id, is_read) WHERE is_read = false;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own_notifications" ON public.notifications;
CREATE POLICY "own_notifications" ON public.notifications FOR ALL
  USING (user_id::text = auth.uid()::text);


-- ============ 0009_workspaces.sql ============
-- ============================================================
-- AADALA.MA â€” 0009 Workspaces (schema only, no UI/API yet)
-- Tables: workspaces, workspace_members, workspace_documents
-- Run in Supabase SQL Editor (project pvoenvxinkipgpnddumt), after 0001-0008.
-- Members see workspace docs only; owner-or-member reads workspace/members.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner','admin','member','viewer')),
  UNIQUE(workspace_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.workspace_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  version INT DEFAULT 1,
  last_edited_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ws_members_ws ON public.workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ws_docs_ws ON public.workspace_documents(workspace_id, updated_at DESC);

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ws_owner_or_member" ON public.workspaces;
CREATE POLICY "ws_owner_or_member" ON public.workspaces FOR ALL
  USING (owner_id::text = auth.uid()::text OR EXISTS (SELECT 1 FROM public.workspace_members m WHERE m.workspace_id = id AND m.user_id::text = auth.uid()::text));

ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ws_members_read" ON public.workspace_members;
CREATE POLICY "ws_members_read" ON public.workspace_members FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.workspace_members m WHERE m.workspace_id = workspace_id AND m.user_id::text = auth.uid()::text));

ALTER TABLE public.workspace_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "workspace_members_only" ON public.workspace_documents;
CREATE POLICY "workspace_members_only" ON public.workspace_documents FOR ALL
  USING (EXISTS (SELECT 1 FROM public.workspace_members m WHERE m.workspace_id = workspace_id AND m.user_id::text = auth.uid()::text))
  WITH CHECK (EXISTS (SELECT 1 FROM public.workspace_members m WHERE m.workspace_id = workspace_id AND m.user_id::text = auth.uid()::text));


-- ============ 0010_gov_services.sql ============
-- ============================================================
-- AADALA.MA â€” 0010 Gov Services directory (schema only, no verified seeds)
-- Tables: gov_services, user_service_requests
-- Run in Supabase SQL Editor (project pvoenvxinkipgpnddumt), after 0001-0009.
-- NOTE: No seed rows â€” gov URLs are NEVER hallucinated; add only official verified URLs (https, .gov.ma).
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


-- ============ 0011_case_law.sql ============
-- ============================================================
-- AADALA.MA â€” 0011 Case Law (schema only, NO pgvector/embeddings yet)
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


-- ============ 0012_learning.sql ============
-- ============================================================
-- AADALA.MA â€” 0012 Learning (schema only, no UI/API yet)
-- Tables: learning_courses, learning_lessons, student_progress
-- Run in Supabase SQL Editor (project pvoenvxinkipgpnddumt), after 0001-0011.
-- NOTE: No authored lessons here â€” live review today is ReviewMode (flashcards/quiz from excerpts).
-- ============================================================

CREATE TABLE IF NOT EXISTS public.learning_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  level TEXT CHECK (level IN ('beginner','intermediate','advanced')),
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.learning_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.learning_courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_mdx TEXT,
  order_index INT,
  quiz JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.learning_lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  score INT,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_lessons_course ON public.learning_lessons(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_progress_user ON public.student_progress(user_id);

ALTER TABLE public.learning_courses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "courses_public_read" ON public.learning_courses;
CREATE POLICY "courses_public_read" ON public.learning_courses FOR SELECT USING (true);

ALTER TABLE public.learning_lessons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "lessons_public_read" ON public.learning_lessons;
CREATE POLICY "lessons_public_read" ON public.learning_lessons FOR SELECT USING (true);

ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "progress_owner_only" ON public.student_progress;
CREATE POLICY "progress_owner_only" ON public.student_progress FOR ALL
  USING (user_id::text = auth.uid()::text);


-- ============ 0014_error_reports.sql ============
-- ============================================================
-- AADALA.MA â€” 0014 Error Reports (insert-only public, admin read)
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


COMMIT;

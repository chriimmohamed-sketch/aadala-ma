-- ============================================================
-- AADALA.MA — 0009 Workspaces (schema only, no UI/API yet)
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

-- ============================================================
-- AADALA.MA — 0013 Legacy RLS (0001 tables had none)
-- Run in Supabase SQL Editor (project pvoenvxinkipgpnddumt), after 0001-0012.
-- Public reference: anon/authenticated may SELECT; writes admin/editor only.
-- ============================================================

ALTER TABLE public.laws ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "laws_public_read" ON public.laws;
CREATE POLICY "laws_public_read" ON public.laws FOR SELECT USING (true);
DROP POLICY IF EXISTS "laws_admin_write" ON public.laws;
CREATE POLICY "laws_admin_write" ON public.laws FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id::text = auth.uid()::text AND role IN ('admin','legal_editor')));
-- Bypass for anon inserts still blocked by USING (anon has no profile row).

ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "sections_public_read" ON public.sections;
CREATE POLICY "sections_public_read" ON public.sections FOR SELECT USING (true);
DROP POLICY IF EXISTS "sections_admin_write" ON public.sections;
CREATE POLICY "sections_admin_write" ON public.sections FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id::text = auth.uid()::text AND role IN ('admin','legal_editor')));

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "articles_public_read" ON public.articles;
CREATE POLICY "articles_public_read" ON public.articles FOR SELECT USING (true);
DROP POLICY IF EXISTS "articles_admin_write" ON public.articles;
CREATE POLICY "articles_admin_write" ON public.articles FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id::text = auth.uid()::text AND role IN ('admin','legal_editor')));

ALTER TABLE public.legal_issues ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "issues_public_read" ON public.legal_issues;
CREATE POLICY "issues_public_read" ON public.legal_issues FOR SELECT USING (true);
DROP POLICY IF EXISTS "issues_editor_write" ON public.legal_issues;
CREATE POLICY "issues_editor_write" ON public.legal_issues FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id::text = auth.uid()::text AND role IN ('admin','legal_editor','legal_reviewer')));

ALTER TABLE public.issue_article_mapping ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "map_public_read" ON public.issue_article_mapping;
CREATE POLICY "map_public_read" ON public.issue_article_mapping FOR SELECT USING (true);
DROP POLICY IF EXISTS "map_admin_write" ON public.issue_article_mapping;
CREATE POLICY "map_admin_write" ON public.issue_article_mapping FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id::text = auth.uid()::text AND role IN ('admin','legal_editor')));

ALTER TABLE public.entities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "entities_public_read" ON public.entities;
CREATE POLICY "entities_public_read" ON public.entities FOR SELECT USING (true);
DROP POLICY IF EXISTS "entities_admin_write" ON public.entities;
CREATE POLICY "entities_admin_write" ON public.entities FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id::text = auth.uid()::text AND role IN ('admin','legal_editor')));

ALTER TABLE public.entity_article_mapping ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "em_map_public_read" ON public.entity_article_mapping;
CREATE POLICY "em_map_public_read" ON public.entity_article_mapping FOR SELECT USING (true);
DROP POLICY IF EXISTS "em_map_admin_write" ON public.entity_article_mapping;
CREATE POLICY "em_map_admin_write" ON public.entity_article_mapping FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id::text = auth.uid()::text AND role IN ('admin','legal_editor')));

ALTER TABLE public.reference_answers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ref_public_read" ON public.reference_answers;
CREATE POLICY "ref_public_read" ON public.reference_answers FOR SELECT USING (true);
DROP POLICY IF EXISTS "ref_editor_write" ON public.reference_answers;
CREATE POLICY "ref_editor_write" ON public.reference_answers FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id::text = auth.uid()::text AND role IN ('admin','legal_editor','legal_reviewer')));

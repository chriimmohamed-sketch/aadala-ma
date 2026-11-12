-- AADALA.MA — Phase 02 post-apply catalog assertions
-- Run after migrations 0001-0016 and the Phase 02 hardening patch.
-- Catalog assertions do not replace multi-user integration tests.
DO $$
DECLARE
  table_name text;
  required_tables text[] := ARRAY[
    'profiles','audit_logs','laws','sections','articles','legal_issues',
    'issue_article_mapping','entities','entity_article_mapping','reference_answers',
    'document_templates','generated_documents','sources','ingestion_jobs',
    'raw_documents','document_versions','review_queue','legal_documents',
    'contract_audits','mandatory_clauses','tracked_cases','case_events',
    'notifications','workspaces','workspace_members','workspace_documents',
    'gov_services','user_service_requests','case_law','learning_courses',
    'learning_lessons','student_progress','error_reports'
  ];
  required_policies text[] := ARRAY[
    'profiles_insert_self','profiles_update_own_nonrole','profiles_update_admin_any',
    'audit_select_admin','workspaces_select_member','workspaces_insert_owner',
    'workspaces_update_owner','workspaces_delete_owner',
    'workspace_members_select','workspace_members_owner_insert',
    'workspace_members_owner_update','workspace_members_owner_delete',
    'workspace_documents_select','workspace_documents_insert',
    'workspace_documents_update','workspace_documents_delete'
  ];
  policy_name text;
BEGIN
  FOREACH table_name IN ARRAY required_tables LOOP
    IF to_regclass(format('public.%I', table_name)) IS NULL THEN
      RAISE EXCEPTION 'Required table is missing: public.%', table_name;
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relname = table_name AND c.relrowsecurity
    ) THEN
      RAISE EXCEPTION 'RLS is not enabled on public.%', table_name;
    END IF;
  END LOOP;

  FOREACH policy_name IN ARRAY required_policies LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public' AND policyname = policy_name
    ) THEN
      RAISE EXCEPTION 'Required policy is missing: %', policy_name;
    END IF;
  END LOOP;

  IF has_function_privilege('anon', 'public.is_admin(uuid)', 'EXECUTE') THEN
    RAISE EXCEPTION 'anon can execute public.is_admin(uuid)';
  END IF;
  IF NOT has_function_privilege('authenticated', 'public.is_admin(uuid)', 'EXECUTE') THEN
    RAISE EXCEPTION 'authenticated cannot execute public.is_admin(uuid)';
  END IF;
  IF has_function_privilege('anon', 'private.is_workspace_member(uuid)', 'EXECUTE') THEN
    RAISE EXCEPTION 'anon can execute private.is_workspace_member(uuid)';
  END IF;
  IF NOT has_function_privilege('authenticated', 'private.is_workspace_member(uuid)', 'EXECUTE') THEN
    RAISE EXCEPTION 'authenticated cannot execute private.is_workspace_member(uuid)';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'audit_logs'
      AND cmd = 'INSERT' AND roles @> ARRAY['authenticated']::name[]
  ) THEN
    RAISE EXCEPTION 'authenticated still has an audit_logs INSERT policy';
  END IF;
END;
$$;
SELECT 'PASS: RLS catalog, policies, helper grants, and audit insert restrictions.' AS result;

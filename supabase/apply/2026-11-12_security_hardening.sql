-- AADALA.MA — Phase 02 security hardening
-- Reviewable patch for a disposable/staging Supabase database first.
-- This file is intentionally in supabase/apply, NOT the migration history:
-- create a timestamped migration with "supabase migration new security_hardening"
-- and copy this SQL into it before applying through the normal migration workflow.
-- Safe to re-run. No tables or user rows are dropped.

BEGIN;

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated;

CREATE OR REPLACE FUNCTION private.current_profile_role()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
  SELECT p.role FROM public.profiles AS p
  WHERE p.id = auth.uid() LIMIT 1;
$$;
REVOKE ALL ON FUNCTION private.current_profile_role() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.current_profile_role() TO authenticated;

-- Only answer for the current caller; never reveal another UUID's admin status.
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
  SELECT uid IS NOT NULL AND uid = auth.uid()
     AND EXISTS (
       SELECT 1 FROM public.profiles AS p
       WHERE p.id = auth.uid() AND p.role = 'admin'
     );
$$;
REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;

-- Profiles: no self-promotion, and no self-referential policy subquery.
DROP POLICY IF EXISTS profiles_insert_self ON public.profiles;
CREATE POLICY profiles_insert_self ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid() AND role = 'user');

DROP POLICY IF EXISTS profiles_update_own_nonrole ON public.profiles;
CREATE POLICY profiles_update_own_nonrole ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role = private.current_profile_role());

DROP POLICY IF EXISTS profiles_update_admin_any ON public.profiles;
CREATE POLICY profiles_update_admin_any ON public.profiles
  FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS profiles_delete_admin ON public.profiles;
CREATE POLICY profiles_delete_admin ON public.profiles
  FOR DELETE TO authenticated
  USING (public.is_admin(auth.uid()));

-- Trusted server/service-role writes only; prevent unattributed client audit rows.
DROP POLICY IF EXISTS audit_insert_self ON public.audit_logs;

-- Workspace helpers bypass table RLS only for these tightly-scoped predicates.
CREATE OR REPLACE FUNCTION private.is_workspace_owner(ws uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
  SELECT auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.workspaces AS w
    WHERE w.id = ws AND w.owner_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION private.is_workspace_member(ws uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
  SELECT auth.uid() IS NOT NULL AND (
    private.is_workspace_owner(ws)
    OR EXISTS (
      SELECT 1 FROM public.workspace_members AS m
      WHERE m.workspace_id = ws AND m.user_id = auth.uid()
    )
  );
$$;

CREATE OR REPLACE FUNCTION private.can_write_workspace(ws uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
  SELECT auth.uid() IS NOT NULL AND (
    private.is_workspace_owner(ws)
    OR EXISTS (
      SELECT 1 FROM public.workspace_members AS m
      WHERE m.workspace_id = ws AND m.user_id = auth.uid()
        AND m.role IN ('owner', 'admin', 'member')
    )
  );
$$;

REVOKE ALL ON FUNCTION private.is_workspace_owner(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.is_workspace_member(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.can_write_workspace(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.is_workspace_owner(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_workspace_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION private.can_write_workspace(uuid) TO authenticated;

-- Workspaces: members read; only owner creates/updates/deletes.
DROP POLICY IF EXISTS ws_owner_or_member ON public.workspaces;
DROP POLICY IF EXISTS workspaces_select_member ON public.workspaces;
DROP POLICY IF EXISTS workspaces_insert_owner ON public.workspaces;
DROP POLICY IF EXISTS workspaces_update_owner ON public.workspaces;
DROP POLICY IF EXISTS workspaces_delete_owner ON public.workspaces;
CREATE POLICY workspaces_select_member ON public.workspaces
  FOR SELECT TO authenticated USING (private.is_workspace_member(id));
CREATE POLICY workspaces_insert_owner ON public.workspaces
  FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY workspaces_update_owner ON public.workspaces
  FOR UPDATE TO authenticated
  USING (private.is_workspace_owner(id))
  WITH CHECK (private.is_workspace_owner(id) AND owner_id = auth.uid());
CREATE POLICY workspaces_delete_owner ON public.workspaces
  FOR DELETE TO authenticated USING (private.is_workspace_owner(id));

-- Membership roster is visible to members; only owner manages membership.
DROP POLICY IF EXISTS ws_members_read ON public.workspace_members;
DROP POLICY IF EXISTS ws_members_owner_write ON public.workspace_members;
DROP POLICY IF EXISTS workspace_members_select ON public.workspace_members;
DROP POLICY IF EXISTS workspace_members_owner_insert ON public.workspace_members;
DROP POLICY IF EXISTS workspace_members_owner_update ON public.workspace_members;
DROP POLICY IF EXISTS workspace_members_owner_delete ON public.workspace_members;
CREATE POLICY workspace_members_select ON public.workspace_members
  FOR SELECT TO authenticated USING (private.is_workspace_member(workspace_id));
CREATE POLICY workspace_members_owner_insert ON public.workspace_members
  FOR INSERT TO authenticated
  WITH CHECK (
    private.is_workspace_owner(workspace_id)
    AND user_id IS NOT NULL
    AND role IN ('admin', 'member', 'viewer')
  );
CREATE POLICY workspace_members_owner_update ON public.workspace_members
  FOR UPDATE TO authenticated
  USING (private.is_workspace_owner(workspace_id))
  WITH CHECK (
    private.is_workspace_owner(workspace_id)
    AND user_id IS NOT NULL
    AND role IN ('admin', 'member', 'viewer')
  );
CREATE POLICY workspace_members_owner_delete ON public.workspace_members
  FOR DELETE TO authenticated
  USING (private.is_workspace_owner(workspace_id));

-- Viewers are read-only; writers are owner/admin/member.
DROP POLICY IF EXISTS workspace_members_only ON public.workspace_documents;
DROP POLICY IF EXISTS workspace_documents_select ON public.workspace_documents;
DROP POLICY IF EXISTS workspace_documents_insert ON public.workspace_documents;
DROP POLICY IF EXISTS workspace_documents_update ON public.workspace_documents;
DROP POLICY IF EXISTS workspace_documents_delete ON public.workspace_documents;
CREATE POLICY workspace_documents_select ON public.workspace_documents
  FOR SELECT TO authenticated USING (private.is_workspace_member(workspace_id));
CREATE POLICY workspace_documents_insert ON public.workspace_documents
  FOR INSERT TO authenticated
  WITH CHECK (
    private.can_write_workspace(workspace_id)
    AND (last_edited_by IS NULL OR last_edited_by = auth.uid())
  );
CREATE POLICY workspace_documents_update ON public.workspace_documents
  FOR UPDATE TO authenticated
  USING (private.can_write_workspace(workspace_id))
  WITH CHECK (
    private.can_write_workspace(workspace_id)
    AND (last_edited_by IS NULL OR last_edited_by = auth.uid())
  );
CREATE POLICY workspace_documents_delete ON public.workspace_documents
  FOR DELETE TO authenticated USING (private.can_write_workspace(workspace_id));

-- Prevent moving a document from one workspace to another via UPDATE.
CREATE OR REPLACE FUNCTION private.prevent_workspace_document_reparenting()
RETURNS trigger LANGUAGE plpgsql SET search_path = pg_catalog
AS $$
BEGIN
  IF NEW.workspace_id IS DISTINCT FROM OLD.workspace_id THEN
    RAISE EXCEPTION 'Moving a document between workspaces is not permitted'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION private.prevent_workspace_document_reparenting() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS trg_prevent_workspace_document_reparenting ON public.workspace_documents;
CREATE TRIGGER trg_prevent_workspace_document_reparenting
  BEFORE UPDATE OF workspace_id ON public.workspace_documents
  FOR EACH ROW EXECUTE FUNCTION private.prevent_workspace_document_reparenting();

COMMIT;

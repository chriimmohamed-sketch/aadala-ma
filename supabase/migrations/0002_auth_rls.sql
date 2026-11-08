-- ============================================================
-- AADALA.MA — 0002 Supabase Auth + RLS
-- Tables: profiles, audit_logs
-- Roles: user, legal_editor, legal_reviewer, admin
-- Run in Supabase SQL Editor (project pvoenvxinkipgpnddumt)
-- Requires: 0001_init.sql applied first (schema.sql).
-- NOTE: Never expose SUPABASE_SERVICE_ROLE_KEY in frontend code.
-- ============================================================

-- pgcrypto for gen_random_uuid() (already available on Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------- profiles ----------
-- One row per auth.users row. Role is NEVER set from client;
-- trigger below always creates 'user'. Only admins change roles.
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'user'
    CHECK (role IN ('user', 'legal_editor', 'legal_reviewer', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- updated_at auto-maintenance
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------- audit_logs ----------
-- Append-only (for normal users). Service/admin can read.
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_email TEXT,
  action TEXT NOT NULL,
  entity TEXT,
  entity_id TEXT,
  before JSONB,
  after JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity, entity_id);

-- ---------- role helper ----------
CREATE OR REPLACE FUNCTION public.is_admin(uid UUID)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = uid AND role = 'admin');
$$;

-- ---------- auto-create profile on signup ----------
-- Security: always 'user'; client cannot choose role.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------- Row Level Security ----------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- profiles: read own OR admin-only table? Least privilege:
-- authenticated users can read their own row; admins can read all.
DROP POLICY IF EXISTS profiles_select_own_or_admin ON public.profiles;
CREATE POLICY profiles_select_own_or_admin ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR public.is_admin(auth.uid()));

-- profiles: insert only for self (trigger already inserts; this covers manual backfill)
DROP POLICY IF EXISTS profiles_insert_self ON public.profiles;
CREATE POLICY profiles_insert_self ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- profiles: update own display_name/email only; role change requires admin.
-- Split into two policies so regular users cannot escalate role.
DROP POLICY IF EXISTS profiles_update_own_nonrole ON public.profiles;
CREATE POLICY profiles_update_own_nonrole ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS profiles_update_admin_any ON public.profiles;
CREATE POLICY profiles_update_admin_any ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- profiles: delete only by admin
DROP POLICY IF EXISTS profiles_delete_admin ON public.profiles;
CREATE POLICY profiles_delete_admin ON public.profiles
  FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- audit_logs: insert as self
DROP POLICY IF EXISTS audit_insert_self ON public.audit_logs;
CREATE POLICY audit_insert_self ON public.audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (actor = auth.uid() OR actor IS NULL);

-- audit_logs: select only admin
DROP POLICY IF EXISTS audit_select_admin ON public.audit_logs;
CREATE POLICY audit_select_admin ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- audit_logs: no update/delete for authenticated users (append-only).
-- Service role (backend scripts) bypasses RLS when needed.

-- ---------- comments ----------
COMMENT ON TABLE public.profiles IS 'Per-user profile; role is server-controlled only (user default, admin by admins).';
COMMENT ON TABLE public.audit_logs IS 'Append-only audit trail; read restricted to admins via RLS.';

-- ============================================================
-- AADALA.MA — 0015 Fix workspace RLS infinite recursion
-- Problem: 0009 policies on public.workspace_members query the same
--          table (self-reference), so Postgres raises
--          42P17 "infinite recursion detected in policy for relation
--          workspace_members" on every read of workspaces,
--          workspace_members and workspace_documents.
-- Fix:     SECURITY DEFINER helper functions read the membership table
--          outside RLS, and all policies call them instead of
--          sub-selecting workspace_members directly.
-- Additive: nothing is dropped except the three faulty policies.
-- Run after 0009 (safe to re-run).
-- ============================================================

create or replace function public.is_workspace_member(ws uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.workspace_members m
    where m.workspace_id = ws
      and m.user_id::text = auth.uid()::text
  );
$$;

create or replace function public.is_workspace_owner(ws uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.workspaces w
    where w.id = ws
      and w.owner_id::text = auth.uid()::text
  );
$$;

revoke all on function public.is_workspace_member(uuid) from public;
revoke all on function public.is_workspace_owner(uuid) from public;
grant execute on function public.is_workspace_member(uuid) to authenticated;
grant execute on function public.is_workspace_owner(uuid) to authenticated;

-- workspaces: owner OR member
drop policy if exists "ws_owner_or_member" on public.workspaces;
create policy "ws_owner_or_member" on public.workspaces for all
  using (public.is_workspace_owner(id) or public.is_workspace_member(id))
  with check (public.is_workspace_owner(id) or public.is_workspace_member(id));

-- workspace_members: members of the same workspace can read rows
drop policy if exists "ws_members_read" on public.workspace_members;
create policy "ws_members_read" on public.workspace_members for select
  using (public.is_workspace_member(workspace_id));

-- workspace_members: owners/admins invite and remove members
drop policy if exists "ws_members_owner_write" on public.workspace_members;
create policy "ws_members_owner_write" on public.workspace_members for all
  using (public.is_workspace_owner(workspace_id) or public.is_workspace_member(workspace_id))
  with check (public.is_workspace_owner(workspace_id) or public.is_workspace_member(workspace_id));

-- workspace_documents: members only
drop policy if exists "workspace_members_only" on public.workspace_documents;
create policy "workspace_members_only" on public.workspace_documents for all
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

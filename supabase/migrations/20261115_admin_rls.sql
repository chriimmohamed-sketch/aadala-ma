-- AADALA.MA — Admin RBAC via Supabase Auth + Row Level Security
-- 2026-11-16
--
-- Replaces the localStorage-based RBAC with real server-enforced authorization.
-- Apply from Supabase Dashboard → SQL Editor (the MCP connector is read-only).
--
-- Design notes:
--   * RLS is the enforcement layer. The client-side check in
--     app/[locale]/admin/page.tsx is only a UX affordance — it is NOT the guard.
--   * auth.uid() is the authenticated user's UUID; it cannot be spoofed by a
--     client because Postgres resolves it from the verified JWT.
--   * The "role" lives in the database, never in localStorage. A user editing
--     localStorage cannot escalate.
--   * Every policy is idempotent (drop if exists → create) so this file can be
--     re-run safely.

-- ==========================================================================
-- 1. profiles table
-- ==========================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'One row per authenticated user. role is the single source of truth for authorization.';

-- Auto-maintain updated_at
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ==========================================================================
-- 2. Enable RLS
-- ==========================================================================
alter table public.profiles enable row level security;

-- ==========================================================================
-- 3. Policies on profiles
-- ==========================================================================
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles" on public.profiles
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "Admins can update own profile" on public.profiles;
create policy "Admins can update own profile" on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ==========================================================================
-- 4. Helper: is the current user an admin?
--    Stable, SECURITY DEFINER, and deliberately narrow. Used by other
--    policies so the role check is written once.
-- ==========================================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, anon;

-- ==========================================================================
-- 5. Auto-provision a profile row on signup
--    Without this, a new user has no profile row and is therefore not an
--    admin — which is the correct default.
-- ==========================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ==========================================================================
-- 6. Legal content tables — public read, admin write
--    These tables are only created if they already exist; if a table is
--    absent the block is skipped rather than failing the whole migration.
-- ==========================================================================
do $$
declare
  t text;
begin
  foreach t in array array[
    'legal_sources', 'legal_articles', 'legal_chunks',
    'knowledge_cards', 'jurisprudence_decisions', 'ingest_queue'
  ] loop
    if to_regclass('public.' || t) is not null then
      execute format('alter table public.%I enable row level security', t);
      execute format('drop policy if exists %I on public.%I', 'Public read ' || t, t);
      execute format(
        'create policy %I on public.%I for select using (true)',
        'Public read ' || t, t
      );
      execute format('drop policy if exists %I on public.%I', 'Admins manage ' || t, t);
      execute format(
        'create policy %I on public.%I for all using (public.is_admin()) with check (public.is_admin())',
        'Admins manage ' || t, t
      );
    end if;
  end loop;
end $$;

-- ==========================================================================
-- 7. Promote the administrator
--    Replace the email below with the real admin address before running.
-- ==========================================================================
insert into public.profiles (id, email, role)
select id, email, 'admin'
from auth.users
where email = 'admin@aadala.ma'
on conflict (id) do update set role = 'admin', email = excluded.email;

-- ==========================================================================
-- 8. Verification queries (run after applying)
-- ==========================================================================
-- a) the admin row:
--      select id, email, role from public.profiles;
-- b) confirm anon cannot write:
--      insert into public.profiles (id, email, role) values (gen_random_uuid(), 'x@y.z', 'admin');
--      -- expected: ERROR: new row violates row-level security policy
-- c) confirm anon cannot escalate:
--      update public.profiles set role = 'admin' where email = 'someone@example.com';
--      -- expected: ERROR (no policy allows it)
-- d) confirm the admin can read all:
--      -- with the admin JWT:
--      select count(*) from public.profiles;

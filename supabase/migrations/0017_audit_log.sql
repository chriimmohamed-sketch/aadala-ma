-- 0017_audit_log.sql
-- Audit trail for security-relevant events (login, admin actions, document generation).
-- Additive: does not alter existing tables.

create table if not exists public.audit_log (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete set null,
  event text not null,
  metadata jsonb not null default '{}'::jsonb,
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists audit_log_user_idx on public.audit_log (user_id, created_at desc);
create index if not exists audit_log_event_idx on public.audit_log (event, created_at desc);

alter table public.audit_log enable row level security;

-- Only service_role / admins can read; inserts happen via server (service_role) only.
create policy "audit_log_admin_read" on public.audit_log
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

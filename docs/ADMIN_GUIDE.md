# Admin Guide — AADALA.MA

## Access
- Route: `/ar/admin` (Control Center).
- Auth: Supabase Auth (email/password) → session verified server-side (`lib/supabase/auth.server.ts`).
- RBAC: `profiles.role` (`user` / `legal_editor` / `legal_reviewer` / `admin`) via RLS. Admin UI requires `role = 'admin'`.
- Fail-closed: missing Supabase env → 503; signed-in non-admin → access-denied.

## First admin
1. Sign up at `/ar/register` (role becomes `user` via DB trigger).
2. SQL Editor: `UPDATE public.profiles SET role = 'admin' WHERE email = 'you@example.com';`
3. Sign in and open `/ar/admin`.

## Modules
Users, Roles, Legislation, Sources, Jurisprudence, AI Review, MIYAR, Files, Notifications, Audit Log, Performance, Errors, System Settings.

## Workflow
Draft → Editorial/Legal Review → Approval → Publish → Update/Archive.

## Audit
Sensitive changes recorded in `audit_logs` (actor, action, entity, before/after) — append-only, admin-readable via RLS.

## Least Privilege
See `lib/admin/permissions.ts` (`isAdminRole` gate; rank helpers for editors/reviewers). Always verify on the server, never from localStorage/client claims.

## Backup/Restore
See `docs/BACKUP_RESTORE.md`. Test restore regularly.

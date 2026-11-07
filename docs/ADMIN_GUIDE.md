# Admin Guide — AADALA.MA

## Access
- Route: `/ar/admin` (Control Center).
- Requires authentication + RBAC (to implement).

## Modules
Users, Roles, Legislation, Sources, Jurisprudence, AI Review, MIYAR, Files, Notifications, Audit Log, Performance, Errors, System Settings.

## Workflow
Draft → Editorial/Legal Review → Approval → Publish → Update/Archive.

## Audit
All sensitive changes recorded in `publication_reviews` / audit_logs (user, action, date, entity, before/after).

## Least Privilege
See `src/lib/admin/permissions.ts`. Verify on server, not only UI.

## Backup/Restore
See `docs/BACKUP_RESTORE.md`. Test restore regularly.
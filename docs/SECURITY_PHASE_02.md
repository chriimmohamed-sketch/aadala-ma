# AADALA.MA — Phase 02: Security & Database Recovery

## Scope reviewed

Read-only review of repository migrations 0001–0016, the pending bundle dated 2026-11-11, Supabase integration files, and SECURITY_AUDIT.md.

## Confirmed repository-level findings

1. Migration 0009 created self-referential membership policies.
2. Migration 0015 removes that recursion, but its replacement membership write policy still lets any member perform membership writes. Its workspace FOR ALL policy also lets members update/delete a workspace, and its document policy gives viewers write access.
3. Migration 0002 defines public.is_admin(uuid) as SECURITY DEFINER without revoking the default PUBLIC execute privilege. It accepts an arbitrary UUID, exposing admin-status checks for other accounts. The profile self-update policy queries profiles from a policy on profiles, creating a potential RLS-recursion hazard. Profile insertion does not explicitly pin role to user.
4. Migration 0002 allows authenticated clients to insert audit rows with actor IS NULL, weakening attribution.
5. Migrations 0001–0014 create multiple sensitive user-owned tables. The pending bundle says some migrations were not yet applied in the live project when that bundle was generated.

## Proposed repair

The companion SQL patch in supabase/apply/2026-11-12_security_hardening.sql:
- limits is_admin to the current caller and revokes anonymous/public execution;
- adds a private helper for the caller's profile role, avoiding a self-referential profile query;
- pins self-created profiles to the ordinary user role;
- removes direct authenticated inserts into audit_logs;
- separates workspace read/create/update/delete permissions;
- reserves membership administration to the workspace owner;
- makes viewer read-only and prevents document reassignment between workspaces.

No existing tables or user records are dropped.

## Validation

Run supabase/tests/security_hardening_checks.sql after the full schema and patch. It checks table existence, RLS enablement, required policy names, and function privileges. This catalog test does not replace multi-user integration tests.

Before production, use a disposable/staging database with user A (owner), B (member), C (viewer), D (non-member), and an administrator. Verify:
- B/C/D cannot add, alter, or remove workspace members;
- B/C cannot update/delete the workspace;
- C can read but cannot insert/update/delete workspace documents;
- D cannot read workspace data;
- a normal user cannot set their profile role to admin;
- anon cannot execute admin/workspace helper functions;
- authenticated clients cannot insert audit records.

## Environment limitation

The linked Supabase connector currently returns no projects for list_projects. The live database could not be inspected, migrated, or tested. The patch has not been applied to any live database. Do not apply it to production before confirming actual migration history and testing it in staging.

## Normal migration workflow

From the repository root, create a migration using the installed Supabase CLI:

    supabase migration new security_hardening

Copy the SQL from supabase/apply/2026-11-12_security_hardening.sql into the generated timestamped migration file, then run the project's normal local/staging migration workflow. Run catalog assertions and multi-user tests before production.

# Backup & Restore — AADALA.MA

## Database (Supabase/PostgreSQL)
- Daily automated backups (Supabase built-in).
- Test restore quarterly to staging.

## Files
- Legal source PDFs + extracted text in `public/legal/`.
- Keep off-site copy.

## Restore Procedure
1. Restore DB from backup.
2. Redeploy app (git checkout + build).
3. Verify smoke tests (home, legal, ai).
4. Update IMPLEMENTATION_PLAN.md.
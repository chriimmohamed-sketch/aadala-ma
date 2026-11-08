# Changelog — AADALA.MA

## [0.1.0] - 2026-11-07
### Added
- Next.js 16 foundation, i18n (10 locales), RTL.
- Design system (Midnight Navy/Royal Gold/Ivory/Graphite).
- Legal encyclopedia (7 PDF sources).
- AADALA AI (RAG, API, chat UI).
- MIYAR inheritance engine (experimental) + tests.
- AADALA REAL ESTATE conflict analyzer.
- AADALA JURISPRUDENCE search (empty, verified sources only).
- AADALA LEGAL SERVICES (procedures + draft generator).
- CRIMINAL LAW LAB (educational).
- AADALA CONTROL CENTER (admin skeleton).
- Supabase client + schema.
- Security audit report.
- Quality gate + CI.

### Notes
- Auth/RBAC not implemented (admin open) — before production. (Superseded: Supabase Auth implemented below.)
- Cloudflare deploy via CI (Windows local build unsupported).

## [0.2.0] - 2026-11-08
### Added
- Supabase Auth (email/password) + RLS (`profiles`, `audit_logs`, `0002_auth_rls.sql`).
- Login/Register pages (`/ar/login`, `/ar/register`) + header AuthButton (session only, no localStorage role).
- Server RBAC: proxy session gate + `/ar/admin` role check (`profiles.role = 'admin'`, fail-closed).
- Tests: permissions (5) + auth (3) → 33 total; build 264 pages.
- `@tailwindcss/postcss` (webpack utilities) + Google Fonts + theme tokens + empty-chart state (visual fixes).
- Repair-pack hygiene: meta description, locale guard (`dynamicParams=false`, 404 for invalid locale), `/robots.txt` + `/sitemap.xml` (Workers).
- GitHub Pages: `.nojekyll`; root `robots.txt`/`sitemap.xml` aligned to Pages URL.
- Docs: `README.md`, `MASTER_PROJECT_MAP.md`, `DEPLOYMENT.md`, `ADMIN_GUIDE.md`, `USER_GUIDE.md`, `docs/AUTH_SUPABASE.md`.

## [0.2.1] - 2026-11-08
### Merged (from aadala-ma-patch.zip, reviewed)
- `deploy-cloudflare.yml`: secret check + lint/typecheck/test gate + single cf:build + Supabase build-time vars.
- Rate limiting: Cloudflare `AI_LIMITER` binding with in-memory fallback + `clientIp` prod hardening; new `rate-limit.test.ts`.
- AADALA AI hardening: system/user prompt separation, real body-size check, per-field type validation, certainty downgrade rules.
- Completed pages: student, legal-aid, academic, sharia, updates (+ `PageShell`, `data/updates.ts`).
- Static: favicon/manifest + OG/canonical + CDN drop + Workers-auth redirects.
- Unification: static teal/brass design ported to Next home (hero/seal/ticker/tools/trust/palette/progress/steps/tilt/reveal).

### Skipped (intentionally)
- `proxy.ts` (patch reverts to Basic Auth) — kept Supabase `updateSession` instead.
- `wrangler.toml [[ratelimits]]` — kept current toml (in-memory limiter); add binding after a dry run.
- `docs/DEPLOYMENT.md` (patch is older) — kept current dual-track docs.
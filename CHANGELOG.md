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
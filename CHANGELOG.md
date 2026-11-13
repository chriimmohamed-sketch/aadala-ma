# Changelog — AADALA.MA

## [0.2.0] - 2026-11-13
### Added
- Machine extraction pipeline for the uploaded PDFs (pypdf text layer when readable, Windows Arabic OCR `ar-SA` otherwise) in `data/arabic_pdf.py` / `data/build_articles.py`.
- `document.html`: browser for the extracted articles — keyword search, deep links `#article-<key>`, prev/next navigation, page/section/confidence badges and a permanent “غير مدقق” (unverified) notice.
- `database.html`: per-document article counts and direct links to the article browser.
- Generated SQL (ready to apply) `supabase/migrations/20261113000300_legal_articles_extracted.sql` + `supabase/seed/articles_*.sql` + one-shot `supabase/apply_articles.sql` (2970 articles).
- Both worlds in one project: the **Next.js App Router source** from the `AADALA.MA_FULLSTACK` snapshot (`app/[locale]/**`, Header/Footer/ThemeToggle/ZelligeCanvas, `lib/` engines, `data/legal-categories.ts`) is now part of this repo. Static-first deployment is unchanged until the app is built and deployed.

### Notes
- All machine-extracted article text is **unverified**; nothing is labelled `verified`/`published` without human review against the Official Gazette.
- Article SQL is **not yet applied** to Supabase (tool access is read-only); apply `supabase/apply_articles.sql` from the SQL editor.
- Deployed artifacts ship no OCR dumps or extraction scripts; the live site remains static HTML/CSS/JS on Cloudflare Workers.

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
- Auth/RBAC not implemented (admin open) — before production.
- Cloudflare deploy via CI (Windows local build unsupported).
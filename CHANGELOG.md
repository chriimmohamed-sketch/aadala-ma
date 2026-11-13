# Changelog — AADALA.MA

## [0.2.1] - 2026-11-13
### Added
- Golden Set benchmark: `lib/ai-assistant/golden-set.test.ts` (25 assertions, fully offline) + `docs/GOLDEN_SET.md` — 30 questions in two tiers (GS-01..22: expected top-1 source; GS-23..30: anti-hallucination probes incl. `unverifiedCitations` on «المادة 230»).
- `docs/ADMIN_GUIDE.md`: new mandatory 2FA/MFA section for admin accounts (owner steps, not yet applied).

### Security
- `vitest` 3.2.7 → 5.1.0 and `@types/node` 20 → 24: removes 2 critical vulnerabilities (tinypool RCE, GHSA-5gmw-xhrv-c9v3 / GHSA-85c8-ppgw-ccpr). Full suite still green: **50/50 tests**.
- `npm audit fix` applied (lockfile-only). Remaining advisories: **9 moderate**, all in build-time tooling (`glob`/`minimatch` inside `@opennextjs/cloudflare` and `@typescript-eslint/typescript-estree`); none ship in the Next.js runtime or Workers bundles. Fixing requires breaking downgrades — intentionally not applied.
- Supabase advisors re-checked 2026-11-13: 12 tables with RLS enabled and no policies (INFO; deny-by-default, intentional), 2 functions with mutable `search_path` (`set_updated_at`, `touch_doc_updated_at`), 4 SECURITY DEFINER functions callable by `anon`/`authenticated` (needed by RLS policies — review before public launch), 25 `auth_rls_initplan` (wrap `auth.<fn>()` in `(select …)`), 22 unindexed FKs, 20 multiple-permissive-policy pairs, 2 duplicate indexes on `legal_articles` and `legal_documents`. All require write access to fix — blocked while the project is in read-only mode (see Notes).

### Notes
- Supabase project `pvoenvxinkipgpnddumt` remains in **read-only mode** (`default_transaction_read_only = on`, not in recovery) as of 2026-11-13: `legal_articles` still holds 0 rows and `supabase/apply_articles.sql` (2970 articles) **cannot be applied** until the owner restores write mode from the dashboard (disk quota/billing on the free plan). MCP and Management API both execute inside read-only transactions.
- WSL is not installed on the Windows machine and OpenNext × Windows deploy remains blocked; deploy via Cloudflare Dashboard ← Workers ← Deploy, or install WSL.

## [0.2.0] - 2026-11-13
### Added
- Machine extraction pipeline for the uploaded PDFs (pypdf text layer when readable, Windows Arabic OCR `ar-SA` otherwise) in `data/arabic_pdf.py` / `data/build_articles.py`.
- `document.html`: browser for the extracted articles — keyword search, deep links `#article-<key>`, prev/next navigation, page/section/confidence badges and a permanent “غير مدقق” (unverified) notice.
- `database.html`: per-document article counts and direct links to the article browser.
- Generated SQL (ready to apply) `supabase/migrations/20261113000300_legal_articles_extracted.sql` + `supabase/seed/articles_*.sql` + one-shot `supabase/apply_articles.sql` (2970 articles).
- **Phase 1 (BAA) foundation:** new migration `supabase/migrations/20261114000100_legal_articles_vector.sql` (pgvector, `legal_articles.embedding vector(1024)`, HNSW, Arabic FTS, `match_legal_articles()`), idempotent embeddings builder `data/build_embeddings.py`, and `/api/ai` now prefers pgvector similarity (`AI_VECTOR_SEARCH=1`) with TF-IDF fallback.
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
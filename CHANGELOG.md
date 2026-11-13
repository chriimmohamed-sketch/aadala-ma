# Changelog — AADALA.MA

## [0.3.1] - 2026-11-13 — OpenNext deploy preparation (branch `fix/opennext-deploy`)

### Added / Changed
- `wrangler.jsonc` (replaces `wrangler.toml`, backed up as `wrangler.static.jsonc.bak`): `main = .open-next/worker.js`, `assets` from `.open-next/assets` with `ASSETS` binding, `compatibility_date 2026-11-01`, `nodejs_compat`. No legacy bindings existed (`rate-limit` falls back to the in-memory limiter).
- `open-next.config.ts` confirmed present with `defineCloudflareConfig({})` (the earlier `*.deploy-bak` workaround file no longer exists).
- `.assetsignore.bak` — backup of the static-assets ignore list (needed for the static Worker fallback).
- `.gitignore`: `/.open-next/` excluded from git.
- `next.config.ts`: CSP `connect-src` now permits `https://*.supabase.co` + `wss://*.supabase.co` (browser Supabase Auth calls were previously blocked — login/register/MFA would have been dead in production). No `output: "standalone"` exists; `npm start` (`next start`) does not depend on standalone output.
- Dependencies: `wrangler` 4.158.0 → **4.162.0** (`@opennextjs/cloudflare` stays 1.20.17 — already latest).

### Verification (Windows, this machine)
- `tsc --noEmit` clean · ESLint **0 errors** (6 inherited warnings) · **81/81 vitest** · `npm run cf:build` **succeeded on Windows**: `.open-next/worker.js` (2,216 bytes) + `.open-next/assets/` (89 files, 4.7 MB) produced; 387 static/SSG pages + 11 dynamic API routes bundled.
- Static site stays the live production artifact on Workers until preview review (this branch is NOT merged to `master` and NO `wrangler deploy` was executed).

### Open (needs Cloudflare Linux/CI to verify)
- `wrangler deploy` of the OpenNext worker (this branch) — blocked intentionally until preview is reviewed.
- After preview passes, merge to `master`, then set GitHub secrets `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` for the CI deploy workflow.

## [0.3.0] - 2026-11-13 — الدمج الكامل (Merge of the full-stack AADALA.MA lineage)

### Merged (from `AADALA.MA-SIGNATURE-enhanced.zip`, 2026-11-10 build — with v0.2.0 convention files)
- **Auth stack**: `/{locale}/login|register|mfa|forgot|update-password`, `LoginForm`/`RegisterForm`/`MfaForm`/`ForgotPasswordForm`/`UpdatePasswordForm`/`AuthButton`, `GlobalLoader`, `StorageNotice`, `MobileNav`, `@supabase/ssr` server session refresh.
- **API**: `/api/ai` (full hardened route: anti-injection system prompt, `parseAiRequest` validation, `checkRateLimit` with Cloudflare Rate Limiting binding + in-memory fallback, `suggestNearest` fallback, optional **pgvector** path via `AI_VECTOR_SEARCH=1`), `/api/admin/ingest/{queue,review}`, `/api/cases/track`, `/api/cron/ingest`, `/api/documents/{generate,templates}`, `/api/notifications/remind`, `/api/student/progress`, `/api/workspaces`.
- **Libraries**: `lib/ingestion/*` (+tests), `lib/documents/*` (+tests), `lib/gov/gov-gateway.ts` (+test), `lib/study/flashcards.ts`, `lib/contracts/auditor.ts`, `lib/legal-services/{deadlines,wizard}.ts`, `lib/miyar/explain.ts`, `lib/security/validate.ts` (+tests), `lib/admin/permissions.ts` (real RBAC + test), real `lib/supabase/*` (server/middleware/auth.server), `lib/legal-knowledge` types, `data/legal-database.ts`, `data/updates.ts`, `data/glossary.ts`, **real corpus** `data/legal-index.json` (733 chunks, 629 carrying article/chapter numbers).
- **Supabase**: `migrations/0002…0013` (auth RLS, document templates, ingestion, legal documents, contract audits, tracked cases, notifications, workspaces, gov services, case law, learning, legacy RLS) + `seed-legal.sql`. **Not applied — DB is read-only.**
- **Routing**: `proxy.ts` (Next 16 convention) = locale redirect + Supabase session refresh + admin gate (fail-closed 503 when Supabase env is missing); replaces the placeholder `middleware.ts`.
- **Framework conventions**: `app/manifest.ts`, `app/robots.ts`, `app/sitemap.ts`, `app/[locale]/error.tsx`, `not-found.tsx`.
- **Hand-merged**: `package.json` (added @supabase/ssr, cloudflare@7, framer-motion, lucide-react, react-icons, recharts; kept vitest@5 + @types/node@24 security bumps), `.env.example` (Supabase Auth + vector-search vars).
- `.github/workflows/deploy-cloudflare.yml` (secrets check + NEXT_PUBLIC vars).

### Kept deliberately (owner-approved 2026-11-13)
- The **deployed static site** (root *.html, `assets/`, `admin/`, `auth/`, `data/legal-sources/`, `public/legal/`).
- The **Design Constitution** (`docs/DESIGN_CONSTITUTION.md`) and its implementation (`app/globals.css`, brand Header/Footer, `app/icon.jpg`).
- Deploy safety (`.assetsignore`, `wrangler.toml`, Next.js `next.config.ts` Windows workarounds, `tsconfig.json`, `vitest.config.ts`).

### Verified
- `tsc --noEmit` clean · ESLint **0 errors** (6 warnings carried over) · **81/81 vitest** · `next build`: **387/387 pages** · docs/GOLDEN_SET.md recalibrated to v2 (real corpus; exact-lookup + source honesty assertions).

### Notes
- The Next.js app is **not deployed** — static site stays the live artifact on Workers until CI (GitHub Actions) deploys it with `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` secrets; OpenNext×Windows still cannot build.
- Supabase stays **read-only** — auth/RLS are code-complete, not activated (needs owner: dashboard write access + `0001→0013` in SQL editor + MFA enrollment).
- UI bundle grew: auth flows require `NEXT_PUBLIC_SUPABASE_*` to function; pages render without them but auth actions will fail until configured.

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
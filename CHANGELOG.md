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

## [0.3.0] - 2026-11-12 — GENESIS: Evidence-Based Assistant

### Added
- **Unified retrieval**: `lib/ai-assistant/retrieval.ts` now merges `data/legal-index.json` with the 9 structured laws (127 articles) at load time. Family, commercial, labour and both procedure codes are reachable by `/api/ai` for the first time.
- **Relevance gating**: IDF-weighted coverage (`MIN_COVERAGE = 0.4`) + subject anchor (rarest question term must match, or coverage ≥ 0.55). A single generic word can no longer retrieve an unrelated law.
- **Arabic morphology**: clitic stripping (`بالاستئناف` → `استئناف`, `وشروطها` → `شروطها`), suffix reduction, and a small documented retrieval-synonym map (`طلاق↔تطليق`, `مدة↔أجل`).
- **Procedural answers**: `lib/ai-assistant/procedures.ts` (`matchProcedure`) returns real steps + documents from `data/legal-services.ts` when no article matches (certainty `low`, labelled unreviewed).
- **Honest limits answer**: no more dead-end; `insufficient_sources` states what is missing and suggests reformulation.
- **Scripts**: `scripts/clean-legal-index.mjs` (report by default, `--fix` rewrites) and `scripts/fix-arabic-contamination.mjs` (documented word map, Arabic-context only).
- **Docs**: `GENESIS/00–05`, `ENGINE/*`, `DOCUMENTS/*`, `LEGAL/*`, `SECURITY/SECURITY_AUDIT.md`, `TESTING/*`, `RELEASE/RELEASE_READINESS.md`.

### Changed
- `data/legal-sources.ts`: 13 → 18 sources (5 structured codes appended, `file: ""`).
- `app/[locale]/legal/[slug]/page.tsx`: skips `fs.readFileSync` for structured documents (no crash on empty `file`).
- `app/api/ai/route.ts`: certainty derives from `retrievalQuality`; RAG-only answers capped at `medium`; citation check runs on LLM output only.
- `components/AIChat.tsx`: empty-references message is procedure-aware.
- `lib/legal-data/*.ts`: 249 English artifacts repaired inside Arabic text (`from→من`, `between→بين`, `in→في`, `during→خلال`, …). All articles remain `verified:false`.

### Fixed
- `app/[locale]/layout.tsx`: skip link text (`Patton` → `تخطي إلى المحتوى الرئيسي`).
- `data/legal-index.json`: 733 → 732 chunks, control characters removed, 493,900 → 435,547 bytes.
- False `إحالات غير مؤكدة` warning for appeal-deadline questions.

### Verified
- `npm run typecheck` clean · `npm test` 20 files / 97 tests · `npm run build` OK (180 legal pages).
- Local API acceptance: divorce → `family-code` 94/97; complaint → 4-step procedure; appeal → `civil-procedure` 130/134 (`ثلاثون يومًا`); labour → `labor-code` 13.

### Not done
- No deploy (awaiting explicit approval). No migrations, no DB/env changes.
- OCR/PDF pipeline still not implemented. 7 raw texts remain unindexed (extraction quality). Human legal review still required for `verified:true`.

## [0.2.0] - 2026-11-12 — Creative Upgrade + Security + Deploy

### Added
- **Supreme Justice Navigation**: `HeaderSupreme` + `MobileNavSupreme` + isolated `justice-*` CSS across 23+ pages (sticky, mega-menu, RTL, keyboard, ARIA).
- **FloatingAI widget**: small dismissible button (bottom-left) → compact panel (max 70vh) with close (X).
- **Error reporting**: `0014_error_reports.sql` + `POST /api/reports/error` (rate-limited 5/min, insert-only) + `ReportErrorForm`.
- **Deadline engine v2**: pure UTC engine, 5 rules (all `verified:false`), religious holidays manual.
- **Error boundaries**: `app/[locale]/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx`.
- **Structured legal data**: `lib/legal-data/` (9 laws, ~110 articles, all `verified:false`), `LegalArticleView`/`LegalTreeView`/`SourceCard`, `/legal/[slug]` structured render + raw fallback.
- **Front codes**: lamp `LoginForm`, `HangingCard`, `DownloadButton`, `GlobalLoader`, `AIToolsSection` merged into live platform.
- **Public pages**: `mushkilati.html` (6 worlds × 10 problems + 4 tools), `profile/` kit, `assets/navigation.js|css`.
- **DB completion**: 33/33 tables live (0003, 0004, 0006–0012, 0014, 0015, 0016). Workspace RLS recursion fixed (`SECURITY DEFINER` helpers). Mojibake seeds repaired (CP1256 → UTF-8).
- **Docs**: `docs/DB_STATE.md`, `docs/DEPLOY_NOTES.md`, `supabase/apply/` (bundle + helpers).
- **Deploy safety**: CI smoke-check step (verifies canonical site serves new build); `scripts/deploy.ps1` (one-command local deploy with VC++ runtime workaround).
- **Dark mode**: full token overrides (navy, gold, danger, success, teal, …) + smooth transitions + no-FOUC inline script.
- **A11y**: touch targets ≥44px (theme toggle, search, nav triggers, mobile tabs, drawer links, palette input). Lighthouse: a11y 96%, best-practices 100%, SEO 100%.
- **Layout**: `overflow-x: hidden` (no horizontal scroll), inline-style backgrounds.

### Changed
- Login removed: 7 auth pages → `redirect("/")`; `AuthButton` dropped from headers; forms/API/migrations preserved.
- `HeaderSupreme` + `MobileNavSupreme`: `AuthButton` removed.
- `eslint.config.mjs`: ignore `.open-next/**`.
- `app/[locale]/layout.tsx`: root layout split (`app/layout.tsx` + `HtmlLangDir` client component) to fix Next.js 16 dev-server `not-found.tsx` issue.

### Security
- CSP: `object-src 'none'`, `upgrade-insecure-requests`. Rate limits: 30/min templates, 20/min admin queue, 5/min error reports.
- `docs/SECURITY_REVIEW_27.md` (24/27 ✅).
- Login removal: no public auth path remains (MFA dropped).

### Deployment
- Live (correct account): `https://aadala-ma.cheraimmohamed20.workers.dev` (Version ID `7f876f93…`).
- CI deploys gated: `DEPLOY_ENABLED=false` (secrets point to wrong account `chriimmohamed`). Flip to `true` after issuing a Workers API token for `cheraimmohamed20`.
- Local deploy: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts\deploy.ps1`.

### Known limitations
- 9 laws + 5 deadline rules unverified (`verified:false`); 4 laws still raw fallback.
- Jurisprudence corpus empty by design.
- Backup/restore untested end-to-end.
- dev-chain: 14 vulnerabilities (dev-only; production audit clean).
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
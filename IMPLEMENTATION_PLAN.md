# AADALA.MA — Implementation Plan

## Phase 0 — Discovery (done)
- Inspected environment: Node v24.20.0, npm 11.19.0, git 2.55.0. No gh/wrangler installed.
- Working directory contains unrelated CHRVVIM Campus project; AADALA.MA isolated in `aadala-ma/` subfolder to avoid mixing.
- Scaffolded Next.js 16.4.5 (App Router, TS, Tailwind v4, ESLint). Turbopack unavailable on win32/x64; build uses Webpack.

## Phase 1 — Architecture (done)
- Modular monolith, src/ modules, App Router locale segment for 10 locales.
- PostgreSQL planned; documented schema in PROJECT_SPEC.md §9. Local dev uses in-memory/mock data labeled as mock.

## Phase 2 — Foundation (done)
- Next.js 16.4.5, TypeScript, Tailwind v4, ESLint, Vitest, proxy-based i18n routing.
- Build (webpack), lint, typecheck, tests pass.

## Phase 3 — Platform UI (partial)
- Home + all module routes created; incomplete features marked "قيد التطوير".
- Header/Footer, language labels. RTL/LTR via html dir.
- Modular monolith, src/ modules, App Router locale segment.
- PostgreSQL planned; using documented schema + migrations later. Local dev uses in-memory/mock data labeled as mock.

## Phases 2-12 — see PROJECT_SPEC.md ordering.
- Foundation, design system, i18n (10 langs, ar first), public pages, auth, admin, DB, legal knowledge, search, AI/RAG, case law, inheritance engine, property, criminal lab, procedures, sharia, academic, updates, founder, PDF, hardening, tests, GitHub/CF.

## Risks
- No Cloudflare/GitHub CLIs; auth steps deferred to user.
- No real legal data; mock/demo data clearly labeled.
- Turbopack unavailable; webpack builds slower but functional.

## Decisions
- See DECISIONS.md.
# AADALA.MA — Development Roadmap

## Phase 0 — Discovery (DONE)
- Environment inspection, PROJECT_SPEC.md review, IMPLEMENTATION_PLAN.md, DECISIONS.md.

## Phase 1 — Foundation (DONE)
- Next.js 16, TypeScript, Tailwind v4, ESLint, Vitest, proxy routing, 10 locales.

## Phase 2 — Platform UI (DONE)
- All pages/routes created, design system (teal/brass), RTL, Mobile-first.

## Phase 3 — Identity & Admin (PENDING)
- Auth (NextAuth/Supabase Auth), RBAC, admin CRUD, audit persistence.

## Phase 4 — Legal Knowledge (PARTIAL)
- 7 PDF sources integrated. Need: more sources, article parsing, versioning, search (FTS).

## Phase 5 — AI & RAG (PARTIAL)
- Retrieval (TF-IDF) + provider adapter. Need: embedding/vector search, citation verification, AI provider key.

## Phase 6 — Specialized Tools (PARTIAL)
- MIYAR (experimental), Real Estate (preliminary), Criminal Lab (educational), Legal Services (drafts).
- Need: expert review, more cases, PDF export.

## Phase 7 — Academic, Sharia & Updates (PENDING)
- Placeholder pages. Need: content, translations, legal monitoring.

## Phase 8 — Founder Profile (DONE)
- /founder page with verified info only.

## Phase 9 — Hardening (PARTIAL)
- Security audit done. Need: auth, rate limiting (Redis), file upload security, backups.

## Phase 10 — Testing (PARTIAL)
- Unit tests (25). Need: integration, E2E, a11y, mobile, RTL.

## Phase 11 — GitHub & Cloudflare (PARTIAL)
- GitHub ✅, CI ✅, Cloudflare auth ✅. Need: Secrets + deploy.

## Phase 12 — Launch (PENDING)
- Final checklist, monitoring, runbooks, maintenance docs.

## Priority Order (Next Steps)
1. Auth + RBAC (Phase 3) — critical for security.
2. Cloudflare deploy (Phase 11) — needs Secrets.
3. Supabase schema (Phase 4) — needs manual SQL.
4. AADALA AI provider (Phase 5) — needs API key.
5. More legal sources (Phase 4) — ongoing.
6. Expert review of MIYAR (Phase 6) — external.
7. E2E + a11y tests (Phase 10) — ongoing.
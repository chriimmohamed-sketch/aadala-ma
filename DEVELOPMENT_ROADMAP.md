# AADALA.MA — Development Roadmap

## Phase 2.1 — Premium Moroccan Legal Intelligence Re-theme (2026-11-13 — DONE for Next.js app, IN PROGRESS for static site)
- New Design Constitution in force (`docs/DESIGN_CONSTITUTION.md`): كحلي #263247 · عاجي #F7F5F0 · أبيض #FFFFFF · ذهبي مطفأ #B99A5B · أخضر مزرق #2D7778 · رمادي #5F6875 · أحمر #B94A48 (errors only).
- `app/globals.css` rebuilt on the new palette (same semantic variable names + `.aadala-shell` brand header/footer + `.aadala-logo-badge` circular logo clip + `.aadala-btn-teal`).
- Header: logo mark + grouped nav (5 primary + "المزيد" dropdown), mobile collapsible nav, real `messages.nav` keys, keyboard-accessible.
- Footer: 4-column layout (brand + المنصة + المصادر والمنهجية + الثقة والشركة), non-advisory disclaimer.
- `app/icon.jpg` = official AADALA.MA logo; favicon wired via Next convention.
- Static site (`assets/css/main.css`, `index.html` hero, `assets/js/app.js` renderHeader) — same palette to be applied in the re-theme commit; see IMPLEMENTATION_STATUS.md.

## Phase 11 — GitHub & Cloudflare (PARTIAL → unblocked)
- GitHub: master updated 2026-11-13.
- Live site was **down**: Worker `aadala-ma` did not exist (code 10007); all routes returned 404.
- Assets-mode deploy path validated on Windows: `wrangler deploy --dry-run` completes; OpenNext auto-detection bypassed by temporarily renaming `open-next.config.ts` (restored automatically), because OpenNext×Windows is unsupported.
- `.assetsignore` fixed to exclude `.next`, source dirs, docs, SQL, and root tool configs.
- Static site redeploy via wrangler (assets only, no OpenNext) — outcome recorded in IMPLEMENTATION_STATUS.md.

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

## Phase 11 — GitHub & Cloudflare (see update above)
- Assets-mode deploy unblocked; Worker recreated from repo root. Remaining: link aadala.ma (owner).

## Phase 12 — Launch (PENDING)
- Final checklist, monitoring, runbooks, maintenance docs.
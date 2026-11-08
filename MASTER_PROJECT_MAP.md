# AADALA.MA — Master Project Map

## 1. Overview
- Name: AADALA.MA — منصة العدالة والذكاء القانوني المغربي
- Tagline: القانون مفهوم، والحق معلوم.
- Stack: Next.js 16 + React 19 + TypeScript + Tailwind v4 (+ `@supabase/ssr`)
- Hosting (dual):
  - **Full-stack:** Cloudflare Workers via OpenNext (`https://aadala-ma.cheraimmohamed20.workers.dev`)
  - **Static:** GitHub Pages legacy (`https://chriimmohamed-sketch.github.io/aadala-ma/`, branch `main` `/`)
- DB: Supabase/PostgreSQL (schema: `supabase/schema.sql` + migrations `0001_init.sql`, `0002_auth_rls.sql`)
- Auth: Supabase Auth (email/password) + PostgreSQL/RLS(`profiles`/`audit_logs`), anon key only in client
- AI: RAG retrieval (keyword/TF-IDF) + provider adapter (server-side key), anti-hallucination

## 2. Module Map
| Module | Path | Status |
|---|---|---|
| Home | app/[locale]/page.tsx | ✅ Implemented |
| Legal Encyclopedia | app/[locale]/legal/page.tsx + [slug] | ✅ (7 PDF sources) |
| Search | app/[locale]/search/page.tsx | ✅ (retrieveWithRefs) |
| AADALA AI | app/[locale]/ai/page.tsx + api/ai | ✅ (retrieval-only without provider key) |
| MIYAR | app/[locale]/miyar/page.tsx + MiyarEngine | ✅ (experimental) |
| Real Estate | app/[locale]/property/page.tsx + RealEstateAnalyzer | ✅ (preliminary) |
| Jurisprudence | app/[locale]/case-law/page.tsx | ⚠️ Empty (no verified decisions) |
| Legal Services | app/[locale]/procedures/page.tsx + LegalServices | ✅ (procedures + drafts) |
| Criminal Lab | app/[locale]/criminal/page.tsx + CriminalLab | ✅ (educational) |
| Student/Researcher | app/[locale]/student/page.tsx | ⚠️ Placeholder |
| Founder | app/[locale]/founder/page.tsx | ✅ (from PROJECT_SPEC) |
| Dashboard | app/[locale]/dashboard/page.tsx + LegalDashboard | ✅ (KPIs, mock counts) |
| Auth (Login/Register) | app/[locale]/login, app/[locale]/register | ✅ (Supabase Auth, server-verified) |
| Admin/Control Center | app/[locale]/admin/page.tsx | ✅ Gate (Supabase session + `profiles.role='admin'` server-enforced); UI skeleton |
| Sharia | app/[locale]/sharia/page.tsx | ⚠️ Placeholder |
| Academic | app/[locale]/academic/page.tsx | ⚠️ Placeholder |
| Updates | app/[locale]/updates/page.tsx | ⚠️ Placeholder |
| Legal Aid | app/[locale]/legal-aid/page.tsx | ⚠️ Placeholder |
| Static gateway | index.html + `*.html` + `assets/` | ✅ GitHub Pages (self-contained index) |

## 3. Core Libraries
- `lib/i18n/` — 10 locales, RTL/LTR
- `lib/ai-assistant/` — retrieval, provider, types
- `lib/miyar/` — inheritance engine (experimental)
- `lib/inheritance/` — legacy inheritance engine
- `lib/real-estate/` — property conflict analyzer
- `lib/criminal-lab/` — criminal analysis (educational)
- `lib/legal-services/` — procedures + drafts
- `lib/jurisprudence/` — search (empty data)
- `lib/legal-knowledge/` — types (aligned with DB schema)
- `lib/admin/` — permissions (server RBAC), audit (in-memory + `audit_logs`)
- `lib/security/` — rate-limit
- `lib/supabase/` — `client` (browser) / `server` (cookies) / `auth.server` (`getSessionUser`) / `middleware` (`updateSession`)

## 4. Data
- `data/legal-sources.ts` — 7 PDF sources
- `data/legal-index.json` — 494KB indexed legal text
- `data/legal-quality.json` — quality metadata
- `data/criminal-lab.ts`, `data/jurisprudence.ts`, `data/legal-services.ts`
- `public/legal/*.txt` — extracted normalized text

## 5. Database (Supabase/PostgreSQL)
- Legal schema: `supabase/schema.sql` (8 tables: laws, sections, articles, legal_issues, issue_article_mapping, entities, entity_article_mapping, reference_answers) + FTS indexes (Arabic)
- Migrations: `supabase/migrations/0001_init.sql` (mirror), `0002_auth_rls.sql` (`profiles` + `audit_logs` + RLS + `handle_new_user()` trigger, role always `user`)
- Roles: `user`, `legal_editor`, `legal_reviewer`, `admin` (RLS)

## 6. Navigation
- Proxy: `proxy.ts` → `lib/supabase/middleware.ts` (`updateSession`: locale redirect + Supabase session gate for `/admin`, fail-closed 503)
- Header: nav links to all modules + `AuthButton` (login/logout via Supabase session)
- Footer: privacy, terms, disclaimer

## 7. API
- `app/api/ai/route.ts` — POST /api/ai (RAG, 8-part answer, rate-limited, anti-hallucination)

## 8. Testing
- Vitest: 33 tests (inheritance 3, miyar 15, retrieval 7, permissions 5, auth 3)
- `npm run quality:gate` — lint + typecheck + test + build
- Build: 264 pages

## 9. Deployment
- Vercel: deprecated
- Cloudflare Workers (OpenNext + wrangler.toml, CI workflow `deploy-cloudflare.yml`): ✅ Live (`workers.dev`)
- GitHub Pages (legacy branch `main` `/`): ✅ Live (static `index.html`); `public/` assets belong to Workers — Pages serves root `robots.txt`/`sitemap.xml` (Pages URL)
- Supabase: apply `0001` + `0002` in SQL Editor (project `pvoenvxinkipgpnddumt`)

## 10. Security
- No hardcoded secrets; anon key only in client, Service Role server-only
- Supabase session gate + server RBAC (`profiles.role`) in proxy + admin page (fail-closed)
- Rate limiting (best-effort in-memory)
- SECURITY_AUDIT.md documents risks

## 11. Design
- Teal/Brass identity (from AADALA.MA HTML reference)
- Zellige canvas, command palette, dark mode, RTL, Mobile-first
- globals.css: full design system

# AADALA.MA — Master Project Map

## 1. Overview
- Name: AADALA.MA — منصة العدالة والذكاء القانوني المغربي
- Tagline: القانون مفهوم، والحق معلوم.
- Stack: Next.js 16 + React 19 + TypeScript + Tailwind v4
- Hosting: Cloudflare Pages (OpenNext) — Vercel deprecated
- DB: Supabase/PostgreSQL (schema: supabase/schema.sql)
- AI: RAG retrieval (keyword/TF-IDF) + provider adapter

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
| Admin/Control Center | app/[locale]/admin/page.tsx | ⚠️ Skeleton (RBAC planned) |
| Sharia | app/[locale]/sharia/page.tsx | ⚠️ Placeholder |
| Academic | app/[locale]/academic/page.tsx | ⚠️ Placeholder |
| Updates | app/[locale]/updates/page.tsx | ⚠️ Placeholder |
| Legal Aid | app/[locale]/legal-aid/page.tsx | ⚠️ Placeholder |

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
- `lib/admin/` — permissions (RBAC), audit
- `lib/security/` — rate-limit
- `lib/supabase/` — client

## 4. Data
- `data/legal-sources.ts` — 7 PDF sources
- `data/legal-index.json` — 494KB indexed legal text
- `data/legal-quality.json` — quality metadata
- `data/criminal-lab.ts`, `data/jurisprudence.ts`, `data/legal-services.ts`
- `public/legal/*.txt` — extracted normalized text

## 5. Database (Supabase/PostgreSQL)
- Schema: `supabase/schema.sql` (8 tables: laws, sections, articles, legal_issues, issue_article_mapping, entities, entity_article_mapping, reference_answers)
- FTS index on articles (Arabic)
- Migration: `supabase/migrations/0001_init.sql`

## 6. Navigation
- Proxy: `proxy.ts` — locale redirect + admin gate (Basic Auth, fail-closed)
- Header: nav links to all modules
- Footer: privacy, terms, disclaimer

## 7. API
- `app/api/ai/route.ts` — POST /api/ai (RAG, 8-part answer, rate-limited, anti-hallucination)

## 8. Testing
- Vitest: 25 tests (inheritance 3, miyar 15, retrieval 7)
- `npm run quality:gate` — lint + typecheck + test + build

## 9. Deployment
- Vercel: deprecated (project deleted)
- Cloudflare: OpenNext + wrangler.toml, CI workflow (needs Secrets)
- Supabase: schema pending manual application

## 10. Security
- No hardcoded secrets
- Admin gate (Basic Auth, fail-closed) in proxy
- Rate limiting (best-effort in-memory)
- SECURITY_AUDIT.md documents risks

## 11. Design
- Teal/Brass identity (from AADALA.MA HTML reference)
- Zellige canvas, command palette, dark mode, RTL, Mobile-first
- globals.css: full design system (292 lines)
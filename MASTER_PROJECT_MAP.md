- Stack: Next.js 16 + React 19 + TypeScript + Tailwind v4 (+ `@supabase/ssr`)
- Hosting (dual):
  - **Full-stack:** Cloudflare Workers via OpenNext (`https://aadala-ma.cheraimmohamed20.workers.dev`)
  - **Static:** GitHub Pages legacy (`https://chriimmohamed-sketch.github.io/aadala-ma/`, branch `main` `/`)
- DB: Supabase/PostgreSQL (schema: `supabase/schema.sql` + migrations `0001_init.sql`, `0002_auth_rls.sql`)
- Auth: Supabase Auth (email/password) + PostgreSQL/RLS(`profiles`/`audit_logs`), anon key only in client
- AI: RAG retrieval (keyword/TF-IDF) + provider adapter (server-side key), anti-hallucination


## 2026-11-13 — Interleaved merge (this branch, `integrate/aadala-refresh`)
The lineage of `design/aadala-refresh` (Supreme navigation, FloatingAI, structured `lib/legal-data/` registry, rate-limited admin endpoints, RLS recursion fix `0015`, mojibake seed repair `0016`, DB state doc `docs/DB_STATE.md`) is merged into this repository with the Next.js app + static site + deploy config + golden set.
Key artifacts added in this merge: `components/layout/HeaderSupreme.tsx`, `components/layout/MobileNavSupreme`, `components/FloatingAI.tsx`, `components/AnswerAnimator.tsx`, `components/CitationActions.tsx`, `components/LegalArticle.tsx`, `components/SourceCard.tsx`, `lib/legal-data/{types,obligations,real-rights,tahfidh,penal,civil-procedure,commercial,criminal-procedure,family,labor,index}.ts`, `supabase/migrations/0014–0016`, `public/mushkilati.html`, `public/profile/`.

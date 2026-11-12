# AADALA.MA — منصة العدالة والذكاء القانوني المغربي

## Overview

AADALA.MA is an independent Moroccan legal intelligence platform designed to make legal knowledge accessible, understandable, and actionable. It provides:

- **Legal AI Assistant** — Structured legal analysis with source references
- **Legal Encyclopedia** — Moroccan legislation organized by domain
- **Inheritance Calculator (MIYAR)** — Islamic inheritance (Mawarith) computation
- **Real Estate & Property Rights** — Tools and explanations
- **Criminal Analysis** — Educational legal analysis
- **Procedures & Documents** — Guides, templates, PDF export
- **Sharia & Fiqh** — Islamic jurisprudence (separate section)
- **Academic Space** — Articles, glossary, case law
- **Founder Profile** — `/founder`

## Status

**Current version: 0.2.0 (Creative Upgrade + Security + Deploy)**

Next.js 16 app is live on Cloudflare Workers (correct account). A static `index.html` gateway is live on GitHub Pages. All core modules shipped; unverified content is badged (`قيد المراجعة` / `قيد التجهيز`). See `CHANGELOG.md`, `IMPLEMENTATION_STATUS.md`, and `docs/DEPLOY_NOTES.md`.

### Highlights
- Supreme Justice Navigation + FloatingAI widget + 23+ pages
- Dark mode (full token overrides, smooth transitions, no-FOUC)
- Security: CSP, rate limits, error reporting, 24/27 audit
- DB: 33/33 tables live (migrations 0003–0016)
- A11y: Lighthouse 96% (a11y), 100% (best-practices, SEO)
- Deploy: gated CI + one-command local deploy (`scripts/deploy.ps1`)

## Tech Stack (Current)

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (+ design tokens, RTL Arabic-first, 10 locales)
- Supabase Auth (email/password) + PostgreSQL/RLS (`profiles`, `audit_logs`)
- Cloudflare Workers via OpenNext + Wrangler (full-stack)
- GitHub Pages (static `index.html` + `*.html` pages)
- GitHub Actions CI (lint + typecheck + test + build)

## Live URLs

🌐 **App (full-stack): https://aadala-ma.cheraimmohamed20.workers.dev**
🌐 **Static (Pages): https://chriimmohamed-sketch.github.io/aadala-ma/**

Open `./index.html` in a modern browser for the static build. No build step required.

```bash
# Or serve with any static server:
npx serve .
```

## Project Structure

```
aadala-ma/
├── index.html              # Static gateway (standalone, self-contained)
├── *.html                  # Static pages: legal-ai, encyclopedia, inheritance, real-estate, criminal, procedures, fiqh, academic, founder, case-law, gazette, contact, privacy, terms, design-system
├── auth/                   # Deprecated static auth (redirects to Next.js /ar/login)
├── admin/dashboard.html    # Deprecated static admin (redirects; Next.js /ar/admin is canonical)
├── assets/
│   ├── css/main.css        # Static design system
│   └── js/                 # Shared logic (app, i18n, legal-content)
├── app/
│   ├── globals.css         # Next.js design tokens
│   ├── [locale]/           # 10 locales (ar first): home, legal, search, ai, miyar, property, case-law, procedures, criminal, sharia, academic, updates, student, founder, legal-aid, dashboard, login, register, admin
│   └── api/ai/route.ts     # AADALA AI (RAG, rate-limited)
├── components/             # AIChat, MiyarEngine, LegalDashboard, LegalServices, LoginForm, RegisterForm, AuthButton, ZelligeCanvas, ThemeToggle, layout/{Header,Footer}
├── lib/
│   ├── supabase/           # client/server/auth/middleware (anon key only)
│   ├── i18n/               # locales (10), RTL
│   ├── ai-assistant/       # retrieval (TF-IDF) + provider + types
│   ├── miyar/ + inheritance/ # inheritance engines + fractions
│   ├── real-estate/ criminal-lab/ legal-services/ jurisprudence/
│   ├── legal-knowledge/    # legal types (DB-aligned)
│   ├── admin/              # permissions (server RBAC) + audit
│   └── security/           # rate-limit
├── data/                   # legal-sources, legal-index, legal-quality, ...
├── messages/               # 10 locale JSON (ar canonical)
├── public/
│   ├── robots.txt          # Workers robots (workers.dev)
│   ├── sitemap.xml         # Workers sitemap
│   └── legal/*.txt         # Extracted legal texts (7 sources)
├── supabase/
│   ├── schema.sql          # Legal schema (8 tables, FTS)
│   └── migrations/         # 0001_init.sql, 0002_auth_rls.sql (profiles/audit_logs + RLS)
├── worker/                 # Legacy Worker stub (not the production path)
├── .github/workflows/      # CI + deploy-cloudflare
├── wrangler.toml           # Cloudflare Workers (OpenNext)
├── next.config.ts postcss.config.mjs
├── .env.example            # Env template (no secrets)
└── docs/
    ├── AUTH_SUPABASE.md
    ├── DEPLOYMENT.md ADMIN_GUIDE.md USER_GUIDE.md BACKUP_RESTORE.md
```

## Security

- No secrets in code; `.env*` gitignored (only `.env.example` committed)
- Supabase Auth: anon key in client bundle only; **no Service Role Key in frontend**
- Roles (`user`/`legal_editor`/`legal_reviewer`/`admin`) enforced server-side via `profiles` + RLS (never from localStorage)
- `/ar/admin` fail-closed (503 without Supabase env; 403 for non-admin)
- Rate limiting on `/api/ai` (8 req/60s/IP, in-memory)
- Audit trail: `audit_logs` (append-only, admin-readable)

## Legal Disclaimer

AADALA.MA is an independent platform. It is NOT affiliated with the Moroccan Ministry of Justice or any official institution. Information provided is for educational purposes and does not constitute legal advice. Always consult a qualified Moroccan lawyer.

## Founder

MOHAMED CHRAIM — محمد شرايم
Student, Faculty of Legal, Economic and Social Sciences, Ibn Zohr University, Agadir.
Law — Private Law / Criminal Sciences.

## License

TBD — to be determined before public release.

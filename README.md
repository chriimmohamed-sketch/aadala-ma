# AADALA.MA — منصة العدالة والذكاء القانوني المغربي

## Overview

AADALA.MA is an independent Moroccan legal intelligence platform designed to make legal knowledge accessible, understandable, and actionable. It provides:

- **Legal AI Assistant** — Structured legal analysis with source references
- **Legal Encyclopedia** — Moroccan legislation organized by domain
- **Inheritance Calculator** — Islamic inheritance (Mawarith) computation
- **Real Estate & Property Rights** — Tools and explanations
- **Criminal Analysis** — Educational legal analysis
- **Procedures & Documents** — Guides, templates, PDF export
- **Sharia & Fiqh** — Islamic jurisprudence (separate section)
- **Academic Space** — Articles, glossary, case law
- **Founder Profile** — `/founder`

## Status

**Current version: 0.2.0 (Prototype / Demo)**

This is a static-first prototype. Several features are in demo mode and clearly labeled. See `IMPLEMENTATION_PLAN.md` and `DECISIONS.md` for details.

Uploaded legal PDFs now power real, article-level pages:

- `database.html` — sources catalogue with live Supabase sync, per-document extracted article counts.
- `document.html?doc=<slug>` — machine-extracted Moroccan legal articles (search, deep links, page/confidence badges, **unverified** label).

The repository also contains the full Next.js App Router application source (from the `AADALA.MA_FULLSTACK` snapshot) for development and a future app experience under `app/[locale]/**`. The deployed site remains the static build until the app is built and deployed.

## Tech Stack (Current)

- HTML5 + CSS3 (RTL Arabic-first)
- Vanilla JavaScript
- Tailwind CSS (via CDN)
- localStorage (demo data)

## Planned Tech Stack (Production)

- Next.js + React + TypeScript
- Tailwind CSS + design tokens
- PostgreSQL + pgvector
- Cloudflare Workers/OpenNext
- GitHub Actions CI/CD

## Live URL

🌐 **https://aadala-ma.cheraimmohamed20.workers.dev**

Deployed on Cloudflare Workers (Pages). All pages and assets are live.

Simply open `index.html` in a modern browser. No build step required.

```bash
# Or serve with any static server:
npx serve .
```

## Project Structure

```
aadala-ma/
├── index.html              # Homepage
├── legal-ai.html           # Legal AI Assistant
├── encyclopedia.html       # Legal Encyclopedia
├── inheritance.html        # Inheritance Calculator
├── real-estate.html        # Real Estate & Property
├── criminal.html           # Criminal Analysis
├── procedures.html         # Procedures & Documents
├── fiqh.html               # Sharia & Fiqh
├── academic.html           # Academic Space
├── founder.html            # Founder Profile
├── database.html           # Sources catalogue (live Supabase sync)
├── document.html           # Browser for machine-extracted articles
├── data/
│   ├── legal-sources/      # Uploaded PDFs + extracted JSON
│   └── build_articles.py   # Extraction pipeline (pypdf / Windows OCR)
├── app/                    # Next.js App Router source (locale routes)
├── auth/
│   ├── login.html          # Login
│   └── register.html       # Register
├── admin/
│   └── dashboard.html      # Admin Dashboard
├── assets/
│   ├── css/main.css        # Design system
│   └── js/app.js           # Shared logic
├── .env.example            # Environment template
├── .gitignore
├── IMPLEMENTATION_PLAN.md
├── DECISIONS.md
└── README.md
```

## Security

- No secrets in code
- `.env` in `.gitignore`
- Passwords hashed (in production backend)
- Input validation
- Rate limiting (production)
- Audit logs

## Legal Disclaimer

AADALA.MA is an independent platform. It is NOT affiliated with the Moroccan Ministry of Justice or any official institution. Information provided is for educational purposes and does not constitute legal advice. Always consult a qualified Moroccan lawyer.

## Founder

MOHAMED CHRAIM — محمد شرايم
Student, Faculty of Legal, Economic and Social Sciences, Ibn Zohr University, Agadir.
Law — Private Law / Criminal Sciences.

## License

TBD — to be determined before public release.

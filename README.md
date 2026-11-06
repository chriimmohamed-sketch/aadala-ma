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

**Current version: 0.1.0 (Prototype / Demo)**

This is a static-first prototype. Several features are in demo mode and clearly labeled. See `IMPLEMENTATION_PLAN.md` and `DECISIONS.md` for details.

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

## Running Locally

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

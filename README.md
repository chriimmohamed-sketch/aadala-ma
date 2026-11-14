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

Next.js 16 app is live on Cloudflare Workers (OpenNext). A static `index.html` gateway is live on GitHub Pages. All core modules shipped; unverified content is badged («قيد المراجعة» / «تجريبي»). See `CHANGELOG.md`, `IMPLEMENTATION_STATUS.md`, and `docs/DEPLOY_NOTES.md`.

### Highlights
- Supreme Justice Navigation + FloatingAI widget + 23+ pages
- Dark mode (full token overrides, smooth transitions, no-FOUC)
- Security: CSP, rate limits, error reporting, 24/27 audit
- DB: 33/33 tables live (migrations 0003–0016)
- A11y: Lighthouse 96% (a11y), 100% (best-practices, SEO)
- Deploy: gated CI + one-command local deploy (`scripts/deploy.ps1`)

## Supreme Justice Navigation + aadala-refresh (merged 2026-11-13)
This branch (`integrate/aadala-refresh`) carries both upstream lineages merged without deletions:
- `main`: institutions page, Profile (`/profile/`), report-error flow, animated UI kit (`AnswerAnimator`, `FloatingAI`), `data/institutions.json`, `data/jurisprudence.json`, deploy Dockerfile, `docs/portfolio-guide/`.
- `design/aadala-refresh`: **Supreme Justice Navigation** (`HeaderSupreme`/`MobileNavSupreme`), FloatingAI, structured **legal data registry** (`lib/legal-data/`), `/ar/report` + `POST /api/reports/error`, `mushkilati.html` («مشكلتي»), rate-limited admin ingest + document templates APIs, migrations `0014–0016`, `docs/DB_STATE.md`.
- This repository: real corpus `data/legal-index.json`, AI golden set v2 (`docs/GOLDEN_SET.md`), design constitution (`docs/DESIGN_CONSTITUTION.md`), admin 2FA runbook (`docs/ADMIN_GUIDE.md` §2FA), OpenNext deploy config (`wrangler.jsonc`), al-ilm page.

**Live sites:** `https://aadala-ma.cheraimmohamed20.workers.dev` (Workers, Next.js app) · `https://chriimmohamed-sketch.github.io/aadala-ma/` (GitHub Pages static gateway) · `https://aadala.ma` (custom domain, not yet linked).
See `docs/DB_STATE.md` for the current database state and `docs/ADMIN_GUIDE.md` for admin 2FA requirements.

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

**Current version: 0.2.0 (Prototype / Demo)**


## Supreme Justice Navigation (merged 2026-11-13)
This branch (`integrate/aadala-refresh`) also carries the `design/aadala-refresh` work: the **Supreme Justice Navigation** (`HeaderSupreme`/`MobileNavSupreme`), **FloatingAI** chat widget, structured **legal data registry** (`lib/legal-data/`), report-error page (`/ar/report`), **Profile** (`/profile/`), **مشكلتي** (`/mushkilati.html`), rate-limited admin ingest + document templates APIs, migrations `0014–0016`, and a consolidated deploy pipeline (`wrangler.jsonc` → OpenNext on Workers).
See `docs/DB_STATE.md` for the current database state and `docs/ADMIN_GUIDE.md` for admin 2FA requirements.


# DESIGN_AUDIT.md — AADALA.MA

## Date
2026-11-12

## Scope
Audit of the current static prototype in `aadala-ma/` against the **Grand Redesign Mandate** (`AADALA_MA_GRAND_REDESIGN_ULTIMATE.html`) and master requirements.

## Repository & stack (actual)
- **Type:** Static-first prototype (HTML/CSS/Vanilla JS) deployed to Cloudflare Workers (`wrangler`).
- **Framework files present but not actively used for runtime:** `package.json` includes Next.js/React/TypeScript/OpenNext deps; `src/`, `next.config.ts`, `tsconfig.json` exist but primary live experience is static HTML pages.
- **Styling:** `assets/css/main.css` (design tokens, RTL, components) + Tailwind CDN in pages.
- **State:** `localStorage` for auth/demo data/i18n preference/audit logs.
- **Data:** `assets/js/legal-content.js` (16 verified-reference entries, metadata-level), `assets/js/app.js` (mock LegalAI, demo inheritance, encyclopedia categories).

## Implemented / working (prototype level)
- 21 HTML pages: home, legal-ai, encyclopedia, gazette, case-law, inheritance, real-estate, criminal, procedures, fiqh, academic, founder, auth (login/register), admin dashboard, legal-aid, design-system, privacy, terms, contact, 404.
- Shared header/footer rendering, theme toggle, basic auth UI state (demo).
- i18n foundation: 10 language definitions (ar, zgh, fr, en, es, de, fa, tr, nl, it), RTL/LTR handling, selector in header, Arabic/French/English dictionaries (partial), fallback to Arabic.
- Design tokens updated toward "Architecture of Justice" palette in CSS variables.
- Cloudflare deployment configured (`wrangler`); GitHub repo and CI workflow present.

## Partial / mock / not production-ready
- **Legal AI:** template/mock responses, no RAG, no vector DB, no real citations retrieval, no document upload pipeline.
- **Search:** hero/category search routes to encyclopedia query params; no indexed full-text engine.
- **Gazette archive:** UI scaffold and status fields only; no real ingestion, no PDF/OCR pipeline, no verified complete coverage.
- **Case law:** UI scaffold; no verified decision database.
- **Inheritance engine:** simplified demo equal-split placeholder logic; not legally validated (no proper fara'id, awl, radd, hajb).
- **Auth/RBAC:** `localStorage` demo; no secure backend sessions, no real password hashing/verification server-side, no protected APIs.
- **Admin:** demo dashboard/logs in local storage; no real review/publish workflow.
- **Documents/PDF:** no real template engine or tested export pipeline.
- **Legal radar/knowledge graph:** static/preview placeholders; no live monitoring or verified relationships.
- **Multilingual content:** interface strings partially translated (ar/fr/en); 7 languages structural placeholders; no page-content translation workflow, no reviewed legal translations.

## Key defects fixed in this pass
- Corrupted "gazette / الجريدة الرسمية" labels in JS/HTML/data (`burglary` artifacts) corrected.
- Broken script tag sequence in `index.html` fixed.
- Homepage hero and key sections redesigned toward mandate (clearer headline, trust notes, pathways, radar transparency, knowledge-graph placeholder labeled as non-fake).

## Visual/UX gaps vs mandate (remaining)
- No custom logo/brand assets suite (SVG lockups, favicon set, OG image) beyond text/icon placeholder.
- Navigation is functional but not a full grouped mega-menu/mobile system as specified.
- Module pages still largely scaffold-level; need task-specific layouts per mandate (document viewer, timelines, citation panels, etc.).
- Knowledge graph is illustrative placeholder, not data-driven.
- Search modes shown as chips but not backed by distinct search pipelines.
- Accessibility, performance, and automated test coverage not fully audited/implemented.
- Dark theme improved via tokens but not fully validated across all components.

## Risks & constraints
- **Legal accuracy:** any computed or AI-generated legal output must remain clearly labeled and non-authoritative until validated.
- **Data provenance:** no automated ingestion from official sources; coverage claims must remain conservative.
- **Security/privacy:** demo auth/storage unsuitable for production; secrets must never be committed; any future backend must meet 09-08/CNDP considerations.
- **Architecture:** migrating to full Next.js+DB+RAG is a larger effort than static patching; should be staged.

## Prioritized next steps
1. **Content integrity:** curate verified texts with source metadata, dates, and status from official sources (e.g. sgg.gov.ma) and surface provenance in UI.
2. **Real search/index:** introduce structured data and client/server search (or static index) with transparent scope.
3. **Inheritance engine:** implement deterministic, explainable fara'id rules with test cases and expert review gate.
4. **Legal AI (grounded):** add RAG pipeline with chunking, metadata, citations, and refusal/uncertainty behavior.
5. **Auth/backend:** move from localStorage to secure backend (sessions, RBAC, audit), with env-managed secrets.
6. **UX systemization:** build reusable components, responsive nav, accessibility pass, and `/design-system` as living reference.
7. **i18n completion:** translation workflow, reviewed content, per-language publishing controls.
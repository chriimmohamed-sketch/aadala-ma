# IMPLEMENTATION_STATUS.md — AADALA.MA

## Snapshot
- **Date:** 2026-11-13
- **Version:** 0.1.x prototype (static-first)
- **Live:** https://aadala-ma.cheraimmohamed20.workers.dev
- **Repo:** https://github.com/chriimmohamed-sketch/aadala-ma (branch `master`)

## Status legend
- ✅ Implemented (prototype/demo)
- 🟡 Partial / scaffold
- ⛔ Not implemented / planned

## Pages & modules
| Area | Status | Notes |
|---|---:|---|
| Homepage | ✅/🟡 | Redesigned hero/sections per mandate direction; trust/radar/graph labeled transparently; search not fully indexed |
| Navigation/Header/Footer | ✅/🟡 | Shared render, theme toggle, lang selector, auth UI (demo); needs grouped mega-menu/mobile refinement |
| Legal AI | 🟡 | Mock/template responses with structured sections; no RAG, no real retrieval/citations |
| Encyclopedia | 🟡 | 16 reference entries + categories; browse/search params basic; no full-text corpus/versioning |
| Gazette (الجريدة الرسمية) | 🟡/✅ | Renders indexed issues from the database (currently 1: BO 7437, metadata only); no OCR/full archive yet |
| Case Law (الاجتهاد القضائي) | 🟡 | Scaffold UI and filters; no verified decisions dataset |
| Inheritance | 🟡 | Demo calculator (simplified); requires deterministic fara'id logic + expert validation |
| Real Estate / Criminal / Procedures / Fiqh / Academic | 🟡 | Informational scaffolds and entry points |
| Legal Aid | 🟡 | Guidance structure; no official eligibility determination or verified workflows |
| Founder | ✅/🟡 | Static profile page (verify details before publishing claims) |
| Auth (login/register) | 🟡 | localStorage demo only; no secure backend |
| Admin dashboard | 🟡 | Demo views/logs in localStorage; no real RBAC/publish workflow |
| Design System page | 🟡 | Token/component showcase (basic) |
| Privacy/Terms/Contact/404 | ✅ | Static pages present |

## Cross-cutting
| Capability | Status | Notes |
|---|---:|---|
| Arabic-first RTL | ✅ | Default ar/RTL; logical direction mostly via document dir |
| i18n architecture | 🟡 | 10 langs defined, selector, ar/fr/en strings partial, others fallback placeholders |
| Theme (light/dark) | ✅/🟡 | Token-based; needs full component QA |
| Data provenance labels | 🟡 | Some disclaimers present; needs consistent per-item source/status metadata |
| Security & privacy | 🟡 | No committed secrets intended; demo storage/auth not production-grade; 09-08/CNDP needs review |
| Testing | ⛔/🟡 | No comprehensive automated test run documented in this pass; CI workflow exists |
| Accessibility (WCAG 2.2 AA target) | 🟡 | Not fully audited |
| Performance/SEO | 🟡 | Basic meta; needs audit |
| Deployment | ✅ | Cloudflare Workers deploy works; GitHub pushes working |

## Recent changes (this pass)
- Fixed corrupted Gazette labels across app/i18n/data/pages.
- Fixed `index.html` script loading order/markup.
- Redesigned homepage hero and added mandate-aligned sections (trust notes, radar transparency, knowledge placeholder, pathways).
- Added `DESIGN_AUDIT.md` and `IMPLEMENTATION_STATUS.md`.

## Honest limitations
- No real RAG/LLM integration, no verified full legal corpus, no OCR/digitization pipeline, no real case-law database.
- Inheritance results are **not** authoritative; complex cases require expert review.
- Features shown as placeholders/previews are explicitly non-operational unless implemented and tested.
- Multilingual coverage is incomplete; untranslated UI/content must fall back clearly (Arabic canonical).

## Next execution priorities
1. Verified legal data ingestion + provenance UI (Gazette/legislation/case law where permitted).
2. Deterministic inheritance engine with tests and explainability.
3. Backend auth/RBAC + database + secure document handling.
4. Grounded Legal AI (RAG, citations, uncertainty/refusal).
5. Componentized UI, accessibility pass, and full i18n workflow.

## Database (Supabase) — 2026-11-13

| Item | Status | Notes |
|---|---:|---|
| Supabase project wiring | ✅ | Project `pvoenvxinkipgpnddumt`; browser uses publishable key only |
| Public read client | ✅ | `assets/js/supabase-db.js`; local index renders first, live data upgrades it; graceful fallback |
| Sources database page | ✅ | `database.html` — search, category filter, connection status, per-document versions |
| Encyclopedia integration | ✅ | Category view merges Supabase documents + local fallback, shows origin badge |
| RLS policies (legal core) | ✅ | Applied 2026-11-13: public read for `reference`/`published`, admin-only writes via `is_admin()` |
| Seed 6 reference documents / 9 PDF files | ✅ | Applied 2026-11-13; all rows `reference` with `last_verified_at = NULL` |
| Article-level text (`legal_articles`) | ⛔ | Deliberately not seeded; requires verified extraction + human review |
| Auth / RBAC | ⛔ | Still localStorage demo; `is_admin()` policies prepared for future Supabase Auth |
| RAG / pgvector | ⛔ | Not implemented |

### Verified after applying (2026-11-13)
- `legal_documents` = 6، `legal_document_versions` = 9، `legal_sources` = 6، `legal_articles` = 0.
- REST عام بـ publishable key يُرجع 6 سجلات مع نسخها؛ صفحة `database.html` تعرض «متصل بقاعدة البيانات — 6 سجلات».
- Security advisor: لم تبقَ تحذيرات `rls_enabled_no_policy` على جداول القانون الأربعة.
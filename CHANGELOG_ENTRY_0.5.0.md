# 0.5.0 — 2026-11-16

## Added — Legal Intelligence (OMEGA Batch 1, zero-simulation)
- **72 / 72 official SGG documents** verified at Level A: `HEAD 200` +
  `application/pdf` + full download + `sha256` + text extraction.
  **2,258 PDF pages · 86.2 MB · 2,855,583 extracted characters.**
  Report: `docs/legal-intelligence/SGG_VERIFICATION_REPORT.md`.
- **Byte-identity proof.** `CONS-040` (39.08) was re-downloaded independently on
  2026-11-16 from the same official URL and produced the **identical**
  fingerprint `048d55bf7cc652ad`, the identical size (809,275 B), the identical
  page count (63) and the identical character count (57,313).
- **Article-level corpus, zero-missing:** 39.08 → **334/334**, 31.08 → **206/206**.
  `fontTools` installed to resolve CFF-font glyph corruption (U+FFFD); NFKC
  normalisation applied; three glyph-reversed article headers (157/240/282)
  matched via an extended pattern.
- `scripts/legal-pipeline/extract_pdf.py` · `chunk_articles.py` · `bm25_probe.py`
  · `verify_sgg.py` · `audit_articles.py`.
- `data/legal-sources/articles/39-08-code-droits-reels_verified.json` (334 articles)
  and `MDE_31-08_consumer_verified.json` (206 articles) — additive, alongside
  the pre-existing files.

## Added — Legal audit
- `scripts/legal-pipeline/audit_articles.py` verifies an article sample against
  the **original PDF**: per-page re-extraction, verbatim opening and closing
  clause on the claimed page span, and a bidirectional bleed check.
- **Result: 30/30 PASS** on a seeded random sample (seed 20261116) —
  15 articles per corpus. Details in
  `docs/legal-intelligence/ARTICLE_AUDIT_30.json`.

## Added — Legal status disclosure
- `components/LegalStatusNotice.tsx` — the single warning component, rendered on
  **14 pages**: `legal`, `legal/[slug]`, `knowledge`, `search`, `ai`,
  `case-law`, `student`, `sharia`, `academic`, `updates`, `legal-aid`,
  `property`, `criminal`, `procedures`.
- `LegalRecord.legalStatusVerified` / `legalStatusSource` — the registry now
  distinguishes *what the source PDF says about itself* from a verified legal
  status. Everything reads **«غير مُتحقَّق منها»** until checked against the
  Journal Officiel's effectiveness records. No text is claimed to be in force,
  amended or repealed.

## Added — Admin security (Supabase Auth + RLS)
- `app/[locale]/admin/page.tsx` rewritten: session check + RLS-scoped
  `profiles.role` read. The localStorage role is no longer consulted.
- `supabase/migrations/20261115_admin_rls.sql` — `profiles` table, RLS
  policies, an `is_admin()` helper, an auto-provision trigger, and
  admin-only policies on the legal content tables. **Ready to apply from the
  Supabase Dashboard** (the MCP connector is read-only).

## Added — Design system v3
- `design/tokens.json` is now the **single source of truth** (23 colours ×
  2 themes), regenerated into `app/globals.css` by
  `scripts/sync-design-tokens.mjs`.
- `app/design-v3.css` — the consolidation layer: role separation, one radius
  scale, one elevation scale, a fluid type scale, a motion budget, print styles.
- `scripts/audit-contrast.mjs` — WCAG verifier; exits 1 on any failure.
- **8 measured defects fixed** (see `docs/DESIGN_SYSTEM.md`): token drift,
  navy used as both ink and surface, six fragmented card families, border
  contrast at 1.48:1 / 1.30:1, eight never-ending animations, two undefined
  custom properties, white-on-teal at 1.9:1 in dark mode, and two header
  accents at 3.28:1 / 3.11:1.

## Added — Preview deployment
- `wrangler.preview.jsonc` — a **separate worker** (`aadala-ma-preview`) so a
  preview deploy never touches the production route. See `docs/PREVIEW_DEPLOY.md`.

## Accessibility
- Every page's `<main>` now carries `id="main"`, so the layout's skip link
  always has a real target (Lighthouse `skip-link` failure resolved).
- `prefers-reduced-motion` now stops **all** animation and transition, not just
  the decorative subset.
- Print styles: chrome removed, cards flattened, external URLs printed, headings
  kept with their content.

## Verification
| Check | Result |
|-------|--------|
| `npm run lint` | 0 errors |
| `npm run typecheck` | clean |
| `npm run test` | 124/124 |
| `npm run cf:build` | 488 static pages, 10 locales |
| `npm run design:contrast` | 0 failures (19 pairs × 2 themes) |
| Lighthouse (preview) | Accessibility **0.98**, Best Practices **1.00**, SEO **1.00** |
| Article audit | **30/30 PASS** |

## Still open (honest)
- Legal status of every consolidated text: **UNDETERMINED** — the platform says
  so on every legal page.
- pgvector semantic layer: migration prepared, not applied, corpus not embedded.
- MIYAR's new fiqhi rules: **awaiting specialist review**; not exposed to users
  (`docs/legal-intelligence/MIYAR_FIQH_REVIEW.md`, 11 open questions).
- SGG Level B → A: **complete (72/72)**.
- OMEGA Priority 2–5 institutional crawl: not started — the target grids are
  JavaScript-rendered and need browser automation.
- Production deploy: **blocked pending explicit approval**. The preview is at
  `https://aadala-ma-preview.cheraimmohamed20.workers.dev`.

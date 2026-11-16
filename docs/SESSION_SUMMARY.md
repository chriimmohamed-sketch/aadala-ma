# AADALA.MA — SESSION SUMMARY (2026-11-16)

> The rejected visual layer was reverted to the pre-v3 state; non-visual work remains additive.
> Master branch (`131f99e`) is completely untouched.
> Production (`wrangler deploy`) **blocked pending explicit approval**.
> Preview deployed: `https://aadala-ma-preview.cheraimmohamed20.workers.dev`

---

## 1. Design System v3 — REVERTED (owner rejected)

**Decision:** the owner rejected v3 and asked to keep the original design, how options
appear, and the visual/structural layout. The visual layer is therefore **not shipped**.

**What was reverted (commit `419e6f3`):**

| File(s) | Action |
|---|---|
| `app/globals.css`, `design/tokens.json` | restored byte-for-byte to the pre-v3 baseline |
| `app/design-v3.css` | import removed; file kept for reference only |
| `components/{DocumentGenerator,DownloadButton,FloatingAI,GlobalLoader,HangingCard,MobileNav}.tsx` | restored to pre-v3 bytes |
| `app/[locale]/layout.tsx` | v3 import and role-token skip-link classes removed |
| 14 page files | `LegalStatusNotice` renderings removed; original layout restored |
| `app/[locale]/legal/*` | original layout restored, with only `id="main"` kept from the a11y fix |

**Retained (non-visual):** SGG verification, 30-article audit, registry fields,
Supabase migrations, MIYAR rules, admin Supabase Auth gate, preview worker config,
and all research documentation. `components/LegalStatusNotice.tsx` remains in the
repo but is not rendered. The v3 analysis in `docs/DESIGN_SYSTEM.md` is reference only.

---

## 2. Legal Intelligence — OMEGA Batch 1 (COMPLETE)

### 72/72 SGG documents verified at Level A

- **HEAD 200 + application/pdf** on every official URL
- Full PDF download + `sha256` fingerprint + text extraction via `pypdf`
- **2,258 PDF pages · 86.2 MB · 2,855,583 extracted characters**
- Zero files missing on disk
- Byte-identity proof: `CONS-040` (= 39.08) re-downloaded independently on 16/11 → identical `sha256-16 = 048d55bf7cc652ad`, identical size (809,275 B), identical pages (63), identical chars (57,313)

**Article-level corpus completeness:**
- 39.08: **334/334** (0 missing)
- 31.08: **206/206** (0 missing)

### 30-article audit vs original PDFs

- **30/30 PASS** (seeded random sample, seed 20261116; 15 per corpus)
- Method: per-page re-extraction, verbatim opening/closing clause on claimed page span, bidirectional bleed check
- Details: `docs/legal-intelligence/ARTICLE_AUDIT_30.json`

---

## 3. Legal Status Disclosure — UI reverted, data retained

The `LegalStatusNotice` component and the `legalStatusVerified` / `legalStatusSource`
registry fields were introduced during this session, then removed from the rendered
pages when the owner rejected visual changes. The component file and the data remain
available for a future, design-neutral disclosure decision.

**Registry:** `data/legal-database.ts` still marks every record **«غير مُتحقَّق منها»**
until it is independently verified against the Journal Officiel's effectiveness records.
Previous values like «غير ملغى»، «مدمجة حتى 2019» were source-PDF transcriptions, not
legal-status verification.

**Skip link fix:** `id="main"` added to every `<main>` via:
- 22 page `.tsx` files directly
- `components/layout/PageShell.tsx` (5 pages)
- `components/aalada-ultimate/UnifiedDashboard.tsx`

Lighthouse `skip-link` failure resolved (0.98 → no color-contrast failure).

---

## 4. Admin Security — Supabase Auth + RLS

**Replaced:** localStorage-based RBAC (client-side, trivially bypassed).

**Now:** Supabase Auth + Row Level Security in Postgres.

**Code:** `app/[locale]/admin/page.tsx` — session check + RLS-scoped `profiles.role` read. The localStorage role is no longer consulted.

**Migration:** `supabase/migrations/20261115_admin_rls.sql` — `profiles` table, RLS policies, `is_admin()` helper, auto-provision trigger on `auth.users` insert, admin-only policies on legal content tables.

**Status:** Ready to apply from the Supabase Dashboard (MCP is read-only; owner Dashboard access required).

**Verification commands (owner only):**
```sql
-- confirm admin row exists
select id, email, role from public.profiles;
-- confirm anon cannot write
insert into public.profiles (id, email, role) values (gen_random_uuid(), 'x@y.z', 'admin');
-- expected: ERROR (RLS blocks it)
```

---

## 5. MIYAR Engine — Awaiting Specialist Review

**4 rules added** (all in `lib/miyar/engine.ts`, lines 105-259), **NOT exposed to users** — the component still calls `computeMiyar` (not `computeMiyarEnhanced`):

1. `computeWasiyyaFiqhi` — conditions and ceiling of wasiyya (third of net estate)
2. `detectFromNasakhath` — 3 nasikh scenarios (son+daughter, asaba, wife+descendants)
3. `determineWasiyyaStatus` — wasiyya: wajib / nadafa / mahjub
4. `computeMiyarEnhanced` — enriched Markdown report with fiqhi verification

**11 open questions** for the fiqh specialist (documented in `docs/legal-intelligence/MIYAR_FIQH_REVIEW.md`):
- Key question: Is wasiyya **mahjub** (blocked) when a fard heir exists, or **permissible up to the third** with the heir merely disadvantaged? The legal reasoning differs and affects the result.

**Honest caveat:** Rules were NOT validated against a fiqhi source. Submitted for correction, not presented as correct.

---

## 6. Preview Deployment (SEPARATE WORKER)

| | Production | Preview |
|---|---|---|
| Worker | `aadala-ma` | `aadala-ma-preview` |
| URL | `https://aadala-ma.cheraimmohamed20.workers.dev` | **`https://aadala-ma-preview.cheraimmohamed20.workers.dev`** |
| Version | `f8bc4b97-d77a-4dd5-ab62-dfbfce495586` (untouched since Phase 1) | `bfa1ab64-bc9b-4d28-9a30-cd4940086dc8` (reverted-design build) |
| Effect | **Never touched** by preview deploy | Contains the original design + non-visual session work |

**Preview includes:** the original site design (v3 not imported), legal-intelligence data/docs,
Supabase Auth gate (requires RLS migration), 488 static pages, 10 locales.

**Verified after deploy:** preview and production returned identical computed styles for the
homepage, the procedures page, every `select`/`option`, the action buttons, and dark mode
(navy `#0c1a2b`, gold `#8a5f1c`, ivory `#f3efe4`; dark `#08121a`/`#47b9a3`). The preview CSS
contains no v3 token names, and `/ar/legal` no longer renders the notice component.

**Teardown:** `npx wrangler delete -c wrangler.preview.jsonc` — production unaffected.

---

## 7. What Was NOT Done (honest)

| Blocked item | Reason |
|---|---|
| Legal status of every text | UNDETERMINED — no Journal Officiel effectiveness check |
| pgvector semantic layer | Migration prepared, not applied; needs SQL-Editor + API key |
| MIYAR fiqhi rules | Awaiting specialist review; 11 open questions |
| OCR for scanned corpora | Needs legal sign-off; deps `pdf-parse` exist |
| OMEGA Priority 2–5 crawl | Target grids are JS-rendered; needs browser automation |
| Production deploy | Blocked pending explicit approval |
| Google/Bing Search Console | Requires Cloudflare Dashboard + domain binding (outside MCP) |
| 2FA enrollment for admin | Requires Supabase Dashboard (MCP read-only) |
| Design palette | Moot — v3 was reverted; the live palette is the original `#0C1A2B` / `#8A5F1C` / `#F3EFE4` |

---

## 8. Commands Verified

| Command | Result |
|---|---|
| `npm run lint` | 0 errors, 25 warnings |
| `npm run typecheck` | clean |
| `npm run test` | 124/124 passed |
| `npm run cf:build` | 488 static pages, 10 locales |
| `npm run design:sync` | tooling only — **not run for the shipped state** (v3 reverted) |
| `npm run design:contrast` | tooling only — validates the rejected v3 palette |
| Lighthouse (preview) | 0.98 accessibility / 1.00 best practices / 1.00 SEO on the previous v3 preview (historical; not re-run after revert) |

---

## 9. Git Log (last 9 commits)

```
419e6f3 revert(design): restore the pre-v3 visual state exactly; keep legal-intelligence data and docs
e4257fc docs: note the skip-link fix in the execution report
1942aff a11y: PageShell and UnifiedDashboard main get id=main for the skip link
b13c0de docs: changelog 0.5.0
1735d4b legal-status: unify notice across 14 legal pages via component; preview worker config + docs
cd0963b legal-status: notice component on every legal page; verified flag in registry; research state v4
15c18b9 sgg: 72/72 documents Level A verified; batch report; verify_sgg script
67eef1c audit+docs: 30-article legal audit 30/30 PASS; MIYAR fiqh review doc; manual steps; supabase migrations
ee85263 design-v3
```

**Master:** `131f99e` completely untouched.

---

## 10. Files Changed (outside cwd, for reference)

**Design files (v3 — not shipped):**
- `design/tokens.json` — **restored to the pre-v3 baseline** (commit `419e6f3`)
- `app/design-v3.css` — reference only; **not imported**
- `scripts/sync-design-tokens.mjs` — v3 tooling, not part of the build
- `scripts/audit-contrast.mjs` — v3 tooling, not part of the build

**New legal-intelligence pipeline:**
- `scripts/legal-pipeline/verify_sgg.py` — HEAD/GET/sha256/extract
- `scripts/legal-pipeline/audit_articles.py` — 30-article audit vs PDF
- `docs/legal-intelligence/SGG_VERIFICATION_REPORT.md` — 72/72 Level A report
- `docs/legal-intelligence/ARTICLE_AUDIT_30.json` — 30/30 PASS results
- `docs/legal-intelligence/MIYAR_FIQH_REVIEW.md` — 11 open questions
- `docs/legal-intelligence/AADALA_RESEARCH_STATE.json` — v4 state resume

**Accessibility & legal-status components:**
- `components/LegalStatusNotice.tsx` — retained but **not rendered** (UI reverted)
- `data/legal-database.ts` — `legalStatusVerified` / `legalStatusSource` fields (data retained)
- `app/[locale]/legal/[slug]/page.tsx` — original layout restored; only `id="main"` kept
- `app/[locale]/legal/page.tsx` — original layout restored; only `id="main"` kept
- `components/layout/PageShell.tsx` — `id="main"` on `<main>`
- `components/aalada-ultimate/UnifiedDashboard.tsx` — `id="main"` on `<main>`

**New infrastructure:**
- `wrangler.preview.jsonc` — separate preview worker config
- `docs/MANUAL_STEPS.md` — 8-step owner action list (priority-ordered)
- `docs/PREVIEW_DEPLOY.md` — preview deployment guide
- `docs/DESIGN_SYSTEM.md` — full design system documentation
- `docs/EXECUTION_REPORT_2026-11-16.md` — this summary
- `CHANGELOG_ENTRY_0.5.0.md` + prepended to `CHANGELOG.md`

**No files deleted.** No secrets in code. All secrets reside in GitHub Secrets or `.dev.vars` (gitignored).

--- 

**Session completed: 2026-11-16. All counts measured on real files. No estimation. Production gate held.**
# AADALA.MA — Design System v3

> **NOT SHIPPED (2026-11-16).** The owner rejected Design System v3 and asked to keep the
> original design, option appearance, and visual/structural layout. This document is retained
> as a design-analysis reference only. `app/design-v3.css` is no longer imported;
> `design/tokens.json` and `app/globals.css` were restored to the pre-v3 baseline, and the
> restyled components were reverted byte-for-byte.

> 2026-11-16 — consolidation of three stacked design layers into one token-driven system.
> **Additive only**: nothing was removed. Every prior rule still exists; the v3 layer resolves it.

---

## 1. Why the design looked weak — 6 measured defects

Every claim below was measured with a script, not estimated.

| # | Defect | Measurement | Fix |
|---|--------|-------------|-----|
| **D1** | **Token drift** — `design/tokens.json` declared navy `#0B1D3A` / gold `#C9A227`, but the live `:root` blocks served `#0C1A2B` / `#8A5F1C`. The declared palette was never actually rendered. | 4 stale hex values live vs 2 declared | `design/tokens.json` is now authoritative and auto-regenerated into `app/globals.css` by `scripts/sync-design-tokens.mjs` |
| **D2** | **Role collision** — `--aadala-navy` served as *both* a text colour (122 usages) and a surface colour (6 usages). Impossible to satisfy in dark mode: navy-on-navy. | 122 text uses + 6 surface uses of one token | Split into role tokens: `navy` (ink) · `brand-navy` / `brand-navy-2` (surface) · `on-navy` (text on surface) |
| **D3** | **Fragmented cards** — 6 card families (`.aadala-card`, `.kbd-card`, `.skeu-inner`, `.book`, `.tool`, `.sample`) with 4 radii (6/12/16/20px) and 3 shadow treatments. | 17 card-related classes audited | One radius scale (`--aadala-r-*`) + one elevation scale (`--aadala-elev-1..4`); families keep their silhouette, not their fundamentals |
| **D4** | **Border contrast failure** — border-on-surface measured **1.48:1** (light) and **1.30:1** (dark), below the 1.5:1 non-text minimum. | `scripts/audit-contrast.mjs` | Light border darkened to `#C9C0AB` (1.81:1), dark lifted to `#33558C` (1.95:1); form controls use `border-strong` at ≥3:1 |
| **D5** | **Motion overload** — 8 always-running infinite animations, several purely decorative, none paused off-screen. | animation inventory | Motion budget: `gradientShift` 10s→18s, `float` 6s→9s, `shimmer` 3s→6s, marquee 38s→52s; orbs disabled below 768px; `prefers-reduced-motion` now kills **all** animation and transition |
| **D6** | **Undefined tokens** — `--aadala-glow` and `--c` were referenced but never declared, so those `box-shadow` declarations silently dropped (the hero search focus ring was invisible). | undefined-var scan | Declared in `app/design-v3.css` |

Two further defects were found while fixing the above:

- **D7 — Dark-mode white-on-teal.** `bg-teal` + `text-white` is 7.86:1 in light but **1.9:1** in dark (teal flips to `#47B9A3`). Fixed with `teal-deep` (surface) + `on-teal` (text on it).
- **D8 — Header contrast.** `.justice-topline-code` measured 3.28:1 and `.justice-drawer-section-title` 3.11:1 against the navy shell — both below AA. Both now use `gold-bright` (7.56:1).

---

## 2. The token system

`design/tokens.json` is the single source of truth. 23 colours × 2 themes = 46 values, every one with a defined role.

### Light theme

| Role | Token | Value | Purpose |
|------|-------|-------|---------|
| Ink | `navy` | `#0B1D3A` | Headings, links (15.16:1 on bg) |
| Ink | `graphite` | `#2B2B2B` | Body text (12.79:1 on bg) |
| Ink | `muted` | `#5A5A5A` | Secondary text (6.23:1) |
| Surface | `bg` | `#F7F3EA` | Page ground |
| Surface | `surface` | `#FFFFFF` | Cards (14.16:1 with graphite) |
| Surface | `ivory-deep` | `#EFE7D6` | Recessed panels |
| Brand surface | `brand-navy` | `#0B1D3A` | Header, hero, footer shell |
| Brand surface | `brand-navy-2` | `#13294B` | Gradient partner |
| On brand | `on-navy` | `#F7F3EA` | Text on brand-navy (15.16:1) |
| Accent | `gold` | `#8A6A20` | Gold *text* (5.04:1 on surface) |
| Accent | `gold-bright` | `#C9A227` | Gold *decoration* (6.94:1 on brand-navy) |
| Accent | `gold-soft` | `#E6C96A` | Gold highlight |
| On accent | `on-gold` | `#0B1D3A` | Text on gold-bright (6.94:1) |
| Accent | `teal` | `#0F5C52` | Teal text (7.86:1 on surface) |
| Surface | `teal-deep` | `#0F5C52` | Filled teal button |
| On accent | `on-teal` | `#FFFFFF` | Text on teal-deep (7.86:1) |
| Line | `border` | `#C9C0AB` | Card borders (1.81:1) |
| Line | `border-strong` | `#8A7C5E` | Form control borders (≥3:1) |
| State | `danger` | `#9B2C2C` | Errors (7.53:1) |
| State | `success` | `#2F6B4F` | Success (6.29:1) |

### Dark theme
Same roles, inverted values. `navy` becomes `#EDE8DA` (light ink), `brand-navy` stays dark (`#0A1526`) so the shell never inverts, `gold` becomes `#E6C96A`, `teal` becomes `#47B9A3`, borders lift to `#33558C` / `#5D82BC`.

---

## 3. Radius, elevation, type, spacing

```
--aadala-r-xs 8px    --aadala-r-sm 12px   --aadala-r-md 16px
--aadala-r-lg 20px   --aadala-r-xl 28px

--aadala-elev-1  resting card
--aadala-elev-2  raised button
--aadala-elev-3  hovered card
--aadala-elev-4  hero / featured panel

--aadala-fs-display … --aadala-fs-h1/h2/h3   (clamp, fluid)
--aadala-lh-tight 1.32   --aadala-lh-body 1.9   --aadala-measure 68ch
```

---

## 4. Motion budget

| Motion | Before | After | Rationale |
|--------|--------|-------|-----------|
| `.hero-bg` gradient | 10s | 18s | Decorative; slower reads as material, not motion |
| `.orb` drift | 6s | 9s + off on mobile | Pure decoration; disabled ≤768px |
| `.shimmer` | 3s | 6s | Was a reading distraction |
| `.tick` marquee | 38s | 52s | Slower scroll = calmer |
| `.seal` spin | 40s / 60s | unchanged | Purposeful, very slow |
| **All** under `prefers-reduced-motion` | partial | **total** | `animation-duration: .001ms`, `iteration-count: 1`, `transition-duration: .001ms` |

---

## 5. Print styles

Added for legal reading: chrome (header, footer, nav, drawers, ticker) is removed, cards lose their shadows, external links print their URL, headings avoid orphaned breaks, and paragraphs keep `orphans: 3 / widows: 3`.

---

## 6. How to work with the system

```bash
npm run design:sync       # regenerate the token block in globals.css from tokens.json
npm run design:contrast   # WCAG audit — exits 1 on any failure
npm run design:audit      # full colour-drift report (design/report.md)
```

**Rule:** edit `design/tokens.json` → run `npm run design:sync` → run `npm run design:contrast`. Never hardcode a hex in a component; use the semantic token (`text-navy`, `bg-brand-navy`, `text-on-navy`, …).

### Adding a new token
1. Add it to `design/tokens.json` with a `light` and a `dark` value.
2. Run `npm run design:sync`.
3. Add the pair to `scripts/audit-contrast.mjs` CHECKS so its contrast is verified automatically.
4. Run `npm run design:contrast`.

---

## 7. Verification

| Check | Command | Result |
|-------|---------|--------|
| Token sync | `npm run design:sync` | 23 colours × 2 themes regenerated |
| WCAG contrast | `npm run design:contrast` | **0 failures** (19 pairs × 2 themes) |
| Lint | `npm run lint` | 0 errors, 26 warnings |
| Typecheck | `npm run typecheck` | clean |
| Tests | `npm run test` | 124/124 passed |
| Build | `npm run cf:build` | 488 static pages, 10 locales |

---

## 8. Files

| File | Role |
|------|------|
| `design/tokens.json` | Source of truth (23 colours, 3 font stacks) |
| `app/globals.css` | Base + legacy layers; token block is generated |
| `app/design-v3.css` | v3 layer — role separation, scales, motion budget, print |
| `scripts/sync-design-tokens.mjs` | Regenerates the token block |
| `scripts/audit-contrast.mjs` | WCAG verifier (CI-usable, exits 1 on failure) |
| `scripts/unify-design.mjs` | Drift audit (pre-existing) |

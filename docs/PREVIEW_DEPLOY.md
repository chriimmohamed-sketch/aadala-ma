# AADALA.MA — Preview deployment

> Preview only. Production (`aadala-ma`) is **never** touched by this flow.

## Why a separate worker

`wrangler deploy` with the default config deploys to the `aadala-ma` worker — that is
the production route. A preview must not touch it. The preview config declares a
**different worker name** (`aadala-ma-preview`), so the two are independent:

| | Production | Preview |
|---|---|---|
| Worker | `aadala-ma` | `aadala-ma-preview` |
| Config | `wrangler.jsonc` | `wrangler.preview.jsonc` |
| URL | `https://aadala-ma.cheraimmohamed20.workers.dev` | `https://aadala-ma-preview.<your-subdomain>.workers.dev` |
| Triggered by | explicit approval only | any preview deploy |

## Deploy a preview

```bash
# 1. build (must be green)
npm run cf:build

# 2. deploy to the PREVIEW worker
npx wrangler deploy -c wrangler.preview.jsonc
```

The preview URL is printed on completion.

## Verify

```bash
# the preview serves
curl -s -o /dev/null -w "%{http_code}" https://aadala-ma-preview.<subdomain>.workers.dev/ar

# production is unchanged
npx wrangler versions list | head
```

## What the preview includes

Everything the current branch has:

- The original site design (Design Refresh v2 baseline) — v3 is not imported
- Legal-intelligence data and docs (SGG verification, article audit, registry flags)
- Supabase Auth admin gate (requires the RLS migration to be applied first)
- 488 static pages across 10 locales

## What is NOT in the preview

- Nothing is seeded into a separate database — the preview talks to the **same**
  Supabase project as production. If you apply the RLS migration, it applies to
  both.
- The MIYAR engine's new rules are **not** wired to the UI (awaiting the fiqh
  specialist review).

## Teardown

```bash
npx wrangler delete -c wrangler.preview.jsonc
```

This deletes the preview worker and its versions. Production is unaffected.

## Gate

Production deployment (`npx wrangler deploy` with the default `wrangler.jsonc`)
remains **blocked** until the owner approves. See `docs/MANUAL_STEPS.md` step 8 for
the full review checklist.

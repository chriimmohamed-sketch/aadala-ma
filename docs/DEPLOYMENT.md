# Deployment Guide — AADALA.MA

## Prerequisites
- Node.js 22+, npm 10+
- GitHub repo: https://github.com/chriimmohamed-sketch/aadala-ma
- Cloudflare account + Supabase project (`pvoenvxinkipgpnddumt`)

## Build (production)
```bash
npm ci
npm run quality:gate
```

## Cloudflare Workers (Full-Stack via OpenNext)
```bash
npm run cf:build
npx wrangler deploy
```
Live: `https://aadala-ma.cheraimmohamed20.workers.dev`

Set env vars in Cloudflare Dashboard → Workers & Pages → `aadala-ma` → Settings → Variables:
- `NEXT_PUBLIC_SUPABASE_URL` — `https://pvoenvxinkipgpnddumt.supabase.co` (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon/public key (safe in client bundle)
- `AI_PROVIDER_API_KEY` — optional (server-only; enables full AADALA AI)
- **Never** ship `SUPABASE_SERVICE_ROLE_KEY` to the client bundle (server scripts only).

## GitHub Pages (Static)
- Source: `main` `/` (legacy build) → `https://chriimmohamed-sketch.github.io/aadala-ma/`
- Serves `index.html` + `*.html` + `assets/` + root `robots.txt`/`sitemap.xml` (`.nojekyll` disables Jekyll).
- `public/robots.txt`/`sitemap.xml` belong to Workers; Pages serves the root files.

## Supabase
- Run in SQL Editor, in order: `supabase/migrations/0001_init.sql`, then `supabase/migrations/0002_auth_rls.sql`.
- First admin: sign up, then `UPDATE public.profiles SET role = 'admin' WHERE email = 'you@example.com';`

## Rollback
- Revert to previous commit and redeploy.
- Restore DB from backup (see BACKUP_RESTORE.md).

# Deployment Guide — AADALA.MA

## Prerequisites
- Node.js 20+, npm 10+
- GitHub repo: https://github.com/chriimmohamed-sketch/aadala-ma
- Cloudflare account

## Build (production)
```bash
npm ci
npm run quality:gate
```

## Cloudflare Pages (Full-Stack via OpenNext)
```bash
npm run cf:build
npx wrangler deploy
```
Set env vars in Cloudflare Dashboard → Workers/Pages → Settings → Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `AI_PROVIDER_API_KEY` (optional)

## Supabase
- Project: pvoenvxinkipgpnddumt (eu-west-2)
- Apply `supabase/schema.sql` in SQL Editor.

## Rollback
- Revert to previous commit and redeploy.
- Restore DB from backup (see BACKUP_RESTORE.md).
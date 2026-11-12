# Deployment Guide — AADALA.MA

## Prerequisites
- Node.js 20+, npm 10+
- GitHub repo: https://github.com/chriimmohamed-sketch/aadala-ma
- Vercel account (team chriim) or Cloudflare account

## Build (production)
```bash
npm ci
npm run quality:gate
```

## Vercel
```bash
npx vercel --prod
```
Set env vars in Vercel dashboard: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, AI_PROVIDER_API_KEY, etc.

## Cloudflare (via CI)
- GitHub Actions: `.github/workflows/deploy-cloudflare.yml`
- Requires secrets: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID.
- Local cf:build not supported on Windows (native binding). Use CI (ubuntu-latest).

## DNS/Domain
- Do NOT change DNS without explicit owner approval.
- Domain AADALA.MA availability/ownership must be verified before linking.

## Rollback
- Revert to previous commit and redeploy.
- Restore DB from backup (see BACKUP_RESTORE.md).
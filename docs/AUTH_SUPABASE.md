# AADALA.MA — Supabase Auth + RLS

## Architecture

```
User -> Login/Register (/ar/login, /ar/register)
     -> Supabase Auth (signInWithPassword / signUp)
     -> Session (cookies via @supabase/ssr; tokens verified server-side)
     -> profiles (role: user | legal_editor | legal_reviewer | admin)
     -> audit_logs (append-only)
     -> RLS (admin reads all; user reads own; role changes admin-only)
```

## Files

- `lib/supabase/client.ts` — browser client (ANON KEY ONLY, never service_role)
- `lib/supabase/server.ts` — server client (ANON KEY ONLY, httpOnly cookies)
- `lib/supabase/auth.server.ts` — `getSessionUser()` (verifies via Auth server + profiles RLS)
- `lib/supabase/middleware.ts` — session refresh + signed-in gate for `/admin`
- `app/[locale]/login`, `app/[locale]/register` — Supabase UI (`signInWithPassword`, `signUp`, `getSession`, `signOut`)
- `app/[locale]/admin` — server-enforced `role === 'admin'` (fail-closed)
- `supabase/migrations/0002_auth_rls.sql` — profiles/audit_logs + RLS + signup trigger (role always `user`)

## Deleted / replaced

- `localStorage` identity/role trust (legacy `aadala_user` blob) — removed; `AADALA.login/register` now redirect to Supabase.
- Fake `login()` accepting any password — removed.
- Any-signed-in-user to `/admin` — removed; requires `profiles.role = 'admin'`.
- Client-side `role` as permission source — removed; always fetched server-side via RLS.
- `ADMIN_USER`/`ADMIN_PASSWORD` Basic Auth — deprecated (replaced by Supabase session gate).

## Environment (Cloudflare Dashboard)

| Variable | Visibility | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | `https://pvoenvxinkipgpnddumt.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Anon key; safe in client bundle |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret (server only)** | Backend scripts only; NEVER in frontend code, NEVER in Workers vars for client |

No `NEXT_PUBLIC_*` secret is used. No `Service Role Key` is shipped to the browser.

## Apply SQL

Supabase Dashboard → SQL Editor → Run `supabase/migrations/0002_auth_rls.sql`.
This creates `profiles`, `audit_logs`, RLS policies, and the `handle_new_user()` trigger.

## First admin

1. Sign up via `/ar/register` (role becomes `user` automatically).
2. In SQL Editor (or service-role script), run:
   `UPDATE public.profiles SET role = 'admin' WHERE email = 'you@example.com';`
3. Sign in again and open `/ar/admin`.

# AADALA.MA — Decisions

- D1: Project isolated in `aadala-ma/` subfolder because root contains unrelated CHRVVIM project.
- D2: Next.js 16.4.5 with App Router, TypeScript, Tailwind v4.
- D3: Build/dev use `--webpack` because Turbopack native bindings invalid on this Windows environment.
- D4: Arabic is the only fully implemented language initially; other 9 locales scaffolded with placeholder messages marked "قيد التطوير".
- D5: Mock data clearly labeled `DEMO`/`تجريبي` until real sourced legal content is added.
- D6: No secrets in repo; `.env.example` only.
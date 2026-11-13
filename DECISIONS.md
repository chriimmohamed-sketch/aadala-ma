# AADALA.MA — Decisions

- D1: Project isolated in `aadala-ma/` subfolder because root contains unrelated CHRVVIM project.
- D2: Next.js 16.4.5 with App Router, TypeScript, Tailwind v4.
- D3: Build/dev use `--webpack` because Turbopack native bindings invalid on this Windows environment.
- D4: Arabic is the only fully implemented language initially; other 9 locales scaffolded with placeholder messages marked "قيد التطوير".
- D5: Mock data clearly labeled `DEMO`/`تجريبي` until real sourced legal content is added.
- D6: No secrets in repo; `.env.example` only.
- D7: Static-first runtime: the live site is plain HTML/CSS/JS on Cloudflare Workers assets; Next.js deps remain but are not the deploy target.
- D8: Uploaded PDFs are the primary content source. Text extraction runs in two modes: pypdf text layer when clean, Windows Arabic OCR (`ar-SA`) when the embedded font encoding is broken.
- D9: Extracted article text is published as `status = 'extracted'` with a visible per-article confidence and “غير مدقق” badge; only human-checked text can become `verified`/`published`.
- D10: Merged into this project the full Next.js application source that previously existed only as the `AADALA.MA_FULLSTACK` snapshot (App Router `app/[locale]/**`, Header/Footer/ThemeToggle/ZelligeCanvas, `lib/` engines, `data/legal-categories.ts`). It is source-only — the deployed artifact remains the static site until the app is built and deployed deliberately.
- D11: Machine-OCR raw dumps (`data/ocr/**`) are excluded from git and from the Worker assets; only the consolidated article JSON is public.
# AADALA.MA — DECISIONS.md

## D1: Static-first architecture
**Decision:** Build as a static HTML/CSS/JS site deployable without a build step, rather than Next.js.
**Reason:** npm install is extremely slow/unreliable in this environment (network). No PostgreSQL available. No gh/wrangler CLI.
**Trade-off:** Loses SSR, API routes, and server-side auth. Gains immediate usability and deployability.
**Future:** Upgrade to Next.js when environment supports it. Structure is migration-ready.

## D2: localStorage for data
**Decision:** Use localStorage for auth, audit logs, and user data in demo mode.
**Reason:** No database server available locally.
**Trade-off:** Data is per-browser, not shared. Acceptable for demo/prototype.
**Future:** Migrate to PostgreSQL + pgvector when available.

## D3: Template-based Legal AI
**Decision:** Legal AI returns structured template responses, not real RAG.
**Reason:** No LLM API key or vector DB available.
**Trade-off:** Responses are generic, not source-grounded. Clearly labeled as demo.
**Future:** Implement real RAG with verified sources when infrastructure is ready.

## D4: Demo inheritance calculator
**Decision:** Inheritance calculator uses simplified equal distribution, not real Islamic inheritance rules.
**Reason:** Requires expert validation of complex rules (Hijab, Awl, Radd, Asaba).
**Trade-off:** Clearly labeled as demo requiring expert review.

## D5: No real deployment
**Decision:** Prepare for deployment but do not push to GitHub or Cloudflare.
**Reason:** No gh CLI, no wrangler CLI, no user approval for cloud resources.
**Future:** User can deploy manually or install CLIs.

## D6: Arabic-first, 10-language structure
**Decision:** Arabic is fully implemented. Other 9 languages have i18n structure planned but not content.
**Reason:** Translation requires native speakers and review.
**Future:** Add languages incrementally.

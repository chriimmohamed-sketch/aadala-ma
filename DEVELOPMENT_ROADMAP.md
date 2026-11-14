## Phase 2.1 — Premium Moroccan Legal Intelligence Re-theme (2026-11-13 — DONE for Next.js app, IN PROGRESS for static site)
- New Design Constitution in force (`docs/DESIGN_CONSTITUTION.md`): كحلي #263247 · عاجي #F7F5F0 · أبيض #FFFFFF · ذهبي مطفأ #B99A5B · أخضر مزرق #2D7778 · رمادي #5F6875 · أحمر #B94A48 (errors only).
- `app/globals.css` rebuilt on the new palette (same semantic variable names + `.aadala-shell` brand header/footer + `.aadala-logo-badge` circular logo clip + `.aadala-btn-teal`).
- Header: logo mark + grouped nav (5 primary + "المزيد" dropdown), mobile collapsible nav, real `messages.nav` keys, keyboard-accessible.
- Footer: 4-column layout (brand + المنصة + المصادر والمنهجية + الثقة والشركة), non-advisory disclaimer.
- `app/icon.jpg` = official AADALA.MA logo; favicon wired via Next convention.
- Static site (`assets/css/main.css`, `index.html` hero, `assets/js/app.js` renderHeader) — same palette to be applied in the re-theme commit; see IMPLEMENTATION_STATUS.md.

## Phase 11 — GitHub & Cloudflare (PARTIAL → unblocked)
- GitHub: master updated 2026-11-13.
- Live site was **down**: Worker `aadala-ma` did not exist (code 10007); all routes returned 404.
- Assets-mode deploy path validated on Windows: `wrangler deploy --dry-run` completes; OpenNext auto-detection bypassed by temporarily renaming `open-next.config.ts` (restored automatically), because OpenNext×Windows is unsupported.
- `.assetsignore` fixed to exclude `.next`, source dirs, docs, SQL, and root tool configs.
- Static site redeploy via wrangler (assets only, no OpenNext) — outcome recorded in IMPLEMENTATION_STATUS.md.


## 2026-11-13 — الدمج الكامل لها الإنتاج (Full-stack merge)
- أدخلت شجرة `design/aadala-refresh`: **Supreme Justice Navigation** (`HeaderSupreme`, `MobileNavSupreme`, `FloatingAI`), صفحات `/ar/report` (أبلغ عن خطأ) مع `POST /api/reports/error`، `public/mushkilati.html` («مشكلتي»)، `public/profile/` («ملفي» + صورة المؤسس)، `institutions`؟ (on `origin/main` — أُدمجت في هذا الفرع؟ إن لم تُدمج فهي في `origin/main`)، `lib/legal-data/*` (registry مُربط بالبناء)، `public/assets/navigation.css|js`، migrations `0014` (`error_reports`) + `0015` (إصلاح تعاودية RLS في workspaces) + `0016` (إصلاح mojibake في البذور)، bundle تطبيق `supabase/apply/2026-11-11_pending_bundle.sql`، rate-limit على `/api/admin/ingest/queue` و`/api/documents/templates`، `docs/DB_STATE.md` (شجرات مثبتة بالنتائج).
- مجموعة التقييم هنا: build 387 صفحة (مع صفحات auth الجديدة) + 81 اختباراً ناجحاً.

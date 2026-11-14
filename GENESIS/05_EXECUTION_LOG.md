# 05 ظ¤ ╪│╪ش┘ ╪د┘╪ز┘┘┘è╪░ (EXECUTION LOG)

**╪د┘╪ش┘╪│╪ر:** 2026-11-12 ┬╖ ┘à┘╪╡╪ر Windows ┬╖ PowerShell 5.1 + Node 22 + Python 3.15
**╪د┘┘é╪د╪╣╪»╪ر:** ┘â┘ ╪│╪╖╪▒ ┘ç┘╪د ┘┘┘┘ّ╪░ ┘╪╣┘┘è┘ï╪د. ┘╪د ╪«╪╖┘ê╪ر ┘à╪«╪╖╪╖╪ر ╪ز┘┘â╪ز╪ذ ╪ذ╪╡┘è╪║╪ر ╪د┘┘à┘╪ش┘╪▓.

---

## 1. ╪د┘┘à┘┘╪د╪ز ╪د┘┘à╪╣╪»┘┘ّ┘╪ر ┘ê╪د┘┘à┘┘╪┤╪ث╪ر

| ╪د┘┘à┘┘ | ╪د┘╪╣┘à┘ | ┘é╪ذ┘ ظْ ╪ذ╪╣╪» |
|---|---|---|
| `app/[locale]/layout.tsx` | ╪ح╪╡┘╪د╪ص ┘╪╡ ╪▒╪د╪ذ╪╖ ╪د┘╪ز╪«╪╖┘è | `Patton ╪ح┘┘ë ╪د┘┘à╪ص╪ز┘ê┘ë ╪د┘╪▒╪خ┘è╪│┘è` ظْ `╪ز╪«╪╖┘è ╪ح┘┘ë ╪د┘┘à╪ص╪ز┘ê┘ë ╪د┘╪▒╪خ┘è╪│┘è` |
| `lib/ai-assistant/retrieval.ts` | ╪ح╪╣╪د╪»╪ر ╪ذ┘╪د╪ة ╪د┘╪د╪│╪ز╪▒╪ش╪د╪╣ | 1 ┘à┘┘╪î 300+ ╪│╪╖╪▒ |
| `lib/ai-assistant/procedures.ts` | **╪ش╪»┘è╪»**: ┘à╪╖╪د╪ذ┘é ╪د┘┘à╪│╪د╪╖╪▒ | ظ¤ |
| `app/api/ai/route.ts` | ┘è┘é┘è┘ ╪╡╪د╪»┘é + ┘╪▒╪╣ ┘à╪│╪د╪╖╪▒ + ┘à╪»┘é┘é | +80/ظêْ10 ╪│╪╖╪▒┘ï╪د |
| `components/AIChat.tsx` | ╪▒╪│╪د┘╪ر ┘╪▒╪د╪║ ┘ê╪د╪╣┘è╪ر ╪ذ╪د┘┘à╪│╪╖╪▒╪ر | ╪│╪╖╪▒ ┘ê╪د╪ص╪» |
| `data/legal-sources.ts` | 5 ┘à╪╡╪د╪»╪▒ ┘à┘ç┘è┘â┘╪ر | 13 ظْ 18 |
| `data/legal-index.json` | ╪ز┘╪╕┘è┘ ╪د┘┘┘ç╪▒╪│ | 733 ظْ 732 ┘à┘é╪╖╪╣┘ï╪د |
| `app/[locale]/legal/[slug]/page.tsx` | ╪ز╪«╪╖┘è ┘é╪▒╪د╪ة╪ر ╪د┘┘à┘┘ ┘┘┘à╪╡╪د╪»╪▒ ╪د┘┘à┘ç┘è┘â┘╪ر | `fs` ┘à╪ص┘à┘è |
| `lib/legal-data/*.ts` (9 ┘à┘┘╪د╪ز) | ╪ح╪╡┘╪د╪ص ╪د┘┘â┘┘à╪د╪ز ╪د┘╪ح┘╪ش┘┘è╪▓┘è╪ر | 249 ╪د╪│╪ز╪ذ╪»╪د┘┘ï╪د |
| `scripts/clean-legal-index.mjs` | **╪ش╪»┘è╪»**: ╪ز┘╪╕┘è┘ ╪د┘┘┘ç╪▒╪│ | ظ¤ |
| `scripts/fix-arabic-contamination.mjs` | **╪ش╪»┘è╪»**: ╪ح╪╡┘╪د╪ص ╪د┘╪ز┘┘ ╪د┘┘╪╡┘è | ظ¤ |
| `lib/ai-assistant/acceptance.test.ts` | **╪ش╪»┘è╪»**: ┘à╪│╪ذ╪د╪▒ ╪د┘┘é╪ذ┘ê┘ | 5 ╪ث╪│╪خ┘╪ر |

**┘┘à ┘è┘╪ص╪░┘ ╪ث┘è ┘à┘┘ ╪ث┘ê ┘à╪│╪د╪▒ ╪ث┘ê ╪ز╪▒╪ش┘à╪ر.** ┘┘à ╪ز┘┘à╪│ `supabase/migrations`. ┘┘à ┘è┘┘╪┤╪▒ ╪┤┘è╪ة.

---

## 2. ╪د┘╪ث┘ê╪د┘à╪▒ ┘ê╪د┘┘╪ز╪د╪خ╪ش (╪ص╪▒┘┘è╪ر)

### 2.1 ╪ز┘╪╕┘è┘ ╪د┘┘┘ç╪▒╪│
```
node scripts/clean-legal-index.mjs
ظْ entriesBefore 733 ┬╖ entriesAfter 732 ┬╖ droppedUnusable 1 ┬╖ textModified 66
ظْ bytesBefore 493900 ┬╖ bytesAfter 435547

node scripts/clean-legal-index.mjs --fix
ظْ wrote data\legal-index.json ظ¤ 733 ظْ 732 chunks, 493900 ظْ 435547 bytes
ظْ verify: ctrl chars left 0
```

### 2.2 ╪ح╪╡┘╪د╪ص ╪د┘╪ز┘┘ ╪د┘┘╪╡┘è
```
node scripts/fix-arabic-contamination.mjs
ظْ totalReplacements 249 (9 ┘à┘┘╪د╪ز)
node scripts/fix-arabic-contamination.mjs --fix
ظْ rewrote 9 files, 249 replacements
node scripts/fix-arabic-contamination.mjs   (╪ز╪ص┘é┘é)
ظْ files [] ┬╖ totalReplacements 0
```

### 2.3 ╪د┘┘╪ص╪╡ ╪د┘┘┘ê╪╣┘è ┘ê╪د┘╪د╪«╪ز╪ذ╪د╪▒╪د╪ز
```
npm run typecheck   ظْ tsc --noEmit (┘╪╕┘è┘)
npm test            ظْ 20 ┘à┘┘┘ï╪د / 97 ╪د╪«╪ز╪ذ╪د╪▒┘ï╪د ┘╪د╪ش╪ص┘ï╪د
npm run build       ظْ ┘╪د╪ش╪ص
```

### 2.4 ╪د┘╪ذ┘╪د╪ة
```
18 ╪╡┘╪ص╪ر ┘é╪د┘┘ê┘┘è╪ر ├ù 10 ┘╪║╪د╪ز = 180 ╪╡┘╪ص╪ر SSG
.next/server/app/ar/legal/family-code.html ظْ 104,076 ╪ذ╪د┘è╪ز
  ┘è╪ص╪ز┘ê┘è: ┬س╪د┘╪ز╪╖┘┘è┘é┬╗ ظ£ô ┬╖ ┬س┘é┘è╪» ╪د┘┘à╪▒╪د╪ش╪╣╪ر┬╗ ظ£ô ┬╖ ┬س┘à╪»┘ê┘╪ر ╪د┘╪ث╪│╪▒╪ر┬╗ ظ£ô
.next/server/app/ar/legal/civil-procedure.html ظْ ┘è╪ص╪ز┘ê┘è ┬س╪د┘╪د╪│╪ز╪خ┘╪د┘┬╗ ┘ê┬س╪س┘╪د╪س┘ê┘┬╗ ظ£ô
```

---

## 3. ╪د╪«╪ز╪ذ╪د╪▒ ╪د┘┘é╪ذ┘ê┘ (┘à╪ص┘┘è┘ï╪د: `npm start` ╪س┘à `POST /api/ai`)

| # | ╪د┘╪│╪ج╪د┘ | certainty | ╪د┘┘à╪▒╪د╪ش╪╣ / ╪د┘┘à╪│╪د╪▒ |
|---|---|---|---|
| 1 | ┘à╪د ┘ç┘è ╪ث┘┘ê╪د╪╣ ╪د┘╪╖┘╪د┘é ┘┘è ╪د┘┘à╪║╪▒╪ذ╪ا | medium | `family-code` ┬╖ ╪د┘┘à╪د╪»╪ر 94╪î ╪د┘┘à╪د╪»╪ر 97 |
| 2 | ┘â┘è┘ ╪ث╪▒┘╪╣ ╪┤┘â╪د┘è╪ر╪ا | low | ┘à╪│╪د╪▒ 4 ╪«╪╖┘ê╪د╪ز + 3 ┘ê╪س╪د╪خ┘é (╪ذ┘è╪د┘╪د╪ز ┘à╪│╪╖╪▒╪ر) |
| 3 | ┘à╪د ╪┤┘ç╪د╪»╪ر ╪╡╪ص╪ر ╪╣┘é╪» ╪د┘╪ذ┘è╪╣╪ا | low | `droits-reels-2018` ┬╖ ╪د┘┘à╪د╪»╪ر 214╪î ╪د┘┘à╪د╪»╪ر 3 + ╪ز┘╪ذ┘è┘ç ┬س╪د┘╪╡┘╪ر ┘à╪ص╪»┘ê╪»╪ر┬╗ |
| 4 | ┘à╪»╪ر ╪د┘╪╖╪╣┘ ╪ذ╪د┘╪د╪│╪ز╪خ┘╪د┘ | medium | `civil-procedure` ┬╖ ╪د┘┘à╪د╪»╪ر 130╪î 134 ┬╖ `criminal-procedure` ┬╖ 396 |
| 5 | ┘à╪د ┘ç┘è ╪┤╪▒┘ê╪╖ ╪╡╪ص╪ر ╪╣┘é╪» ╪د┘╪┤╪║┘╪ا | medium | `labor-code` ┬╖ 13 ┬╖ `obligations-contrats` ┬╖ 2╪î 65 |

- **╪ز╪ص╪░┘è╪▒ ┬س╪ح╪ص╪د┘╪د╪ز ╪║┘è╪▒ ┘à╪ج┘â╪»╪ر┬╗:** 0 ┘┘è ┘â┘ ╪د┘╪ث╪│╪خ┘╪ر ╪د┘╪«┘à╪│╪ر.
- **┬س╪د┘╪ش┘ê╪د╪ذ ╪║┘è╪▒ ┘à┘ê╪ش┘ê╪»┬╗:** ┘┘à ┘è╪╕┘ç╪▒╪ؤ ╪د┘┘╪▒╪د╪║ ┘è┘╪ش╪د╪ذ ╪ذ╪ص╪»┘ê╪» ╪╡╪▒┘è╪ص╪ر ╪ث┘ê ┘à╪│╪د╪▒ ┘à╪│╪╖╪▒╪ر.
- **Rate limit:** ╪د┘╪╖┘╪ذ ╪د┘╪▒╪د╪ذ╪╣ ┘┘è ┘╪د┘╪░╪ر ╪»┘é┘è┘é╪ر ┘ê╪د╪ص╪»╪ر ╪ث╪╣╪د╪» `429` (╪د┘╪ص╪» 8/╪»┘é┘è┘é╪ر) ظ¤ ┘è╪╣┘à┘ ┘â┘à╪د ┘ç┘ê ┘à╪╡┘à┘à.

---

## 4. ┘à╪د ╪ز╪║┘è┘ّ╪▒ ┘┘è ╪د┘╪│┘┘ê┘â (┘é╪ذ┘/╪ذ╪╣╪»)

| ╪د┘╪│┘┘ê┘â | ┘é╪ذ┘ | ╪ذ╪╣╪» |
|---|---|---|
| ┬س╪د┘╪╖┘╪د┘é ┘┘è ╪د┘┘à╪║╪▒╪ذ┬╗ | ╪»╪│╪ز┘ê╪▒╪î medium | ┘à╪»┘ê┘╪ر ╪د┘╪ث╪│╪▒╪ر╪î medium |
| ┬س┘â┘è┘ ╪ث╪▒┘╪╣ ╪┤┘â╪د┘è╪ر╪ا┬╗ | 0 ┘à╪▒╪د╪ش╪╣╪î ╪╖╪▒┘è┘é ┘à╪│╪»┘ê╪» | 4 ╪«╪╖┘ê╪د╪ز + ┘ê╪س╪د╪خ┘é╪î low |
| ┬س┘à╪»╪ر ╪د┘╪╖╪╣┘ ╪ذ╪د┘╪د╪│╪ز╪خ┘╪د┘┬╗ | ╪ز╪ص╪░┘è╪▒ ╪ح╪ص╪د┘╪د╪ز ┘â╪د╪░╪ذ | 3 ┘à╪▒╪د╪ش╪╣ ╪╡╪ص┘è╪ص╪ر╪î ╪ذ┘╪د ╪ز╪ص╪░┘è╪▒ |
| ┘à┘é╪╖╪╣ ╪╣╪▒╪ذ┘è ┘à┘┘ê┘ّ╪س | `between┘ç┘à╪د`, `in ╪د┘╪»╪╣┘ê┘ë` | `╪ذ┘è┘┘ç┘à╪د`, `┘┘è ╪د┘╪»╪╣┘ê┘ë` |
| ╪ث╪ص╪▒┘ ╪ز╪ص┘â┘à ┘┘è ╪د┘┘┘ç╪▒╪│ | 56 ┘à┘é╪╖╪╣┘ï╪د | 0 |

---

## 5. ┘à╪د ┘┘à ┘è┘┘┘┘┘ّ╪░ (╪╡╪▒┘è╪ص)

| ╪د┘╪ذ┘╪» | ╪د┘╪│╪ذ╪ذ |
|---|---|
| ╪د┘┘╪┤╪▒ ╪╣┘┘ë Cloudflare | ╪ذ╪د┘╪ز╪╕╪د╪▒ ┘à┘ê╪د┘┘é╪ر ╪╡╪▒┘è╪ص╪ر (┘┘ ╪ث┘╪┤╪▒ ╪ز┘┘é╪د╪خ┘è┘ï╪د) |
| ┘┘ç╪▒╪│╪ر 7 ┘╪╡┘ê╪╡ ╪«╪د┘à | ╪ش┘ê╪»╪ر ╪د╪│╪ز╪«╪▒╪د╪ش ╪║┘è╪▒ ┘â╪د┘┘è╪ر (`tahfidh`/`code-penal`/`bulletin` = unreliable) |
| OCR | ┘╪د ┘à╪ص╪▒┘â╪î ┘êWorkers ╪ذ┘╪د Node APIs |
| ┘à╪▒╪د╪ش╪╣╪ر ╪ذ╪┤╪▒┘è╪ر ┘┘┘à┘ê╪د╪» | ╪ز╪ص╪ز╪د╪ش ┘à╪«╪ز╪╡┘ï╪د ┘é╪د┘┘ê┘┘è┘ï╪د |
| ┘à┘╪ز╪د╪ص AI | ╪║┘è╪▒ ┘à╪ز┘ê┘╪▒╪ؤ RAG ┘è╪╣┘à┘ ╪ذ╪»┘ê┘┘ç |
| CI auto-deploy | ┘è╪ص╪ز╪د╪ش `CLOUDFLARE_API_TOKEN` |

---

## 6. ┘à┘┘╪د╪ز ╪د┘╪ث╪»┘╪ر
- `GENESIS/00_FORENSIC_AUDIT.md` ظ¤ ┘à╪د ┘┘╪ص╪╡ ┘ê╪ث╪╣╪╖╪د┘┘ç
- `GENESIS/02_FEATURE_REALITY_MATRIX.md` ظ¤ ╪ز╪╡┘┘è┘ ┘â┘ ┘à┘è╪▓╪ر
- `ENGINE/*` ظ¤ ╪ز┘╪د╪╡┘è┘ ╪د┘┘à╪ص╪▒┘â ┘ê╪د┘┘à╪»┘é┘é
- `TESTING/TEST_RESULTS.md` ظ¤ ┘à╪«╪▒╪ش╪د╪ز ╪د┘╪د╪«╪ز╪ذ╪د╪▒╪د╪ز


## 7. Jurisprudence layer (0.3.1) — 2026-11-12

**Source:** 22 PDFs supplied by the user (20 text-layer commercial-court decisions + 2 scans).
**Triage:** 20 text-layer PDFs -> 18 unique decisions (2 duplicate pairs, Jaccard >= 0.7);
2 scanned PDFs excluded (no text layer - OCR engine absent).

**Ingestion (scripts/ingest-jurisprudence.py):**
- Bigram plausibility gate trained on data/legal-index.json (188,598 transitions).
- Unreadable fragments excised and marked [...] (902 elisions total; density 5.4%-12.9%).
- Keep ratio >= 45%, >= 120 words; 18/20 decisions kept; 2 gate-skipped.
- Output: data/jurisprudence.json - 18 decisions, 53 chunks, ~9.4k words, all verified:false.

**Integration:**
- lib/legal-data/jurisprudence.ts, lib/legal-data/index.ts (+1), data/legal-sources.ts (+1).
- components/JurisprudenceView.tsx, app/[locale]/legal/[slug]/page.tsx (conditional render).
- retrieval.ts: blend (statutes lead, jurisprudence fills spare slots); retrievalQuality
  now uses unweighted term recall; jurisprudence-only top chunk caps at "low".
- app/api/ai/route.ts: forwards verified/kind; appends jurisprudence disclosure note.
- components/AIChat.tsx: "قيد المراجعة" + "اجتهاد قضائي — غير مُراجع" badges.

**Verification:**
- npm test: 21 files / 105 tests passed (incl. new lib/ai-assistant/jurisprudence.test.ts, 8 tests).
- npm run typecheck: clean.
- npm run build: 454 pages (190 legal detail = 19 slugs x 10 locales).
- Local API (POST /api/ai): divorce -> family-code, 2 refs, medium;
  banking question -> jurisprudence refs (kind=jurisprudence, verified=false) + disclosure note, low.
- No deploy, no push.

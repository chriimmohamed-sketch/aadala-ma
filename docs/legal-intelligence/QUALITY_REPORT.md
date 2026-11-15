# AADALA.MA — OMEGA Batch 1 — QUALITY REPORT (Zero-Simulation, 2026-11-15)

> Every number below was measured in this session on the real files. Nothing is estimated.
> Files: PDFs in `docs/legal-intelligence/raw/` (local; gitignored — large binaries). Extracted text/JSON + pipeline scripts are committed.

## 1. Documents processed (real)
| File | Source URL | bytes | sha256-16 | pages | chars | non-space |
|---|---|---|---|---|---|---|
| `MDE_39-08_droits_reels.pdf` | https://www.sgg.gov.ma/Portals/1/textesconsolides/39_08.pdf | 809,275 | `048d55bf7cc652ad` | 63 | 70,807 | 57,313 |
| `MDE_31-08_consumer.pdf` | https://www.sgg.gov.ma/Portals/1/textesconsolides/31_08.pdf | 878,022 | `9b793b4496c27f87` | 61 | 93,350 | 76,078 |
| `BO_7558_Ar.pdf` | https://www.sgg.gov.ma/BO/AR/3111/2026/BO_7558_Ar.pdf | 654,164 | `cef1f90d2355c343` | 35 | 116,575 | 96,329 |
| `BO_7556-bis_Ar.pdf` | https://www.sgg.gov.ma/BO/AR/3111/2026/BO_7556-bis_Ar.pdf | 9,405,045 | `5db9cb1f4f7c1b43` | 226 | 687,430 | 572,311 |

*`MDE_39-08…pdf` is **byte-identical** to the file already at `data/legal-sources/39-08-code-droits-reels.pdf` (both `048d55bf7cc652ad`, 809,275 bytes) — official source binarily reproduced (BO_7558 hash `cef1f90d…` verified both by HEAD and by full download + extraction).*

## 2. Article extraction — verified
| Corpus | Articles found | Expected | Missing | Method notes |
|---|---|---|---|---|
| مدونة الحقوق العينية (موطدة 2025-08-25) | **334** | 334 | **0** | `N المادة` line-start regex; 3 headers corrupted in PDF glyphs (`157 لمادةا` — RTL glyph reversal) — matched via extended pattern; U+FFFD present in a few glyphs (fontTools missing → CFF parse incomplete) |
| قانون حماية المستهلك (موطدة 2025-05-22) | **206** | 206 | **0** | 205 numeric + المادة الأولى (word numeral) |
| **Total** | **540/540** | 540 | **0** | |
| AADALA's own JSON (`39-08-code-droits-reels.json`) | 330 | 334 | **4** | gap vs official text — flagged to project team; not silently patched |
| AADALA's own JSON (`code-droits-reels.json`) | 333 | 334 | **1** | same file, second extractor — flagged |

Article boundaries land on real official articles 1→final (334 موطدة 2025-08-25؛ 206 موطدة 2025-05-22) — verified by numbering check & by reading first/last articles.

## 3. Retrieval probe (BM25, naive Arabic tokenization, k1=1.5, b=0.75) — REAL RESULTS
### MDE_39-08 (extracted official text)
| Query | Top match | Score |
|---|---|---|
| حق الشفعة | المادة 300 / 299 / 298 | 4.34 / 4.21 / 4.03 |
| البيع العقاري | المادة 295 | 7.71 |
| التحفيظ | المادة 305 | 7.11 |
| بطلان العقد | المادة 299 (weak/lexical) | 4.95 |
| الملكية المشتركة | المادة 23 (weak) | 8.16 |
| حق الارتفاق | المادة 48 / 49 / 38 | 4.90 / 4.83 / 4.22 |
| الرهن الرسمي | المادة 170 / 165 / 166 | 8.45 / 6.97 / 6.83 |
| الشركات التجارية | **لا مطابقة معجمية — سلوك صحيح خارج المجال** | 0 |
| الجريمة والعقوبة | **لا مطابقة — سلوك صحيح خارج المجال** | 0 |
| حق الملكية | المادة 13 / 221 / 110 | 4.47 / 4.42 / 4.42 |

### MDE_31-08
| Query | Top match | Score |
|---|---|---|
| حق التراجع | المادة 85 / 94 / 36 | 4.23 / 4.11 / 3.65 |
| الضمان | المادة 71 / 72 / 66 | 5.18 / 4.75 / 4.59 |
| الغش والتزوير | المادة 196 | 5.73 |
| الحق في الإعلام | المادة 11 / 152 / 5 | 5.49 / 5.05 / 4.75 |
| الشركات التجارية | المادة 44 / 20 (weak) | 4.25 / 4.05 |

**Honesty:** lexical retrieval is sufficient for statute subject-matter matching; it is NOT adequate for free-form legal questions (as expected). A semantic (embedding) layer is required for true NL queries — the platform already plans pgvector; nothing was built.

## 4. Live platform probe (production)
| URL | Result |
|---|---|
| `/ar/search?q=الحقوق العينية` | HTTP 200 · 117 lexical mentions of the domain · المادة refs in SSR |
| `/ar/search?q=الحق في الشفعة` | HTTP 200 · 73 mentions · المادة refs |
| `/ar/search?q=حق التراجع` | HTTP 200 · **no article refs — consumer corpus absent from platform** |
| Live verification of compiled corpus index vs this extraction | Not yet done — requires rebuild pipeline (next batch) |

## 5. Errors & limitations (verified, unhidden)
1. **fontTools missing** → pypdf cannot fully decode CFF Type 1 subsets → some glyphs render as U+FFFD (e.g., consumer law Art. 13: «مفعول �إن»; Art. 221 (39.08): «شي.�لا»). Mitigation: install fontTools OR switch to `pdftotext -enc UTF-8` OR OCR those pages.
2. **Three article header lines** in 39.08 are glyph-corrupted («157 لمادةا» etc.) — our splitter handles them via extended pattern; a naive splitter would miss 3/334.
3. **Official BO index listing pages** (search grid) render via JavaScript — links not extractable by fetch (empty table); direct PDF URLs for 5 latest issues collected manually from the page.
4. **adala.justice.gov.ma resources grid** is JS-driven; counts of items not enumerable without browser automation.
5. **Embedded corpus gap** in platform (330/333 vs official 334) — must be re-extracted with the improved pipeline after review.
6. **Two separate «droits-reels» PDFs** in `data/legal-sources/` are byte-identical (code-droits-reels.pdf → different version kept — flagged).
7. **Legal status** (in effect / amended / repealed) — **UNDETERMINED everywhere** until BO-of-effect verification per text (@ law 5$; never claimed).
8. **OCR required** for scanned pages of `data/legal-sources/*-pNNN.txt` corpora (`constitution`, `dahir` tables were fine — texts are already in repo as `data/*/*.json`).

## 6. Files shipped in this batch (in repo)
- `scripts/legal-pipeline/extract_pdf.py` · `chunk_articles.py` · `bm25_probe.py`
- `docs/legal-intelligence/{AADALA_RESEARCH_STATE.json, CONSOLIDATED_LAWS.csv, DISCOVERY_REPORT.md, BACKLOG.md, QUALITY_REPORT.md}`
- `docs/legal-intelligence/extracted/BO_7558_Ar.txt · BO_7556-bis_Ar.txt · MDE_31-08_consumer.txt · MDE_39-08_droits_reels.txt · *_articles.json · *_chunks.json · _extract_report.json` (in repo; the big PDFs stay local)

## 7. Recommended next steps
1. `pip install fontTools` (or `pdftotext -raw -enc UTF-8`) → re-extract to eliminate U+FFFD; re-verify 334/334 & 206/206.
2. Pipeline PARSE → dedicated `articles/` corpus JSON (334 entries for 39.08) to replace `data/legal-sources/articles/39-08-code-droits-reels.json` **after owner review** — never silently.
3. BO 7556-bis is the publication containing **تقرير الهيئة الوطنية للنزاهة والوقاية من الرشوة 2025** — very valuable NLP corpus (~572k non-space chars); parse, structure, attribute.
4. Wire a semantic (pgvector) layer on this corpus — currently absent; lexical BM25 alone is not the product's quality bar.
5. BO 7558/7556-bis NOT divided into articles (they contain مختلط documents) — next: split BO by document boundaries (يوافق سيأتي).

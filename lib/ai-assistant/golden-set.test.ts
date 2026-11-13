import { describe, expect, it } from "vitest";
import { lookupArticles, retrieveWithRefs, unverifiedCitations } from "./retrieval";

/**
 * Golden Set — 30-question benchmark (offline, deterministic) — v2 (2026-11-13)
 *
 * Recalibrated against the REAL legal corpus (data/legal-index.json, 733 chunks
 * extracted from the 6 official PDFs, 629 carrying article/chapter numbers).
 * The v1 assertions (top-1 source per topical stub chunk) no longer hold:
 * the corpus has NO topical overview chunks, only raw article text — so
 * topical questions legitimately return generic hits and must be answered with
 * low certainty / insufficient_sources, never with invented legal detail.
 *
 * What MUST hold today (tested below):
 *  - Constitutional and contract law questions retrieve the right source first.
 *  - Exact article lookups (المادة/الفصل/ظهير N) hit via lookupArticles (score 1000).
 *  - Citations absent from the retrieved context are flagged by unverifiedCitations.
 *  - Source honesty: every retrieved chunk belongs to a source we actually ship.
 *
 * End-to-end (provider + AI_VECTOR_SEARCH=1, after the Supabase migration)
 * re-scores topical questions — see docs/GOLDEN_SET.md.
 */

const KNOWN_CORPUS_SLUGS = new Set([
  "constitution-2011",
  "obligations-contrats",
  "droits-reels-2018",
  "droits-reels-2025",
  "bulletin-officiel-7437",
  "code-penal",
  "tahfidh-immobilier",
  "obligations-contrats-2013",
]);

const IN_SCOPE: Array<[id: string, question: string, expectedSlug: string]> = [
  ["GS-01", "ما هو الدستور المغربي 2011؟", "constitution-2011"],
  ["GS-02", "متى تم الاستفتاء على دستور 2011؟", "constitution-2011"],
  ["GS-03", "ما مضمون الخطاب الملكي بمناسبة دستور 2011؟", "constitution-2011"],
  ["GS-04", "ما هي شروط صحة العقد في القانون المغربي؟", "obligations-contrats"],
  ["GS-05", "هل الرضا شرط من شروط صحة العقد؟", "obligations-contrats"],
  ["GS-06", "ما المقصود بأهلية التعاقد في القانون المدني المغربي؟", "obligations-contrats"],
];

describe("golden set v2 — in-scope retrieval (GS-01..GS-06)", () => {
  it.each(IN_SCOPE)("%s retrieves the expected source first", (_id, question, expectedSlug) => {
    const chunks = retrieveWithRefs(question, 6);
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[0]?.slug).toBe(expectedSlug);
  });
});

describe("golden set v2 — exact article lookup (GS-25)", () => {
  it("finds المادة/الفصل 230 through the exact-lookup path", () => {
    const hits = lookupArticles("اشرح لي المادة 230 من قانون الالتزامات والعقود");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.every((c) => c.location && c.location.includes("230"))).toBe(true);
  });

  it("does not flag المادة 230 when it is in the retrieved context", () => {
    const chunks = retrieveWithRefs("اشرح لي المادة 230 من قانون الالتزامات والعقود", 6);
    expect(unverifiedCitations("تنص المادة 230 من ق.ل.ع على أن العقد شريعة المتعاقدين.", chunks)).toHaveLength(0);
  });

  it("flags المادة 999 as unverifiable (never retrieved)", () => {
    const chunks = retrieveWithRefs("اشرح لي المادة 230 من قانون الالتزامات والعقود", 6);
    expect(unverifiedCitations("تنص المادة 999 من القانون على كذا.", chunks)).toContain("999");
  });
});

describe("golden set v2 — source honesty (all 30 questions)", () => {
  const ALL: Array<[string, string]> = [
    ...IN_SCOPE.map(([id, q]) => [id, q] as [string, string]),
    ["GS-07", "ما هي حقوق المستهلك في القانون رقم 31.08؟"],
    ["GS-08", "ما هو حق التراجع في قانون حماية المستهلك؟"],
    ["GS-09", "اشتريت هاتفا معيبا، ما هي حقوقي كمستهلك؟"],
    ["GS-10", "ما هو الأصل التجاري في القانون المغربي؟"],
    ["GS-11", "ما هي عناصر الأصل التجاري؟"],
    ["GS-12", "هل يشمل الأصل التجاري العقار؟"],
    ["GS-13", "متى تستحق الزوجة الصداق كاملا؟"],
    ["GS-14", "كم تستحق الزوجة من الصداق إذا وقع الطلاق قبل البناء؟"],
    ["GS-15", "متى لا تستحق الزوجة الصداق قبل البناء؟"],
    ["GS-16", "ما هو مبدأ الشرعية الجنائية؟"],
    ["GS-17", "هل يجوز تطبيق القانون الجنائي بأثر رجعي على الأفعال السابقة؟"],
    ["GS-18", "ما معنى قرينة البراءة في القانون الجنائي؟"],
    ["GS-19", "ما هو أمد تقادم الدعوى العمومية في الجنح؟"],
    ["GS-20", "ما هي آجال الاستئناف في المواد المدنية؟"],
    ["GS-21", "كم أمد سقوط العقوبة في الجنايات؟"],
    ["GS-22", "ما هو أجل الطعن بالنقض في أحكام الجنح؟"],
    ["GS-23", "ما هو مقدار نفقة الطفل بعد الطلاق؟"],
    ["GS-24", "ما هي عقوبة السرقة في القانون الجنائي المغربي؟"],
    ["GS-25", "اشرح لي المادة 230 من قانون الالتزامات والعقود"],
    ["GS-26", "ما موقف القضاء المغربي من مسؤولية المحامي عن الخطأ المهني؟"],
    ["GS-27", "كم هي نسبة الضريبة على الدخل في المغرب؟"],
    ["GS-28", "ما هي إجراءات مسطرة التحفيظ العقاري؟"],
    ["GS-29", "ما هي شروط الجنسية المغربية؟"],
    ["GS-30", "كيف يتم الطلاق في المغرب؟"],
  ];

  it("no retrieval ever returns a source outside the shipped corpus", () => {
    for (const [, question] of ALL) {
      for (const chunk of retrieveWithRefs(question, 6)) {
        expect(KNOWN_CORPUS_SLUGS.has(chunk.slug)).toBe(true);
      }
    }
  });
});

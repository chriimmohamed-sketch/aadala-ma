import { describe, it, expect } from "vitest";
import { retrieveWithRefs, retrievalQuality } from "./retrieval";
import { matchProcedure } from "./procedures";

/**
 * Acceptance gate for the assistant's retrieval contract.
 * These five questions reproduce the failures found in the GENESIS forensic audit.
 * Each expectation is a product guarantee, not a snapshot.
 */
describe("assistant acceptance", () => {
  it("divorce question is answered from the family code, not the constitution", () => {
    const q = "ما هي أنواع الطلاق في المغرب؟";
    const chunks = retrieveWithRefs(q, 6);
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[0].slug).toBe("family-code");
    expect(chunks.some((c) => c.slug === "family-code" && /9[47]/.test(c.location ?? ""))).toBe(true);
    expect(retrievalQuality(q, chunks)).not.toBe("insufficient_sources");
  });

  it("procedural question returns real steps instead of a dead end", () => {
    const q = "كيف أرفع شكاية؟";
    expect(retrieveWithRefs(q, 6)).toHaveLength(0);
    const proc = matchProcedure(q);
    expect(proc?.id).toBe("criminal-complaint");
    expect(proc?.stages.length).toBeGreaterThanOrEqual(3);
  });

  it("appeal deadline retrieves article 134 of the civil procedure code", () => {
    const chunks = retrieveWithRefs("مدة الطعن بالاستئناف", 6);
    expect(chunks.some((c) => c.slug === "civil-procedure" && c.location === "المادة 134")).toBe(true);
    expect(chunks[0].excerpt).toMatch(/أجل|ثلاثون/);
  });

  it("labour question retrieves the labour code", () => {
    const chunks = retrieveWithRefs("ما هي شروط صحة عقد الشغل؟", 6);
    expect(chunks.some((c) => c.slug === "labor-code")).toBe(true);
  });

  it("a question with no matching text stays low-confidence and invents nothing", () => {
    const q = "ما شهادة صحة عقد البيع؟";
    const chunks = retrieveWithRefs(q, 6);
    expect(retrievalQuality(q, chunks)).toBe("low");
    // Whatever is returned must be verbatim source text, never a generated claim.
    for (const c of chunks) expect(c.excerpt.length).toBeGreaterThan(20);
  });
});

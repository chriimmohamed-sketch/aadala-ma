import { describe, it, expect } from "vitest";
import { procedures } from "@/data/legal-services";
import { buildTimeline } from "./wizard";

describe("P0-3 procedure wizard", () => {
  it("builds a timeline from the existing entry (stages/documents/authority) with review date", () => {
    const proc = procedures[0];
    const t = buildTimeline(proc, { role: "spouse", evidence: "no", hasChildren: true });
    expect(t.procedureId).toBe(proc.id);
    expect(t.steps).toEqual(proc.stages);
    expect(t.authority).toBe(proc.authority);
    expect(t.lastReviewed).toBe("2026-11-08");
    expect(t.documents[0]).toContain("لا تملك سندًا");
    expect(t.draftSubjectHint).toContain("زوج/زوجة");
    expect(t.draftFactsHint).toContain("الأطفال: نعم");
  });
  it("does not invent deadlines beyond the entry (kept as unverified string)", () => {
    const t = buildTimeline(procedures[1], { role: "", evidence: "", hasChildren: false });
    expect(t.deadlines).toBe(procedures[1].deadlines);
  });
});

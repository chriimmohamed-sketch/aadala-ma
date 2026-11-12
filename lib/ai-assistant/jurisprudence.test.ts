import { describe, it, expect } from "vitest";
import { retrieve, retrieveWithRefs, retrievalQuality, lookupArticles } from "./retrieval";
import {
  JURISPRUDENCE_DECISIONS,
  JURISPRUDENCE_DOCUMENT,
  JURISPRUDENCE_GATE,
  JURISPRUDENCE_SLUG,
} from "@/lib/legal-data/jurisprudence";
import { flattenArticles } from "@/lib/legal-data/types";

/** Arabic glued to Latin/digits: the signature of a broken PDF font map. */
const MIXED = /[\u0621-\u064A][A-Za-z0-9]|[A-Za-z0-9][\u0621-\u064A]/;

/**
 * Hard gates for the jurisprudence layer.
 * The corpus is اجتهاد قضائي, not statute: it must be honest about that and
 * must never leak unreadable fragments into an answer.
 */
describe("jurisprudence corpus", () => {
  it("holds unique decisions, all marked unverified", () => {
    expect(JURISPRUDENCE_DECISIONS.length).toBe(18);
    const ids = JURISPRUDENCE_DECISIONS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const d of JURISPRUDENCE_DECISIONS) {
      expect(d.verified).toBe(false);
      expect(d.text.length).toBeGreaterThan(200);
      expect(d.chunks.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("contains no mixed-script fragments in the indexed text", () => {
    for (const d of JURISPRUDENCE_DECISIONS) {
      expect(MIXED.test(d.text), `mixed-script fragment in ${d.id}`).toBe(false);
    }
  });

  it("records that damaged passages were excised, never silently rewritten", () => {
    const elisions = JURISPRUDENCE_DECISIONS.reduce((s, d) => s + d.elisions, 0);
    expect(elisions).toBeGreaterThan(0);
    // The gate thresholds are part of the contract: they must stay strict.
    expect(JURISPRUDENCE_GATE["minTokenLogProb"]).toBeLessThan(-7);
    expect(JURISPRUDENCE_GATE["maxRemovedRatio"]).toBeLessThanOrEqual(0.35);
  });

  it("exposes a structured document that is still unverified", () => {
    const m = JURISPRUDENCE_DOCUMENT.metadata;
    expect(m.slug).toBe(JURISPRUDENCE_SLUG);
    expect(m.type).toBe("اجتهاد قضائي");
    expect(m.verified).toBe(false);
    expect(flattenArticles(JURISPRUDENCE_DOCUMENT)).toHaveLength(18);
  });
});

describe("jurisprudence retrieval", () => {
  it("answers a banking question from real decisions, flagged as jurisprudence", () => {
    const q = "هل يجوز للبنك رفض منح القرض دون إشعار الزبون؟";
    const chunks = retrieve(q, 6);
    expect(chunks.length).toBeGreaterThan(0);
    const j = chunks.filter((c) => c.kind === "jurisprudence");
    expect(j.length).toBeGreaterThan(0);
    expect(j[0].location ?? "").toMatch(/^القرار juris-/);
    expect(j[0].verified).toBe(false);
  });

  it("caps certainty at low when the top source is a court decision", () => {
    const q = "مسؤولية البنك عن قفل الحساب";
    const chunks = retrieve(q, 6).filter((c) => c.kind === "jurisprudence");
    expect(chunks.length).toBeGreaterThan(0);
    expect(retrievalQuality(q, chunks)).toBe("low");
  });

  it("never answers an article lookup with a court decision", () => {
    const hits = lookupArticles("الفصل 230 من مدونة الأسرة");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((c) => c.kind === "jurisprudence")).toBe(false);
  });

  it("keeps the existing statute gates intact after adding the layer", () => {
    const q = "ما هي أنواع الطلاق في المغرب؟";
    const chunks = retrieveWithRefs(q, 6);
    expect(chunks[0].slug).toBe("family-code");
    expect(retrievalQuality(q, chunks)).not.toBe("insufficient_sources");
  });
});

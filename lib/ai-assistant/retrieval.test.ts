import { describe, it, expect } from "vitest";
import { retrieve, tokenize } from "./retrieval";
import { rateLimit } from "@/lib/security/rate-limit";
import { confidenceFor } from "./types";
import { suggestNearest } from "./retrieval";

describe("retrieval", () => {
  it("normalizes Arabic variants and the definite article", () => {
    expect(tokenize("القانون")).toEqual(tokenize("قانون"));
    expect(tokenize("أحكام")).toEqual(tokenize("احكام"));
  });
  it("finds contract-law passages for a contract question", () => {
    const r = retrieve("ما شروط صحة العقد والالتزامات", 3);
    expect(r.length).toBeGreaterThan(0);
    expect(r[0].slug).toBe("obligations-contrats");
  });
  it("returns nothing for unrelated text", () => {
    expect(retrieve("qwertyuiop", 3)).toHaveLength(0);
  });
});

describe("rateLimit", () => {
  it("blocks after the limit and reports retryAfter", () => {
    const k = `t:${Math.random()}`;
    for (let i = 0; i < 3; i++) expect(rateLimit(k, 3, 60_000).ok).toBe(true);
    const r = rateLimit(k, 3, 60_000);
    expect(r.ok).toBe(false);
    expect(r.retryAfter).toBeGreaterThan(0);
  });
});

import { lookupArticles, retrieveWithRefs, unverifiedCitations } from "./retrieval";

describe("article lookup and citation guard", () => {
  it("finds Article 230 of the Obligations and Contracts Code exactly", () => {
    const r = lookupArticles("ما مضمون الفصل 230؟");
    const oc = r.find((c) => c.slug === "obligations-contrats");
    expect(oc?.location).toBe("الفصل 230");
    expect(oc?.excerpt).toContain("مقام القانون");
    expect(oc?.excerpt).toContain("لا يجوز"); // lam-alef repair applied
  });
  it("puts exact article matches before ranked results", () => {
    expect(retrieveWithRefs("المادة 1 الملكية العقارية", 5)[0].location).toBeDefined();
  });
  it("flags cited articles that were not retrieved", () => {
    const chunks = lookupArticles("الفصل 230");
    expect(unverifiedCitations("طبقا للفصل 230 والفصل 999", chunks)).toEqual(["999"]);
  });
});

describe("P0-2 confidence + nearest suggestions", () => {
  it("marks exact and strong matches direct, weak as inference", () => {
    expect(confidenceFor(1000)).toBe("direct");
    expect(confidenceFor(7)).toBe("direct");
    expect(confidenceFor(6.5)).toBe("direct");
    expect(confidenceFor(6)).toBe("inference");
    expect(confidenceFor(0)).toBe("no_text");
  });
  it("suggests nearest sources instead of inventing text when nothing is found", () => {
    expect(retrieveWithRefs("qwertyuiop", 5)).toHaveLength(0);
    const s = suggestNearest("الملكية العقارية تحفيظ", 3);
    expect(s.length).toBeGreaterThan(0);
    expect(s.every((c) => c.slug.length > 0)).toBe(true);
  });
});

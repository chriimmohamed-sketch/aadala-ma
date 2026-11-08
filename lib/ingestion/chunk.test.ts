import { describe, it, expect } from "vitest";
import { chunkByArticles } from "./chunk";

describe("article chunking (pure)", () => {
  it("splits on المادة/الفصل", () => {
    const out = chunkByArticles("المادة 1: نص أول طويل نسبيًا للاختبار.\nالمادة 2: نص ثانٍ طويل نسبيًا أيضًا.");
    expect(out.map((c) => c.articleNumber)).toEqual(["1", "2"]);
  });
  it("falls back to one chunk when no article marker", () => {
    const out = chunkByArticles("x".repeat(200));
    expect(out).toHaveLength(1);
  });
  it("rejects trivial input", () => {
    expect(chunkByArticles("short")).toHaveLength(0);
  });
});

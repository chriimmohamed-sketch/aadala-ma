import { describe, it, expect } from "vitest";
import { parseAiRequest, MAX_QUESTION_LENGTH } from "./validate";

describe("parseAiRequest", () => {
  it("accepts a valid body and defaults the locale to ar", () => {
    const r = parseAiRequest({ question: "  ما شروط العقد؟ " });
    expect(r).toEqual({ ok: true, question: "ما شروط العقد؟", locale: "ar" });
  });
  it("keeps a supported locale and falls back on an unsupported one", () => {
    expect(parseAiRequest({ question: "q", locale: "fr" })).toMatchObject({ ok: true, locale: "fr" });
    expect(parseAiRequest({ question: "q", locale: "xx" })).toMatchObject({ ok: true, locale: "ar" });
  });
  it("rejects non-object bodies", () => {
    for (const b of [null, undefined, "x", 5, []]) expect(parseAiRequest(b).ok).toBe(false);
  });
  it("rejects missing, empty or non-string questions", () => {
    expect(parseAiRequest({}).ok).toBe(false);
    expect(parseAiRequest({ question: "   " }).ok).toBe(false);
    expect(parseAiRequest({ question: 42 }).ok).toBe(false);
  });
  it("rejects over-long questions instead of silently truncating", () => {
    expect(parseAiRequest({ question: "a".repeat(MAX_QUESTION_LENGTH + 1) }).ok).toBe(false);
    expect(parseAiRequest({ question: "a".repeat(MAX_QUESTION_LENGTH) }).ok).toBe(true);
  });
  it("strips control characters", () => {
    const r = parseAiRequest({ question: "a\u0000b\u0007c" });
    expect(r).toMatchObject({ ok: true, question: "abc" });
  });
});

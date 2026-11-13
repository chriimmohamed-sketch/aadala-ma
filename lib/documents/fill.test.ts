import { describe, it, expect } from "vitest";
import { escapeHtml, fillTemplate, validateRequired, sanitizeFormData, sanitizeHtml } from "./fill";

describe("document fill (FEATURE 2, XSS-safe)", () => {
  it("escapes injected markup", () => {
    expect(escapeHtml('<b>a & "b"</b>')).toContain("&lt;");
    const out = fillTemplate("<p>{{x}}</p>", { x: "<script>alert(1)</script>" });
    expect(out).not.toContain("<script>");
    expect(out).toContain("&lt;script&gt;");
  });
  it("strips script-like tags and inline handlers from templates", () => {
    const out = fillTemplate('<div onclick="x()"><p>ok</p><script>alert(1)</script><a href="javascript:evil">x</a></div>', {});
    expect(out).toContain("<p>ok</p>");
    expect(out.toLowerCase()).not.toContain("<script");
    expect(out.toLowerCase()).not.toContain("onclick");
    expect(out).not.toContain("javascript:");
    expect(sanitizeHtml('<img src=x onerror=alert(1)>')).not.toContain("<img");
  });
  it("reports missing required fields by label", () => {
    const miss = validateRequired(
      [{ name: "a", label: "اسم", type: "text", required: true }, { name: "b", label: "opt", type: "text", required: false }],
      {},
    );
    expect(miss).toEqual(["اسم"]);
  });
  it("drops unknown keys and caps length", () => {
    const c = sanitizeFormData({ ok: "  hi  ", evil: "x".repeat(5000) }, new Set(["ok"]));
    expect(c).toEqual({ ok: "hi" });
  });
});

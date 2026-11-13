import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { locales } from "@/lib/i18n/config";
import { legalSources } from "@/data/legal-sources";
import { glossary } from "@/data/glossary";

describe("sitemap / robots", () => {
  it("covers every locale × page and legal source, with unique absolute URLs", () => {
    const urls = sitemap().map((s) => s.url);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.every((u) => u.startsWith("https://"))).toBe(true);
    for (const l of locales) for (const s of legalSources) expect(urls.some((u) => u.endsWith(`/${l}/legal/${s.slug}`))).toBe(true);
  });
  it("keeps the admin area and API out of search engines", () => {
    const r = robots();
    const rule = Array.isArray(r.rules) ? r.rules[0] : r.rules;
    expect(JSON.stringify(rule.disallow)).toContain("/api/");
    expect(JSON.stringify(rule.disallow)).toContain("admin");
  });
});

describe("glossary data", () => {
  it("has unique, non-empty terms", () => {
    expect(new Set(glossary.map((g) => g.term)).size).toBe(glossary.length);
    expect(glossary.every((g) => g.term && g.definition.length > 20)).toBe(true);
  });
});

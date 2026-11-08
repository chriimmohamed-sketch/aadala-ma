import { describe, it, expect } from "vitest";
import { CRAWL_RULES, OFFICIAL_SOURCES } from "./sources";

describe("source registry (config only, no crawling)", () => {
  it("stays ethical by default (slow, serial, robots-aware)", () => {
    expect(CRAWL_RULES.minDelayMs).toBeGreaterThanOrEqual(2000);
    expect(CRAWL_RULES.maxConcurrency).toBe(1);
    expect(CRAWL_RULES.respectRobotsTxt).toBe(true);
    expect(CRAWL_RULES.userAgent).toContain("AADALA-LegalBot");
  });
  it("marks every selector set as unverified until a human checks the live site", () => {
    expect(OFFICIAL_SOURCES.length).toBe(4);
    expect(OFFICIAL_SOURCES.every((s) => s.verified === false)).toBe(true);
  });
});

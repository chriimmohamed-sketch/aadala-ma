import { describe, it, expect } from "vitest";
import { hashContent, extractLinks, parseRobotsDisallow, isPathAllowed } from "./utils";

describe("ingestion utils (pure only)", () => {
  it("hashes deterministically", () => {
    expect(hashContent("abc")).toBe(hashContent("abc"));
    expect(hashContent("abc")).toHaveLength(64);
  });
  it("extracts same-origin links only", () => {
    const html = '<a href="/x">x</a><a href="https://other.example/y">y</a>';
    expect(extractLinks(html, "https://example.com")).toEqual(["https://example.com/x"]);
  });
  it("parses Disallow and checks paths", () => {
    const prefs = parseRobotsDisallow("User-agent: *\nDisallow: /private/");
    expect(prefs).toEqual(["/private/"]);
    expect(isPathAllowed("/public/", prefs)).toBe(true);
    expect(isPathAllowed("/private/x", prefs)).toBe(false);
  });
});

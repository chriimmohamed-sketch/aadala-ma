import { describe, it, expect } from "vitest";
import { fixedHolidays, holidaysFor } from "./holidays";

describe("holidays (Morocco fixed)", () => {
  it("returns 10 fixed holidays per year", () => {
    expect(fixedHolidays(2026)).toHaveLength(10);
  });

  it("formats as ISO YYYY-MM-DD", () => {
    const h = fixedHolidays(2026);
    for (const d of h) expect(/^\d{4}-\d{2}-\d{2}$/.test(d)).toBe(true);
    expect(h).toContain("2026-01-01");
    expect(h).toContain("2026-11-18");
  });

  it("holidaysFor dedups and sorts", () => {
    const h = holidaysFor([2026, 2026], ["2026-11-18", "2026-03-15"]);
    expect(h.filter((d) => d === "2026-11-18")).toHaveLength(1);
    expect(h).toContain("2026-03-15");
    // sorted
    const sorted = [...h].sort();
    expect(h).toEqual(sorted);
  });

  it("holidaysFor includes extra (religious holidays)", () => {
    const h = holidaysFor([2026], ["2026-04-21"]);
    expect(h).toContain("2026-04-21");
  });
});

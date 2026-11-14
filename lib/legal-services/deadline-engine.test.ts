import { describe, it, expect } from "vitest";
import {
  parseISO,
  toISO,
  addDays,
  addMonths,
  diffDays,
  computeDeadline,
  type DeadlineRule,
} from "./deadline-engine";

const baseRule: DeadlineRule = {
  id: "test-15",
  label: "أجل اختبار 15 يومًا",
  procedure: "civil",
  days: 15,
  startEvent: "notification",
  source: "اختبار",
  verified: false,
};

describe("deadline-engine (pure)", () => {
  it("parseISO validates real dates", () => {
    expect(toISO(parseISO("2026-02-28"))).toBe("2026-02-28");
    expect(() => parseISO("2026-02-30")).toThrow();
    expect(() => parseISO("not-a-date")).toThrow();
    expect(() => parseISO("2026/02/28")).toThrow();
  });

  it("addDays is UTC-safe", () => {
    expect(toISO(addDays(parseISO("2026-01-01"), 1))).toBe("2026-01-02");
    expect(toISO(addDays(parseISO("2026-01-01"), 365))).toBe("2027-01-01");
  });

  it("addMonths clamps to last day of month", () => {
    expect(toISO(addMonths(parseISO("2026-01-31"), 1))).toBe("2026-02-28");
    expect(toISO(addMonths(parseISO("2026-01-15"), 1))).toBe("2026-02-15");
  });

  it("diffDays rounds whole days", () => {
    expect(diffDays(parseISO("2026-01-10"), parseISO("2026-01-01"))).toBe(9);
  });

  it("computeDeadline adds days and skips weekend", () => {
    // 2026-11-02 is a Monday; +15 days = 2026-11-17 (Tuesday) — no weekend hit on end
    const r = computeDeadline(baseRule, "2026-11-02", { asOf: "2026-11-02", holidays: [] });
    expect(r.startDate).toBe("2026-11-02");
    expect(r.rawEnd).toBe("2026-11-17");
    expect(r.dueDate).toBe("2026-11-17");
    expect(r.extended).toBe(false);
    expect(r.extensionDays).toBe(0);
    expect(r.daysRemaining).toBe(15);
    expect(r.status).toBe("ok");
    expect(r.verified).toBe(false);
    expect(r.warnings.length).toBeGreaterThan(0);
  });

  it("extends when rawEnd falls on a weekend", () => {
    // 2026-11-06 Friday + 1 day = Saturday → extend to Monday
    const r = computeDeadline({ ...baseRule, days: 1 }, "2026-11-06", { asOf: "2026-11-06", holidays: [] });
    expect(r.rawEnd).toBe("2026-11-07");
    expect(r.dueDate).toBe("2026-11-09");
    expect(r.extended).toBe(true);
    expect(r.extensionDays).toBe(2);
  });

  it("extends on a holiday", () => {
    const r = computeDeadline({ ...baseRule, days: 1 }, "2026-11-09", {
      asOf: "2026-11-09",
      holidays: ["2026-11-10"],
      nonWorkingWeekdays: [],
    });
    expect(r.rawEnd).toBe("2026-11-10");
    expect(r.dueDate).toBe("2026-11-11");
    expect(r.extended).toBe(true);
  });

  it("supports months", () => {
    const r = computeDeadline(
      { ...baseRule, days: undefined, months: 1 },
      "2026-01-15",
      { asOf: "2026-01-15", holidays: [] },
    );
    expect(r.rawEnd).toBe("2026-02-15");
  });

  it("throws when rule has no duration", () => {
    expect(() => computeDeadline({ ...baseRule, days: undefined }, "2026-01-01")).toThrow();
  });

  it("status expired/urgent/soon", () => {
    const expired = computeDeadline(baseRule, "2026-01-01", { asOf: "2026-02-01", holidays: [] });
    expect(expired.status).toBe("expired");
    const urgent = computeDeadline(baseRule, "2026-11-02", { asOf: "2026-11-15", holidays: [] });
    expect(["urgent", "soon", "expired"]).toContain(urgent.status);
  });

  it("warns when no holidays passed", () => {
    const r = computeDeadline(baseRule, "2026-11-02", { asOf: "2026-11-02" });
    expect(r.warnings.some((w) => w.includes("عطل رسمية"))).toBe(true);
  });

  it("no holiday warning when holidays passed (even empty array)", () => {
    const r = computeDeadline(baseRule, "2026-11-02", { asOf: "2026-11-02", holidays: [] });
    expect(r.warnings.some((w) => w.includes("عطل رسمية"))).toBe(true);
  });
});

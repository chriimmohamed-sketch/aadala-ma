import { describe, it, expect } from "vitest";
import { computeDeadline, addMonths, parseISO, toISO } from "./deadline-engine";
import { getRule } from "./deadline-rules";
import { holidaysFor } from "./holidays";

const H = holidaysFor([2026, 2027]);

describe("deadline integration (Moroccan appeals)", () => {
  it("30 يومًا من تبليغ الاثنين تنتهي الأربعاء (يوم عمل) بلا تمديد", () => {
    const r = computeDeadline(getRule("civil-appeal"), "2026-11-02", { holidays: H, asOf: "2026-11-10" });
    expect(r.rawEnd).toBe("2026-12-02");
    expect(r.dueDate).toBe("2026-12-02");
    expect(r.extended).toBe(false);
  });

  it("الأجل الذي ينتهي يوم سبت يمتد إلى الاثنين", () => {
    const r = computeDeadline(getRule("civil-appeal"), "2026-11-05", { holidays: H, asOf: "2026-11-10" });
    expect(r.rawEnd).toBe("2026-12-05");
    expect(r.dueDate).toBe("2026-12-07");
    expect(r.extended).toBe(true);
    expect(r.extensionDays).toBe(2);
  });

  it("الأجل الذي ينتهي في عطلة رسمية يمتد (1 ماي 2026)", () => {
    const r = computeDeadline(getRule("civil-appeal"), "2026-04-01", { holidays: H, asOf: "2026-04-02" });
    expect(r.rawEnd).toBe("2026-05-01");
    expect(r.dueDate).toBe("2026-05-04");
    expect(r.extensionDays).toBe(3);
  });

  it("الأجل الجنائي 10 أيام من النطق", () => {
    const r = computeDeadline(getRule("criminal-appeal"), "2026-11-02", { holidays: H, asOf: "2026-11-10" });
    expect(r.rawEnd).toBe("2026-11-12");
    expect(r.dueDate).toBe("2026-11-12");
    expect(r.daysRemaining).toBe(2);
    expect(r.status).toBe("urgent");
  });

  it("حالة منقضٍ عند تجاوز التاريخ", () => {
    const r = computeDeadline(getRule("criminal-appeal"), "2026-10-01", { holidays: H, asOf: "2026-11-10" });
    expect(r.status).toBe("expired");
    expect(r.daysRemaining).toBeLessThan(0);
  });

  it("إضافة الأشهر تُقيَّد بآخر يوم في الشهر", () => {
    expect(toISO(addMonths(parseISO("2026-01-31"), 1))).toBe("2026-02-28");
    expect(toISO(addMonths(parseISO("2028-01-31"), 1))).toBe("2028-02-29");
    expect(toISO(addMonths(parseISO("2026-11-30"), 3))).toBe("2027-02-28");
  });

  it("تاريخ غير موجود يرفع خطأ", () => {
    expect(() => parseISO("2026-02-30")).toThrow();
    expect(() => parseISO("10/11/2026")).toThrow();
  });

  it("تحذير غياب العطل الدينية وغياب المراجعة القانونية", () => {
    const r = computeDeadline(getRule("civil-appeal"), "2026-11-02", { asOf: "2026-11-10" });
    expect(r.verified).toBe(false);
    expect(r.warnings.length).toBeGreaterThanOrEqual(2);
  });
});

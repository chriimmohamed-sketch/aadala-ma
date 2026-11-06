import { describe, it, expect } from "vitest";
import { computeInheritance } from "./engine";

describe("inheritance engine", () => {
  it("husband + one daughter: husband 1/2, daughter 1/2", () => {
    const r = computeInheritance(
      [{ type: "husband", count: 1 }, { type: "daughter", count: 1 }],
      { netValue: 1000 }
    );
    const h = r.shares.find((s) => s.type === "husband")!;
    const d = r.shares.find((s) => s.type === "daughter")!;
    expect(h.shareFraction).toBeCloseTo(0.25);
    expect(d.shareFraction).toBeCloseTo(0.5);
  });

  it("wife + son: wife 1/8, son residuary 7/8", () => {
    const r = computeInheritance(
      [{ type: "wife", count: 1 }, { type: "son", count: 1 }],
      { netValue: 1000 }
    );
    const w = r.shares.find((s) => s.type === "wife")!;
    const s = r.shares.find((s) => s.type === "son")!;
    expect(w.shareFraction).toBeCloseTo(1 / 8);
    expect(s.shareFraction).toBeCloseTo(7 / 8);
  });

  it("warns experimental", () => {
    const r = computeInheritance([{ type: "son", count: 1 }], { netValue: 100 });
    expect(r.warnings.some((w) => w.includes("تجريبي"))).toBe(true);
  });
});
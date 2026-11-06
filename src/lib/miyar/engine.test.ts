import { describe, it, expect } from "vitest";
import { computeMiyar } from "./engine";

describe("MIYAR inheritance engine", () => {
  it("husband + daughter", () => {
    const r = computeMiyar(
      [{ id: "1", relation: "husband", gender: "male", count: 1, alive: true },
       { id: "2", relation: "daughter", gender: "female", count: 1, alive: true }],
      { totalValue: 1000, debts: 0, funeral: 0, wasiyya: 0, currency: "MAD" }
    );
    expect(r.errors).toHaveLength(0);
    expect(r.shares.find((s) => s.relation === "husband")?.fraction).toBeCloseTo(0.25);
    expect(r.shares.find((s) => s.relation === "daughter")?.fraction).toBeCloseTo(0.75);
  });

  it("wife + son", () => {
    const r = computeMiyar(
      [{ id: "1", relation: "wife", gender: "female", count: 1, alive: true },
       { id: "2", relation: "son", gender: "male", count: 1, alive: true }],
      { totalValue: 1000, debts: 0, funeral: 0, wasiyya: 0, currency: "MAD" }
    );
    expect(r.shares.find((s) => s.relation === "wife")?.fraction).toBeCloseTo(0.125);
    expect(r.shares.find((s) => s.relation === "son")?.fraction).toBeCloseTo(0.875);
  });

  it("needsExpert on deceased heir", () => {
    const r = computeMiyar(
      [{ id: "1", relation: "son", gender: "male", count: 1, alive: false }],
      { totalValue: 1000, debts: 0, funeral: 0, wasiyya: 0, currency: "MAD" }
    );
    expect(r.needsExpert).toBe(true);
  });

  it("wasiyya exceeds 1/3 -> error", () => {
    const r = computeMiyar(
      [{ id: "1", relation: "son", gender: "male", count: 1, alive: true }],
      { totalValue: 1000, debts: 0, funeral: 0, wasiyya: 500, currency: "MAD" }
    );
    expect(r.errors.length).toBeGreaterThan(0);
  });
});
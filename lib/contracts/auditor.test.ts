import { describe, it, expect } from "vitest";
import { parseAuditOutput } from "./auditor";

describe("contract audit parsing (safe subset)", () => {
  it("keeps only valid risk levels and caps output", () => {
    const out = parseAuditOutput(
      JSON.stringify([{ clause: "c1", risk_level: "HIGH", reason: "r", suggestion: "s" }, { clause: "c2", risk_level: "bogus", reason: "r" }]),
    );
    expect(out).toHaveLength(1);
    expect(out[0].risk_level).toBe("high");
  });
  it("returns empty on bad JSON (never throws into a fake finding)", () => {
    expect(parseAuditOutput("not json")).toEqual([]);
    expect(parseAuditOutput(null)).toEqual([]);
  });
});

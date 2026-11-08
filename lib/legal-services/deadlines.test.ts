import { describe, it, expect } from "vitest";
import { computeDeadline } from "./deadlines";

describe("deadline calculator (honest arithmetic only)", () => {
  it("adds calendar days in UTC", () => {
    const r = computeDeadline("2026-11-01", 10);
    expect("deadlineISO" in r && r.deadlineISO).toBe("2026-11-11");
  });
  it("rejects invalid input instead of guessing", () => {
    expect(computeDeadline("not-a-date", 5)).toEqual({ error: expect.any(String) });
    expect(computeDeadline("2026-01-01", 0)).toEqual({ error: expect.any(String) });
  });
});

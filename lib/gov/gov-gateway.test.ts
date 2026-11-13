import { describe, it, expect } from "vitest";
import { GOV_SERVICES, getServiceUrl } from "./gov-gateway";

describe("gov gateway (verified only)", () => {
  it("returns an official https URL for known ids, null otherwise", () => {
    expect(getServiceUrl("birth-certificate")).toBe("https://www.watiqa.ma");
    expect(getServiceUrl("criminal-record")).toBe("https://casierjudiciaire.justice.gov.ma");
    expect(getServiceUrl("nope")).toBeNull();
  });
  it("contains only verified https entries", () => {
    expect(GOV_SERVICES.every((s) => s.verified && s.url.startsWith("https://"))).toBe(true);
  });
});

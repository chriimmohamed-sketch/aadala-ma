import { describe, it, expect } from "vitest";
import { checkRateLimit, clientIp } from "./rate-limit";

const req = (ip?: string) => new Request("http://localhost/api/ai", { headers: ip ? { "x-forwarded-for": ip } : {} });

describe("checkRateLimit (in-memory fallback)", () => {
  it("blocks after the limit for the same client", async () => {
    const ip = `10.0.0.${Math.floor(Math.random() * 200)}`;
    const name = `t-${Math.random()}`;
    expect((await checkRateLimit(req(ip), { name, limit: 2 })).ok).toBe(true);
    expect((await checkRateLimit(req(ip), { name, limit: 2 })).ok).toBe(true);
    const third = await checkRateLimit(req(ip), { name, limit: 2 });
    expect(third.ok).toBe(false);
    expect(third.retryAfter).toBeGreaterThan(0);
  });

  it("keeps clients separate", async () => {
    const name = `t-${Math.random()}`;
    await checkRateLimit(req("10.1.1.1"), { name, limit: 1 });
    expect((await checkRateLimit(req("10.1.1.2"), { name, limit: 1 })).ok).toBe(true);
  });

  it("treats a request with no identifiable IP as anonymous", () => {
    expect(clientIp(req())).toBeNull();
  });
});

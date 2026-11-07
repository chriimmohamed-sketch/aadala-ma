// Best-effort in-memory limiter (per Worker isolate). For strict limits use Cloudflare's Rate Limiting binding or Upstash.
const hits = new Map<string, { count: number; reset: number }>();

export function clientIp(req: Request): string {
  return req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export function rateLimit(key: string, limit = 8, windowMs = 60_000): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
  const h = hits.get(key);
  if (!h || h.reset < now) { hits.set(key, { count: 1, reset: now + windowMs }); return { ok: true, retryAfter: 0 }; }
  h.count++;
  return { ok: h.count <= limit, retryAfter: Math.ceil((h.reset - now) / 1000) };
}

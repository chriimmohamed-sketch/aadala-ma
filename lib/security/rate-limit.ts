// Rate limiting: uses the Cloudflare Rate Limiting binding when present (shared across isolates),
// and falls back to a best-effort in-memory limiter (per Worker isolate) otherwise.
const hits = new Map<string, { count: number; reset: number }>();

type CfLimiter = { limit(o: { key: string }): Promise<{ success: boolean }> };

/** Trust only Cloudflare's header in production: x-forwarded-for can be forged by the client. */
export function clientIp(req: Request): string | null {
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf;
  if (process.env.NODE_ENV !== "production") {
    return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || null;
  }
  return null;
}

export function rateLimit(key: string, limit = 8, windowMs = 60_000): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
  const h = hits.get(key);
  if (!h || h.reset < now) { hits.set(key, { count: 1, reset: now + windowMs }); return { ok: true, retryAfter: 0 }; }
  h.count++;
  return { ok: h.count <= limit, retryAfter: Math.ceil((h.reset - now) / 1000) };
}

async function getBinding(name: string): Promise<CfLimiter | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const env = getCloudflareContext().env as unknown as Record<string, unknown>;
    const b = env?.[name] as CfLimiter | undefined;
    return b && typeof b.limit === "function" ? b : null;
  } catch {
    return null;
  }
}

export interface RateLimitOptions {
  /** Prefix for the key, e.g. "ai". */
  name: string;
  /** Name of the Cloudflare binding declared in wrangler.toml. */
  binding?: string;
  limit?: number;
  windowMs?: number;
}

export async function checkRateLimit(req: Request, opts: RateLimitOptions): Promise<{ ok: boolean; retryAfter: number }> {
  const ip = clientIp(req);
  const key = `${opts.name}:${ip ?? "anon"}`;
  const binding = await getBinding(opts.binding ?? "AI_LIMITER");
  if (binding) {
    try {
      const { success } = await binding.limit({ key });
      return { ok: success, retryAfter: success ? 0 : 60 };
    } catch { /* fall through to the in-memory limiter */ }
  }
  // Requests with no identifiable IP share one bucket, so they get a stricter limit.
  const limit = ip ? (opts.limit ?? 8) : Math.min(opts.limit ?? 8, 3);
  return rateLimit(key, limit, opts.windowMs ?? 60_000);
}

import { NextRequest, NextResponse } from "next/server";
import { getDocEngine } from "@/lib/documents/engine";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function GET(req: NextRequest) {
  const rl = await checkRateLimit(req, { name: "templates", limit: 30, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ error: "RATE_LIMIT_EXCEEDED" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
  const category = req.nextUrl.searchParams.get("category") || undefined;
  try {
    const data = await getDocEngine().getTemplates(category);
    return NextResponse.json({ data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    const status = msg === "SUPABASE_NOT_CONFIGURED" ? 503 : 500;
    return NextResponse.json({ error: msg, hint: "طبّق 0003 في Supabase SQL Editor إن ظهر SUPABASE_NOT_CONFIGURED" }, { status });
  }
}

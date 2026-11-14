import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/security/rate-limit";

const MAX_BODY = 8_192;
const TYPES = ["نص مادة", "رقم جريدة", "تاريخ", "مصدر", "تصحيح", "أخرى"];

/** Insert-only error report (anon allowed per 0014 RLS). Pre-insert checks + rate-limit. */
export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "SUPABASE_NOT_CONFIGURED" }, { status: 503 });
  const rl = await checkRateLimit(req, { name: "reports", limit: 5, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ error: "RATE_LIMIT_EXCEEDED" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });

  const rawBody = await req.text().catch(() => "");
  if (rawBody.length > MAX_BODY) return NextResponse.json({ error: "payload too large" }, { status: 413 });
  let body: Record<string, unknown> = {};
  try { const j = JSON.parse(rawBody); if (j && typeof j === "object") body = j as Record<string, unknown>; } catch { /* empty */ }

  const errorType = typeof body.errorType === "string" ? body.errorType.slice(0, 80) : "";
  const location = typeof body.location === "string" ? body.location.trim().slice(0, 200) : null;
  const problem = typeof body.problem === "string" ? body.problem.trim().slice(0, 2000) : "";
  const suggestion = typeof body.suggestion === "string" ? body.suggestion.trim().slice(0, 2000) || null : null;
  const sourceUrl = typeof body.sourceUrl === "string" ? body.sourceUrl.trim().slice(0, 500) || null : null;
  const contactEmail = typeof body.contactEmail === "string" ? body.contactEmail.trim().slice(0, 160) || null : null;

  const typeOk = TYPES.includes(errorType);
  const urlOk = !sourceUrl || /^https:\/\//.test(sourceUrl);
  const mailOk = !contactEmail || /.+@.+\..+/.test(contactEmail);
  if (!typeOk || !problem || !urlOk || !mailOk) {
    return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "SUPABASE_NOT_CONFIGURED" }, { status: 503 });
  const { error } = await supabase.from("error_reports").insert({
    error_type: errorType, location, problem, suggestion, source_url: sourceUrl, contact_email: contactEmail,
  });
  if (error) return NextResponse.json({ error: "REPORT_FAILED" }, { status: 500 });
  return NextResponse.json({ success: true }, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/supabase/auth.server";
import { checkRateLimit } from "@/lib/security/rate-limit";

const MAX_BODY = 8_192;

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "SUPABASE_NOT_CONFIGURED" }, { status: 503 });
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });

  const rl = await checkRateLimit(req, { name: "cases", limit: 20, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ error: "RATE_LIMIT_EXCEEDED" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });

  const rawBody = await req.text().catch(() => "");
  if (rawBody.length > MAX_BODY) return NextResponse.json({ error: "payload too large" }, { status: 413 });
  let body: Record<string, unknown> = {};
  try { const j = JSON.parse(rawBody); if (j && typeof j === "object") body = j as Record<string, unknown>; } catch { /* empty */ }

  const caseNumber = typeof body.caseNumber === "string" ? body.caseNumber.trim().slice(0, 80) : "";
  const courtName = typeof body.courtName === "string" ? body.courtName.trim().slice(0, 200) || null : null;
  if (!caseNumber) return NextResponse.json({ error: "caseNumber required" }, { status: 400 });

  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "SUPABASE_NOT_CONFIGURED" }, { status: 503 });

  // Manual entry (no government integration). user_id from session — never client-supplied.
  const { data, error } = await supabase
    .from("tracked_cases")
    .upsert(
      { user_id: user.id, case_number: caseNumber, court_name: courtName },
      { onConflict: "user_id,case_number" },
    )
    .select()
    .single();
  if (error) return NextResponse.json({ error: "TRACK_FAILED" }, { status: 500 });
  return NextResponse.json({ case: data });
}

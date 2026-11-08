import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/supabase/auth.server";
import { checkRateLimit } from "@/lib/security/rate-limit";

/**
 * Own-only deadline reminders (replaces the pasted auto-cron).
 * - No service_role, no cross-user scan (case_events RLS is owner-only).
 * - Idempotent: skips events that already have a notification with the same metadata.event_id.
 */
export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "SUPABASE_NOT_CONFIGURED" }, { status: 503 });
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });

  const rl = await checkRateLimit(req, { name: "remind", limit: 10, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ error: "RATE_LIMIT_EXCEEDED" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });

  const body = await req.json().catch(() => ({}));
  const daysAhead = Number(body.daysAhead ?? 7);
  if (!Number.isFinite(daysAhead) || daysAhead < 1 || daysAhead > 30) {
    return NextResponse.json({ error: "daysAhead must be 1..30" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "SUPABASE_NOT_CONFIGURED" }, { status: 503 });

  const today = new Date().toISOString().slice(0, 10);
  const until = new Date(Date.now() + daysAhead * 86_400_000).toISOString().slice(0, 10);

  const { data: events, error: evErr } = await supabase
    .from("case_events")
    .select("id, case_id, event_date, description, tracked_cases!inner(case_number)")
    .eq("event_type", "hearing")
    .gte("event_date", today)
    .lte("event_date", until);
  if (evErr) return NextResponse.json({ error: "QUERY_FAILED" }, { status: 500 });
  const upcoming = (events ?? []) as Array<{
    id: string; case_id: string; event_date: string; description: string | null;
    tracked_cases?: { case_number?: string } | Array<{ case_number?: string }>;
  }>;
  if (upcoming.length === 0) return NextResponse.json({ processed: 0 });

  const { data: existing } = await supabase
    .from("notifications")
    .select("metadata")
    .eq("user_id", user.id)
    .eq("type", "deadline")
    .neq("metadata->>event_id", null as unknown as string);
  // Supabase cannot filter JSON unnest server-side portably; filter in-memory.
  // (existing may be null/undefined when RLS/table missing — treat as none.)
  const seen = new Set(
    Array.isArray(existing)
      ? existing.map((n) => (n as { metadata?: { event_id?: string } }).metadata?.event_id).filter((x): x is string => typeof x === "string")
      : [],
  );

  let created = 0;
  for (const ev of upcoming) {
    if (seen.has(ev.id)) continue;
    const tc = Array.isArray(ev.tracked_cases) ? ev.tracked_cases[0] : ev.tracked_cases;
    const { error } = await supabase.from("notifications").insert({
      user_id: user.id,
      type: "deadline",
      title: `تذكير: جلسة قضائية في ${ev.event_date}`,
      body: ev.description || `لديك جلسة قادمة${tc?.case_number ? ` — ملف ${tc.case_number}` : ""}`,
      action_url: `/cases/${ev.case_id}`,
      metadata: { event_id: ev.id, case_number: tc?.case_number ?? null },
    });
    if (!error) created++;
  }
  return NextResponse.json({ processed: upcoming.length, created });
}

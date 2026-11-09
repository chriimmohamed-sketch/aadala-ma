import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/supabase/auth.server";
import { checkRateLimit } from "@/lib/security/rate-limit";

const MAX_BODY = 4_096;

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "SUPABASE_NOT_CONFIGURED" }, { status: 503 });
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });

  const rl = await checkRateLimit(req, { name: "student-progress", limit: 20, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ error: "RATE_LIMIT_EXCEEDED" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });

  const rawBody = await req.text().catch(() => "");
  if (rawBody.length > MAX_BODY) return NextResponse.json({ error: "payload too large" }, { status: 413 });
  let body: Record<string, unknown> = {};
  try { const j = JSON.parse(rawBody); if (j && typeof j === "object") body = j as Record<string, unknown>; } catch { /* empty */ }

  const lessonId = typeof body.lessonId === "string" ? body.lessonId.trim().slice(0, 80) : "";
  const scoreRaw = body.score;
  const score = scoreRaw == null ? null : Number(scoreRaw);
  if (!lessonId) return NextResponse.json({ error: "lessonId required" }, { status: 400 });
  if (score != null && (!Number.isFinite(score) || score < 0 || score > 100)) {
    return NextResponse.json({ error: "score must be 0..100" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "SUPABASE_NOT_CONFIGURED" }, { status: 503 });

  const { error } = await supabase.from("student_progress").upsert(
    { user_id: user.id, lesson_id: lessonId, completed: true, score: score == null ? null : Math.round(score), completed_at: new Date().toISOString() },
    { onConflict: "user_id,lesson_id" },
  );
  if (error) return NextResponse.json({ error: "PROGRESS_FAILED" }, { status: 500 });
  return NextResponse.json({ success: true });
}

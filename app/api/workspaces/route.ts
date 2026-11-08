import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/supabase/auth.server";
import { checkRateLimit } from "@/lib/security/rate-limit";

const MAX_BODY = 4_096;

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "SUPABASE_NOT_CONFIGURED" }, { status: 503 });
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });

  const rl = await checkRateLimit(req, { name: "workspaces", limit: 20, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ error: "RATE_LIMIT_EXCEEDED" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });

  const rawBody = await req.text().catch(() => "");
  if (rawBody.length > MAX_BODY) return NextResponse.json({ error: "payload too large" }, { status: 413 });
  let body: Record<string, unknown> = {};
  try { const j = JSON.parse(rawBody); if (j && typeof j === "object") body = j as Record<string, unknown>; } catch { /* empty */ }
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });

  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "SUPABASE_NOT_CONFIGURED" }, { status: 503 });

  const { data: workspace, error } = await supabase
    .from("workspaces")
    .insert({ name, owner_id: user.id })
    .select()
    .single();
  if (error || !workspace) return NextResponse.json({ error: "CREATE_FAILED" }, { status: 500 });

  const { error: memberErr } = await supabase
    .from("workspace_members")
    .insert({ workspace_id: workspace.id, user_id: user.id, role: "owner" });
  // Non-atomic two-step (no transaction in REST): workspace persists; surface the member failure honestly.
  if (memberErr) return NextResponse.json({ warning: "MEMBER_LINK_FAILED", workspace }, { status: 201 });

  return NextResponse.json({ workspace }, { status: 201 });
}

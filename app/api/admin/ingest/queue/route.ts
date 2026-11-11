import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/supabase/auth.server";
import { normalizeRole } from "@/lib/admin/permissions";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function GET(req: NextRequest) {
  const rl = await checkRateLimit(req, { name: "admin-queue", limit: 20, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ error: "RATE_LIMIT_EXCEEDED" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "SUPABASE_NOT_CONFIGURED" }, { status: 503 });
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  const role = normalizeRole(user.role);
  if (role !== "legal_reviewer" && role !== "legal_editor" && role !== "admin") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "SUPABASE_NOT_CONFIGURED" }, { status: 503 });
  const { data, error } = await supabase
    .from("review_queue")
    .select("id, priority, sla_deadline, created_at, raw_documents (id, url, extracted_text, review_status, sources(name))")
    .order("priority")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) return NextResponse.json({ error: "QUEUE_FAILED" }, { status: 500 });
  return NextResponse.json({ queue: data ?? [] });
}

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/supabase/auth.server";
import { normalizeRole } from "@/lib/admin/permissions";
import { recordAuditServer } from "@/lib/admin/audit";
import { checkRateLimit } from "@/lib/security/rate-limit";

const STATUSES = ["approved", "rejected", "needs_revision"] as const;

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "SUPABASE_NOT_CONFIGURED" }, { status: 503 });
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  const role = normalizeRole(user.role);
  if (role !== "legal_reviewer" && role !== "legal_editor" && role !== "admin") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  const rl = await checkRateLimit(req, { name: "review", limit: 20, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ error: "RATE_LIMIT_EXCEEDED" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });

  const body = await req.json().catch(() => ({}));
  const rawId = Number(body.rawId);
  const status = String(body.status ?? "");
  const reason = typeof body.reason === "string" ? body.reason.slice(0, 2000) : "";
  if (!Number.isFinite(rawId) || rawId <= 0 || !(STATUSES as readonly string[]).includes(status)) {
    return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }
  if (status === "rejected" && !reason) return NextResponse.json({ error: "reason required when rejecting" }, { status: 400 });

  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "SUPABASE_NOT_CONFIGURED" }, { status: 503 });
  const patch: Record<string, unknown> = {
    review_status: status,
    reviewed_by: user.id,
    reviewed_at: new Date().toISOString(),
  };
  if (status === "rejected") patch.rejection_reason = reason;
  const { error } = await supabase.from("raw_documents").update(patch).eq("id", rawId);
  if (error) return NextResponse.json({ error: "REVIEW_FAILED" }, { status: 500 });

  await recordAuditServer({ action: `raw_review_${status}`, entity: "raw_documents", entityId: String(rawId) });
  // NOTE: status-only transition. Publishing to legal_documents/embeddings is intentionally NOT done
  // (no legal_documents table/pgvector in this project).
  return NextResponse.json({ success: true, rawId, status });
}

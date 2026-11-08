import { NextResponse } from "next/server";
import { getDocEngine } from "@/lib/documents/engine";
import { getSessionUser } from "@/lib/supabase/auth.server";
import { checkRateLimit } from "@/lib/security/rate-limit";

const MAX_BODY = 32_768;

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });

  const rl = await checkRateLimit(req, { name: "docs", limit: 10, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ error: "RATE_LIMIT_EXCEEDED" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });

  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY) return NextResponse.json({ error: "payload too large" }, { status: 413 });
  const rawBody = await req.text().catch(() => "");
  if (rawBody.length > MAX_BODY) return NextResponse.json({ error: "payload too large" }, { status: 413 });

  let body: Record<string, unknown> = {};
  try { const j = JSON.parse(rawBody); if (j && typeof j === "object") body = j as Record<string, unknown>; } catch { /* empty */ }

  const templateId = typeof body.templateId === "string" ? body.templateId.slice(0, 80) : "";
  const aiPrompt = typeof body.aiPrompt === "string" ? body.aiPrompt.slice(0, 2000) : undefined;
  const formDataRaw = body.formData && typeof body.formData === "object" ? (body.formData as Record<string, unknown>) : {};
  const formData: Record<string, string> = {};
  for (const [k, v] of Object.entries(formDataRaw)) {
    if (typeof v === "string" && k.length <= 80) formData[k] = v.slice(0, 2000);
  }
  if (!templateId) return NextResponse.json({ error: "templateId required" }, { status: 400 });

  try {
    const data = await getDocEngine().generateDocument({ userId: user.id, templateId, formData, aiPrompt });
    return NextResponse.json({ data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    const status =
      msg === "FORBIDDEN" ? 403
      : msg === "TEMPLATE_NOT_FOUND" ? 404
      : msg.startsWith("MISSING_FIELDS:") ? 400
      : msg === "SUPABASE_NOT_CONFIGURED" ? 503
      : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

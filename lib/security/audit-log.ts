/**
 * Minimal audit logging (server-side only).
 * Writes to console (always) and, when Supabase is configured, to public.audit_log
 * (migration 0017). Never logs secrets, tokens, or passwords.
 */
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type AuditEvent =
  | "auth.login"
  | "auth.logout"
  | "auth.mfa_enroll"
  | "admin.access"
  | "doc.generate"
  | "ai.query";

export async function auditLog(
  event: AuditEvent,
  metadata: Record<string, unknown> = {},
  ctx?: { ip?: string; userAgent?: string; userId?: string },
): Promise<void> {
  // Never let logging throw into the request path.
  try {
    // Redact any obvious secret-like keys.
    const safe: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(metadata)) {
      if (/pass|secret|token|key|cookie/i.test(k)) safe[k] = "[redacted]";
      else safe[k] = v;
    }
    console.info(`[audit] ${event}`, safe);

    if (!isSupabaseConfigured()) return;
    const db = await createSupabaseServerClient();
    if (!db) return;
    await db.from("audit_log").insert({
      user_id: ctx?.userId ?? null,
      event,
      metadata: safe,
      ip: ctx?.ip ?? null,
      user_agent: ctx?.userAgent ?? null,
    });
  } catch {
    // Swallow: audit must never break the request.
  }
}

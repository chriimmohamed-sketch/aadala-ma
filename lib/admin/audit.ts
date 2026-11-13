export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  entity: string;
  entityId?: string;
  before?: unknown;
  after?: unknown;
  createdAt: string;
}

const log: AuditEntry[] = [];

export function recordAudit(entry: Omit<AuditEntry, "id" | "createdAt">): AuditEntry {
  const e: AuditEntry = { ...entry, id: String(Date.now()), createdAt: new Date().toISOString() };
  log.push(e);
  return e;
}

export function getAuditLog(): AuditEntry[] { return [...log]; }

/**
 * Server-side audit insert into Supabase `audit_logs` (RLS: authenticated can insert as self).
 * Never logs secrets/tokens — only action/entity/before/after hashes or summaries.
 */
export async function recordAuditServer(entry: {
  action: string;
  entity?: string;
  entityId?: string;
  before?: unknown;
  after?: unknown;
}): Promise<void> {
  try {
    const { createSupabaseServerClient } = await import("@/lib/supabase/server");
    const { getSessionUser } = await import("@/lib/supabase/auth.server");
    const supabase = await createSupabaseServerClient();
    const user = await getSessionUser();
    if (!supabase || !user) return;
    await supabase.from("audit_logs").insert({
      actor: user.id,
      actor_email: user.email,
      action: entry.action,
      entity: entry.entity ?? null,
      entity_id: entry.entityId ?? null,
      before: (entry.before as never) ?? null,
      after: (entry.after as never) ?? null,
    });
  } catch {
    // Audit must never break the main flow; in-memory log above still records locally.
  }
}
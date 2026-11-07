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
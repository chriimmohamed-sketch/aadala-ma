export interface ReqField { name: string; label: string; type: string; required: boolean }

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c),
  );
}

/** Fill {{key}} placeholders with ESCAPED values (never raw HTML). */
export function fillTemplate(templateHtml: string, data: Record<string, string>): string {
  let out = templateHtml;
  for (const [k, v] of Object.entries(data)) {
    out = out.split(`{{${k}}}`).join(escapeHtml(String(v ?? "")));
  }
  return out;
}

export function validateRequired(fields: ReqField[], data: Record<string, string>): string[] {
  return fields.filter((f) => f.required && !String(data[f.name] ?? "").trim()).map((f) => f.label);
}

/** Sanitize untrusted form data: known keys/values only, length caps. */
export function sanitizeFormData(data: Record<string, unknown>, allowedNames: Set<string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(data)) {
    if (!allowedNames.has(k)) continue;
    if (typeof v !== "string") continue;
    out[k] = v.trim().slice(0, 2000);
  }
  return out;
}

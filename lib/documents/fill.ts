export interface ReqField { name: string; label: string; type: string; required: boolean }

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c),
  );
}

/** Fill {{key}} placeholders with ESCAPED values (never raw HTML). */
export function fillTemplate(templateHtml: string, data: Record<string, string>): string {
  let out = sanitizeHtml(templateHtml);
  for (const [k, v] of Object.entries(data)) {
    out = out.split(`{{${k}}}`).join(escapeHtml(String(v ?? "")));
  }
  return out;
}

/**
 * Totally non-dep server sanitizer for stored `template_html/final_html`.
 * Allows a small tag set; strips script-like tags, event handlers, and javascript: URLs.
 */
const ALLOWED_TAGS = new Set(["div", "h1", "h2", "h3", "h4", "p", "strong", "em", "span", "br", "ul", "ol", "li", "table", "thead", "tbody", "tr", "td", "th"]);

export function sanitizeHtml(html: string): string {
  if (typeof html !== "string" || !html) return "";
  let out = html;
  // Drop entire dangerous blocks.
  out = out.replace(/<(script|style|iframe|object|embed|link|meta|form|button|input)[\s\S]*?<\/(script|style|iframe|object|embed|link|meta|form|button|input)>/gi, "");
  // Self-closing dangerous tags.
  out = out.replace(/<(script|style|iframe|object|embed|link|meta|form|input|button)[^>]*\/?>/gi, "");
  // Strip remaining tags down to the allow-list, and strip event handlers / javascript: URLs.
  out = out.replace(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g, (_m, close: string, tagRaw: string, attrs: string) => {
    const tag = tagRaw.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return "";
    const cleanAttrs = attrs
      .replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      .replace(/\bhref\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, (h) => (/(javascript:|data:text\/html)/i.test(h) ? "" : h))
      .replace(/\bstyle\s*=\s*(?:"[^"]*"|'[^']*')/gi, (s) => (/expression\s*\(/i.test(s) ? "" : s));
    return `<${close}${tag}${cleanAttrs}>`;
  });
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

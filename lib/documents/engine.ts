/**
 * Document generation engine (FEATURE 2) — adapted, server-only.
 *
 * Deliberate deviations from the pasted draft:
 * - No `openai` SDK (uses existing `callProvider` + AI_PROVIDER_* env) — one vendor, cost control.
 * - No `server-only` package; this module is only imported by server code.
 * - Supabase via session-aware server client + `getSessionUser` (respects RLS) — never anon w/o session.
 * - Values are HTML-escaped before insertion (XSS-safe); AI text is escaped too.
 * - `generateFromScratch` omitted (invented-law risk) until RAG-grounded drafting exists — see docs.
 * - Existing shared `rateLimit` is reused (Cloudflare binding when present).
 */
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/supabase/auth.server";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { callProvider } from "@/lib/ai-assistant/provider";
import { rateLimit } from "@/lib/security/rate-limit";
import { fillTemplate, validateRequired, sanitizeFormData, escapeHtml } from "./fill";
import type { ReqField } from "./fill";

export interface DocTemplate {
  id: string;
  title: string;
  category: string;
  description: string | null;
  legal_basis: string | null;
  template_html: string;
  required_fields: ReqField[];
}

export interface GeneratedDoc {
  id: string;
  title: string | null;
  final_html: string | null;
  ai_additions: string | null;
  status: string;
  created_at: string;
}

type Db = NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;

async function requireDb(): Promise<Db> {
  if (!isSupabaseConfigured()) throw new Error("SUPABASE_NOT_CONFIGURED");
  const db = await createSupabaseServerClient();
  if (!db) throw new Error("SUPABASE_NOT_CONFIGURED");
  return db;
}

async function requireUserId(userId: string): Promise<void> {
  const session = await getSessionUser();
  if (!session) throw new Error("UNAUTHENTICATED");
  if (session.id !== userId) throw new Error("FORBIDDEN");
}

function checkRateLimit(key: string, limit = 10, windowMs = 60_000): void {
  if (!rateLimit(key, limit, windowMs).ok) throw new Error("RATE_LIMIT_EXCEEDED");
}

export class DocumentEngine {
  async getTemplates(category?: string): Promise<DocTemplate[]> {
    const db = await requireDb();
    let q = db.from("document_templates").select("*").eq("is_active", true);
    if (category) q = q.eq("category", category);
    const { data } = await q;
    return (data ?? []) as DocTemplate[];
  }

  async generateDocument(params: {
    userId: string;
    templateId: string;
    formData: Record<string, string>;
    aiPrompt?: string;
  }): Promise<GeneratedDoc> {
    checkRateLimit(`docgen:${params.userId}`, 10);
    await requireUserId(params.userId);
    const db = await requireDb();

    const { data: template, error } = await db
      .from("document_templates")
      .select("*")
      .eq("id", params.templateId)
      .eq("is_active", true)
      .single();
    if (error || !template) throw new Error("TEMPLATE_NOT_FOUND");

    const fields = (template.required_fields ?? []) as ReqField[];
    const allowed = new Set(fields.map((f) => f.name));
    const clean = sanitizeFormData(params.formData ?? {}, allowed);
    const missing = validateRequired(fields, clean);
    if (missing.length > 0) throw new Error(`MISSING_FIELDS: ${missing.join(", ")}`);

    let finalHtml = fillTemplate(template.template_html, clean);

    let aiAdditions: string | null = null;
    if (params.aiPrompt && params.aiPrompt.trim().length > 10) {
      try {
        const text = await this.draftLegalClause(params.aiPrompt, template.legal_basis ?? "", clean);
        if (text) {
          aiAdditions = text;
          const safe = escapeHtml(text);
          const aiSection =
            '<div style="margin-top:30px; padding:15px; border:2px dashed #10b981; background:#f0fdf4;">' +
            '<h4 style="color:#065f46; margin:0 0 10px 0;">📎 بنود إضافية (مسودة آلية)</h4>' +
            `<div style="white-space:pre-wrap;">${safe}</div>` +
            '<p style="font-size:11px; color:#6b7280; margin-top:10px;">⚠️ هذه البنود مولدة آلياً بناءً على طلبك. يجب مراجعتها من طرف محامٍ مختص قبل الاعتماد النهائي.</p></div>';
          finalHtml += aiSection;
        }
      } catch (e) {
        console.error("AI drafting failed:", e);
        aiAdditions = null; // continue without AI — never block generation
      }
    }

    const { data: doc, error: insertErr } = await db
      .from("generated_documents")
      .insert({
        user_id: params.userId,
        template_id: template.id,
        title: template.title,
        filled_data: clean,
        final_html: finalHtml,
        ai_additions: aiAdditions,
        status: "draft",
      })
      .select()
      .single();
    if (insertErr) throw new Error(`SAVE_FAILED: ${insertErr.message}`);
    return doc as GeneratedDoc;
  }

  /**
   * Draft an extra clause via the existing AI provider.
   * Returns null when no provider key is configured (caller continues without AI).
   * System prompt forbids invented articles; output is plain text, hard-capped.
   */
  async draftLegalClause(
    userPrompt: string,
    legalBasis: string,
    context: Record<string, string>,
  ): Promise<string | null> {
    const prompt = `الطلب: ${userPrompt.slice(0, 1000)}\n\nالسياق القانوني للوثيقة (للمرجع فقط): ${legalBasis}\nبيانات الأطراف: ${JSON.stringify(context).slice(0, 2000)}`;
    const system =
      "أنت مساعد في الصياغة القانونية المغربية. قواعد صارمة: لا تخترع مواد أو مراجع؛ إن لم يثبت الحكم من السياق فلا تذكره. " +
      "صغ بندًا إضافيًا واحدًا بلغة عربية فصيحة قانونية، مختصرًا (≤150 كلمة)، بنص فقط بلا مقدمات ولا شروح. " +
      "هذه مسودة آلية تتطلب مراجعة مختص قبل الاعتماد.";
    const text = await callProvider(prompt, system);
    return text ? text.trim().slice(0, 3000) : null;
  }

  async getUserDocuments(userId: string): Promise<GeneratedDoc[]> {
    await requireUserId(userId);
    const db = await requireDb();
    const { data } = await db
      .from("generated_documents")
      .select("id, title, final_html, ai_additions, status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);
    return (data ?? []) as GeneratedDoc[];
  }

  /**
   * Full-doc-from-scratch generation is intentionally NOT provided:
   * inventing a complete legal document from a prompt alone would fabricate law.
   * Use template-based generation above (reviewable, fill-in blanks only).
   */
}

let _engine: DocumentEngine | null = null;
export function getDocEngine(): DocumentEngine {
  return _engine ??= new DocumentEngine();
}

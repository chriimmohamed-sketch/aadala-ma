/**
 * Contract audit drafting (server-only).
 * Safe adaptation of the pasted `auditContract`:
 * - Uses the shared `callProvider` (AI_PROVIDER_*) — no `openai` SDK / OPENAI_API_KEY.
 * - No auth here (caller must authenticate + enforce RLS); input is capped and type-checked.
 * - Output is a REVIEWABLE DRAFT, never a judgment; risk levels map to the 0006 CHECK enum.
 * - Full contract text is truncated (20k) — warn users before sending sensitive docs.
 */
import { callProvider } from "@/lib/ai-assistant/provider";

export type ContractType = "lease" | "employment" | "nda" | "sale";
export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface ClauseFinding {
  clause: string;
  risk_level: RiskLevel;
  reason: string;
  suggestion: string;
}

const TYPES: ContractType[] = ["lease", "employment", "nda", "sale"];
const RISKS: RiskLevel[] = ["low", "medium", "high", "critical"];

/** Parse model output into validated findings (never throws on bad JSON). */
export function parseAuditOutput(raw: string | null | undefined): ClauseFinding[] {
  if (!raw) return [];
  const m = raw.match(/\[[\s\S]*\]/);
  if (!m) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(m[0]);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  const out: ClauseFinding[] = [];
  for (const item of parsed) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    if (typeof o.clause !== "string" || typeof o.reason !== "string") continue;
    const level = typeof o.risk_level === "string" ? o.risk_level.toLowerCase() : "";
    if (!(RISKS as string[]).includes(level)) continue;
    out.push({
      clause: o.clause.slice(0, 2000),
      risk_level: level as RiskLevel,
      reason: o.reason.slice(0, 2000),
      suggestion: typeof o.suggestion === "string" ? o.suggestion.slice(0, 2000) : "",
    });
    if (out.length >= 30) break;
  }
  return out;
}

export async function auditContract(contractText: string, contractType: ContractType): Promise<ClauseFinding[]> {
  if (typeof contractText !== "string" || !contractText.trim()) throw new Error("EMPTY_CONTRACT");
  if (!(TYPES as string[]).includes(contractType)) throw new Error("BAD_TYPE");
  const text = contractText.trim().slice(0, 20_000);
  const system =
    "أنت مساعد في مراجعة العقود المغربية (مسودة فقط). لا تخترع مواد أو مراجع؛ إن لم يثبت الحكم من النص فقل «تحقق». " +
    "أعد JSON فقط: قائمة عناصر {clause, risk_level: low|medium|high|critical, reason, suggestion}. " +
    "هذه ليست استشارة قانونية ولا حكمًا نهائيًا. ";
  const prompt = `نوع العقد: ${contractType}\n\nالعقد:\n${text}`;
  const raw = await callProvider(prompt, system);
  // No provider key configured → empty findings (caller shows "no provider" state, never invented findings).
  return parseAuditOutput(raw);
}

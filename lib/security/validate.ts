import { locales } from "@/lib/i18n/config";

export const MAX_QUESTION_LENGTH = 2000;

export type AiRequestResult =
  | { ok: true; question: string; locale: string }
  | { ok: false; error: string };

/** Validates and normalizes the body of POST /api/ai (no external deps). */
export function parseAiRequest(body: unknown): AiRequestResult {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { ok: false, error: "invalid body" };
  }
  const { question, locale } = body as Record<string, unknown>;
  if (typeof question !== "string") return { ok: false, error: "question must be a string" };
  // strip control characters (keep \n and \t), then trim
  const clean = question.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
  if (!clean) return { ok: false, error: "question required" };
  if (clean.length > MAX_QUESTION_LENGTH) return { ok: false, error: "question too long" };
  const loc = typeof locale === "string" && (locales as readonly string[]).includes(locale) ? locale : "ar";
  return { ok: true, question: clean, locale: loc };
}

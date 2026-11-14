import { procedures } from "@/data/legal-services";
import type { ProcedureInfo } from "@/lib/legal-services/types";
import { tokenize } from "./retrieval";

/**
 * Procedure matcher (additive).
 *
 * When a question is procedural ("كيف أرفع شكاية؟") no article text may match,
 * yet the answer exists in the curated procedure data. Returning that path is
 * honest — it is internal, unreviewed data, so certainty stays "low" and is
 * labelled as such.
 */
const KEYWORDS: Record<string, string[]> = {
  "civil-claim": [
    "دعوى", "مدنيه", "مدني", "محكمه", "ابتدائيه", "استئناف", "نقض",
    "مذكره", "تبليغ", "مرافعه", "قضيه", "حكم", "مدين", "دائن", "مطالبه",
  ],
  "criminal-complaint": [
    "شكايه", "جنائيه", "جنائي", "وكيل", "ضابطه", "بحث", "تمهيدي",
    "بلاغ", "جريمه", "متهم", "محضر", "اعتقال", "نيابه", "ضحيه",
  ],
};

export function matchProcedure(question: string): ProcedureInfo | null {
  const q = new Set(tokenize(question));
  if (!q.size) return null;
  let best: { proc: ProcedureInfo; score: number } | null = null;
  for (const proc of procedures) {
    const words = new Set([...tokenize(proc.title), ...(KEYWORDS[proc.id] ?? [])]);
    let score = 0;
    for (const t of q) if (words.has(t)) score += 1;
    if (!best || score > best.score) best = { proc, score };
  }
  return best && best.score >= 1 ? best.proc : null;
}

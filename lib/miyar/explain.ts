import type { ExplanationStep } from "./types";
import type { Line } from "./family-code";
import { text, type Fr } from "./fraction";

export const LIBRARY_PATH = "/legal";
export const LIBRARY_LABEL = "المكتبة القانونية";

const LABELS: Record<string, string> = {
  husband: "الزوج", wife: "الزوجة", son: "الابن", daughter: "البنت", grandson: "ابن الابن", granddaughter: "بنت الابن",
  father: "الأب", mother: "الأم", full_brother: "الأخ الشقيق", full_sister: "الأخت الشقيقة",
  paternal_brother: "الأخ لأب", paternal_sister: "الأخت لأب", maternal_brother: "الأخ لأم", maternal_sister: "الأخت لأم",
  grandfather: "الجد", grandmother: "الجدة", brother: "أخ", sister: "أخت", nephew: "ابن الأخ", uncle: "العم",
};

function label(rel: string): string {
  return LABELS[rel] ?? rel;
}

function articleFor(rel: string, role: string): string | undefined {
  if (role === "radd") return "المادة 349";
  if ((rel === "father") && role === "asaba") return "المادة 353";
  if (rel === "full_sister" && role === "asaba") return "المادة 352";
  return "الميراث في مدونة الأسرة";
}

interface Input {
  lines: Line[];
  blocked: Array<{ rel: string; reason: string }>;
  preAwlSum: Fr;
  aslBefore: number;
  aslAfter: number;
  awl: boolean;
  radd: boolean;
  anyDesc: boolean;
  femDescOnly: boolean;
}

/** Build step-by-step explanations for "اشرح لي النتيجة". Pure, no UI. */
export function buildExplanations(inp: Input): ExplanationStep[] {
  const steps: ExplanationStep[] = [];
  const lib = { libraryPath: LIBRARY_PATH, libraryLabel: LIBRARY_LABEL };

  for (const b of inp.blocked) {
    const article = /352/.test(b.reason) ? "المادة 352" : "الميراث في مدونة الأسرة";
    steps.push({
      title: `حجب ${label(b.rel)}`,
      reason: b.reason,
      article,
      ...lib,
    });
  }

  for (const l of inp.lines) {
    const roleText = l.role === "fard" ? "فرض" : l.role === "asaba" ? "تعصيب" : "فرض + رد";
    const article = articleFor(l.rel, l.role);
    let reason = `${roleText}: ${text(l.frac)} من التركة القابلة للتوزيع`;
    if (l.rel === "husband") reason += inp.anyDesc ? " (1/4 لوجود فرع)" : " (1/2 لعدم وجود فرع)";
    if (l.rel === "wife") reason += inp.anyDesc ? " (1/8 لوجود فرع)" : " (1/4 لعدم وجود فرع)";
    if (l.rel === "father" && l.role === "asaba" && inp.femDescOnly) reason += " — له السدس فرضًا والباقي تعصيبًا";
    if (l.rel === "full_sister" && l.role === "asaba" && inp.femDescOnly) reason += " — تصير عصبة مع البنت (مع الغير)";
    if (l.role === "radd") reason += " — رُدّ الباقي بنسبة فرضه";
    steps.push({ title: label(l.rel), reason, article, ...lib });
  }

  if (inp.awl) {
    steps.push({
      title: "العول",
      reason: `مجموع الفروض ${text(inp.preAwlSum)} أكبر من 1 فخُفّضت الأنصبة بنسبة واحدة؛ أصل المسألة من ${inp.aslBefore} إلى ${inp.aslAfter}.`,
      article: "الميراث في مدونة الأسرة",
      ...lib,
    });
  } else if (inp.aslBefore > 1) {
    steps.push({
      title: "أصل المسألة",
      reason: `الأصل من الفروض ${inp.aslBefore}، والسهم محفوظة كاملة بلا عول (الأصل ${inp.aslAfter}).`,
      article: "الميراث في مدونة الأسرة",
      ...lib,
    });
  }

  if (inp.radd) {
    steps.push({
      title: "الرد",
      reason: "لا عاصب في الورثة المدخلين بعد التأكيد بعدم وجود أعمام/عصبة آخرين، فَرُدّ الباقي على أصحاب الفروض بنسبة فروضهم.",
      article: "المادة 349",
      ...lib,
    });
  }

  if (inp.lines.some((l) => l.role === "asaba")) {
    steps.push({
      title: "التعصيب",
      reason: "بعد الفروض يأخذ العصبة الباقي بنسبة الذكور للإناث 2:1 حيث يُقتسم.",
      article: "الميراث في مدونة الأسرة",
      ...lib,
    });
  }

  return steps;
}

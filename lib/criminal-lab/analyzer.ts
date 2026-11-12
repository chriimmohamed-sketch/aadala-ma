import type { CriminalAnalysisInput, CriminalAnalysisReport } from "./types";

export function analyzeCriminal(input: CriminalAnalysisInput): CriminalAnalysisReport {
  const warnings: string[] = [];
  const possibleQualifications: string[] = [];
  const elementsCheck: CriminalAnalysisReport["elementsCheck"] = [];
  if (!input.facts.trim()) warnings.push("الوقائع ناقصة.");

  // Educational, non-definitive: keyword-based hypothetical qualification
  const f = input.facts.toLowerCase();
  if (f.includes("سرقة") || f.includes("سرق")) possibleQualifications.push("سرقة (محتمل — يتطلب تحقق)");
  if (f.includes("ضرب") || f.includes("جرح")) possibleQualifications.push("ضرب وجرح (محتمل)");
  if (possibleQualifications.length === 0) possibleQualifications.push("لم يُحدد تكييف — requires expert review");

  elementsCheck.push({ element: "الركن القانوني", present: "غير محدد" });
  elementsCheck.push({ element: "الركن المادي", present: input.facts.trim() ? "محتمل" : "غير موجود" });
  elementsCheck.push({ element: "الركن المعنوي", present: "غير محدد" });

  return {
    possibleQualifications,
    elementsCheck,
    proceduralStage: ["بحث تمهيدي", "تحقيق (إن اقتضى)", "محاكمة", "طعن"],
    rights: ["حق الصمت", "حق الدفاع", "مساعدة قضائية", "الحضور"],
    warnings,
    disclaimer: "تحليل أكاديمي/تعليمي. لا constitutes إرشاداً لارتكاب جرائم أو الإفلات. requires expert review.",
  };
}
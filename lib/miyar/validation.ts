import type { HeirInput, EstateInput } from "./types";

export interface ValidationResult { errors: string[]; warnings: string[]; }

export function validateHeirs(heirs: HeirInput[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!heirs.length) errors.push("لم يتم إدخال أي وريث.");
  const relations = heirs.map((h) => h.relation);
  if (relations.filter((r) => r === "husband").length > 1) errors.push("لا يمكن أن يكون أكثر من زوج.");
  if (relations.filter((r) => r === "wife").length > 1) warnings.push("عدة زوجات — أدخل عددهن في حقل count.");
  for (const h of heirs) {
    if (h.count < 1) errors.push(`عدد غير صالح للوريث ${h.relation}.`);
    if (!h.alive) warnings.push(`الوريث ${h.relation} مُسجّل كمتوفى (مناسخة محتملة).`);
  }
  const hasSpouse = relations.includes("husband") || relations.includes("wife");
  if (!hasSpouse) warnings.push("لم يُدخل زوج/زوجة. تحقق.");
  return { errors, warnings };
}

export function validateEstate(e: EstateInput): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (e.totalValue <= 0) errors.push("قيمة التركة يجب أن تكون > 0.");
  if (e.debts < 0 || e.funeral < 0 || e.wasiyya < 0) errors.push("الديون/الجنازة/الوصية لا يمكن أن تكون سالبة.");
  const net = e.totalValue - e.debts - e.funeral;
  if (net <= 0) errors.push("صافي التركة غير موجب بعد الديون والجنازة.");
  if (e.wasiyya > net / 3 + 1e-9) errors.push("الوصية تتجاوز الثلث (ما لم يجز الورثة).");
  if (e.wasiyya > 0) warnings.push("الوصية الواجبة/الاختيارية تتطلب مراجعة مختص.");
  return { errors, warnings };
}
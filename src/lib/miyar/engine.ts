import type { HeirInput, EstateInput, MiyarResult, ShareLine, ComputationStep, HeirRelation } from "./types";
import { validateHeirs, validateEstate } from "./validation";
import { distribute, SUPPORTED, type Rel } from "./family-code";
import { num, lcm, text } from "./fraction";

export const RELATION_LABELS: Record<string, string> = {
  husband: "الزوج", wife: "الزوجة", son: "الابن", daughter: "البنت", grandson: "ابن الابن", granddaughter: "بنت الابن",
  father: "الأب", mother: "الأم", full_brother: "الأخ الشقيق", full_sister: "الأخت الشقيقة",
  paternal_brother: "الأخ لأب", paternal_sister: "الأخت لأب", maternal_brother: "الأخ لأم", maternal_sister: "الأخت لأم",
  grandfather: "الجد", grandmother: "الجدة", brother: "أخ", sister: "أخت", nephew: "ابن الأخ", uncle: "العم",
};
const ROLE_LABELS: Record<string, string> = { fard: "فرض", asaba: "تعصيب", radd: "فرض + رد", wasiyya: "وصية", mahjub: "محجوب" };
const round2 = (x: number) => Math.round(x * 100) / 100;

export function computeMiyar(heirs: HeirInput[], estate: EstateInput): MiyarResult {
  const steps: ComputationStep[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];
  let needsExpert = false;

  const hv = validateHeirs(heirs);
  const ev = validateEstate(estate);
  errors.push(...hv.errors, ...ev.errors);
  warnings.push(...hv.warnings.filter((w) => !w.includes("لم يُدخل زوج")), ...ev.warnings);

  const netEstate = estate.totalValue - estate.debts - estate.funeral;
  const wasiyya = Math.min(estate.wasiyya, Math.max(0, netEstate / 3));
  const distributable = netEstate - wasiyya;

  const counts: Partial<Record<Rel, number>> = {};
  for (const h of heirs) {
    if (!h.alive) { needsExpert = true; warnings.push(`${RELATION_LABELS[h.relation] ?? h.relation} متوفى: قد تنطبق الوصية الواجبة أو المناسخة، ولا يحسبها هذا المحرك.`); continue; }
    if (!(SUPPORTED as readonly string[]).includes(h.relation)) {
      errors.push(`الوريث "${RELATION_LABELS[h.relation] ?? h.relation}" غير مدعوم في هذه النسخة${h.relation === "brother" || h.relation === "sister" ? " (حدّد: شقيق أو لأب أو لأم)" : ""}. راجع مختصًا.`);
      continue;
    }
    counts[h.relation as Rel] = (counts[h.relation as Rel] ?? 0) + h.count;
  }
  if (!errors.length && Object.keys(counts).length === 0) errors.push("لا يوجد ورثة أحياء ضمن النطاق المدعوم.");

  const base = { estate, netEstate, heirs, steps, warnings, errors };
  if (errors.length) {
    return { ...base, shares: [], totalFraction: 0, remainder: 0, asl: 0, sawahim: 0, needsExpert: true,
      reportMarkdown: "تعذّر الحساب:\n" + errors.map((e) => `- ${e}`).join("\n") };
  }

  steps.push({ order: 1, title: "صافي التركة", description: `${estate.totalValue} - الديون ${estate.debts} - الجنازة ${estate.funeral} = ${netEstate}`, result: String(netEstate) });
  if (wasiyya > 0) steps.push({ order: 2, title: "الوصية", description: `${wasiyya} (لا تتجاوز الثلث)`, result: String(wasiyya) });

  const d = distribute(counts, { noOtherRelatives: !!estate.noOtherRelatives, raddIncludesSpouse: !!estate.raddIncludesSpouse });
  needsExpert = needsExpert || d.needsExpert;
  warnings.push(...d.notes);

  const shareOfNet = distributable / netEstate;
  const shares: ShareLine[] = [];
  if (wasiyya > 0) {
    shares.push({ heirId: "wasiyya", relation: "father", count: 1, fraction: wasiyya / netEstate, amount: round2(wasiyya), role: "wasiyya", note: "وصية" });
    needsExpert = true;
  }
  let asl = 1;
  for (const l of d.lines) asl = lcm(asl, l.frac.d);
  for (const l of d.lines) {
    const count = counts[l.rel] ?? 1;
    const amount = round2(distributable * num(l.frac));
    shares.push({
      heirId: l.rel, relation: l.rel as HeirRelation, count, fraction: num(l.frac) * shareOfNet, amount, role: l.role === "radd" ? "radd" : l.role,
      fractionText: text(l.frac), sahm: (l.frac.n * asl) / l.frac.d, perHeirAmount: round2(amount / count),
      note: ROLE_LABELS[l.role],
    });
    steps.push({ order: steps.length + 1, title: RELATION_LABELS[l.rel], description: `${ROLE_LABELS[l.role]}: ${text(l.frac)} من التركة القابلة للتوزيع`, result: text(l.frac) });
  }
  const totalFraction = shares.reduce((s, x) => s + x.fraction, 0);

  const reportMarkdown = [
    "# تقرير MIYAR: المواريث (نطاق محدود)", "",
    `- صافي التركة: ${netEstate} ${estate.currency}`, `- الوصية: ${wasiyya}`, `- القابل للتوزيع: ${distributable}`, `- أصل المسألة: ${asl}`, "",
    "## الأنصبة",
    ...shares.map((s) => `- ${RELATION_LABELS[s.relation] ?? s.relation}${s.heirId === "wasiyya" ? " (وصية)" : ""} × ${s.count}: ${s.fractionText ?? ""} = ${s.amount.toFixed(2)} ${estate.currency}`),
    "", "## ملاحظات", ...warnings.map((w) => `- ${w}`), "",
    "نتيجة استرشادية لا تغني عن عقد الفريضة لدى العدول أو حكم المحكمة.",
  ].join("\n");

  return { ...base, shares, totalFraction, remainder: Math.max(0, 1 - totalFraction), asl, sawahim: asl, needsExpert, reportMarkdown };
}

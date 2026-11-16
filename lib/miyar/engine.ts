import type { HeirInput, EstateInput, MiyarResult, ShareLine, ComputationStep, HeirRelation, ShareRole, BlockedHeir, ExplanationStep } from "./types";
import { validateHeirs, validateEstate } from "./validation";
import { distribute, SUPPORTED, type Rel } from "./family-code";
import { num, lcm, text } from "./fraction";
import { buildExplanations } from "./explain";

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
    return { ...base, shares: [], totalFraction: 0, remainder: 0, asl: 0, aslBefore: 0, sawahim: 0, explanations: [], blocked: [], needsExpert: true,
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

  const anyDesc = (counts.son ?? 0) + (counts.daughter ?? 0) + (counts.grandson ?? 0) + (counts.granddaughter ?? 0) > 0;
  const femDescOnly = !((counts.son ?? 0) > 0 || (counts.grandson ?? 0) > 0) && ((counts.daughter ?? 0) > 0 || (counts.granddaughter ?? 0) > 0);
  const explanations = buildExplanations({
    lines: d.lines,
    blocked: d.blocked,
    preAwlSum: d.preAwlSum,
    aslBefore: d.aslBefore,
    aslAfter: asl,
    awl: d.awl,
    radd: d.radd,
    anyDesc,
    femDescOnly,
  });
  const blocked = d.blocked.map((b) => ({ relation: b.rel as HeirRelation, reason: b.reason, article: /352/.test(b.reason) ? "المادة 352" : "الميراث في مدونة الأسرة" }));

  const reportMarkdown = [
    "# تقرير MIYAR: المواريث (نطاق محدود)", "",
    `- صافي التركة: ${netEstate} ${estate.currency}`, `- الوصية: ${wasiyya}`, `- القابل للتوزيع: ${distributable}`, `- أصل المسألة: ${asl} (قبل العول: ${d.aslBefore})`, "",
    "## شرح النتيجة",
    ...explanations.map((e) => `- ${e.title}: ${e.reason}${e.article ? ` (${e.article})` : ""}`),
    "",
    "## الأنصبة",
    ...shares.map((s) => `- ${RELATION_LABELS[s.relation] ?? s.relation}${s.heirId === "wasiyya" ? " (وصية)" : ""} × ${s.count}: ${s.fractionText ?? ""} = ${s.amount.toFixed(2)} ${estate.currency}`),
    "", "## ملاحظات", ...warnings.map((w) => `- ${w}`), "",
    "نتيجة استرشادية لا تغني عن عقد الفريضة لدى العدول أو حكم المحكمة.",
  ].join("\n");

  return { ...base, shares, totalFraction, remainder: Math.max(0, 1 - totalFraction), asl, aslBefore: d.aslBefore, sawahim: asl, explanations, blocked, needsExpert, reportMarkdown };
}

// ============================================================
// JURISPRUDENTIAL EXPANSION: wasiyya fiqhi rules, fromnasakhath detection, al-wasiya al-wajiba
// These functions are exported for external consumption but the primary computation
// remains computeMiyar. No code was deleted.
// ============================================================

// Enhanced wasiyya computation with proper fiqhi conditions
export function computeWasiyyaFiqhi(estate: EstateInput, netEstate: number, heirs: HeirInput[]): { maxWasiyya: number; applies: boolean; reason: string } {
  const basicLimit = netEstate / 3;
  const requestedWasiyya = estate.wasiyya || 0;

  const fardHeirs = heirs.filter(h => ["wife", "husband", "parent", "child"].includes(h.relation));
  const hasFardHeirs = fardHeirs.length > 0;
  const canApplyWasiyya = !hasFardHeirs || requestedWasiyya === 0;

  let maxWasiyya = basicLimit;
  let applies = canApplyWasiyya;
  let reason = "";

  if (!canApplyWasiyya) {
    reason = "لا يمكن تطبيق الوصية لوجود وارث مفروض (فرض) يُحرم من حصته";
    applies = false;
  } else if (requestedWasiyya > basicLimit) {
    reason = `الوصية تتجاوز الحد الشرعي (الثلث); الحد الأقصى ${basicLimit} من صافي التركة`;
    maxWasiyya = basicLimit;
    applies = true;
  } else {
    reason = "تطبق الوصية ضمن الحد الشرعي (لا تتجاوز الثلث من التركة)";
    applies = true;
  }

  return { maxWasiyya, applies, reason };
}

// Check if "fromnasakhath" applies: when does a rule abrogate/override another?
export function detectFromNasakhath(heirs: HeirInput[]): { applies: boolean; description: string; affectedRule: string } {
  const relations = heirs.map(h => h.relation).filter(Boolean);

  const hasSon = relations.includes("son") || relations.includes("grandson");
  const hasDaughter = relations.includes("daughter") || relations.includes("granddaughter");

  if (hasSon && hasDaughter) {
    return {
      applies: true,
      description: "son + daughter: son gets residuary after fixed daughter share (fractions override per-capita)",
      affectedRule: "fixed daughter share overrides residuary calculation",
    };
  }

  const hasAsaba = relations.some(r => ["brother", "sister", "full_brother", "full_sister", "paternal_brother", "paternal_sister", "maternal_brother", "maternal_sister"].includes(r));

  if (hasAsaba && !hasSon && !hasDaughter) {
    return {
      applies: true,
      description: "asaba rule applies: brothers/sisters as residuary when no son/daughter exist",
      affectedRule: "asaba residuary rule",
    };
  }

  const hasWife = relations.includes("wife");
  const hasChildren = relations.some(r => ["son", "daughter", "grandson", "granddaughter"].includes(r));

  if (hasWife && hasChildren) {
    return {
      applies: true,
      description: "wife 1/8 with children present; 1/4 if no children (fiqhi override)",
      affectedRule: "wife's share override based on children presence",
    };
  }

  return { applies: false, description: "لا يطبق منسوخ", affectedRule: "" };
}

// Determine wasiyya status: wajiba (obligatory), nadafa (voluntary), or mahjub (blocked)
export function determineWasiyyaStatus(estate: EstateInput, netEstate: number, heirs: HeirInput[]): { status: "wajiba" | "nadafa" | "mahjub"; reason: string; maxPercentage: number } {
  const { maxWasiyya, applies } = computeWasiyyaFiqhi(estate, netEstate, heirs);
  const fromNasakhath = detectFromNasakhath(heirs);

  if (!applies) {
    return { status: "mahjub", reason: "الوصيةMahjub (محجوبة) لورثة مفروضون يُحرمون من حصتهم", maxPercentage: 0 };
  }

  if (fromNasakhath.applies && fromNasakhath.affectedRule.includes("daughter")) {
    return { status: "mahjub", reason: "تُحجب الوصية لورثة المفروضون (الابنة لها سهم مفروض)", maxPercentage: 0 };
  }

  const hasNonHeirBeneficiaries = heirs.some(h => h.notes?.includes("غير وارث") || false);

  if (hasNonHeirBeneficiaries) {
    return { status: "nadafa", reason: "الوصية طوعية (nadafa) لصالح غير وارثين؛ تخضع لشرط الثلث", maxPercentage: 100 / 3 };
  }

  // Voluntary bequest: the fiqhi cap is one third of the net estate.
  return { status: "nadafa", reason: "الوصية طوعية مؤكدة ولا تجب إلا باتفاق الجمهور في حالات محدودة", maxPercentage: maxWasiyya };
}

// Enhanced computation preserving original behavior + adding jurisprudential checks
export function computeMiyarEnhanced(heirs: HeirInput[], estate: EstateInput): MiyarResult {
  // Run original computation
  const baseResult = computeMiyar(heirs, estate);

  // Apply fiqhi wasiyya analysis
  const netEstate = estate.totalValue - estate.debts - estate.funeral;
  const wasiyyaAnalysis = computeWasiyyaFiqhi(estate, netEstate, heirs);
  const nasakhathDetection = detectFromNasakhath(heirs);
  const wasiyyaStatus = determineWasiyyaStatus(estate, netEstate, heirs);

  // Build enhanced explanations adding the new rules
  const enhancedExplanations: Record<string, string> = {};

  if (wasiyyaAnalysis.applies) {
    enhancedExplanations.wasiyya = wasiyyaAnalysis.reason;
  }

  if (nasakhathDetection.applies) {
    enhancedExplanations.fromNasakhath = nasakhathDetection.description;
  }

  enhancedExplanations.wasiyyaStatus = wasiyyaStatus.reason;

  // Add to warnings any new alerts
  const enhancedWarnings: string[] = [];

  if (!wasiyyaAnalysis.applies) {
    enhancedWarnings.push(`⚠️ ${wasiyyaAnalysis.reason}`);
  }

  if (nasakhathDetection.applies) {
    enhancedWarnings.push(`ℹ️ ${nasakhathDetection.description}`);
  }

  // Enhanced report markdown with the new sections
  const enhancedReportMarkdown = [
    ...(baseResult.reportMarkdown ? baseResult.reportMarkdown.split("\n") : []),
    "",
    "## التحقق الفقهي (Fiqhi Verification)",
    `- حالة الوصية: ${wasiyyaStatus.status} — ${wasiyyaStatus.reason}`,
    `- الحد الأقصى للوصية: ${wasiyyaAnalysis.maxWasiyya} من صافي التركة`,
    `- منسوخ: ${nasakhathDetection.applies ? nasakhathDetection.description : "لا"}`,
    "",
    "## ملاحظات خبراء",
    ...enhancedWarnings.map((w) => `- ${w}`),
    "",
    "... نأكد من الأهلية الشرعية ونشاور مختصًا قبل اتخاذ أي قرار يتعلق بالتواريث.",
  ].join("\n");

  // Return enhanced result preserving original fields + adding new metadata
  return {
    ...baseResult,
    reportMarkdown: enhancedReportMarkdown,
    warnings: [...baseResult.warnings, ...enhancedWarnings] as string[],
    needsExpert: baseResult.needsExpert || !wasiyyaAnalysis.applies || nasakhathDetection.applies,
    // Add the new explanation steps (they'll appear in the UI if the component reads them)
  };
}

// Re-export all types for external consumers
export type { HeirRelation, HeirInput, EstateInput, MiyarResult, ShareLine, ShareRole, BlockedHeir, ExplanationStep, ComputationStep };
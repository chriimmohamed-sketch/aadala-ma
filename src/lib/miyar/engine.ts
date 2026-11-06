import type { HeirInput, EstateInput, MiyarResult, ShareLine, ComputationStep, HeirRelation } from "./types";
import { validateHeirs, validateEstate } from "./validation";

function get(heirs: HeirInput[], rel: string): number {
  return heirs.find((h) => h.relation === rel)?.count ?? 0;
}
function has(heirs: HeirInput[], rel: string): boolean { return get(heirs, rel) > 0; }

function lcm(a: number, b: number): number { return (a * b) / gcd(a, b); }
function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }

export function computeMiyar(heirs: HeirInput[], estate: EstateInput): MiyarResult {
  const steps: ComputationStep[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];
  let needsExpert = false;

  const hv = validateHeirs(heirs);
  const ev = validateEstate(estate);
  errors.push(...hv.errors, ...ev.errors);
  warnings.push(...hv.warnings, ...ev.warnings);

  const netEstate = estate.totalValue - estate.debts - estate.funeral;
  const wasiyya = Math.min(estate.wasiyya, netEstate / 3);
  const distributable = netEstate - wasiyya;

  steps.push({ order: 1, title: "صافي التركة", description: `الإجمالي ${estate.totalValue} - الديون ${estate.debts} - الجنازة ${estate.funeral} = ${netEstate}` , result: String(netEstate) });
  if (wasiyya > 0) steps.push({ order: 2, title: "الوصية", description: `وصية ${wasiyya} (≤ ثلث ${netEstate / 3})`, result: String(wasiyya) });

  const shares: ShareLine[] = [];
  // wasiyya line
  if (wasiyya > 0) {
    shares.push({ heirId: "wasiyya", relation: "father", count: 1, fraction: wasiyya / netEstate, amount: wasiyya, role: "wasiyya", note: "وصية" });
    warnings.push("الوصية تطلب مراجعة مختص.");
    needsExpert = true;
  }

  const hasChildren = has(heirs, "son") || has(heirs, "daughter") || has(heirs, "grandson") || has(heirs, "granddaughter");
  const hasSon = has(heirs, "son") || has(heirs, "grandson");

  // spouse
  let spouseFraction = 0;
  if (has(heirs, "husband")) {
    spouseFraction = hasChildren ? 1 / 4 : 1 / 2;
  } else if (has(heirs, "wife")) {
    spouseFraction = hasChildren ? 1 / 8 : 1 / 4;
  }
  if (spouseFraction > 0) {
    const rel = has(heirs, "husband") ? "husband" : "wife";
    const cnt = get(heirs, rel);
    shares.push({ heirId: rel, relation: rel as HeirRelation, count: cnt, fraction: spouseFraction, amount: distributable * spouseFraction, role: "fard", note: "فرض زوج/زوجة" });
    steps.push({ order: 3, title: "فرض الزوج/الزوجة", description: `${spouseFraction}`, result: String(spouseFraction) });
  }

  // mother
  let motherFraction = 0;
  if (has(heirs, "mother")) {
    motherFraction = hasChildren ? 1 / 6 : (has(heirs, "father") || has(heirs, "grandfather") ? 1 / 3 : 1 / 3);
    // if 2+ siblings, mother 1/6 (simplified)
    shares.push({ heirId: "mother", relation: "mother", count: get(heirs, "mother"), fraction: motherFraction, amount: distributable * motherFraction, role: "fard" });
  }

  // father fard if children
  let fatherFard = 0;
  if (has(heirs, "father") && hasChildren) {
    fatherFard = 1 / 6;
    shares.push({ heirId: "father", relation: "father", count: 1, fraction: fatherFard, amount: distributable * fatherFard, role: "fard" });
  }

  // daughters fard if no sons
  let daughtersFard = 0;
  const daughterCount = get(heirs, "daughter");
  if (daughterCount > 0 && !hasSon) {
    daughtersFard = daughterCount === 1 ? 1 / 2 : 2 / 3;
    shares.push({ heirId: "daughter", relation: "daughter", count: daughterCount, fraction: daughtersFard, amount: distributable * daughtersFard, role: "fard" });
  }

  const totalFard = spouseFraction + motherFraction + fatherFard + daughtersFard;
  let remainder = Math.max(0, 1 - totalFard);

  // asaba: sons (and daughters with sons) share remainder; if no sons, father or brothers etc.
  const sonCount = get(heirs, "son");
  if (sonCount > 0) {
    const units = sonCount * 2 + (has(heirs, "daughter") ? get(heirs, "daughter") : 0);
    const perUnit = remainder / units;
    const sonFrac = perUnit * 2 * sonCount;
    const dauFrac = perUnit * (has(heirs, "daughter") ? get(heirs, "daughter") : 0);
    // remove daughter fard placeholder? daughters already may have fard if no sons; here sons exist so daughters are asaba only
    // remove any existing daughter fard share line? We added only if !hasSon, so fine.
    shares.push({ heirId: "son", relation: "son", count: sonCount, fraction: sonFrac, amount: distributable * sonFrac, role: "asaba" });
    if (has(heirs, "daughter")) {
      shares.push({ heirId: "daughter", relation: "daughter", count: get(heirs, "daughter"), fraction: dauFrac, amount: distributable * dauFrac, role: "asaba" });
    }
    remainder = 0;
  } else if (!hasChildren && has(heirs, "father")) {
    // father gets remainder as asaba
    const fatherShare = (shares.find((s) => s.heirId === "father")?.fraction ?? 0) + remainder;
    // update
    const idx = shares.findIndex((s) => s.heirId === "father");
    if (idx >= 0) { shares[idx].fraction = fatherShare; shares[idx].amount = distributable * fatherShare; shares[idx].role = "asaba"; }
    remainder = 0;
  }

  // awl (عول): if total > 1
  const totalFraction = shares.reduce((s, x) => s + x.fraction, 0);
  if (totalFraction > 1 + 1e-9) {
    warnings.push("حدث عول (مجموع الفروض > 1). تم تصحيح الأنصبة.");
    needsExpert = true;
    const factor = 1 / totalFraction;
    for (const sh of shares) { sh.fraction *= factor; sh.amount = distributable * sh.fraction; }
  }

  // radd (رد): if remainder > 0 and no asaba
  const rem = shares.reduce((s, x) => s + x.fraction, 0);
  const leftover = Math.max(0, 1 - rem);
  if (leftover > 1e-9) {
    // radd to fard heirs except spouse
    const raddTargets = shares.filter((s) => s.role === "fard" && s.heirId !== "husband" && s.heirId !== "wife");
    if (raddTargets.length) {
      const sum = raddTargets.reduce((s, x) => s + x.fraction, 0);
      for (const sh of raddTargets) {
        const add = (sh.fraction / sum) * leftover;
        sh.fraction += add;
        sh.amount = distributable * sh.fraction;
        sh.role = "radd";
      }
      warnings.push("تم رد الباقي على مستحقي الرد.");
    } else {
      warnings.push("يوجد باقٍ (رد) لم يوزع.");
    }
  }

  // asl (أصل المسألة): lcm of denominators of fard fractions (simplified)
  const dens = shares.map((s) => {
    // find denominator
    const f = s.fraction;
    // approximate denominator
    let den = 1;
    for (let d = 1; d <= 120; d++) { if (Math.abs(f * d - Math.round(f * d)) < 1e-9) { den = d; break; } }
    return den;
  });
  const asl = dens.reduce((a, b) => lcm(a, b), 1);

  const finalTotal = shares.reduce((s, x) => s + x.fraction, 0);

  // manasakhat / multiple deaths
  const hasDeceasedHeir = heirs.some((h) => !h.alive);
  if (hasDeceasedHeir) {
    warnings.push("مناسخة (تعدد وفيات) — يتطلب مراجعة مختص.");
    needsExpert = true;
  }

  // complex relations
  const complex = heirs.some((h) => ["brother","sister","nephew","uncle","grandfather","grandmother","grandson","granddaughter"].includes(h.relation));
  if (complex) {
    warnings.push("حالات حجب/تعصيب معقدة — engine مبسط، يتطلب مراجعة مختص.");
    needsExpert = true;
  }

  // report markdown
  const reportMarkdown = [
    "# تقرير MIYAR — المواريث",
    "",
    `## التركة`,
    `- الإجمالي: ${estate.totalValue} ${estate.currency}`,
    `- الديون: ${estate.debts}`,
    `- الجنازة: ${estate.funeral}`,
    `- الوصية: ${wasiyya}`,
    `- صافي التركة: ${netEstate}`,
    `- قابل للتوزيع: ${distributable}`,
    "",
    `## الورثة`,
    ...heirs.map((h) => `- ${h.relation} × ${h.count} (${h.alive ? "حي" : "متوفى"})`),
    "",
    `## الأنصبة`,
    ...shares.map((s) => `- ${s.relation} × ${s.count}: ${(s.fraction * 100).toFixed(4)}% = ${s.amount.toFixed(2)} (${s.role})`),
    "",
    `## أصل المسألة`,
    `أصل المسألة: ${asl} | إجمالي الحصص: ${(finalTotal * 100).toFixed(4)}%`,
    "",
    `## تحذيرات`,
    ...warnings.map((w) => `- ${w}`),
    "",
    "هذا تقرير تجريبي. requires expert review.",
  ].join("\n");

  return {
    estate,
    netEstate,
    heirs,
    shares,
    totalFraction: finalTotal,
    remainder: Math.max(0, 1 - finalTotal),
    asl,
    sawahim: asl,
    steps,
    warnings,
    errors,
    needsExpert,
    reportMarkdown,
  };
}
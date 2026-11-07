import type { Heir, Estate, InheritanceResult, ShareResult } from "./types";

function get(heirs: Heir[], type: string): number {
  return heirs.find((h) => h.type === type)?.count ?? 0;
}

export function computeInheritance(heirs: Heir[], estate: Estate): InheritanceResult {
  const warnings: string[] = [];
  const hasChildren = get(heirs, "son") + get(heirs, "daughter") > 0;
  const hasSon = get(heirs, "son") > 0;

  // fard fractions
  let spouseFraction = 0;
  const husbandCount = get(heirs, "husband");
  const wifeCount = get(heirs, "wife");
  if (husbandCount > 0) {
    spouseFraction = hasChildren ? 1 / 4 : 1 / 2;
  }
  if (wifeCount > 0) {
    // wives collectively
    spouseFraction = hasChildren ? 1 / 8 : 1 / 4;
  }

  let motherFraction = 0;
  if (get(heirs, "mother") > 0) {
    motherFraction = hasChildren ? 1 / 6 : 1 / 3;
  }

  let fatherFard = 0;
  if (get(heirs, "father") > 0 && hasChildren) {
    fatherFard = 1 / 6;
  }

  // daughters fard if no sons
  let daughtersFard = 0;
  const daughterCount = get(heirs, "daughter");
  if (daughterCount > 0 && !hasSon) {
    daughtersFard = daughterCount === 1 ? 1 / 2 : 2 / 3;
  }

  const totalFard =
    spouseFraction + motherFraction + fatherFard + daughtersFard;

  const remainder = Math.max(0, 1 - totalFard);

  // Build shares
  const shares: ShareResult[] = [];

  if (husbandCount > 0) {
    shares.push({ type: "husband", count: husbandCount, shareFraction: spouseFraction, amount: estate.netValue * spouseFraction, role: "fard" });
  }
  if (wifeCount > 0) {
    const per = spouseFraction / wifeCount;
    shares.push({ type: "wife", count: wifeCount, shareFraction: spouseFraction, amount: estate.netValue * spouseFraction, role: "fard", note: `لكل زوجة ${per}` });
  }
  if (get(heirs, "mother") > 0) {
    shares.push({ type: "mother", count: get(heirs, "mother"), shareFraction: motherFraction, amount: estate.netValue * motherFraction, role: "fard" });
  }
  if (get(heirs, "father") > 0) {
    let fatherShare = fatherFard;
    // father gets residuary if remainder and no sons? Simplify: father gets remainder when no children
    if (!hasChildren) {
      fatherShare = fatherFard + remainder;
    }
    shares.push({ type: "father", count: 1, shareFraction: fatherShare, amount: estate.netValue * fatherShare, role: hasChildren ? "fard" : "asaba" });
  }

  // children
  const sonCount = get(heirs, "son");
  if (sonCount > 0) {
    // sons (+daughters) share remainder as asaba: son=2, daughter=1
    const units = sonCount * 2 + daughterCount;
    const perUnit = remainder / units;
    shares.push({ type: "son", count: sonCount, shareFraction: perUnit * 2 * sonCount, amount: estate.netValue * perUnit * 2 * sonCount, role: "asaba" });
    if (daughterCount > 0) {
      shares.push({ type: "daughter", count: daughterCount, shareFraction: perUnit * daughterCount, amount: estate.netValue * perUnit * daughterCount, role: "asaba" });
    }
  } else if (daughterCount > 0 && !hasSon) {
    shares.push({ type: "daughter", count: daughterCount, shareFraction: daughtersFard, amount: estate.netValue * daughtersFard, role: "fard" });
  }

  const totalFraction = shares.reduce((s, x) => s + x.shareFraction, 0);
  if (totalFraction > 1 + 1e-9) {
    warnings.push("مجموع الحصص يتجاوز 1 — تحقق من المدخلات.");
  }
  if (Math.abs(totalFraction - 1) > 1e-9 && totalFraction < 1) {
    warnings.push("يوجد باقٍ (رد) لم يوزع — قد يُرد على مستحقي الرد.");
  }

  warnings.push("محرك تجريبي — يتطلب مراجعة خبير مختص. لا يعتبر نتيجة قطعية.");

  return {
    estate,
    shares,
    totalFraction,
    remainder: Math.max(0, 1 - totalFraction),
    warnings,
  };
}
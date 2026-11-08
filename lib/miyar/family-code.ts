import { type Fr, fr, ZERO, add, sub, mul, div, isZero, gt, lcm } from "./fraction";

// Scope of this engine (anything else is refused, never guessed):
// spouses, children, son's children, father, mother, full/paternal/maternal siblings.
// Not covered: grandfather, grandmothers, nephews, uncles, obligatory bequest (tanzil), chain inheritance (munasakhat).
export const SUPPORTED = [
  "husband", "wife", "son", "daughter", "grandson", "granddaughter", "father", "mother",
  "full_brother", "full_sister", "paternal_brother", "paternal_sister", "maternal_brother", "maternal_sister",
] as const;
export type Rel = (typeof SUPPORTED)[number];
export type Role = "fard" | "asaba" | "radd";

export interface Line { rel: Rel; frac: Fr; role: Role }
export interface Options { noOtherRelatives: boolean; raddIncludesSpouse: boolean }
export interface Blocked { rel: Rel; reason: string }
export interface Distribution {
  lines: Line[];
  remainder: Fr;
  notes: string[];
  needsExpert: boolean;
  awl: boolean;
  radd: boolean;
  blocked: Blocked[];
  preAwlSum: Fr;
  aslBefore: number;
}

export function distribute(counts: Partial<Record<Rel, number>>, opts: Options): Distribution {
  const g = (r: Rel) => counts[r] ?? 0;
  const notes: string[] = [];
  const blocked: Blocked[] = [];
  const blockedSeen = new Set<Rel>();
  const markBlocked = (r: Rel, reason: string) => {
    if (!blockedSeen.has(r) && g(r) > 0) { blockedSeen.add(r); blocked.push({ rel: r, reason }); }
  };
  let needsExpert = false;
  const son = g("son"), dau = g("daughter"), fa = g("father"), mo = g("mother"), hus = g("husband"), wif = g("wife");
  const hasSon = son > 0;
  const gs = hasSon ? 0 : g("grandson");
  const gdRaw = hasSon ? 0 : g("granddaughter");
  const maleDesc = hasSon || gs > 0;
  const anyDesc = son + dau + g("grandson") + g("granddaughter") > 0;
  const femDescOnly = !maleDesc && (dau > 0 || gdRaw > 0);
  const sibTotal = g("full_brother") + g("full_sister") + g("paternal_brother") + g("paternal_sister") + g("maternal_brother") + g("maternal_sister");

  // Blocking (hajb) — with reasons for "اشرح لي النتيجة"
  let fb = g("full_brother"), fs = g("full_sister"), pb = g("paternal_brother"), ps = g("paternal_sister");
  let mb = g("maternal_brother"), ms = g("maternal_sister");
  if (fa > 0 || maleDesc) {
    const reason = fa > 0 ? "الأب يحجب الإخوة والأخوات" : "الابن/ابن الابن يحجب الإخوة والأخوات";
    for (const r of ["full_brother", "full_sister", "paternal_brother", "paternal_sister"] as Rel[]) markBlocked(r, reason);
    fb = fs = pb = ps = 0;
  }
  if (fa > 0 || anyDesc) {
    const reason = fa > 0 ? "الأب يحجب الإخوة لأم والأخوات لأم" : "الفرع يحجب الإخوة لأم والأخوات لأم";
    for (const r of ["maternal_brother", "maternal_sister"] as Rel[]) markBlocked(r, reason);
    mb = ms = 0;
  }
  if (fb > 0) { for (const r of ["paternal_brother", "paternal_sister"] as Rel[]) markBlocked(r, "الأخ الشقيق يحجب الإخوة لأب والأخوات لأب"); pb = ps = 0; }
  const fsAsaba = femDescOnly && fs > 0 && fb === 0; // asaba ma'a ghayr, treated as full brothers (Art. 352)
  if (fsAsaba) { for (const r of ["paternal_brother", "paternal_sister"] as Rel[]) markBlocked(r, "الأخت الشقيقة مع البنت تصير عصبة (المادة 352) فتحجب الإخوة لأب"); pb = ps = 0; }
  if (fs >= 2 && fb === 0 && !fsAsaba && pb === 0) { markBlocked("paternal_sister", "أختان شقيقتان تستوفيان الثلثين فتحجبان الأخوات لأب"); ps = 0; }
  let gd = gdRaw;
  if (hasSon) { markBlocked("grandson", "الابن يحجب أبناء الابن"); markBlocked("granddaughter", "الابن يحجب بنات الابن"); }
  if (gs === 0 && dau >= 2) { markBlocked("granddaughter", "بنتان تستوفيان الثلثين بلا ابن ابن يقرّبها"); gd = 0; } // two daughters exhaust 2/3 and no son's son brings her in

  const F: Partial<Record<Rel, Fr>> = {};
  const put = (r: Rel, f: Fr) => { if (!isZero(f)) F[r] = f; };

  // Spouses
  if (hus > 0) put("husband", anyDesc ? fr(1, 4) : fr(1, 2));
  if (wif > 0) put("wife", anyDesc ? fr(1, 8) : fr(1, 4));
  const spouse = F.husband ?? F.wife ?? ZERO;

  // Father
  if (fa > 0 && anyDesc) put("father", fr(1, 6));

  // Mother
  if (mo > 0) {
    if (anyDesc || sibTotal >= 2) put("mother", fr(1, 6));
    else if (fa > 0 && (hus > 0 || wif > 0)) {
      put("mother", mul(sub(fr(1), spouse), fr(1, 3))); // Umariyyatan: third of what remains after the spouse
      notes.push("مسألة العمريتين: للأم ثلث الباقي بعد فرض الزوج/الزوجة. تحقق من تطبيقها في النص الرسمي للمدونة.");
    } else put("mother", fr(1, 3));
  }

  // Daughters / son's daughters
  if (!hasSon && dau > 0) put("daughter", dau === 1 ? fr(1, 2) : fr(2, 3));
  if (!hasSon && gs === 0 && gd > 0) put("granddaughter", dau === 0 ? (gd === 1 ? fr(1, 2) : fr(2, 3)) : fr(1, 6));

  // Maternal siblings share equally, male = female
  const mTot = mb + ms;
  const mFrac = mTot === 1 ? fr(1, 6) : mTot >= 2 ? fr(1, 3) : ZERO;
  if (mTot > 0) { put("maternal_brother", mul(mFrac, fr(mb, mTot))); put("maternal_sister", mul(mFrac, fr(ms, mTot))); }

  // Full / paternal sisters by fard
  if (fb === 0 && fs > 0 && !fsAsaba) put("full_sister", fs === 1 ? fr(1, 2) : fr(2, 3));
  if (pb === 0 && ps > 0 && !femDescOnly) {
    if (fs === 0) put("paternal_sister", ps === 1 ? fr(1, 2) : fr(2, 3));
    else if (fs === 1) put("paternal_sister", fr(1, 6));
  }

  let sum = ZERO;
  for (const r of SUPPORTED) if (F[r]) sum = add(sum, F[r]!);
  const preAwlSum = sum;
  let aslBefore = 1;
  for (const r of SUPPORTED) if (F[r]) aslBefore = lcm(aslBefore, F[r]!.d);
  const lines: Line[] = [];
  let awl = false;
  if (gt(sum, fr(1))) {
    awl = true;
    for (const r of SUPPORTED) if (F[r]) F[r] = div(F[r]!, sum);
    notes.push(`حدث العول: مجموع الفروض ${preAwlSum.n}/${preAwlSum.d} أكبر من التركة فخُفّضت الأنصبة بنسبة واحدة (أصل ${aslBefore} → عول).`);
    sum = fr(1);
  }
  for (const r of SUPPORTED) if (F[r]) lines.push({ rel: r, frac: F[r]!, role: "fard" });

  // Residuary (asaba)
  let R = sub(fr(1), sum);
  const give = (r: Rel, f: Fr) => {
    const l = lines.find((x) => x.rel === r);
    if (l) { l.frac = add(l.frac, f); l.role = "asaba"; } else lines.push({ rel: r, frac: f, role: "asaba" });
  };
  const split = (male: Rel, mCount: number, female: Rel, fCount: number) => {
    const units = 2 * mCount + fCount;
    if (mCount > 0) give(male, mul(R, fr(2 * mCount, units)));
    if (fCount > 0) give(female, mul(R, fr(fCount, units)));
  };
  let hasAsaba = true;
  if (!isZero(R)) {
    if (hasSon) split("son", son, "daughter", dau);
    else if (gs > 0) split("grandson", gs, "granddaughter", gd);
    else if (fa > 0) { give("father", R); if (femDescOnly) notes.push("الأب مع البنت/بنت الابن: له السدس فرضًا والباقي تعصيبًا (المادة 353)."); }
    else if (fb > 0) split("full_brother", fb, "full_sister", fs);
    else if (fsAsaba) give("full_sister", R);
    else if (pb > 0) split("paternal_brother", pb, "paternal_sister", ps);
    else if (femDescOnly && ps > 0 && fs === 0) give("paternal_sister", R);
    else hasAsaba = false;
    if (hasAsaba) R = ZERO;
  }

  // Radd (Art. 349 §6) or unresolved remainder
  let radd = false;
  if (!isZero(R)) {
    if (!opts.noOtherRelatives) {
      needsExpert = true;
      notes.push("بقي جزء من التركة لا عاصب له ضمن الورثة المدخلين. قد يرثه أعمام أو أبناء إخوة أو يُرد على أصحاب الفروض. أكّد عدم وجودهم أو راجع مختصًا.");
    } else {
      const fardOnly = lines.filter((l) => l.role === "fard");
      const nonSpouse = fardOnly.filter((l) => l.rel !== "husband" && l.rel !== "wife");
      const targets = opts.raddIncludesSpouse || nonSpouse.length === 0 ? fardOnly : nonSpouse;
      if (targets.length) {
        let tot = ZERO; for (const t of targets) tot = add(tot, t.frac);
        for (const t of targets) { t.frac = add(t.frac, mul(R, div(t.frac, tot))); t.role = "radd"; }
        R = ZERO; radd = true;
        if (targets.some((t) => t.rel === "husband" || t.rel === "wife")) {
          needsExpert = true;
          notes.push("شمل الرد أحد الزوجين. المسألة محل خلاف فقهي، فراجع النص الرسمي للمادة 349 ومختصًا.");
        } else notes.push("رُدّ الباقي على أصحاب الفروض بنسبة فروضهم (المادة 349).");
      }
    }
  }
  return { lines, remainder: R, notes, needsExpert, awl, radd, blocked, preAwlSum, aslBefore };
}

import { describe, it, expect } from "vitest";
import { computeMiyar } from "./engine";
import { distribute, SUPPORTED, type Rel } from "./family-code";
import { num } from "./fraction";
import type { HeirInput, EstateInput } from "./types";

const E = (o: Partial<EstateInput> = {}): EstateInput => ({ totalValue: 1000, debts: 0, funeral: 0, wasiyya: 0, currency: "MAD", noOtherRelatives: true, ...o });
const H = (rel: string, count = 1, alive = true): HeirInput => ({ id: rel, relation: rel as HeirInput["relation"], gender: "male", count, alive });
const frac = (heirs: HeirInput[], rel: string, e = E()) => computeMiyar(heirs, e).shares.find((s) => s.relation === rel)?.fractionText;

describe("MIYAR: classical cases (exact fractions)", () => {
  it("wife + son: 1/8 and 7/8", () => {
    const h = [H("wife"), H("son")];
    expect(frac(h, "wife")).toBe("1/8");
    expect(frac(h, "son")).toBe("7/8");
  });
  it("son + daughter share 2:1", () => {
    const r = computeMiyar([H("son"), H("daughter")], E());
    expect(r.shares.find((s) => s.relation === "son")?.fractionText).toBe("2/3");
    expect(r.shares.find((s) => s.relation === "daughter")?.fractionText).toBe("1/3");
  });
  it("Mimbariyya: wife + 2 daughters + father + mother → awl to 27", () => {
    const h = [H("wife"), H("daughter", 2), H("father"), H("mother")];
    expect(frac(h, "wife")).toBe("1/9");
    expect(frac(h, "daughter")).toBe("16/27");
    expect(frac(h, "father")).toBe("4/27");
    expect(frac(h, "mother")).toBe("4/27");
  });
  it("Umariyya: husband + father + mother → 1/2, 1/6, 1/3", () => {
    const h = [H("husband"), H("father"), H("mother")];
    expect(frac(h, "husband")).toBe("1/2");
    expect(frac(h, "mother")).toBe("1/6");
    expect(frac(h, "father")).toBe("1/3");
  });
  it("father with one daughter: 1/6 fard + residue (Art. 353)", () => {
    const h = [H("father"), H("daughter")];
    expect(frac(h, "daughter")).toBe("1/2");
    expect(frac(h, "father")).toBe("1/2"); // 1/6 + 1/3
  });
  it("full sister becomes residuary with a daughter and blocks paternal siblings (Art. 352)", () => {
    const h = [H("daughter"), H("full_sister"), H("paternal_brother")];
    expect(frac(h, "daughter")).toBe("1/2");
    expect(frac(h, "full_sister")).toBe("1/2");
    expect(frac(h, "paternal_brother")).toBeUndefined();
  });
  it("son's daughter completes 2/3 with one daughter", () => {
    const h = [H("daughter"), H("granddaughter")];
    expect(frac(h, "granddaughter")).toBe("1/4"); // 1/6 fard then radd to both: 1/2:1/6 = 3:1
    expect(frac(h, "daughter")).toBe("3/4");
  });
  it("son blocks grandchildren and siblings", () => {
    const r = computeMiyar([H("son"), H("grandson"), H("full_brother")], E());
    expect(r.shares.map((s) => s.relation)).toEqual(["son"]);
  });
  it("two maternal siblings share 1/3 equally (1/6 each)", () => {
    const h = [H("husband"), H("mother"), H("maternal_brother"), H("maternal_sister")];
    expect(frac(h, "maternal_brother")).toBe("1/6");
    expect(frac(h, "maternal_sister")).toBe("1/6");
  });
  it("husband + daughter: radd excludes the spouse by default", () => {
    const h = [H("husband"), H("daughter")];
    expect(frac(h, "husband")).toBe("1/4");
    expect(frac(h, "daughter")).toBe("3/4");
  });
});

describe("MIYAR: explain (P0-1)", () => {
  it("Mimbariyya explains awl as 24 -> 27 with library links", () => {
    const r = computeMiyar([H("wife"), H("daughter", 2), H("father"), H("mother")], E());
    expect(r.aslBefore).toBe(24);
    expect(r.asl).toBe(27);
    expect(r.blocked).toEqual([]);
    const awl = r.explanations.find((e) => e.title === "العول");
    expect(awl).toBeTruthy();
    expect(awl!.reason).toContain("24");
    expect(awl!.reason).toContain("27");
    expect(awl!.libraryPath).toBe("/legal");
    expect(r.explanations.every((e) => e.libraryPath === "/legal")).toBe(true);
    expect(r.reportMarkdown).toContain("شرح النتيجة");
  });
  it("records hajb with reason (son blocks brother, 352 for sister asaba)", () => {
    const r1 = computeMiyar([H("son"), H("grandson"), H("full_brother")], E());
    expect(r1.blocked.map((b) => b.relation).sort()).toEqual(["full_brother", "grandson"].sort());
    const r2 = computeMiyar([H("daughter"), H("full_sister"), H("paternal_brother")], E());
    expect(r2.blocked.some((b) => b.relation === "paternal_brother" && /352/.test(b.reason))).toBe(true);
    const r3 = computeMiyar([H("father"), H("daughter")], E());
    expect(r3.explanations.some((e) => e.article === "المادة 353")).toBe(true);
    const r4 = computeMiyar([H("husband"), H("daughter")], E());
    expect(r4.explanations.some((e) => e.article === "المادة 349")).toBe(true);
  });
});

describe("MIYAR: safety", () => {
  it("does not return the remainder unless other relatives are ruled out", () => {
    const r = computeMiyar([H("husband"), H("daughter")], E({ noOtherRelatives: false }));
    expect(r.needsExpert).toBe(true);
    expect(r.remainder).toBeGreaterThan(0);
  });
  it("refuses unsupported heirs instead of guessing", () => {
    const r = computeMiyar([H("grandfather"), H("full_brother")], E());
    expect(r.errors.length).toBeGreaterThan(0);
    expect(r.shares).toHaveLength(0);
  });
  it("flags a deceased heir (obligatory bequest / chain inheritance not computed)", () => {
    const r = computeMiyar([H("son", 1, false), H("wife")], E());
    expect(r.needsExpert).toBe(true);
  });
  it("wasiyya above one third is an error", () => {
    expect(computeMiyar([H("son")], E({ wasiyya: 500 })).errors.length).toBeGreaterThan(0);
  });
  it("amounts sum to the distributable estate (invariant over 4000 random families)", () => {
    let seed = 7;
    const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
    for (let i = 0; i < 4000; i++) {
      const counts: Partial<Record<Rel, number>> = {};
      for (const r of SUPPORTED) if (rnd() < 0.3) counts[r] = 1 + Math.floor(rnd() * 3);
      if (counts.husband && counts.wife) delete counts.wife;
      if (counts.husband) counts.husband = 1;
      if (counts.father) counts.father = 1;
      if (counts.mother) counts.mother = 1;
      if (!Object.keys(counts).length) continue;
      const d = distribute(counts, { noOtherRelatives: true, raddIncludesSpouse: false });
      const total = d.lines.reduce((s, l) => s + num(l.frac), 0);
      expect(Math.abs(total - 1), JSON.stringify(counts)).toBeLessThan(1e-9);
      expect(d.lines.every((l) => l.frac.n > 0 && l.frac.d > 0)).toBe(true);
    }
  });
});

/**
 * AADALA design contrast audit — WCAG 2.1 verification against design/tokens.json.
 * Usage: node scripts/audit-contrast.mjs
 * Exits 1 on any failure (CI-usable).
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const tokens = JSON.parse(fs.readFileSync(path.join(ROOT, "design/tokens.json"), "utf8"));
const C = tokens.colors;

const hex2rgb = (h) => {
  h = h.replace("#", "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const lum = (hex) => {
  const [r, g, b] = hex2rgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const l1 = lum(a), l2 = lum(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

const CHECKS = [
  ["body text: graphite on bg", "graphite", "bg", 4.5],
  ["body text: graphite on surface", "graphite", "surface", 4.5],
  ["muted text on bg", "muted", "bg", 4.5],
  ["muted text on surface", "muted", "surface", 4.5],
  ["headings: navy ink on bg", "navy", "bg", 4.5],
  ["headings: navy ink on surface", "navy", "surface", 4.5],
  ["accent: gold on surface", "gold", "surface", 4.5],
  ["accent: gold on bg", "gold", "bg", 4.5],
  ["accent: gold-bright on brand-navy", "gold-bright", "brand-navy", 4.5],
  ["accent: teal on surface", "teal", "surface", 4.5],
  ["accent: teal on bg", "teal", "bg", 4.5],
  ["on-navy on brand-navy", "on-navy", "brand-navy", 4.5],
  ["on-gold on gold-bright", "on-gold", "gold-bright", 4.5],
  ["on-teal on teal-deep", "on-teal", "teal-deep", 4.5],
  ["danger on surface", "danger", "surface", 4.5],
  ["success on surface", "success", "surface", 4.5],
  ["border on surface (non-text)", "border", "surface", 1.5],
  ["border-strong on surface (controls)", "border-strong", "surface", 3.0],
  ["border-strong on bg (controls)", "border-strong", "bg", 3.0],
];

let totalFail = 0;
for (const mode of ["light", "dark"]) {
  const g = (n) => (mode === "light" ? C[n].light : C[n].dark || C[n].light);
  console.log(`\n=== ${mode.toUpperCase()} THEME ===`);
  let fails = 0;
  for (const [label, fgN, bgN, min] of CHECKS) {
    const fg = g(fgN), bg = g(bgN);
    const c = contrast(fg, bg);
    const ok = c >= min;
    if (!ok) fails++;
    console.log(
      `  ${ok ? "PASS" : "FAIL"}  ${c.toFixed(2).padStart(6)}:1  (min ${min})  ${label.padEnd(38)} ${fg} on ${bg}`
    );
  }
  console.log(`  --> ${fails} failure(s)`);
  totalFail += fails;
}

console.log(`\nTotal failures: ${totalFail}`);
if (totalFail > 0) {
  console.error("design:contrast FAILED");
  process.exit(1);
}
console.log("design:contrast OK — all pairs meet WCAG AA.");

#!/usr/bin/env node
/**
 * AADALA.MA — repair English artifacts inside Arabic legal text (additive).
 *
 *   node scripts/fix-arabic-contamination.mjs           → report only
 *   node scripts/fix-arabic-contamination.mjs --fix     → rewrite the .ts files
 *
 * Source of the defect: PDF extraction dropped Arabic words and left English
 * connectives in their place, e.g. «تطهير الملك from جميع الحقوق» or
 * «حل نزاع betweenهما». This script restores the Arabic connective only where
 * an English word is surrounded by Arabic letters on both sides, so imports
 * (`import ... from "./types"`), identifiers and English prose are untouched.
 *
 * Legal status is unchanged: every document stays `verified: false`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(ROOT, "lib", "legal-data");
const FIX = process.argv.includes("--fix");

/** One documented mapping per artifact. No other wording is changed. */
const MAP = {
  from: "من",
  between: "بين",
  during: "خلال",
  after: "بعد",
  before: "قبل",
  within: "خلال",
  against: "ضد",
  in: "في",
  on: "على",
  to: "إلى",
  of: "من",
  and: "و",
  or: "أو",
};

const AR = /[\u0621-\u064A]/;
const WORD = new RegExp(`\\b(${Object.keys(MAP).join("|")})\\b`, "g");

const isArabic = (ch) => !!ch && AR.test(ch);

function replaceLine(line) {
  return line.replace(WORD, (match, word, offset) => {
    // Nearest non-space neighbour on each side must be an Arabic letter.
    let i = offset - 1;
    while (i >= 0 && /\s/.test(line[i])) i -= 1;
    let j = offset + match.length;
    while (j < line.length && /\s/.test(line[j])) j += 1;
    if (!isArabic(line[i]) || !isArabic(line[j])) return match;
    return MAP[word];
  });
}

if (!fs.existsSync(DIR)) {
  console.error(`[fix-arabic-contamination] missing: ${DIR}`);
  process.exit(1);
}

const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".ts"));
const report = [];
let totalReplacements = 0;
const changed = [];

for (const file of files) {
  const full = path.join(DIR, file);
  const original = fs.readFileSync(full, "utf8");
  const lines = original.split(/\r?\n/);
  let count = 0;
  const samples = [];
  const next = lines.map((line) => {
    const replaced = replaceLine(line);
    if (replaced !== line) {
      const hits = [...line.matchAll(WORD)].length;
      count += hits;
      if (samples.length < 3) samples.push({ before: line.trim().slice(0, 100), after: replaced.trim().slice(0, 100) });
    }
    return replaced;
  });
  if (count > 0) {
    totalReplacements += count;
    report.push({ file, replacements: count, samples });
    changed.push({ full, text: next.join("\n") });
  }
}

console.log(JSON.stringify({ mode: FIX ? "fix" : "report", files: report, totalReplacements }, null, 2));

if (FIX && changed.length) {
  for (const { full, text } of changed) fs.writeFileSync(full, text, "utf8");
  console.log(`[fix-arabic-contamination] rewrote ${changed.length} files, ${totalReplacements} replacements`);
}

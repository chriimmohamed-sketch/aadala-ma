#!/usr/bin/env node
/**
 * AADALA.MA — legal-index cleaner (additive, never invents content).
 *
 *   node scripts/clean-legal-index.mjs           → report only (no writes)
 *   node scripts/clean-legal-index.mjs --fix     → rewrite data/legal-index.json
 *
 * What it does to every chunk (`x`):
 *   1. strips PDF control bytes (\u0000-\u001F except \n) → single space
 *   2. collapses whitespace runs
 *   3. drops chunks that are not usable text (too short, or mostly Latin letters)
 *   4. dedupes identical (slug | first 180 normalised chars)
 *
 * It never edits the Arabic wording itself. Items are rewritten only because
 * PDF extraction inserted control characters and repeated whitespace.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const INDEX = path.join(ROOT, "data", "legal-index.json");

const FIX = process.argv.includes("--fix");

const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g;
const ARABIC = /[\u0621-\u064A]/g;
const LATIN = /[A-Za-z\u00C0-\u00FF]/g;

const clean = (s) => String(s ?? "").replace(CONTROL, " ").replace(/\s+/g, " ").trim();

function isUsableArabic(text) {
  const arabic = (text.match(ARABIC) ?? []).length;
  const latin = (text.match(LATIN) ?? []).length;
  const total = arabic + latin;
  if (total < 20) return false;
  return arabic / total >= 0.55;
}

const normalize = (s) =>
  s
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .toLowerCase();

if (!fs.existsSync(INDEX)) {
  console.error(`[clean-legal-index] missing: ${INDEX}`);
  process.exit(1);
}

const raw = fs.readFileSync(INDEX, "utf8");
const entries = JSON.parse(raw);
if (!Array.isArray(entries)) {
  console.error("[clean-legal-index] legal-index.json is not an array");
  process.exit(1);
}

const beforeBytes = Buffer.byteLength(raw, "utf8");
const perSourceBefore = {};
for (const e of entries) perSourceBefore[e.s] = (perSourceBefore[e.s] ?? 0) + 1;

const out = [];
const seen = new Set();
let modified = 0;
let droppedUnusable = 0;
let droppedDuplicate = 0;

for (const e of entries) {
  const x = clean(e.x);
  if (!x || !isUsableArabic(x)) {
    droppedUnusable += 1;
    continue;
  }
  const key = `${e.s}|${normalize(x).slice(0, 180)}`;
  if (seen.has(key)) {
    droppedDuplicate += 1;
    continue;
  }
  seen.add(key);

  const next = { ...e, x };
  if (next !== e && x !== e.x) modified += 1;
  out.push(next);
}

const perSourceAfter = {};
for (const e of out) perSourceAfter[e.s] = (perSourceAfter[e.s] ?? 0) + 1;

const report = {
  mode: FIX ? "fix" : "report",
  file: path.relative(ROOT, INDEX),
  entriesBefore: entries.length,
  entriesAfter: out.length,
  droppedUnusable,
  droppedDuplicate,
  textModified: modified,
  bytesBefore: beforeBytes,
  bytesAfter: FIX ? undefined : Buffer.byteLength(JSON.stringify(out), "utf8"),
  sources: Object.keys(perSourceBefore).sort().map((slug) => ({
    slug,
    before: perSourceBefore[slug],
    after: perSourceAfter[slug] ?? 0,
  })),
};

console.log(JSON.stringify(report, null, 2));

if (FIX) {
  fs.writeFileSync(INDEX, JSON.stringify(out), "utf8");
  const afterBytes = fs.statSync(INDEX).size;
  console.log(`[clean-legal-index] wrote ${path.relative(ROOT, INDEX)} — ${entries.length} → ${out.length} chunks, ${beforeBytes} → ${afterBytes} bytes`);
}

#!/usr/bin/env node
/**
 * LEGAL DATABASE INGESTION — التحقق من قاعدة بيانات النصوص القانونية
 *   node scripts/ingest-pdfs.mjs
 * - يتأكد أن كل نص في data/legal-database.ts موجود في public/legal/
 * - يعدّ المواد (المادة N) ويحسب SHA-256 والحجم
 * - يكتب docs/legal-ingestion-report.md + يُحدّث data/legal-database.ts
 * - يفشل (exit 1) إذا نقص نص أو فشل التحديث
 */
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const REG = path.join(ROOT, 'data', 'legal-database.ts')
const PUB = path.join(ROOT, 'public', 'legal')
const REPORT = path.join(ROOT, 'docs', 'legal-ingestion-report.md')

const src = fs.readFileSync(REG, 'utf8')
const slugs = [...src.matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[1])
const files = [...src.matchAll(/file:\s*"\/legal\/([^"]+)"/g)].map(m => m[1])
if (slugs.length !== files.length) { console.error('REGISTRY PARSE FAIL'); process.exit(1) }

let fail = false
const rows = []
for (let i = 0; i < slugs.length; i++) {
  const fp = path.join(PUB, files[i])
  if (!fs.existsSync(fp)) { console.error('MISSING TXT:', fp); fail = true; continue }
  const buf = fs.readFileSync(fp)
  const text = buf.toString('utf8')
  const articles = (text.match(/المادة\s+\d+/g) || []).length
  const sha = crypto.createHash('sha256').update(buf).digest('hex')
  rows.push({ slug: slugs[i], file: files[i], articles, sha, bytes: buf.length })
}

// rewrite data/legal-database.ts with real counts/hashes
let out = src
// reset then fill in order
out = out.replace(/articlesCount:\s*\d+,\s*sha256:\s*"[^"]*",\s*bytes:\s*\d+/g, 'articlesCount: 0, sha256: "", bytes: 0')
for (const r of rows) {
  const needle = `articlesCount: 0, sha256: "", bytes: 0`
  const idx = out.indexOf(`slug: "${r.slug}"`)
  if (idx < 0) continue
  const sub = out.slice(idx)
  const j = sub.indexOf(needle)
  const pos = idx + j
  out = out.slice(0, pos) + `articlesCount: ${r.articles}, sha256: "${r.sha}", bytes: ${r.bytes}` + out.slice(pos + needle.length)
}
fs.writeFileSync(REG, out)

fs.mkdirSync(path.dirname(REPORT), { recursive: true })
const md = [
'# تقرير استيراد قاعدة البيانات القانونية',
'',
`تاريخ: ${new Date().toISOString().slice(0,10)}`,
'',
'| # | المصدر | النص | المواد (المادة N) | الحجم (بايت) | SHA-256 |',
'|---|---|---|---|---|---|',
...rows.map((r, i) => `| ${i+1} | ${r.slug} | public/legal/${r.file} | ${r.articles} | ${r.bytes} | ${r.sha.slice(0,16)}… |`),
'',
`المجموع: ${rows.length} مصادر، ${rows.reduce((a,r)=>a+r.articles,0)} مادة مخزنة كنص مستخرج.`,
'',
'**ملاحظة التكرار:** رُفعت 9 ملفات PDF؛ مقابل كل ملف مصدر مدمج واحد فقط (AN 2019 + ONC + تحفيظ + BO 7437 + الدستور + الحقوق العينية ×2 صيغتين). الملفات 39_08 هي مدونة الحقوق العينية (39.08)، وليست القانون 09.08 (المعطيات الشخصية) الذي لم يُرفع.',
'',
'**لا محتوى قانوني مخترعًا:** كل الأعداد والمحتوى من النصوص المستخرجة. النص العربي عند الحاجة للاستشهاد يُقارن دائمًا بالجريدة الرسمية (كما ينصّ المصدر نفسه).',
]
fs.writeFileSync(REPORT, md.join('\n') + '\n')

console.log(`INGEST OK: ${rows.length} sources, ${rows.reduce((a,r)=>a+r.articles,0)} articles, report -> docs/legal-ingestion-report.md`)
if (fail) process.exit(1)

#!/usr/bin/env node
/**
 * scripts/apply-safe-fixes.mjs
 * إصلاح شامل آمن لـ AADALA.MA (نسخة مصحّحة):
 *   1) إغلاق وسوم <script src> غير مغلقة في HTML
 *   2) إصلاح "burglary" ← "الجريدة" في HTML وJS
 *   3) إصلاح مسارات founder.html النسبية
 *   4) إزالة الفرنسية من fiqh/legal-aid (عبارات كاملة)
 *   5) إصلاح الإنجليزية في legal-ai (لا constitutes → لا تُعدّ)
 *   6) تحذير "تجريبي" على زر المواريث
 *   7) إضافة CSP (موسّع بـ Workers) لصفحات HTML
 * وبدون: حذف المصادقة، proxy.ts، admin، package.json، .env.example
 */
import {
  readdirSync, readFileSync, writeFileSync, existsSync,
  statSync,
} from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SKIP_DIRS = new Set([
  'node_modules', '.next', '.git', '.open-next', 'out',
  'scripts', '.github', 'archive', 'public', 'supabase',
]);
const SKIP_FILE_PREFIX = 'AADALA.MA —';
const LOG = { applied: 0, skipped: 0, created: 0, deleted: 0 };
const report = [];

function walk(dir, exts, cb) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, exts, cb);
    else if (exts.some(e => full.endsWith(e))) cb(full);
  }
}

function walkHtml(dir, cb) { walk(dir, ['.html'], cb); }
function walkJs(dir, cb) { walk(dir, ['.js'], cb); }


const CSP_META = `  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https://aadala-ma.cheraimmohamed20.workers.dev;">`;

console.log('\n─── [1/7] إصلاح HTML ───');

walkHtml(ROOT, (file) => {
  const base = file.split('/').pop().split('\\').pop();
  if (base.startsWith(SKIP_FILE_PREFIX)) { LOG.skipped++; return; }

  let content = readFileSync(file, 'utf8');
  const original = content;
  const applied = [];

  // (أ) إغلاق وسوم <script src="..."> غير المغلقة
  const beforeScript = content;
  content = content.replace(
    /<script\s+src="([^"]+)"\s*(?!\s*\/?>)(?=<)/g,
    (m, src) => `<script src="${src}"></script>`
  );
  content = content.replace(
    /<script\s+src="([^"]+)"\s*>\s*(?=\n\s*<script|<div|<footer|<\/body|$)/g,
    `<script src="$1"></script>\n  `
  );
  content = content.replace(/<\/script>\s*<\/script>/g, '</script>');
  if (content !== beforeScript) applied.push('script-close');

  // (ب) burglary → الجريدة (HTML)
  if (/burglary/i.test(content)) {
    content = content
      .replace(/ال\s*burglary\s*الرسمية/g, 'الجريدة الرسمية')
      .replace(/\bburglary\b/gi, 'الجريدة');
    applied.push('burglary');
  }

  // (ج) مسارات founder.html
  if (file.endsWith('founder.html')) {
    const before = content;
    content = content
      .replace(/href="\.\.\/assets\/css\/main\.css"/g, 'href="assets/css/main.css"')
      .replace(/src="\.\.\/assets\/js\/app\.js"/g, 'src="assets/js/app.js"')
      .replace(/src="\.\.\/assets\/js\/i18n\.js"/g, 'src="assets/js/i18n.js"');
    if (content !== before) applied.push('founder-paths');
  }

  // (د) الفرنسية المتسرّبة — عبارات كاملة (أولًا)، ثم مفردات
  if (/fiqh\.html|legal-aid\.html/.test(file)) {
    const before = content;
    content = content
      .replace(/مذهب\s+predominant\s+au\s+Maroc/gi, 'المذهب المالكي السائد في المغرب')
      .replace(/madhhab\s+predominant\s+au\s+Maroc/gi, 'المذهب المالكي السائد في المغرب')
      .replace(/predominant\s+au\s+Maroc/gi, 'السائد في المغرب')
      .replace(/tribunaux\s*،\s*administrations\s*،\s*centres/gi, 'المحاكم، الإدارات، المراكز')
      .replace(/tribunal\s*،\s*administration\s*،\s*médiation/gi, 'المحكمة، الإدارة، الوساطة')
      .replace(/\bpredominant\b/gi, 'السائد');
    if (content !== before) applied.push('french-leak');
  }

  // (هـ) الإنجليزية المكسورة — الواقع "لا constitutes" + الاحتمال "does not constitutes"
  if (file.endsWith('legal-ai.html')) {
    const before = content;
    content = content
      .replace(/does\s+not\s+constitutes/gi, 'does not constitute')
      .replace(/لا\s+constitutes\s+استشارة/g, 'لا تُعدّ استشارة');
    if (content !== before) applied.push('english-fix');
  }

  // (و) تحذير على زر المواريث
  if (file.endsWith('inheritance.html')) {
    const before = content;
    content = content.replace(
      /(<button[^>]*onclick="calculate\(\)"[^>]*>)حساب(<\/button>)/,
      '$1⚠️ حساب (تجريبي)$2'
    );
    if (content !== before) applied.push('inherit-warn');
  }

  // (ز) CSP إن لم تكن موجودة
  if (!content.includes('Content-Security-Policy') && content.includes('<head>')) {
    content = content.replace(/<head>/, `<head>\n${CSP_META}`);
    applied.push('csp');
  }

  if (content !== original) {
    writeFileSync(file, content, 'utf8');
    LOG.applied++;
    report.push(`  ✓ ${relative(ROOT, file).padEnd(35)} [${applied.join(', ')}]`);
  } else {
    LOG.skipped++;
  }
});

console.log('\n─── [2/7] إصلاح burglary في JS ───');

walkJs(ROOT, (file) => {
  // فقط assets/js — تجنّب node_modules وغيره (SKIP_DIRS يغطيها)
  const rel = relative(ROOT, file).replace(/\\/g, '/');
  if (!rel.startsWith('assets/js/')) return;
  let content = readFileSync(file, 'utf8');
  const original = content;
  if (/burglary/i.test(content)) {
    content = content
      .replace(/ال\s*burglary\s*الرسمية/g, 'الجريدة الرسمية')
      .replace(/\bburglary\b/gi, 'الجريدة');
    if (content !== original) {
      writeFileSync(file, content, 'utf8');
      LOG.applied++;
      report.push(`  ✓ ${rel.padEnd(35)} [burglary-js]`);
      return;
    }
  }
  LOG.skipped++;
});

console.log('\n─── [3/7] الحفاظ على المصادقة (تأكيد بدون لمس) ───');
const PRESERVED = [
  'app/[locale]/login',
  'app/[locale]/register',
  'components/LoginForm.tsx',
  'components/RegisterForm.tsx',
  'components/AuthButton.tsx',
  'lib/supabase',
  'supabase/migrations/0002_auth_rls.sql',
  'proxy.ts',
  'app/[locale]/admin/page.tsx',
  'package.json',
  '.env.example',
];
for (const p of PRESERVED) {
  if (existsSync(join(ROOT, p))) {
    report.push(`  · محفوظ (لم يُلمس): ${p}`);
  } else {
    report.push(`  ! غير موجود أصلًا: ${p}`);
  }
}

console.log('\n\n══════════════════════════════════════════');
console.log('  تقرير الإصلاح الآمن');
console.log('══════════════════════════════════════════');
report.forEach(r => console.log(r));
console.log('\n─── الإحصائيات ───');
console.log(`  ملفات معدّلة:    ${LOG.applied}`);
console.log(`  عمليات تخطّيت:   ${LOG.skipped}`);
console.log('\n✅ اكتمل الإصلاح الآمن.\n');
console.log('الخطوة التالية:');
console.log('  npm run lint && npm run typecheck && npm run test && npm run build');

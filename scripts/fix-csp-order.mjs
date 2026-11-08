#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', '.open-next', 'out', 'scripts', '.github', 'archive', 'public', 'supabase']);
const SKIP_PREFIX = 'AADALA.MA —';

function walk(dir, cb) {
  for (const e of readdirSync(dir)) {
    if (SKIP_DIRS.has(e)) continue;
    const full = join(dir, e);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, cb);
    else if (full.endsWith('.html')) cb(full);
  }
}

let fixed = 0;
walk(ROOT, (file) => {
  const base = file.split('/').pop().split('\\').pop();
  if (base.startsWith(SKIP_PREFIX)) return;
  let c = readFileSync(file, 'utf8');
  const orig = c;

  // استخراج سطر CSP
  const cspMatch = c.match(/^\s*<meta[^>]*Content-Security-Policy[^>]*>\s*$/m);
  if (cspMatch) {
    const cspLine = cspMatch[0].trim();
    c = c.replace(cspMatch[0] + '\n', '');
    c = c.replace(cspMatch[0], '');
    // إدراج CSP بعد charset إن وجد، وإلا بعد <head>
    if (/<meta\s+charset[^>]*>/i.test(c)) {
      c = c.replace(/(<meta\s+charset[^>]*>)/i, `$1\n  ${cspLine}`);
    } else {
      c = c.replace(/<head>/i, `<head>\n  ${cspLine}`);
    }
    // إزالة مسافة أولى زائدة في legal-aid
    c = c.replace(/<p class="text-muted">\s+(المحاكم|المحكمة)/g, '<p class="text-muted">$1');
  }

  if (c !== orig) {
    writeFileSync(file, c, 'utf8');
    fixed++;
    console.log(`✓ ${relative(ROOT, file)}`);
  }
});
console.log(`\nأُصلح ${fixed} ملفًا (ترتيب CSP/charset + نظافة legal-aid).`);

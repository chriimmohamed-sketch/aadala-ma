const fs = require('fs');
const base = 'C:/Users/Mohamed Chraim/Downloads/.opera/aadala-ma/supabase/';
const a = fs.readFileSync(base + 'migrations/20261113000100_legal_core_public_read.sql', 'utf8');
const b = fs.readFileSync(base + 'migrations/20261113000200_seed_uploaded_sources.sql', 'utf8');
const header = [
  '-- AADALA.MA - ONE-PASTE SETUP (RLS + public reference seed)',
  '-- Paste this whole file into Supabase Dashboard > SQL Editor and run once.',
  '-- Safe to re-run: policies are dropped/recreated, seeds use ON CONFLICT.',
  '',
  ''
].join('\n');
fs.writeFileSync(base + 'apply_all.sql', header + a + '\n\n' + b, 'utf8');
console.log('apply_all.sql bytes:', fs.statSync(base + 'apply_all.sql').size);

-- ============================================================
-- AADALA.MA — 0016 Repair double-encoded Arabic seed rows
-- Why: the seed rows inserted by 0003/0004 were executed from a
--      bundle that had been read with the Windows ANSI code page,
--      so Arabic (UTF-8) text landed in the database as CP1256
--      mojibake ("ط§ظ„ظˆط¹ط¯ ..." instead of "الوعد ...").
-- Fix: reverse the exact transformation in place:
--        bytes = convert_to(text, 'WIN1256')   -- back to UTF-8 bytes
--        text  = convert_from(bytes, 'UTF8')   -- decode correctly
-- Scope: only rows that still contain the mojibake marker '§'
--        (U+00A7), which never appears in genuine Arabic text.
-- Additive and idempotent: a second run matches zero rows.
-- ============================================================

-- 1) Document templates (0003 seed: 2 rows)
update public.document_templates
set
  title = convert_from(convert_to(title, 'WIN1256'), 'UTF8'),
  description = convert_from(convert_to(coalesce(description, ''), 'WIN1256'), 'UTF8'),
  legal_basis = convert_from(convert_to(coalesce(legal_basis, ''), 'WIN1256'), 'UTF8'),
  template_html = convert_from(convert_to(template_html, 'WIN1256'), 'UTF8'),
  required_fields = convert_from(convert_to(required_fields::text, 'WIN1256'), 'UTF8')::jsonb
where position('§' in title) > 0;

-- 2) Sources (0004 seed: 4 rows; only the Arabic name column is affected)
update public.sources
set name = convert_from(convert_to(name, 'WIN1256'), 'UTF8')
where position('§' in name) > 0;

-- 3) Verification: both queries must return 0 bad rows.
-- select count(*) as bad_templates from public.document_templates where position('§' in title) > 0;
-- select count(*) as bad_sources   from public.sources           where position('§' in name)  > 0;

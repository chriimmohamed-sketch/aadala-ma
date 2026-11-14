# Builds supabase/apply/2026-11-11_pending_bundle.sql from the ordered migrations.
# Reads/writes UTF-8 (no BOM) so Arabic seed templates stay intact.
# Additive helper only: never modifies supabase/migrations/*.

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$migrations = Join-Path $root 'supabase\migrations'
$outFile = Join-Path $PSScriptRoot '2026-11-11_pending_bundle.sql'

$order = @(
    '0003_document_templates',
    '0004_ingestion',
    '0006_contract_audits',
    '0007_tracked_cases',
    '0008_notifications',
    '0009_workspaces',
    '0010_gov_services',
    '0011_case_law',
    '0012_learning',
    '0014_error_reports'
)

$enc = New-Object System.Text.UTF8Encoding($false)
$nl = "`r`n"

$header = @(
    '-- ============================================================',
    '-- AADALA.MA - PENDING DATABASE MIGRATIONS (single paste bundle)',
    '-- Project: pvoenvxinkipgpnddumt',
    '-- Generated: 2026-11-11 from supabase/migrations/ (originals untouched)',
    '-- Why: live PostgREST audit found 22 of 33 tables missing.',
    '-- Proven applied: 0001, 0002, 0005 (their tables exist).',
    '-- This bundle: 0003, 0004, 0006-0012, 0014 (in order, idempotent, atomic).',
    '-- Safe to re-run: IF NOT EXISTS / DROP POLICY IF EXISTS / DROP TRIGGER IF EXISTS',
    '--                / INSERT ... WHERE NOT EXISTS.',
    '-- Run in: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run',
    '-- ============================================================',
    ''
)

$sb = New-Object System.Text.StringBuilder
foreach ($line in $header) { [void]$sb.Append($line).Append($nl) }
[void]$sb.Append('BEGIN;').Append($nl).Append($nl)

foreach ($name in $order) {
    $path = Join-Path $migrations ($name + '.sql')
    $text = [System.IO.File]::ReadAllText($path, $enc)
    [void]$sb.Append('-- ============ ' + $name + '.sql ============').Append($nl)
    [void]$sb.Append($text.Replace("`r`n", "`n").Replace("`n", $nl)).Append($nl)
}

[void]$sb.Append('COMMIT;').Append($nl)

[System.IO.File]::WriteAllText($outFile, $sb.ToString(), $enc)

$check = [System.IO.File]::ReadAllText($outFile, $enc)
Write-Output ('file=' + $outFile)
Write-Output ('chars=' + $check.Length)
Write-Output ('arabic_chars=' + ([regex]::Matches($check, '[\u0600-\u06FF]')).Count)
Write-Output ('mojibake_hits=' + ([regex]::Matches($check, '[\u0637\u00a7\u0638\u201e]')).Count)
Write-Output ('statements_begin=' + ([regex]::Matches($check, 'BEGIN;')).Count)
Write-Output ('statements_commit=' + ([regex]::Matches($check, 'COMMIT;')).Count)

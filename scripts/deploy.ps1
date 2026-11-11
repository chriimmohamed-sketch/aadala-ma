# One-command deploy of AADALA.MA to the correct Cloudflare account.
#
#   powershell -NoProfile -ExecutionPolicy Bypass -File scripts\deploy.ps1
#   powershell ... -File scripts\deploy.ps1 -VerifyOnly     # only check the live site
#   powershell ... -File scripts\deploy.ps1 -NoVerify       # skip the post-deploy check
#
# Requires a `wrangler` login for the canonical account:
#   cheraimmohamed20@gmail.com  ->  0cfbe529667f7f287b11c3ff9feb5139
#   https://aadala-ma.cheraimmohamed20.workers.dev
#
# See docs/DEPLOY_NOTES.md for why this exists (two Cloudflare accounts, CI secrets
# still pointing at the other one).

param(
    [switch]$SkipBuild,
    [switch]$NoVerify,
    [switch]$VerifyOnly,
    [int]$VerifyAttempts = 12
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$SiteUrl = 'https://aadala-ma.cheraimmohamed20.workers.dev'
$ExpectedAccountId = '0cfbe529667f7f287b11c3ff9feb5139'

function Test-LiveSite {
    Write-Host "Checking $SiteUrl/ar ..."
    for ($i = 1; $i -le $VerifyAttempts; $i++) {
        try {
            $probe = "$SiteUrl/ar?deploy=" + [guid]::NewGuid().ToString('N')
            $html = (Invoke-WebRequest -Uri $probe -UseBasicParsing -TimeoutSec 30).Content
            if ($html -match 'justice-header') {
                Write-Host "OK: $SiteUrl serves the current build." -ForegroundColor Green
                return $true
            }
            Write-Host "attempt $i/$VerifyAttempts : still an old build"
        }
        catch {
            Write-Host "attempt $i/$VerifyAttempts : $($_.Exception.Message)"
        }
        if ($i -lt $VerifyAttempts) { Start-Sleep -Seconds 10 }
    }
    Write-Host "ERROR: $SiteUrl is still serving an old build." -ForegroundColor Red
    return $false
}

if ($VerifyOnly) {
    if (Test-LiveSite) { exit 0 } else { exit 1 }
}

# --- OpenNext needs the MSVC runtime on this machine; Edge ships a signed copy. ---
$crtDir = 'C:\Program Files (x86)\Microsoft\Edge\Application\157.0.4341.42'
if ((Test-Path (Join-Path $crtDir 'vcruntime140.dll')) -and -not (Test-Path 'C:\Windows\System32\vcruntime140.dll')) {
    $env:PATH = "$crtDir;$env:PATH"
    Write-Host "Using VC++ runtime from $crtDir"
}

# Public Supabase values (safe in a client bundle); override with environment variables.
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    $env:NEXT_PUBLIC_SUPABASE_URL = 'https://pvoenvxinkipgpnddumt.supabase.co'
}
if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    $env:NEXT_PUBLIC_SUPABASE_ANON_KEY = 'sb_publishable_LzPJfmm_c3MdycX4DTvajQ_eCWdiFB1'
}

# --- Make sure wrangler is pointed at the canonical account. ---
$whoami = & npx wrangler whoami 2>&1 | Out-String
if ($whoami -notmatch $ExpectedAccountId) {
    Write-Host "ERROR: wrangler is not logged in to the canonical account ($ExpectedAccountId)." -ForegroundColor Red
    Write-Host $whoami
    Write-Host "Run 'npx wrangler login' with cheraimmohamed20@gmail.com, then retry." -ForegroundColor Yellow
    exit 1
}

if (-not $SkipBuild) {
    Write-Host "Building with OpenNext ..."
    & cmd /c "npm run cf:build"
    if ($LASTEXITCODE -ne 0) { Write-Host "Build failed." -ForegroundColor Red; exit $LASTEXITCODE }
}

Write-Host "Deploying ..."
& cmd /c "npx wrangler deploy"
if ($LASTEXITCODE -ne 0) { Write-Host "Deploy failed." -ForegroundColor Red; exit $LASTEXITCODE }

if ($NoVerify) { exit 0 }
if (Test-LiveSite) { exit 0 } else { exit 1 }

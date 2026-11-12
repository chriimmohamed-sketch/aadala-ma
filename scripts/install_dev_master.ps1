# Dev Master Installer — Windows (PowerShell)
$ErrorActionPreference = "Continue"
$Root = Join-Path (Get-Location) "Dev_Master_Folder"
$Folders = @("01_Beginner_Projects","02_Intermediate_Projects","03_Advanced_Projects","04_Open_Source_Tools")
foreach ($folder in $Folders) { New-Item -ItemType Directory -Force -Path (Join-Path $Root $folder) | Out-Null }

Write-Host "== فحص المتطلبات ==" -ForegroundColor Cyan
$missing = $false
foreach ($cmd in @("git","docker","python","node")) {
    $found = Get-Command $cmd -ErrorAction SilentlyContinue
    if ($found) {
        $version = & $cmd --version 2>$null | Select-Object -First 1
        Write-Host "✓ $cmd : $version"
    } else {
        Write-Host "⚠ غير موجود: $cmd" -ForegroundColor Yellow
        if ($cmd -eq "git") { $missing = $true }
    }
}
if ($missing) {
    Write-Host "Git ضروري. ثبّته ثم أعد التشغيل." -ForegroundColor Red
    exit 1
}

function Clone-Repo {
    param([string]$Url, [string]$Dest)
    $u = $Url.Split('#')[0]
    if ($u -match '/tree/') { $u = $u -replace '/tree/.*','' }
    $name = [System.IO.Path]::GetFileNameWithoutExtension($u.TrimEnd('/'))
    $target = Join-Path $Dest $name
    if (Test-Path (Join-Path $target ".git")) {
        Write-Host "  ↻ موجود مسبقاً: $name"
        return
    }
    Write-Host "  ↓ clone: $name"
    $null = git clone --depth 1 $u $target 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ $name"
    } else {
        Write-Host "  ✗ فشل: $Url" -ForegroundColor Red
        Add-Content -Path (Join-Path $Root "clone_errors.log") -Value "FAIL: $Url"
    }
}

$beginner = @(
"https://github.com/DarkSoul26/bookstore-mern",
"https://github.com/safak/youtube/tree/quiz-app",
"https://github.com/mkkhedawat/student-management-system",
"https://github.com/cobidev/gatsby-simplefolio",
"https://github.com/gothinkster/realworld",
"https://github.com/machadop1407/recipe-site",
"https://github.com/machadop1407/Expense-Tracker-Fullstack",
"https://github.com/machadop1407/Fitness-Tracker-App",
"https://github.com/adrianhajdin/project_weather_app",
"https://github.com/machadop1407/News-App-Full-Stack",
"https://github.com/R313nt1sss/Meme_Api",
"https://github.com/sahat/hackathon-starter",
"https://github.com/thedeus-network/kutt",
"https://github.com/FaisalST32/note-taking-app",
"https://github.com/antonreshetov/massCode",
"https://github.com/chingu-voyages/v25-geckos-team-65",
"https://github.com/ipenywis/restaurant-webapp",
"https://github.com/enaqx/awesome-react#expense-tracker",
"https://github.com/TryGhost/Ghost",
"https://github.com/Requarks/wiki",
"https://github.com/facebook/docusaurus",
"https://github.com/adrianhajdin/project_travel_companion",
"https://github.com/uber/kepler.gl",
"https://github.com/adrianhajdin/project_corona_tracker",
"https://github.com/coding-garden/tic-tac-toe-multiplayer",
"https://github.com/GoogleChromeLabs/pwa-starter-kit",
"https://github.com/PacktPublishing/MERN-Stack-Course",
"https://github.com/Clever-Programmers/mern-todo",
"https://github.com/safak/youtube/tree/job-board",
"https://github.com/saadpasta/inventory-management-system"
)

$intermediate = @(
"https://github.com/adrianhajdin/project_mern_memories",
"https://github.com/safak/youtube/tree/mern-social-app",
"https://github.com/ooloth/twitter-clone",
"https://github.com/adrianhajdin/project_chat_application",
"https://github.com/antonioerdeljac/next13-lms-platform",
"https://github.com/machadop1407/hotel-management-full-stack",
"https://github.com/mikhae128/restaurant-reservation",
"https://github.com/isurumb/online-movie-ticket-booking-system",
"https://github.com/calendso/calendso",
"https://github.com/shakyShane/grocery-app",
"https://github.com/TannerGabriel/Banking-Application",
"https://github.com/adrianhajdin/project_cryptoverse",
"https://github.com/invoiceninja/invoiceninja",
"https://github.com/CodAffection/Hospital-Management-System",
"https://github.com/zeeshanhanif/car-rental-system",
"https://github.com/adrianhajdin/project_travel_advisor",
"https://github.com/safak/youtube/tree/real-estate-app",
"https://github.com/machadop1407/real-estate-app",
"https://github.com/Clever-Programmers/gmail-clone",
"https://github.com/cortezaproject/corteza-server"
)

$advanced = @(
"https://github.com/shuvooa787/pharmacy-management-system",
"https://github.com/prathyush/awesome-stock-resources",
"https://github.com/strapi/strapi",
"https://github.com/hoppscotch/hoppscotch",
"https://github.com/apache/superset",
"https://github.com/shubhammehra4/Hospital-Management-System",
"https://github.com/JL978/spotify-clone-client",
"https://github.com/muhammederdem/mini-player",
"https://github.com/CleverProgrammers/zoom-clone",
"https://github.com/johndoe/podcast-app",
"https://github.com/safak/youtube/tree/airbnb-clone",
"https://github.com/coding-dojo-sndip/flight-booking-system",
"https://github.com/reedbarger/trello-clone",
"https://github.com/konstantinmuenster/notion-clone",
"https://github.com/oldboyxx/jira_clone",
"https://github.com/rcdexta/react-trello",
"https://github.com/bitwarden/server",
"https://github.com/google/google-authenticator",
"https://github.com/tensorflow/tfjs-examples",
"https://github.com/NicolasHug/Surprise",
"https://github.com/VROOM-Project/vroom",
"https://github.com/grafana/grafana",
"https://github.com/freeCodeCamp/freeCodeCamp"
)

Write-Host "== تحميل مشاريع المبتدئين ($($beginner.Count)) =="
foreach ($u in $beginner) { Clone-Repo -Url $u -Dest (Join-Path $Root "01_Beginner_Projects") }

Write-Host "== تحميل مشاريع المستوى المتوسط ($($intermediate.Count)) =="
foreach ($u in $intermediate) { Clone-Repo -Url $u -Dest (Join-Path $Root "02_Intermediate_Projects") }

Write-Host "== تحميل المشاريع المتقدمة ($($advanced.Count)) =="
foreach ($u in $advanced) { Clone-Repo -Url $u -Dest (Join-Path $Root "03_Advanced_Projects") }

# ---------- 4. Open-source tools ----------
$tools = Join-Path $Root "04_Open_Source_Tools"
New-Item -ItemType Directory -Force -Path $tools | Out-Null
Write-Host "== تثبيت الأدوات مفتوحة المصدر =="

# 1. yt-dlp
if (Get-Command yt-dlp -ErrorAction SilentlyContinue) { Write-Host "  ✓ yt-dlp موجود" }
elseif (Get-Command pip -ErrorAction SilentlyContinue) { pip install -U yt-dlp 2>$null; Write-Host "  ✓ yt-dlp (pip)" }
elseif (Get-Command winget -ErrorAction SilentlyContinue) { winget install yt-dlp.yt-dlp -e 2>$null; Write-Host "  ✓ yt-dlp (winget)" }
else { Write-Host "  ⚠ yt-dlp: لا pip/winget" -ForegroundColor Yellow }

# 2. Ollama
if (Get-Command ollama -ErrorAction SilentlyContinue) { Write-Host "  ✓ Ollama موجود" }
else {
    $ollamaInstaller = Join-Path $env:TEMP "OllamaSetup.exe"
    try {
        Invoke-WebRequest -Uri "https://ollama.com/download/OllamaSetup.exe" -OutFile $ollamaInstaller -UseBasicParsing
        Start-Process -FilePath $ollamaInstaller -Wait
        Write-Host "  ✓ Ollama"
    } catch { Write-Host "  ✗ Ollama" -ForegroundColor Red }
}

# 3. Fooocus
$fooocus = Join-Path $tools "Fooocus"
if (-not (Test-Path $fooocus)) {
    git clone --depth 1 https://github.com/lllyasviel/Fooocus $fooocus 2>$null
    if ($LASTEXITCODE -eq 0) { Write-Host "  ✓ Fooocus (clone)" } else { Write-Host "  ✗ Fooocus" -ForegroundColor Red }
} else { Write-Host "  ↻ Fooocus موجود" }

# 4. Whisper
if (Get-Command whisper -ErrorAction SilentlyContinue) { Write-Host "  ✓ Whisper موجود" }
elseif (Get-Command pip -ErrorAction SilentlyContinue) { pip install -U openai-whisper 2>$null; Write-Host "  ✓ Whisper (pip)" }
else { Write-Host "  ✗ Whisper: لا pip" -ForegroundColor Red }

# 5. Plausible Analytics
$plausible = Join-Path $tools "plausible"
if (-not (Test-Path $plausible)) {
    git clone --depth 1 https://github.com/plausible/analytics $plausible 2>$null
    if ($LASTEXITCODE -eq 0) { Write-Host "  ✓ Plausible (clone)" } else { Write-Host "  ✗ Plausible" -ForegroundColor Red }
} else { Write-Host "  ↻ Plausible موجود" }

# 6. AppFlowy
$appflowy = Join-Path $tools "AppFlowy"
if (-not (Test-Path $appflowy)) {
    git clone --depth 1 https://github.com/AppFlowy-IO/AppFlowy $appflowy 2>$null
    if ($LASTEXITCODE -eq 0) { Write-Host "  ✓ AppFlowy (clone)" } else { Write-Host "  ✗ AppFlowy" -ForegroundColor Red }
} else { Write-Host "  ↻ AppFlowy موجود" }

# 7. Penpot
$penpot = Join-Path $tools "penpot"
if (-not (Test-Path $penpot)) {
    git clone --depth 1 https://github.com/penpot/penpot $penpot 2>$null
    if ($LASTEXITCODE -eq 0) { Write-Host "  ✓ Penpot (clone)" } else { Write-Host "  ✗ Penpot" -ForegroundColor Red }
} else { Write-Host "  ↻ Penpot موجود" }

# 8. n8n
if (Get-Command n8n -ErrorAction SilentlyContinue) { Write-Host "  ✓ n8n موجود" }
elseif (Get-Command npm -ErrorAction SilentlyContinue) { npm install -g n8n 2>$null; Write-Host "  ✓ n8n (npm)" }
elseif (Get-Command docker -ErrorAction SilentlyContinue) { Write-Host "  ⚠ n8n: استخدم docker run n8nio/n8n" }
else { Write-Host "  ✗ n8n: لا npm/docker" -ForegroundColor Red }

# 9. Bitwarden clients
$bw = Join-Path $tools "bitwarden-clients"
if (-not (Test-Path $bw)) {
    git clone --depth 1 https://github.com/bitwarden/clients $bw 2>$null
    if ($LASTEXITCODE -eq 0) { Write-Host "  ✓ Bitwarden clients (clone)" } else { Write-Host "  ✗ Bitwarden" -ForegroundColor Red }
} else { Write-Host "  ↻ Bitwarden clients موجود" }

Write-Host ""
Write-Host "تم التحميل بنجاح" -ForegroundColor Green
Write-Host "المجلد: $Root"
if (Test-Path (Join-Path $Root "clone_errors.log")) {
    $errs = (Get-Content (Join-Path $Root "clone_errors.log")).Count
    Write-Host "أخطاء clone: $errs (راجع $(Join-Path $Root 'clone_errors.log'))" -ForegroundColor Yellow
}

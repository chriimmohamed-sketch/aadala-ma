$ErrorActionPreference = "Stop"
$Root = Join-Path (Get-Location) "Dev_Master_Folder"
$Folders = @("01_Beginner_Projects","02_Intermediate_Projects","03_Advanced_Projects","04_Open_Source_Tools")
foreach ($folder in $Folders) { New-Item -ItemType Directory -Force -Path (Join-Path $Root $folder) | Out-Null }

Write-Host "== فحص المتطلبات ==" -ForegroundColor Cyan
foreach ($cmd in @("git","docker","python","node")) {
    $found = Get-Command $cmd -ErrorAction SilentlyContinue
    if ($found) {
        $version = & $cmd --version 2>$null | Select-Object -First 1
        Write-Host "✓ $cmd : $version"
    } else { Write-Warning "غير موجود: $cmd" }
}
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw "Git ضروري. ثبّته ثم أعد تشغيل السكربت." }

function Clone-Repo([string]$Url, [string]$Destination) {
    $clean = ($Url -split '#')[0]
    $uri = [Uri]$clean
    $parts = $uri.AbsolutePath.Trim('/').Split('/')
    if ($parts.Length -lt 2) { throw "رابط غير صالح: $Url" }
    $owner = $parts[0]; $repo = $parts[1]
    $branch = $null
    if ($parts.Length -ge 4 -and $parts[2] -eq "tree") {
        $branch = ($parts[3..($parts.Length-1)] -join '/')
        $clean = "https://github.com/$owner/$repo"
    }
    $target = Join-Path $Destination $repo
    if (Test-Path (Join-Path $target ".git")) { Write-Host "موجود مسبقاً، تخطي: $repo"; return }
    if (Test-Path $target) { throw "المسار موجود وليس مستودع Git: $target" }
    if ($branch) { & git clone --depth 1 --single-branch --branch $branch $clean $target }
    else { & git clone --depth 1 $clean $target }
    if ($LASTEXITCODE -ne 0) { throw "فشل git clone: $Url" }
}

$Projects = @(
    "01_Beginner_Projects|https://github.com/DarkSoul26/bookstore-mern"
    "01_Beginner_Projects|https://github.com/safak/youtube/tree/quiz-app"
    "01_Beginner_Projects|https://github.com/mkkhedawat/student-management-system"
    "01_Beginner_Projects|https://github.com/cobidev/gatsby-simplefolio"
    "01_Beginner_Projects|https://github.com/gothinkster/realworld"
    "01_Beginner_Projects|https://github.com/machadop1407/recipe-site"
    "01_Beginner_Projects|https://github.com/machadop1407/Expense-Tracker-Fullstack"
    "01_Beginner_Projects|https://github.com/machadop1407/Fitness-Tracker-App"
    "01_Beginner_Projects|https://github.com/adrianhajdin/project_weather_app"
    "01_Beginner_Projects|https://github.com/machadop1407/News-App-Full-Stack"
    "01_Beginner_Projects|https://github.com/R313nt1sss/Meme_Api"
    "01_Beginner_Projects|https://github.com/sahat/hackathon-starter"
    "01_Beginner_Projects|https://github.com/thedeus-network/kutt"
    "01_Beginner_Projects|https://github.com/FaisalST32/note-taking-app"
    "01_Beginner_Projects|https://github.com/antonreshetov/massCode"
    "01_Beginner_Projects|https://github.com/chingu-voyages/v25-geckos-team-65"
    "01_Beginner_Projects|https://github.com/ipenywis/restaurant-webapp"
    "01_Beginner_Projects|https://github.com/enaqx/awesome-react#expense-tracker"
    "01_Beginner_Projects|https://github.com/TryGhost/Ghost"
    "01_Beginner_Projects|https://github.com/Requarks/wiki"
    "01_Beginner_Projects|https://github.com/facebook/docusaurus"
    "01_Beginner_Projects|https://github.com/adrianhajdin/project_travel_companion"
    "01_Beginner_Projects|https://github.com/uber/kepler.gl"
    "01_Beginner_Projects|https://github.com/adrianhajdin/project_corona_tracker"
    "01_Beginner_Projects|https://github.com/coding-garden/tic-tac-toe-multiplayer"
    "01_Beginner_Projects|https://github.com/GoogleChromeLabs/pwa-starter-kit"
    "01_Beginner_Projects|https://github.com/PacktPublishing/MERN-Stack-Course"
    "01_Beginner_Projects|https://github.com/Clever-Programmers/mern-todo"
    "01_Beginner_Projects|https://github.com/safak/youtube/tree/job-board"
    "01_Beginner_Projects|https://github.com/saadpasta/inventory-management-system"
    "02_Intermediate_Projects|https://github.com/adrianhajdin/project_mern_memories"
    "02_Intermediate_Projects|https://github.com/safak/youtube/tree/mern-social-app"
    "02_Intermediate_Projects|https://github.com/ooloth/twitter-clone"
    "02_Intermediate_Projects|https://github.com/adrianhajdin/project_chat_application"
    "02_Intermediate_Projects|https://github.com/antonioerdeljac/next13-lms-platform"
    "02_Intermediate_Projects|https://github.com/machadop1407/hotel-management-full-stack"
    "02_Intermediate_Projects|https://github.com/mikhae128/restaurant-reservation"
    "02_Intermediate_Projects|https://github.com/isurumb/online-movie-ticket-booking-system"
    "02_Intermediate_Projects|https://github.com/calendso/calendso"
    "02_Intermediate_Projects|https://github.com/shakyShane/grocery-app"
    "02_Intermediate_Projects|https://github.com/TannerGabriel/Banking-Application"
    "02_Intermediate_Projects|https://github.com/adrianhajdin/project_cryptoverse"
    "02_Intermediate_Projects|https://github.com/invoiceninja/invoiceninja"
    "02_Intermediate_Projects|https://github.com/CodAffection/Hospital-Management-System"
    "02_Intermediate_Projects|https://github.com/zeeshanhanif/car-rental-system"
    "02_Intermediate_Projects|https://github.com/adrianhajdin/project_travel_advisor"
    "02_Intermediate_Projects|https://github.com/safak/youtube/tree/real-estate-app"
    "02_Intermediate_Projects|https://github.com/machadop1407/real-estate-app"
    "02_Intermediate_Projects|https://github.com/Clever-Programmers/gmail-clone"
    "02_Intermediate_Projects|https://github.com/cortezaproject/corteza-server"
    "03_Advanced_Projects|https://github.com/shuvooa787/pharmacy-management-system"
    "03_Advanced_Projects|https://github.com/prathyush/awesome-stock-resources"
    "03_Advanced_Projects|https://github.com/strapi/strapi"
    "03_Advanced_Projects|https://github.com/hoppscotch/hoppscotch"
    "03_Advanced_Projects|https://github.com/apache/superset"
    "03_Advanced_Projects|https://github.com/shubhammehra4/Hospital-Management-System"
    "03_Advanced_Projects|https://github.com/JL978/spotify-clone-client"
    "03_Advanced_Projects|https://github.com/muhammederdem/mini-player"
    "03_Advanced_Projects|https://github.com/CleverProgrammers/zoom-clone"
    "03_Advanced_Projects|https://github.com/johndoe/podcast-app"
    "03_Advanced_Projects|https://github.com/safak/youtube/tree/airbnb-clone"
    "03_Advanced_Projects|https://github.com/coding-dojo-sndip/flight-booking-system"
    "03_Advanced_Projects|https://github.com/reedbarger/trello-clone"
    "03_Advanced_Projects|https://github.com/konstantinmuenster/notion-clone"
    "03_Advanced_Projects|https://github.com/oldboyxx/jira_clone"
    "03_Advanced_Projects|https://github.com/rcdexta/react-trello"
    "03_Advanced_Projects|https://github.com/bitwarden/server"
    "03_Advanced_Projects|https://github.com/google/google-authenticator"
    "03_Advanced_Projects|https://github.com/tensorflow/tfjs-examples"
    "03_Advanced_Projects|https://github.com/NicolasHug/Surprise"
    "03_Advanced_Projects|https://github.com/VROOM-Project/vroom"
    "03_Advanced_Projects|https://github.com/grafana/grafana"
    "03_Advanced_Projects|https://github.com/freeCodeCamp/freeCodeCamp"
)
$ToolRepos = @(
    "https://github.com/yt-dlp/yt-dlp"
    "https://github.com/ollama/ollama"
    "https://github.com/lllyasviel/Fooocus"
    "https://github.com/openai/whisper"
    "https://github.com/plausible/analytics"
    "https://github.com/AppFlowy-IO/AppFlowy"
    "https://github.com/penpot/penpot"
    "https://github.com/n8n-io/n8n"
    "https://github.com/bitwarden/clients"
)

$Success = 0; $Failed = 0
Write-Host "== تحميل المشاريع: $($Projects.Count) رابطاً ==" -ForegroundColor Cyan
foreach ($entry in $Projects) {
    $parts = $entry -split '\|',2
    $dest = Join-Path $Root $parts[0]
    try { Clone-Repo $parts[1] $dest; $Success++ }
    catch { Write-Warning $_; $Failed++ }
}
Write-Host "== تحميل مستودعات الأدوات التسعة ==" -ForegroundColor Cyan
foreach ($url in $ToolRepos) {
    try { Clone-Repo $url (Join-Path $Root "04_Open_Source_Tools"); $Success++ }
    catch { Write-Warning $_; $Failed++ }
}

Write-Host "== تثبيت yt-dlp و Whisper ==" -ForegroundColor Cyan
if (Get-Command python -ErrorAction SilentlyContinue) {
    & python -m pip install --user --upgrade yt-dlp openai-whisper
    if ($LASTEXITCODE -ne 0) { Write-Warning "تعذر تثبيت حزم Python؛ تحقق من pip وFFmpeg." }
} else { Write-Warning "ثبّت Python 3 لتثبيت yt-dlp وWhisper." }

Write-Host "== تثبيت Ollama ==" -ForegroundColor Cyan
if (Get-Command winget -ErrorAction SilentlyContinue) {
    & winget install --id Ollama.Ollama --exact --accept-package-agreements --accept-source-agreements
    if ($LASTEXITCODE -ne 0) { Write-Warning "تعذر تثبيت Ollama عبر winget؛ استخدم https://ollama.com/download/windows" }
} else { Write-Host "حمّل Ollama من https://ollama.com/download/windows" }

Write-Host @"

== خدمات Docker: تم تنزيل مستودعاتها ولم يتم تشغيلها تلقائياً ==
- Plausible: راجع docker-compose.yml وملف .env.example ودليل self-hosting.
- AppFlowy: اتبع تعليمات AppFlowy-Cloud/Docker الرسمية؛ تطبيق العميل وحده لا يشغّل الخدمة الخلفية.
- Penpot: راجع docker/images/docker-compose.yaml واضبط الأسرار والدومين.
- n8n (تشغيل محلي مؤقت):
  docker volume create n8n_data
  docker run -it --rm --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n
- Bitwarden: مستودع clients لواجهات العميل وليس خادم الاستضافة الذاتية؛ اتبع دليل Bitwarden self-host الرسمي.
- Fooocus: موجود داخل مجلد الأدوات؛ راجع README لاختيار إعداد Python/PyTorch المناسب للعتاد.
"@

Write-Host "المحصلة: نجاح/تخطي=$Success ، إخفاق=$Failed"
if ($Failed -eq 0) { Write-Host "تم التحميل بنجاح" -ForegroundColor Green }
else { Write-Warning "اكتمل التنفيذ مع إخفاقات؛ راجع التحذيرات أعلاه."; exit 2 }

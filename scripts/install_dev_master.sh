#!/usr/bin/env bash
# Dev Master Installer — Linux / macOS
# Creates Dev_Master_Folder, clones the project list, installs 9 open-source tools.
set -u

ROOT="Dev_Master_Folder"
BASE="$(pwd)/$ROOT"

# ---------- 0. Prerequisite check ----------
echo "== فحص المتطلبات =="
missing=0
for cmd in git docker python3 node; do
  if command -v "$cmd" >/dev/null 2>&1; then
    printf '✓ %s: ' "$cmd"; "$cmd" --version 2>/dev/null | head -n 1 || true
  else
    echo "⚠ غير موجود: $cmd"
    [ "$cmd" = "git" ] && missing=1
  fi
done
if [ "$missing" -eq 1 ]; then
  echo "Git ضروري. ثبّته ثم أعد التشغيل."
  exit 1
fi

# ---------- 1. Folder structure ----------
mkdir -p "$BASE"/{01_Beginner_Projects,02_Intermediate_Projects,03_Advanced_Projects,04_Open_Source_Tools}
echo "✓ هيكل المجلدات جاهز: $BASE"

# ---------- 2. Clone helper ----------
clone_repo() {
  # $1 = raw url, $2 = destination dir
  local raw="$1" dest="$2"
  # normalize /tree/branch and #fragment
  local url="$raw"
  url="${url%%#*}"                 # strip fragment
  if [[ "$url" =~ /tree/ ]]; then
    url="${url%%/tree/*}"         # keep base repo url
  fi
  local name
  name="$(basename "$url" .git)"
  local target="$dest/$name"
  if [ -d "$target/.git" ]; then
    echo "  ↻ موجود مسبقاً: $name"
    return 0
  fi
  echo "  ↓ clone: $name"
  if git clone --depth 1 "$url" "$target" >/dev/null 2>&1; then
    echo "  ✓ $name"
  else
    echo "  ✗ فشل: $raw" >> "$BASE/clone_errors.log"
    echo "  ✗ فشل: $raw"
  fi
}

# ---------- 3. Project lists ----------
BEGINNER=(
"https://github.com/DarkSoul26/bookstore-mern"
"https://github.com/safak/youtube/tree/quiz-app"
"https://github.com/mkkhedawat/student-management-system"
"https://github.com/cobidev/gatsby-simplefolio"
"https://github.com/gothinkster/realworld"
"https://github.com/machadop1407/recipe-site"
"https://github.com/machadop1407/Expense-Tracker-Fullstack"
"https://github.com/machadop1407/Fitness-Tracker-App"
"https://github.com/adrianhajdin/project_weather_app"
"https://github.com/machadop1407/News-App-Full-Stack"
"https://github.com/R313nt1sss/Meme_Api"
"https://github.com/sahat/hackathon-starter"
"https://github.com/thedeus-network/kutt"
"https://github.com/FaisalST32/note-taking-app"
"https://github.com/antonreshetov/massCode"
"https://github.com/chingu-voyages/v25-geckos-team-65"
"https://github.com/ipenywis/restaurant-webapp"
"https://github.com/enaqx/awesome-react#expense-tracker"
"https://github.com/TryGhost/Ghost"
"https://github.com/Requarks/wiki"
"https://github.com/facebook/docusaurus"
"https://github.com/adrianhajdin/project_travel_companion"
"https://github.com/uber/kepler.gl"
"https://github.com/adrianhajdin/project_corona_tracker"
"https://github.com/coding-garden/tic-tac-toe-multiplayer"
"https://github.com/GoogleChromeLabs/pwa-starter-kit"
"https://github.com/PacktPublishing/MERN-Stack-Course"
"https://github.com/Clever-Programmers/mern-todo"
"https://github.com/safak/youtube/tree/job-board"
"https://github.com/saadpasta/inventory-management-system"
)

INTERMEDIATE=(
"https://github.com/adrianhajdin/project_mern_memories"
"https://github.com/safak/youtube/tree/mern-social-app"
"https://github.com/ooloth/twitter-clone"
"https://github.com/adrianhajdin/project_chat_application"
"https://github.com/antonioerdeljac/next13-lms-platform"
"https://github.com/machadop1407/hotel-management-full-stack"
"https://github.com/mikhae128/restaurant-reservation"
"https://github.com/isurumb/online-movie-ticket-booking-system"
"https://github.com/calendso/calendso"
"https://github.com/shakyShane/grocery-app"
"https://github.com/TannerGabriel/Banking-Application"
"https://github.com/adrianhajdin/project_cryptoverse"
"https://github.com/invoiceninja/invoiceninja"
"https://github.com/CodAffection/Hospital-Management-System"
"https://github.com/zeeshanhanif/car-rental-system"
"https://github.com/adrianhajdin/project_travel_advisor"
"https://github.com/safak/youtube/tree/real-estate-app"
"https://github.com/machadop1407/real-estate-app"
"https://github.com/Clever-Programmers/gmail-clone"
"https://github.com/cortezaproject/corteza-server"
)

ADVANCED=(
"https://github.com/shuvooa787/pharmacy-management-system"
"https://github.com/prathyush/awesome-stock-resources"
"https://github.com/strapi/strapi"
"https://github.com/hoppscotch/hoppscotch"
"https://github.com/apache/superset"
"https://github.com/shubhammehra4/Hospital-Management-System"
"https://github.com/JL978/spotify-clone-client"
"https://github.com/muhammederdem/mini-player"
"https://github.com/CleverProgrammers/zoom-clone"
"https://github.com/johndoe/podcast-app"
"https://github.com/safak/youtube/tree/airbnb-clone"
"https://github.com/coding-dojo-sndip/flight-booking-system"
"https://github.com/reedbarger/trello-clone"
"https://github.com/konstantinmuenster/notion-clone"
"https://github.com/oldboyxx/jira_clone"
"https://github.com/rcdexta/react-trello"
"https://github.com/bitwarden/server"
"https://github.com/google/google-authenticator"
"https://github.com/tensorflow/tfjs-examples"
"https://github.com/NicolasHug/Surprise"
"https://github.com/VROOM-Project/vroom"
"https://github.com/grafana/grafana"
"https://github.com/freeCodeCamp/freeCodeCamp"
)

echo "== تحميل مشاريع المبتدئين ($( ${#BEGINNER[@]} )) =="
for u in "${BEGINNER[@]}"; do clone_repo "$u" "$BASE/01_Beginner_Projects"; done

echo "== تحميل مشاريع المستوى المتوسط ($( ${#INTERMEDIATE[@]} )) =="
for u in "${INTERMEDIATE[@]}"; do clone_repo "$u" "$BASE/02_Intermediate_Projects"; done

echo "== تحميل المشاريع المتقدمة ($( ${#ADVANCED[@]} )) =="
for u in "${ADVANCED[@]}"; do clone_repo "$u" "$BASE/03_Advanced_Projects"; done

# ---------- 4. Open-source tools ----------
TOOLS="$BASE/04_Open_Source_Tools"
mkdir -p "$TOOLS"
echo "== تثبيت الأدوات مفتوحة المصدر =="

# 1. yt-dlp
if command -v yt-dlp >/dev/null 2>&1; then echo "  ✓ yt-dlp موجود"; else
  if command -v pip3 >/dev/null 2>&1; then pip3 install -U yt-dlp >/dev/null 2>&1 && echo "  ✓ yt-dlp (pip)" || echo "  ✗ yt-dlp";
  elif command -v brew >/dev/null 2>&1; then brew install yt-dlp >/dev/null 2>&1 && echo "  ✓ yt-dlp (brew)" || echo "  ✗ yt-dlp";
  else echo "  ⚠ yt-dlp: لا pip/brew"; fi
fi

# 2. Ollama
if command -v ollama >/dev/null 2>&1; then echo "  ✓ Ollama موجود"; else
  curl -fsSL https://ollama.com/install.sh | sh >/dev/null 2>&1 && echo "  ✓ Ollama" || echo "  ✗ Ollama"
fi

# 3. Fooocus
if [ ! -d "$TOOLS/Fooocus" ]; then
  git clone --depth 1 https://github.com/lllyasviel/Fooocus "$TOOLS/Fooocus" >/dev/null 2>&1 && echo "  ✓ Fooocus (clone)" || echo "  ✗ Fooocus"
else echo "  ↻ Fooocus موجود"; fi

# 4. Whisper
if command -v whisper >/dev/null 2>&1; then echo "  ✓ Whisper موجود"; else
  pip3 install -U openai-whisper >/dev/null 2>&1 && echo "  ✓ Whisper (pip)" || echo "  ✗ Whisper"
fi

# 5. Plausible Analytics (docker)
if command -v docker >/dev/null 2>&1; then
  if [ ! -d "$TOOLS/plausible" ]; then
    git clone --depth 1 https://github.com/plausible/analytics "$TOOLS/plausible" >/dev/null 2>&1 && echo "  ✓ Plausible (clone)" || echo "  ✗ Plausible"
  else echo "  ↻ Plausible موجود"; fi
else echo "  ⚠ Plausible: Docker غير موجود"; fi

# 6. AppFlowy
if [ ! -d "$TOOLS/AppFlowy" ]; then
  git clone --depth 1 https://github.com/AppFlowy-IO/AppFlowy "$TOOLS/AppFlowy" >/dev/null 2>&1 && echo "  ✓ AppFlowy (clone)" || echo "  ✗ AppFlowy"
else echo "  ↻ AppFlowy موجود"; fi

# 7. Penpot
if command -v docker >/dev/null 2>&1; then
  if [ ! -d "$TOOLS/penpot" ]; then
    git clone --depth 1 https://github.com/penpot/penpot "$TOOLS/penpot" >/dev/null 2>&1 && echo "  ✓ Penpot (clone)" || echo "  ✗ Penpot"
  else echo "  ↻ Penpot موجود"; fi
else echo "  ⚠ Penpot: Docker غير موجود"; fi

# 8. n8n
if command -v n8n >/dev/null 2>&1; then echo "  ✓ n8n موجود"; else
  if command -v npm >/dev/null 2>&1; then npm install -g n8n >/dev/null 2>&1 && echo "  ✓ n8n (npm)" || echo "  ✗ n8n";
  elif command -v docker >/dev/null 2>&1; then echo "  ⚠ n8n: استخدم docker run n8nio/n8n"; else echo "  ✗ n8n: لا npm/docker"; fi
fi

# 9. Bitwarden (clients)
if [ ! -d "$TOOLS/bitwarden-clients" ]; then
  git clone --depth 1 https://github.com/bitwarden/clients "$TOOLS/bitwarden-clients" >/dev/null 2>&1 && echo "  ✓ Bitwarden clients (clone)" || echo "  ✗ Bitwarden"
else echo "  ↻ Bitwarden clients موجود"; fi

echo ""
echo "تم التحميل بنجاح"
echo "المجلد: $BASE"
[ -f "$BASE/clone_errors.log" ] && echo "أخطاء clone: $(wc -l < "$BASE/clone_errors.log") (راجع $BASE/clone_errors.log)"

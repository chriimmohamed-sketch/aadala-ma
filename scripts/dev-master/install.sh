#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="Dev_Master_Folder"
BASE="$(pwd)/$ROOT"
mkdir -p "$BASE"/{01_Beginner_Projects,02_Intermediate_Projects,03_Advanced_Projects,04_Open_Source_Tools}

echo "== فحص المتطلبات =="
for cmd in git docker python3 node; do
  if command -v "$cmd" >/dev/null 2>&1; then
    printf '✓ %s: ' "$cmd"; "$cmd" --version 2>/dev/null | head -n 1 || true
  else
    echo "⚠ غير موجود: $cmd"
  fi
done
command -v git >/dev/null 2>&1 || { echo "Git ضروري. ثبّته ثم أعد التشغيل."; exit 1; }

# يحوّل روابط /tree/branch إلى clone مع تحديد الفرع، ويتجاهل fragment مثل #expense-tracker.
clone_repo() {
  local url="$1" dest="$2" clean owner repo branch
  clean="${url%%#*}"
  owner="$(printf '%s' "$clean" | cut -d/ -f4)"
  repo="$(printf '%s' "$clean" | cut -d/ -f5)"
  branch=""
  if [[ "$clean" == */tree/* ]]; then
    branch="${clean#*/tree/}"
    clean="https://github.com/$owner/$repo"
  fi
  [[ -n "$repo" ]] || { echo "رابط غير صالح: $url"; return 1; }
  if [[ -d "$dest/$repo/.git" ]]; then
    echo "موجود مسبقاً، تخطي: $repo"; return 0
  fi
  if [[ -e "$dest/$repo" ]]; then
    echo "المسار موجود وليس مستودع Git، تخطي: $dest/$repo"; return 1
  fi
  if [[ -n "$branch" ]]; then
    git clone --depth 1 --single-branch --branch "$branch" "$clean" "$dest/$repo"
  else
    git clone --depth 1 "$clean" "$dest/$repo"
  fi
}

PROJECTS=(
  '01_Beginner_Projects|https://github.com/DarkSoul26/bookstore-mern'
  '01_Beginner_Projects|https://github.com/safak/youtube/tree/quiz-app'
  '01_Beginner_Projects|https://github.com/mkkhedawat/student-management-system'
  '01_Beginner_Projects|https://github.com/cobidev/gatsby-simplefolio'
  '01_Beginner_Projects|https://github.com/gothinkster/realworld'
  '01_Beginner_Projects|https://github.com/machadop1407/recipe-site'
  '01_Beginner_Projects|https://github.com/machadop1407/Expense-Tracker-Fullstack'
  '01_Beginner_Projects|https://github.com/machadop1407/Fitness-Tracker-App'
  '01_Beginner_Projects|https://github.com/adrianhajdin/project_weather_app'
  '01_Beginner_Projects|https://github.com/machadop1407/News-App-Full-Stack'
  '01_Beginner_Projects|https://github.com/R313nt1sss/Meme_Api'
  '01_Beginner_Projects|https://github.com/sahat/hackathon-starter'
  '01_Beginner_Projects|https://github.com/thedeus-network/kutt'
  '01_Beginner_Projects|https://github.com/FaisalST32/note-taking-app'
  '01_Beginner_Projects|https://github.com/antonreshetov/massCode'
  '01_Beginner_Projects|https://github.com/chingu-voyages/v25-geckos-team-65'
  '01_Beginner_Projects|https://github.com/ipenywis/restaurant-webapp'
  '01_Beginner_Projects|https://github.com/enaqx/awesome-react#expense-tracker'
  '01_Beginner_Projects|https://github.com/TryGhost/Ghost'
  '01_Beginner_Projects|https://github.com/Requarks/wiki'
  '01_Beginner_Projects|https://github.com/facebook/docusaurus'
  '01_Beginner_Projects|https://github.com/adrianhajdin/project_travel_companion'
  '01_Beginner_Projects|https://github.com/uber/kepler.gl'
  '01_Beginner_Projects|https://github.com/adrianhajdin/project_corona_tracker'
  '01_Beginner_Projects|https://github.com/coding-garden/tic-tac-toe-multiplayer'
  '01_Beginner_Projects|https://github.com/GoogleChromeLabs/pwa-starter-kit'
  '01_Beginner_Projects|https://github.com/PacktPublishing/MERN-Stack-Course'
  '01_Beginner_Projects|https://github.com/Clever-Programmers/mern-todo'
  '01_Beginner_Projects|https://github.com/safak/youtube/tree/job-board'
  '01_Beginner_Projects|https://github.com/saadpasta/inventory-management-system'
  '02_Intermediate_Projects|https://github.com/adrianhajdin/project_mern_memories'
  '02_Intermediate_Projects|https://github.com/safak/youtube/tree/mern-social-app'
  '02_Intermediate_Projects|https://github.com/ooloth/twitter-clone'
  '02_Intermediate_Projects|https://github.com/adrianhajdin/project_chat_application'
  '02_Intermediate_Projects|https://github.com/antonioerdeljac/next13-lms-platform'
  '02_Intermediate_Projects|https://github.com/machadop1407/hotel-management-full-stack'
  '02_Intermediate_Projects|https://github.com/mikhae128/restaurant-reservation'
  '02_Intermediate_Projects|https://github.com/isurumb/online-movie-ticket-booking-system'
  '02_Intermediate_Projects|https://github.com/calendso/calendso'
  '02_Intermediate_Projects|https://github.com/shakyShane/grocery-app'
  '02_Intermediate_Projects|https://github.com/TannerGabriel/Banking-Application'
  '02_Intermediate_Projects|https://github.com/adrianhajdin/project_cryptoverse'
  '02_Intermediate_Projects|https://github.com/invoiceninja/invoiceninja'
  '02_Intermediate_Projects|https://github.com/CodAffection/Hospital-Management-System'
  '02_Intermediate_Projects|https://github.com/zeeshanhanif/car-rental-system'
  '02_Intermediate_Projects|https://github.com/adrianhajdin/project_travel_advisor'
  '02_Intermediate_Projects|https://github.com/safak/youtube/tree/real-estate-app'
  '02_Intermediate_Projects|https://github.com/machadop1407/real-estate-app'
  '02_Intermediate_Projects|https://github.com/Clever-Programmers/gmail-clone'
  '02_Intermediate_Projects|https://github.com/cortezaproject/corteza-server'
  '03_Advanced_Projects|https://github.com/shuvooa787/pharmacy-management-system'
  '03_Advanced_Projects|https://github.com/prathyush/awesome-stock-resources'
  '03_Advanced_Projects|https://github.com/strapi/strapi'
  '03_Advanced_Projects|https://github.com/hoppscotch/hoppscotch'
  '03_Advanced_Projects|https://github.com/apache/superset'
  '03_Advanced_Projects|https://github.com/shubhammehra4/Hospital-Management-System'
  '03_Advanced_Projects|https://github.com/JL978/spotify-clone-client'
  '03_Advanced_Projects|https://github.com/muhammederdem/mini-player'
  '03_Advanced_Projects|https://github.com/CleverProgrammers/zoom-clone'
  '03_Advanced_Projects|https://github.com/johndoe/podcast-app'
  '03_Advanced_Projects|https://github.com/safak/youtube/tree/airbnb-clone'
  '03_Advanced_Projects|https://github.com/coding-dojo-sndip/flight-booking-system'
  '03_Advanced_Projects|https://github.com/reedbarger/trello-clone'
  '03_Advanced_Projects|https://github.com/konstantinmuenster/notion-clone'
  '03_Advanced_Projects|https://github.com/oldboyxx/jira_clone'
  '03_Advanced_Projects|https://github.com/rcdexta/react-trello'
  '03_Advanced_Projects|https://github.com/bitwarden/server'
  '03_Advanced_Projects|https://github.com/google/google-authenticator'
  '03_Advanced_Projects|https://github.com/tensorflow/tfjs-examples'
  '03_Advanced_Projects|https://github.com/NicolasHug/Surprise'
  '03_Advanced_Projects|https://github.com/VROOM-Project/vroom'
  '03_Advanced_Projects|https://github.com/grafana/grafana'
  '03_Advanced_Projects|https://github.com/freeCodeCamp/freeCodeCamp'
)
TOOLS=(
  'https://github.com/yt-dlp/yt-dlp'
  'https://github.com/ollama/ollama'
  'https://github.com/lllyasviel/Fooocus'
  'https://github.com/openai/whisper'
  'https://github.com/plausible/analytics'
  'https://github.com/AppFlowy-IO/AppFlowy'
  'https://github.com/penpot/penpot'
  'https://github.com/n8n-io/n8n'
  'https://github.com/bitwarden/clients'
)

ok=0; failed=0
echo "== تحميل المشاريع (عدد الروابط: ${#PROJECTS[@]}) =="
for item in "${PROJECTS[@]}"; do
  level="${item%%|*}"; url="${item#*|}"
  echo "---- $url"
  if clone_repo "$url" "$BASE/$level"; then ((ok+=1)); else ((failed+=1)); echo "فشل هذا المستودع: $url"; fi
done

echo "== تحميل مستودعات الأدوات التسعة =="
for url in "${TOOLS[@]}"; do
  echo "---- $url"
  if clone_repo "$url" "$BASE/04_Open_Source_Tools"; then ((ok+=1)); else ((failed+=1)); echo "تعذر تحميل: $url"; fi
done

# تثبيت أدوات CLI بطريقة غير مدمرة؛ لا يتم تشغيل خوادم Docker تلقائياً.
echo "== تثبيت yt-dlp و Whisper (إن توفرت Python) =="
if command -v python3 >/dev/null 2>&1; then
  python3 -m pip install --user --upgrade yt-dlp openai-whisper || echo "⚠ تعذر تثبيت حزم Python؛ راجع رسالة pip."
else
  echo "⚠ ثبّت Python 3 لتثبيت yt-dlp و Whisper."
fi

echo "== تثبيت Ollama =="
case "$(uname -s)" in
  Darwin)
    if command -v brew >/dev/null 2>&1; then brew install ollama || echo "⚠ تعذر تثبيت Ollama عبر Homebrew."
    else echo "ثبّت Ollama من https://ollama.com/download/mac"; fi ;;
  Linux)
    if command -v curl >/dev/null 2>&1; then
      echo "لتثبيت Ollama: curl -fsSL https://ollama.com/install.sh | sh"
      echo "لم أشغّل سكربتاً خارجياً بصلاحيات النظام تلقائياً؛ نفّذ الأمر أعلاه بعد مراجعته."
    else echo "ثبّت Ollama من https://ollama.com/download"; fi ;;
esac

cat <<'INFO'

== خدمات تحتاج Docker وإعداداً قبل التشغيل ==
تم تحميل مستودعاتها داخل 04_Open_Source_Tools، لكن لم يتم تشغيلها تلقائياً لتجنب
فتح منافذ أو إنشاء قواعد بيانات/حسابات بإعدادات افتراضية:

- Plausible: راجع docker-compose.yml وملف .env.example داخل analytics؛ اتبع دليل self-hosting الرسمي.
- AppFlowy: اتبع دليل AppFlowy-Cloud/Docker الرسمي؛ مستودع AppFlowy وحده ليس خدمة مكتملة.
- Penpot: راجع docker/images/docker-compose.yaml ودليل النشر الرسمي، واضبط الأسرار والدومين.
- n8n: تجربة محلية: docker volume create n8n_data
  docker run -it --rm --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n
- Bitwarden: clients هو كود واجهات العميل، وليس خادم Bitwarden. للنشر الذاتي استخدم مستودع/دليل bitwarden self-host الرسمي.

== Fooocus ==
المستودع موجود في مجلد الأدوات. يحتاج Python وبيئة مناسبة وموارد GPU؛ اتبع README الخاص بنظامك.
لا تشغّله تلقائياً لأن تثبيت PyTorch وحزم GPU يختلف حسب الجهاز.

INFO

echo "نتيجة Git: نجاح/تخطي=$ok، إخفاق=$failed"
if (( failed == 0 )); then
  echo "تم التحميل بنجاح"
else
  echo "اكتمل التنفيذ مع إخفاقات؛ راجع الرسائل أعلاه."
  exit 2
fi

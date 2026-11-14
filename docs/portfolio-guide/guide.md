# من الصفر إلى Portfolio احترافي بالذكاء الاصطناعي | الدليل العملي في 6 خطوات

حساب المحتوى: @mshaerx


---

# ابدأ من هنا
*ما الذي ستبنيه، وكيف تستخدم هذا الدليل؟*


## ماذا ستبني؟

ستبني موقع Portfolio شخصياً احترافياً يعرّف بك وبأعمالك، وتنشره على الإنترنت برابط تشاركه مع أي شخص. ستبدأ من مجلد فارغ، وتنتهي بموقع منشور، وتفهم ما فعلته في كل خطوة. لا تحتاج إلى خبرة برمجية: الذكاء الاصطناعي يكتب الكود، وأنت تقود القرارات وتتحقق من النتائج.

## كيف يعمل الدليل؟

الدليل مكوّن من **6 خطوات** مطابقة لخطوات الفيديو. كل خطوة تنتهي بمخرجات ملموسة تحتاجها الخطوة التي بعدها، ولذلك يجب أن تسير بالترتيب.

| # | الخطوة | ماذا تخرج به؟ |
|---|---|---|
| 1 | اختيار أداة الذكاء الاصطناعي | أداة مثبّتة، وجهاز جاهز، وتقرير فحص |
| 2 | مجلدات المشروع وتنظيم الملفات | هيكل المشروع وملف قواعد `CLAUDE.md` |
| 3 | اكتشاف المحتوى وكتابته | ملف `Content/portfolio-content.md` |
| 4 | تحليل الإلهام وتصميم الموقع وبناؤه | موقع يعمل على جهازك، ومبني على مراحل |
| 5 | الأمان وفحص الموقع | تقرير أمني وإصلاحات مُختبَرة |
| 6 | النشر والاختبار النهائي | موقع منشور برابط، وقائمة فحص مكتملة |

## كيف تستخدم الـ Prompts؟

الـ **Prompt** هو نص تكتبه للأداة لتعرف ماذا تفعل بالضبط. كل Prompt في هذا الدليل مكتوب بالإنجليزية لأن أدوات البرمجة تتعامل معه بدقة أكبر، ومعه شرح عربي لما يفعله ومتى تستخدمه.

1. انسخ النص الموجود داخل الصندوق الداكن كاملاً.
2. استبدل ما بين الأقواس المربعة مثل `[YOUR NAME]` ببياناتك، وانتبه: لا تغيّر شيئاً آخر.
3. الصقه في الأداة وأرسله، ثم اقرأ ما تقترحه الأداة قبل أن توافق.
4. لا تنتقل إلى الـ Prompt التالي قبل أن تتحقق من نتيجة السابق.


> 💡 **نسخة منفصلة لكل Prompt**
> مع هذا الدليل مجلد باسم `prompts/` فيه كل Prompt في ملف نصي مستقل. يمكنك نسخه من هناك بدل نسخه من الـ PDF.


## ست قواعد تحمي مشروعك

| القاعدة | معناها |
|---|---|
| لا ادعاء بلا دليل | اطلب من الأداة أن تعرض الأمر الذي شغّلته ونتيجته |
| لا اختراع | كل خبرة أو رقم أو مشروع يجب أن تكون حقيقية ومن عندك |
| مراحل صغيرة | لا تطلب الموقع كاملاً دفعة واحدة |
| موافقتك أولاً | لا انتقال لمرحلة جديدة دون موافقتك الصريحة |
| لا أسرار | لا تكتب كلمات مرور أو مفاتيح API في أي محادثة أو ملف |
| الأمان لا يُفترض | اطلب فحصاً أمنياً فعلياً، ولا تثق في عبارة «الموقع آمن» |


> ⚠️ **تنبيه صادق**
> هذا الدليل يساعدك على بناء موقع منظم وآمن بدرجة معقولة، لكنه لا يضمن أن موقعك خالٍ من الثغرات. الأدوات تخطئ، وأنت المسؤول عن مراجعة ما يُنشر باسمك. وإن كان موقعك يجمع بيانات الزوار أو يتعامل مع مدفوعات، فاطلب مراجعة أمنية من مختص قبل النشر.



> ℹ️ **الدليل مجاني، والأدوات قد لا تكون كذلك**
> هذا الدليل مجاني بالكامل. لكن أداة الذكاء الاصطناعي واستضافة الموقع قد تتطلب اشتراكاً أو رصيداً بحسب خطتك. تحقق من الصفحات الرسمية للأسعار قبل أن تبدأ.



---

# الخطوة 1: اختيار أداة الذكاء الاصطناعي
*Choose Your AI Tool*


## 1 · ماذا سنفعل؟

سنختار الأداة التي ستبني بها الموقع، ثم نثبّتها ونتأكد أن جهازك جاهز. هذه خطوة قصيرة لكنها تحدد طريقة عملك في بقية الدليل.

## 2 · لماذا نحتاج إلى هذه الخطوة؟

الأدوات تختلف في شيء جوهري: هل ترى ملفاتك الحقيقية وتنفّذ أوامر على جهازك، أم تكتفي بالإجابة في نافذة محادثة؟ إذا كانت الأداة لا ترى مجلدك، فأنت ستنسخ الكود وتلصقه يدوياً وتخطئ كثيراً. وإذا اخترت أداة لا تناسب مستواك، فستضيع وقتك في تعقيدات لا علاقة لها بمشروعك.

## 3 · ماذا نحتاج قبل البدء؟

- جهاز كمبيوتر وإنترنت.
- نافذة طرفية (**Terminal**): برنامج تكتب فيه أوامر نصية بدل النقر. إن لم تستخدمها من قبل فلا مشكلة، وثائق Claude Code فيها دليل مبسّط لفتحها.
- حساب في الأداة التي ستختارها.
- مجلد على جهازك ستعمل فيه (ننشئه في الخطوة 2).

## 4 · التنفيذ خطوة بخطوة

### أنواع الأدوات

| النوع | يرى ملفاتك؟ | ينفّذ أوامر؟ | تحكمك في الكود | مناسب لـ |
|---|---|---|---|---|
| أدوات Agentic Coding | نعم، داخل المجلد الذي تفتحه | نعم، بإذنك | كامل | بناء موقع حقيقي تملكه وتنشره |
| مساعدات المحادثة | لا، إلا إن رفعت ملفات | لا | كامل لكن بنسخ ولصق يدوي | أسئلة وأفكار ومسودات |
| أدوات بناء المواقع بالواجهة | داخل المنصة فقط | لا | محدود | موقع سريع بلا اهتمام بالكود |

**Agentic Coding** تعني أن الأداة لا تجيب فقط: هي تقرأ ملفات مشروعك، وتعدّلها، وتشغّل أوامر، وتجرّب النتيجة، وتكرر حتى تنجح، وأنت تراقب وتوجّه.

### توصيتي للمبتدئ

استخدم **Claude Code**. لأن هذا الدليل مبني حوله، ولأنه يقرأ مجلد المشروع بالكامل وهذا ما تحتاجه الخطوات القادمة. بحسب وثائقه الرسمية يعمل في الطرفية، وأيضاً على الويب وفي تطبيق سطح المكتب وفي VS Code وJetBrains. لتسجيل الدخول تحتاج واحداً من: اشتراك Claude (Pro أو Max أو Team أو Enterprise)، أو حساب Claude Console برصيد مسبق الدفع، أو وصولاً عبر مزوّد سحابي مدعوم.


> ℹ️ **إن اخترت أداة أخرى**
> البرومبتات في هذا الدليل تعمل في أي أداة تقرأ ملفات مشروعك وتنفّذ أوامر. قد تختلف أسماء الأزرار وطريقة التثبيت، وستحتاج إلى الرجوع لوثائق أداتك. لا تستخدم مساعد محادثة لا يرى مجلدك إلا إن كنت مستعداً لرفع الملفات يدوياً في كل مرة.


### تثبيت Claude Code

افتح الطرفية ونفّذ الأمر المناسب لنظامك (من الوثائق الرسمية):

```bash
# macOS, Linux, or WSL
curl -fsSL https://claude.ai/install.sh | bash
```

```powershell
# Windows PowerShell
irm https://claude.ai/install.ps1 | iex
```

```batch
:: Windows CMD
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

بدائل: `brew install --cask claude-code` على macOS مع Homebrew، أو `winget install Anthropic.ClaudeCode` على Windows. التثبيتات عبر Homebrew وWinGet لا تتحدث تلقائياً.

بعد انتهاء التثبيت افتح **نافذة طرفية جديدة** ثم اكتب:

```bash
claude --version
```

### أول تشغيل

انتقل إلى أي مجلد واكتب `claude`. سيطلب منك تسجيل الدخول في المتصفح في أول مرة. بعد الدخول اكتب `/help` لترى الأوامر المتاحة.


> 💡 **أوضاع الصلاحيات**
> الأداة تسألك قبل أن تعدّل ملفاً أو تشغّل أمراً، بحسب «وضع الصلاحيات» الظاهر في الشريط السفلي. اضغط **Shift+Tab** للتنقل بين الأوضاع. في وضع **Plan** تقرأ الأداة وتخطط دون أن تعدّل شيئاً، وهو مفيد للتخطيط. في أول مشروع لك اقرأ كل طلب موافقة بدل الضغط عليه تلقائياً.


### Prompt الخطوة 1


#### Prompt 01: فحص الجاهزية قبل البدء

**متى تستخدمه؟** استخدمه مرة واحدة بعد التثبيت، قبل أن تنشئ أي شيء.

**ماذا يفعل؟** يفحص جهازك قراءةً فقط: هل `git` و`node` و`npm` مثبتة؟ وما الناقص؟ ويخرج بجدول واضح بما يجب فعله دون أن يثبّت شيئاً.

```text
ROLE
You are a patient senior developer onboarding a complete beginner. Assume I have never built a website with an AI coding tool before.

CONTEXT
I am about to build a personal portfolio website from an empty folder, using you as my coding assistant. My operating system is: [YOUR OS: Windows / macOS / Linux]. My profession is: [YOUR PROFESSION]. I have no programming experience unless I say otherwise: [YOUR EXPERIENCE LEVEL].

TASK
Check whether my machine is ready, and tell me exactly what is missing. Do not install or change anything without asking me first.

STEPS
1. Inspect the current working directory and tell me whether it is empty, and what it is called.
2. Check which of these are installed and print their versions (read-only commands only): git, node, npm. If a command is not found, say so plainly instead of guessing.
3. Check whether git is configured with a user name and email (git config --global user.name and user.email). Never print any password, token, or credential.
4. Tell me whether I can run a local web server on this machine (for example: node installed, or python installed).
5. List what is missing, in order of importance, and for each missing item give: what it is (one plain sentence), why I need it for a portfolio website, and the official download or install page.
6. Tell me which items are optional (for example a code editor) and which are required.

CONSTRAINTS
- Read-only commands only in this step. Do not install, delete, or modify anything.
- Do not invent version requirements. If you are unsure whether something is required, say "I am not sure" and tell me where to verify.
- Explain every technical term the first time you use it, in one simple sentence.
- Never ask me to paste secrets, passwords, or API keys.

QUALITY BAR
A non-technical person must be able to follow your report without searching anything else.

OUTPUT FORMAT
A short table: Tool | Installed? | Version | Required? | What to do. Then a "Next actions" list of at most 5 items, and one sentence saying whether I am ready to continue to the next step.

VERIFY
Show the exact commands you ran and what they returned, so I can see the evidence.

STOP AND ASK
When the report is done, stop. Wait for me to install anything missing and tell you to re-check.
```


## 6 · ماذا نتوقع من الأداة؟

تقرير قصير بجدول: ما المثبّت من `git` و`node` و`npm` وإصداراته، وما الناقص، وما الذي تفعله لإصلاحه، وهل أنت جاهز للانتقال. الأداة يجب ألا تثبّت شيئاً دون سؤالك.

## 7 · كيف نتحقق من صحة النتيجة؟

- الأمر `claude --version` يطبع رقم إصدار متبوعاً بـ (Claude Code).
- تقرير الأداة يعرض الأوامر التي شغّلتها ونتائجها، ولا يكتفي بعبارات عامة.
- لا يوجد في التقرير أي كلمة مرور أو مفتاح.

## 8 · الأخطاء الشائعة وكيف تحلها

| المشكلة | الحل |
|---|---|
| `claude` غير معروف بعد التثبيت | افتح نافذة طرفية جديدة. إن استمر فمجلد التثبيت ليس في متغير PATH، راجع صفحة استكشاف أخطاء التثبيت في الوثائق |
| ظهرت رسالة `The token '&&' is not a valid statement separator` | أنت في PowerShell وتشغّل أمر CMD. استخدم أمر PowerShell |
| ظهرت رسالة `'irm' is not recognized` | أنت في CMD وتشغّل أمر PowerShell. استخدم أمر CMD |
| فشل التثبيت برسالة 403 أو syntax error | راجع صفحة Troubleshoot installation في الوثائق، فيها حل لكل رسالة |
| لا تعرف كيف تفتح الطرفية | اتبع دليل الطرفية الرسمي لـ Claude Code |

## 9 · ما الذي يجب أن نحصل عليه قبل الانتقال؟


> ✅ **قائمة الإنجاز**
> - الأداة مثبّتة وسجّلت الدخول بنجاح.
> - `claude --version` يعمل.
> - تقرير الفحص لا يظهر عناصر ناقصة مهمة.
> - `git` مثبّت (ستحتاجه للنشر في الخطوة 6).



**المصادر:** [S1] [Claude Code · Quickstart](https://code.claude.com/docs/en/quickstart) · [S13] [Claude Code · Terminal guide](https://code.claude.com/docs/en/terminal-guide)



---

# الخطوة 2: مجلدات المشروع وتنظيم الملفات
*Project Folders & Files*


## 1 · ماذا سنفعل؟

سننشئ مجلد المشروع بثلاثة مجلدات فرعية، نضع فيها مادتك الخام ومواقع الإلهام، ثم نفتح الأداة داخله لتفهم السياق وتكتب لنفسها ملف قواعد.

```text
Portfolio-Project/
├── Content/
├── Inspiration/
└── Website/
```

يضيف الـ Prompt مجلداً رابعاً اسمه `Docs/` لخطط المشروع وتقاريره. هذا المجلد يبقى خارج ما تنشره، وهذا مقصود.

## 2 · لماذا نحتاج إلى هذه الخطوة؟

الأداة تعطي نتائج أفضل حين تقرأ سياقك الحقيقي بدل أن تخمّن. وفصل المحتوى عن الإلهام عن الكود يمنع خلطاً شائعاً: أن تنسخ الأداة نصاً من موقع مرجعي، أو أن تُنشر ملفاتك الخاصة مع الموقع بالخطأ.

## 3 · ماذا نحتاج قبل البدء؟

الخطوة 1 مكتملة، وعندك مواد أولية ولو بسيطة: نبذة عنك، سيرة ذاتية، وصف لمشروع أو اثنين، وصورة شخصية إن أمكن.

## 4 · التنفيذ خطوة بخطوة

### إنشاء المجلدات

على macOS أو Linux أو WSL:

```bash
mkdir -p Portfolio-Project/{Content,Inspiration,Website}
```

على Windows PowerShell:

```powershell
New-Item -ItemType Directory -Path Portfolio-Project\Content, Portfolio-Project\Inspiration, Portfolio-Project\Website
```

أو أنشئها بالنقر بزر الفأرة داخل المستكشف. النتيجة واحدة.

### ماذا تضع في كل مجلد؟

| المجلد | ما يوضع فيه | أمثلة |
|---|---|---|
| `Content/` | كل ما يخصك وستعتمد عليه الأداة | `bio.txt` · `cv.pdf` · `links.txt` · `photos/` · `projects/project-name/` · `testimonials.txt` |
| `Inspiration/` | ثلاثة مواقع فقط، للتحليل لا للنسخ | `site-1.png` · `site-1-mobile.png` · `links.txt` مع ملاحظة عما أعجبك |
| `Website/` | الكود فقط، تكتبه الأداة | يبقى فارغاً الآن |

### كيف تجمع مواقع الإلهام؟

1. اختر ثلاثة مواقع شخصية أو مواقع أعمال أعجبك تنظيمها ووضوحها، ويفضل أن يتميز كل منها بشيء مختلف.
2. لكل موقع التقط صورة لصفحته الرئيسية بالكامل على الحاسوب، وصورة أخرى على الجوال.
3. أنشئ ملف `links.txt` فيه رابط كل موقع وسطر يوضح ما أعجبك فيه (الألوان، الخطوط، تنظيم المشاريع…).

### كيف تنظّم الصور والملفات؟

- أسماء إنجليزية بحروف صغيرة وشرطات وبلا مسافات، مثل `project-name-cover.png`.
- اضغط الصور الكبيرة جداً قبل وضعها (الأفضل ألا تتجاوز بضعة ميغابايتات) لأنها ستبطئ الموقع.
- ضع كل مشروع في مجلد خاص فيه ملاحظاتك عنه ولقطات الشاشة.
- حوّل المستندات التي تصعب قراءتها إلى نص بسيط (`.txt` أو `.md`) إن لم تفهمها الأداة.


> ⚠️ **لا تضع أسراراً داخل Content**
> أي ملف في هذا المجلد قد تقرأه الأداة وقد يظهر محتواه في الموقع. لا تضع كلمات مرور، ولا مفاتيح API، ولا صور هوية، ولا ملفات عملاء سرية، ولا أرقام هواتف لا تريد نشرها.


### افتح الأداة في المجلد الرئيسي

```bash
cd Portfolio-Project
claude
```

افتحها في `Portfolio-Project` وليس داخل `Website`، لترى المجلدات الثلاثة معاً.

### ما هو ملف CLAUDE.md؟

ملف نصي تقرؤه الأداة في بداية كل محادثة، فيعطيها قواعد ثابتة لا تحتاج أن تكررها. وثائق Claude Code تنصح بإبقائه قصيراً وبإدراج ما قد يسبب أخطاء لو حُذف فقط. الـ Prompt التالي ينشئه لك.

### Prompt الخطوة 2


#### Prompt 02: تعريف الأداة بالمشروع

**متى تستخدمه؟** استخدمه بعد وضع موادك في Content وإلهامك في Inspiration.

**ماذا يفعل؟** يقرأ مجلداتك، ويخبرك بما وجده وما ينقصك، ثم ينشئ ملف `CLAUDE.md` فيه قواعد المشروع ومجلد `Docs/` لسجل العمل.

```text
ROLE
You are a senior web developer and technical project manager. You work only inside the folder I opened you in and treat its files as your primary source of truth.

CONTEXT
This folder is my portfolio project. I created this structure:
- Content/      my personal material: bio, CV, project notes, images, logos, links, certificates, testimonials
- Inspiration/  three reference websites I like (screenshots, saved pages, or text files with links and notes)
- Website/      the empty folder where the website will be built
My name is [YOUR NAME]. My profession is [YOUR PROFESSION].

TASK
Understand the project structure, read what is already inside it, and create a short project rules file so every later session starts with the same context.

STEPS
1. List every file and folder under Content/ and Inspiration/ (names, types, sizes). Do not open private-looking documents beyond what is needed to understand what they are.
2. Read the text files you can read (txt, md, pdf, docx if possible). For images, list them and describe what each appears to be, without inventing details you cannot see.
3. Report what you found per folder, and what looks missing or unclear (for example: no photo, no project descriptions, no links for the reference sites).
4. Create a file named CLAUDE.md in the root of this project (if I am using a tool other than Claude Code, name it PROJECT_RULES.md). Keep it under 60 lines and include only rules that would cause mistakes if removed:
   - the four folders and what each is for (Content, Inspiration, Website, and Docs for planning and reports)
   - the rule: Content/ is the only source of truth about me; never invent facts, projects, numbers, clients, or testimonials
   - the rule: Inspiration/ is for analysis only; never copy another site's design, text, images, or branding
   - the rule: all code goes inside Website/ only; planning documents and reports go in Docs/; only Website/ is ever published or pushed to GitHub
   - the rule: never read, print, or commit secrets (.env files, API keys, tokens)
   - the rule: work in small phases, show what you did, run checks, and wait for my approval before the next phase
   - the rule: ask me when information is missing instead of guessing
5. Create an empty Docs/ folder and a Docs/build-log.md file with a title and today's date. Later phases will append to it.

CONSTRAINTS
- Do not build any website code in this step.
- Do not modify or delete anything inside Content/ or Inspiration/.
- Do not invent contents for files you could not read; list them as "could not read".

QUALITY BAR
Anyone (including a fresh AI session) reading CLAUDE.md should understand the project and its rules in under a minute.

OUTPUT FORMAT
1) Findings per folder (bullets). 2) Gaps and questions (numbered). 3) The full text of the CLAUDE.md you created.

VERIFY
List the files you created and confirm Content/ and Inspiration/ were not changed.

STOP AND ASK
Stop after the output. Wait for my answers to your questions before anything else.
```


## 6 · ماذا نتوقع من الأداة؟

1. قائمة بما وجدته في كل مجلد وما لم تستطع قراءته.
2. أسئلة عن النواقص.
3. ملف `CLAUDE.md` في جذر المشروع بأقل من 60 سطراً.
4. مجلد `Docs/` وفيه `build-log.md`.

## 7 · كيف نتحقق من صحة النتيجة؟

- افتح `CLAUDE.md` واقرأه: هل يذكر المجلدات وقواعد عدم الاختراع وعدم النسخ وعدم لمس الأسرار؟
- تأكد أن ملفاتك في `Content/` و`Inspiration/` كما هي، ولم يُحذف ولم يتغير شيء.
- يمكنك كتابة `/context` داخل الأداة لتتأكد أنها حمّلت الملف.

## 8 · الأخطاء الشائعة وكيف تحلها

| المشكلة | الحل |
|---|---|
| فتحت الأداة داخل `Website` فلا ترى بقية المجلدات | اخرج منها وافتحها في `Portfolio-Project` |
| لا تستطيع قراءة ملف PDF أو صورة | حوّل النص إلى `.txt` أو اكتب وصفاً للصورة في ملف |
| مجلد Content شبه فارغ | أضف ما تستطيع الآن، والباقي ستستكمله في المقابلة بالخطوة 3 |
| طال ملف CLAUDE.md جداً | اطلب من الأداة اختصاره: الملفات الطويلة تُهمل قواعدها |

## 9 · ما الذي يجب أن نحصل عليه قبل الانتقال؟


> ✅ **قائمة الإنجاز**
> - هيكل المجلدات موجود وفيه موادك.
> - `CLAUDE.md` موجود وقصير وواضح.
> - `Docs/build-log.md` موجود.
> - أجبت عن أسئلة الأداة عن النواقص.



**المصادر:** [S2] [Claude Code · Best practices](https://code.claude.com/docs/en/best-practices)



---

# الخطوة 3: اكتشاف المحتوى وكتابة محتوى البورتفوليو
*Discover & Write Your Content*


## 1 · ماذا سنفعل؟

سنجعل الذكاء الاصطناعي يجري معك مقابلة تدريجية يفهم بها تخصصك وأعمالك وجمهورك، ثم يكتب محتوى موقعك كاملاً ويحفظه في ملف واحد: `Content/portfolio-content.md`.

## 2 · لماذا نحتاج إلى هذه الخطوة؟

أكثر المواقع المولّدة بالذكاء الاصطناعي تبدو متشابهة لأن النص عام: «مطوّر شغوف بالتقنية». المحتوى القوي يخرج من تفاصيلك أنت. وإذا طلبت من الأداة كتابة المحتوى دون مقابلة فستخترع، والاختراع في موقع يمثلك خطر على سمعتك. لذلك نبدأ بالأسئلة.

## 3 · ماذا نحتاج قبل البدء؟

- مجلد `Content/` فيه ما جمعته.
- وقت هادئ للإجابة بتفاصيل حقيقية.
- قرارك في أمرين: لغة الموقع الأساسية، وهدفه (عملاء، توظيف، بناء سمعة).

## 4 · التنفيذ خطوة بخطوة

### أقسام موقع البورتفوليو

| القسم | وظيفته |
|---|---|
| Personal Positioning | جملة واحدة تقول من أنت ولمن تفيد |
| Hero Section | أول شاشة: عنوان رئيسي، سطر داعم، زر إجراء |
| About Me | قصتك المهنية باختصار |
| Services / What I Do | ما تقدمه فعلاً |
| Skills & Technologies | الأدوات التي تستخدمها فعلاً |
| Selected Projects | أفضل أعمالك |
| Case Studies | قصة كل مشروع: المشكلة، الحل، النتيجة |
| Work Experience | مسارك المهني |
| Testimonials | شهادات حقيقية فقط |
| Contact Section | كيف يصل إليك الزائر |
| SEO Metadata | العنوان والوصف الذي يظهر في محركات البحث |

### كيف تجيب عن أسئلة المقابلة؟

أجب بقصص وتفاصيل، لا بصفات.

| ضعيف | أقوى |
|---|---|
| «أصمم مواقع احترافية» | «صممت موقع متجر لثلاث علامات صغيرة، وكانت المشكلة أن العملاء لا يجدون المنتجات، فأعدت تنظيم القوائم» |
| «لدي خبرة واسعة» | «عملت ثلاث سنوات في [اسم الجهة]، وكان دوري…» |

ولا تذكر رقماً إلا إذا كان حقيقياً وتستطيع إثباته.

### Prompt الخطوة 3


#### Prompt 03: المقابلة وكتابة محتوى الموقع

**متى تستخدمه؟** الـ Prompt الأهم في الدليل. خصّص له وقتاً ولا تستعجل الإجابات.

**ماذا يفعل؟** يجري معك مقابلة على دفعات صغيرة، ثم يكتب محتوى موقعك في `Content/portfolio-content.md` دون اختراع أي معلومة.

```text
ROLE
You are a senior Personal Branding strategist and website copywriter for personal portfolio sites. You interview first, write second. You are honest, specific, and allergic to generic phrases like "passionate professional" or "results-driven".

CONTEXT
Read everything inside Content/ first. That is what I already gave you. If it is empty or thin, say so. My name is [YOUR NAME] and my field is [YOUR PROFESSION]. The portfolio is for: [GOAL: get clients / get hired / build authority / all of these].

TASK
1) Interview me to discover who I am professionally. 2) Turn my answers into complete, organized website content. 3) Save it to Content/portfolio-content.md.

PHASE A - INTERVIEW (do this first, do not write content yet)
Rules:
- Ask 3 to 4 questions at a time at most, wait for my answers, then continue. Never show a long list of questions at once.
- Before each round, in one line, say what you already understood so I can correct you.
- Cover these topics, in this order: (1) my specialty and the problems I solve; (2) skills and tools I really use; (3) experience and roles; (4) projects I actually built: what the problem was, what I did, what tools I used, what changed, and what I can show; (5) my target audience; (6) the value I offer and what makes me different; (7) my preferred tone: formal, friendly, bold, minimal; (8) languages of the website, and which is primary; (9) contact methods and links I want public; (10) testimonials, certificates, or numbers I can prove.
- Use my Content/ files to avoid asking things I already answered.
- Keep a running list of MISSING information and ask for it before the end.
- When I say I am done, summarize what you learned in 10 bullets and ask me to confirm or correct.

PHASE B - WRITE THE CONTENT
Only after I confirm the summary. Create these sections when the information supports them, and skip any section I did not give material for:
Personal Positioning (one clear sentence plus a short statement), Hero Section (headline, subheadline, primary and secondary call to action), About Me, Services / What I Do, Skills & Technologies, Selected Projects, Case Studies (problem, approach, result, what I learned), Work Experience, Testimonials (only real ones I provided), Contact Section, SEO Metadata (page title, meta description, Open Graph title and description).
For every section add one line: "Goal of this section: ..." and "Information still needed: ..." when relevant.

HARD RULES
- Never invent experience, projects, clients, numbers, certificates, awards, or testimonials. If something is missing, write "[MISSING: ...]" and tell me.
- No generic filler. Every sentence must be specific to me or deleted.
- The site must not read like a traditional CV. Lead with value and proof, not a list of jobs.
- Write in natural, professional language in the language(s) I chose. Match my preferred tone.
- Mark clearly anything that is your suggestion rather than my fact.

QUALITY BAR
A stranger reading only this file should understand who I am, what I do, who I help, and how to contact me in under one minute.

OUTPUT FORMAT
A Markdown file Content/portfolio-content.md with clear headings, one per section, plus a final section "Open questions and missing information".

VERIFY
Re-read the finished file against my answers and list every claim you could not trace to something I said or provided. Remove or flag those claims.

STOP AND ASK
After saving the file, show me the final text and stop. Wait for my approval or edits before any design work.
```


## 6 · ماذا نتوقع من الأداة؟

1. أسئلة على دفعات صغيرة (3 إلى 4 أسئلة في كل مرة)، وقبل كل دفعة تلخص الأداة ما فهمته لتصحّحه.
2. ملخص من 10 نقاط تطلب تأكيده.
3. ملف `Content/portfolio-content.md` فيه الأقسام المناسبة لمعلوماتك، وفي آخره «أسئلة مفتوحة ومعلومات ناقصة».

## 7 · كيف نتحقق من صحة النتيجة؟

- كل جملة عن خبراتك أو مشاريعك يمكنك تتبعها إلى شيء قلته أو وفّرته.
- لا توجد أرقام أو شهادات أو عملاء لم تذكرهم.
- كل الأماكن المعلّمة بـ `[MISSING: ...]` إما استكملتها أو قررت حذفها.
- اقرأ الملف بصوت مرتفع: إن بدا كأنه يصلح لأي شخص، فاطلب إعادة كتابته بتفاصيل أدق.
- اختبار العشر ثوانٍ: هل يفهم غريب من الجزء العلوي من الملف من أنت وماذا تفعل؟

## 8 · الأخطاء الشائعة وكيف تحلها

| المشكلة | الحل |
|---|---|
| إجابات قصيرة جداً | أعطِ مثالاً حقيقياً لكل ادعاء |
| ظهرت عبارات عامة مستهلكة | اكتب للأداة: «هذه الجملة عامة، أعد كتابتها بتفاصيل من إجاباتي أو احذفها» |
| اخترعت الأداة مشروعاً أو رقماً | اطلب حذفه فوراً وذكّرها بقاعدة عدم الاختراع في `CLAUDE.md` |
| القسم يبدو كسيرة ذاتية تقليدية | اطلب منها البدء بالقيمة والدليل بدل قائمة الوظائف |
| لا تملك شهادات عملاء | اترك القسم فارغاً ولا تطلب كتابة شهادات |

## 9 · ما الذي يجب أن نحصل عليه قبل الانتقال؟


> ✅ **قائمة الإنجاز**
> - ملف `portfolio-content.md` موجود في `Content/`.
> - راجعته وصحّحته ووافقت عليه صراحة.
> - لا توجد معلومات مخترعة.
> - قررت لغة الموقع الأساسية.



---

# الخطوة 4: تحليل الإلهام وتصميم الموقع وبناؤه
*Analyze, Design & Build*


## 1 · ماذا سنفعل؟

هذه أطول مراحل الدليل وأهمها. سنحلل ثلاثة مواقع مرجعية، ثم نكتب اتجاهاً بصرياً يخصك، ثم نبني الموقع على **ثماني مراحل** صغيرة، تعرض الأداة بعد كل مرحلة ما أنجزته وتنتظر موافقتك.

## 2 · لماذا نحتاج إلى هذه الخطوة؟

إذا قلت للأداة «ابنِ لي موقعاً احترافياً» فستعطيك أول قالب مألوف: بطاقات متشابهة وألوان متدرجة وخطوط عشوائية. والبناء دفعة واحدة يصعّب اكتشاف الأخطاء. التحليل والاتجاه البصري يعطيان الأداة قراراً واضحاً، والبناء على مراحل يجعلك تراجع كل جزء قبل أن يبني عليه ما بعده. وفي وثائق Claude Code نفسها: افصل الاستكشاف والتخطيط عن التنفيذ، وأعطِ الأداة طريقة تتحقق بها من عملها.

## 3 · ماذا نحتاج قبل البدء؟

- `Content/portfolio-content.md` معتمد (الخطوة 3).
- ثلاثة مواقع مرجعية داخل `Inspiration/` (الخطوة 2).
- متصفح تفتح فيه الموقع على جهازك أثناء البناء.

## 4 · التنفيذ خطوة بخطوة

### أ · تحليل المواقع المرجعية

الهدف أن تفهم **لماذا** نجح كل موقع، لا أن تنسخه. تحلل الأداة التخطيط والتسلسل البصري والخطوط والمسافات والألوان والتنقل والمكونات والحركة والاستجابة وتجربة المستخدم، وتخرج بأفكار تستفيد منها وأخرى تتجنبها. وتعمل فقط على ما تراه في ملفاتك وتعترف بما لا تستطيع التحقق منه.


> ⚠️ **لا تنسخ موقعاً حرفياً**
> نسخ تصميم موقع آخر أو نصوصه أو صوره أو هويته مشكلة أخلاقية وقانونية، ويجعل موقعك بلا شخصية. الـ Prompt يمنع ذلك صراحة.



#### Prompt 04: تحليل المواقع المرجعية

**متى تستخدمه؟** بعد وضع المواقع الثلاثة في Inspiration.

**ماذا يفعل؟** يحلل المواقع الثلاثة التي اخترتها ويستخرج ما يمكن تعلمه منها وما يجب تجنبه، دون نسخ أي شيء منها.

```text
ROLE
You are a senior product designer and front-end architect who deconstructs websites to learn from them without copying them.

CONTEXT
Inspiration/ contains three websites I like (screenshots, saved pages, or notes with links). Content/portfolio-content.md contains my approved content. My profession is [YOUR PROFESSION] and my audience is described in the content file.

TASK
Analyze each reference site and write Inspiration/inspiration-analysis.md.

STEPS
For each of the three references, analyze only what you can actually see or read in the files I provided (if something cannot be determined, write "not visible in the material provided" instead of guessing):
1. Layout: grid, sections order, use of whitespace, page length.
2. Visual hierarchy: what the eye sees first, second, third.
3. Typography: type style categories (serif, sans, mono), scale, weight contrast, line length. Describe; do not claim exact font names unless visible in the material.
4. Spacing: density, rhythm, section padding.
5. Color system: dominant, accent, background, text; contrast quality.
6. Navigation: pattern, number of items, mobile behavior if visible.
7. Components: hero, cards, project tiles, buttons, forms, footers.
8. Animations: what moves, how much, and what purpose it serves (only if visible or described).
9. Responsive behavior: only if visible or described.
10. User experience: how fast a visitor understands who this is and what to do next.
For each site finish with: "Borrow this idea" (3 items, described as principles, not as copied elements) and "Avoid this" (3 items).

THEN WRITE A SYNTHESIS
- What the three sites have in common.
- Where they differ.
- Which principles fit MY content and MY audience, and which do not, with reasons.
- Common AI-generated-website clichés to avoid for my site.

CONSTRAINTS
- Never recommend copying another site's layout pixel by pixel, text, images, illustrations, logo, or brand identity.
- Do not invent facts about the reference sites.
- Do not start designing or coding in this step.

QUALITY BAR
Every recommendation must be traceable to something in the references and justified by my content or audience.

OUTPUT FORMAT
Inspiration/inspiration-analysis.md with one section per site, then the synthesis. Keep each site section under 40 lines.

VERIFY
List which parts of the analysis rely on screenshots, which on text notes, and which could not be verified.

STOP AND ASK
Show me the synthesis and stop. Ask whether I want to adjust which ideas to borrow before the design direction is created.
```


### ب · اتجاه التصميم Design Direction

يحوّل التحليل ومحتواك إلى قرارات: الفكرة العامة، الألوان، الخطوط، المسافات، المكونات، أسلوب الصور، الحركة. وتتحقق الأداة من تباين الألوان وتقترح تقنية البناء المناسبة لحجم مشروعك.

**لا نفرض Framework على الجميع.** بورتفوليو من بضعة أقسام قد يكفيه موقع ثابت بسيط، وبورتفوليو فيه مدوّنة وعشرات الصفحات قد يستفيد من إطار عمل. والـ Prompt يطلب من الأداة توصية واحدة مبررة وبديلاً، وأنت توافق قبل أي كود.


#### Prompt 05: كتابة الاتجاه البصري واختيار التقنية

**متى تستخدمه؟** بعد الموافقة على التحليل.

**ماذا يفعل؟** يحوّل التحليل ومحتواك إلى اتجاه بصري كامل: ألوان وخطوط ومسافات ومكونات وحركة، ويقترح التقنية المناسبة لحجم مشروعك.

```text
ROLE
You are an art director and design-system lead creating a distinctive, restrained visual direction for one person's portfolio.

CONTEXT
Inputs you must read first: Content/portfolio-content.md (who I am and my tone), Inspiration/inspiration-analysis.md (what to borrow and avoid). The site languages and text direction are defined in the content file; respect them.

TASK
Write Docs/design-direction.md, a complete and decision-ready visual direction. Make decisions; do not give me menus of options, except where I must choose.

CONTENTS OF THE DOCUMENT
1. Concept in two sentences: the personality of the site and the one idea that ties it together. It must reflect me, not a generic template.
2. Overall layout system: grid, max content width, section rhythm, page structure.
3. Color palette: background, text, one accent, muted, border, plus states. Give HEX values and the role of each. Verify text/background contrast meets WCAG AA (4.5:1 for body text) and report the ratios you computed.
4. Typography: heading font, body font, and code or meta font if needed, with fallbacks. Fonts must support the site language(s) and be loadable without paid licenses. Give a type scale (sizes, weights, line heights) for desktop and mobile.
5. Spacing scale (for example 4/8/16/24/32/48/72/96) and when to use each.
6. Component system: buttons, links, cards (only where they earn their place), tags, forms, navigation, project tiles, section headers. Define states: hover, focus, active, disabled.
7. Image style: how photos and project screenshots are treated (aspect ratios, corners, borders). If I have no photos, say what to do instead of using stock imagery.
8. Motion: which animations exist, durations, easing, and what each is for. Respect prefers-reduced-motion. No decorative motion.
9. Anti-patterns list specific to this project (for example: no repeated identical cards, no random gradients, no emoji icons, no huge hero stock images).
10. Stack recommendation: propose ONE recommended stack for a portfolio of this size (static site generator, framework, or plain HTML/CSS/JS), with a 3-line reason, and one alternative with its trade-off. Prefer the simplest option that fits my content. Do not force a framework.

CONSTRAINTS
- Do not copy any reference site's layout, assets, or branding; combine principles.
- No visual choice without a reason tied to my content or audience.
- Do not write website code in this step.

QUALITY BAR
A developer who has never seen the references could build a coherent site from this document alone.

OUTPUT FORMAT
Markdown with numbered headings matching the list above, tables for colors and type scale.

VERIFY
Show the contrast ratio table and confirm every color pair used for text passes AA.

STOP AND ASK
Present a one-screen summary and ask me to approve the direction and the stack. Do not proceed without my explicit approval.
```


### ج · البناء التدريجي

الدورة نفسها في كل مرحلة:

1. ترسل Prompt المرحلة.
2. تبني الأداة وتعرض ما أنجزته وقراراتها.
3. تشغّل الأداة الفحوص المتاحة.
4. تفتح الموقع على جهازك وتراجعه بنفسك.
5. توافق أو تطلب تعديلاً، ثم تنتقل.

يحفظ كل Prompt سياقه في ملفات (`Docs/design-direction.md` و`Docs/build-log.md`)، فيمكنك فتح محادثة جديدة بين المراحل دون أن تضيع القرارات. وثائق Claude Code تنصح بـ `/clear` بين المهام غير المترابطة، لأن امتلاء السياق يضعف الأداء.

| المرحلة | ما يُبنى | الـ Prompt |
|---|---|---|
| 1 | إعداد المشروع والبنية الأساسية | 06 |
| 2 | Header وNavigation | 07 |
| 3 | Hero Section | 08 |
| 4 | About وServices | 09 |
| 5 | Projects وCase Studies | 10 |
| 6 | بقية الأقسام | 11 |
| 7 | Footer والتفاصيل النهائية | 12 |
| 8 | تحسين Responsive Design | 13 |


> 💡 **كيف تعاين الموقع على جهازك؟**
> في نهاية المرحلة الأولى تعطيك الأداة أمر تشغيل الموقع محلياً (مثل أمر `dev` أو `start` بحسب التقنية)، ثم تفتح العنوان الذي تعرضه في المتصفح، وغالباً يبدأ بـ `localhost`. لا تخمّن الأمر، واطلب من الأداة كتابته لك.



#### Prompt 06: المرحلة 1: الإعداد والبنية

**متى تستخدمه؟** بعد موافقتك على Design Direction.

**ماذا يفعل؟** ينشئ هيكل المشروع داخل `Website/` وقيم التصميم والأنماط الأساسية، ويشغّل البناء ليتأكد أن الأساس سليم.

```text
ROLE
You are a senior front-end engineer who builds maintainable, accessible, fast portfolio websites, step by step, with verification after each step.

CONTEXT
Read first: CLAUDE.md, Content/portfolio-content.md, Docs/design-direction.md (including the approved stack), and Docs/build-log.md. Everything in those files is binding. This is BUILD PHASE 1 of 8: project setup and base structure.

TASK
Create the project foundation inside Website/ using the stack I approved in the design direction.

STEPS
1. Initialize the project in Website/ with the approved stack. Use official, current commands for that tool; if you are unsure of a command, check its official documentation first instead of guessing.
2. Create a clear folder structure (components or partials, styles, assets, public files) and explain it in 5 lines.
3. Implement the design tokens from design-direction.md as CSS variables (colors, type scale, spacing, radii, motion durations).
4. Implement global base styles: reset, typography, links, focus styles, reduced-motion handling, text direction (RTL or LTR) and language attribute from the content file.
5. Create the page skeleton with semantic landmarks (header, main, footer) and one placeholder per planned section, with no final content yet.
6. Create a .gitignore suited to the stack that excludes dependencies, build output, and secret files (.env and variants).
7. Add the scripts needed to run, build, and preview locally. Run the dev server and the production build.

CONSTRAINTS
- No dependencies beyond what the approved stack needs; justify any extra one in a line.
- No analytics, trackers, or third-party scripts.
- No secrets or API keys anywhere. If something would need one, stop and ask me.
- Do not build header, hero, or any visible section yet.
- Do not touch Content/ or Inspiration/.

QUALITY BAR
The project installs from scratch, builds without warnings, and the empty skeleton renders correctly in the right direction and language.

OUTPUT FORMAT
A short report: what you created (tree), the exact commands to run locally, key decisions, and anything I need to install.

VERIFY
Run the build and show its result. Open the local preview and confirm the skeleton loads. Append a dated entry to Docs/build-log.md with the phase, decisions, and check results.

STOP AND ASK
Stop and wait for my approval before Phase 2. Tell me exactly how to preview the site myself.
```


#### Prompt 07: المرحلة 2: Header وNavigation

**متى تستخدمه؟** بعد الموافقة على المرحلة 1.

**ماذا يفعل؟** يبني رأس الصفحة والتنقل بحيث يسهل استخدامهما بلوحة المفاتيح واللمس على الجوال.

```text
ROLE
You are a senior front-end engineer and UX specialist focused on navigation clarity and accessibility.

CONTEXT
Read first: CLAUDE.md, Content/portfolio-content.md, Docs/design-direction.md, Docs/build-log.md. Phase 1 (setup) is approved and complete. This is BUILD PHASE 2 of 8: header and navigation.

TASK
Build the site header and navigation using the approved design tokens and component rules.

STEPS
1. Decide the navigation items from the sections that actually exist in portfolio-content.md (do not add links to sections that do not exist). Keep it short; explain the choice in two lines.
2. Build the header: name or wordmark (from my content, not invented), navigation links, and one primary call to action if the content defines one.
3. Make it accessible: semantic nav element with a label, visible keyboard focus, logical tab order, a "skip to content" link, current-section indication that does not rely on color alone.
4. Build the mobile pattern: choose the simplest reliable approach (for a small number of links, an always-visible compact row can be better than a hamburger). Touch targets at least 44x44 px. If a menu toggles, it must work with keyboard and expose its state to assistive technology.
5. Implement smooth scrolling or page navigation only as far as the stack requires; respect reduced motion.
6. Match the design direction exactly for typography, spacing, hover, focus, and active states.

CONSTRAINTS
- No new colors, fonts, or spacing values outside the design tokens. If one is truly needed, propose it and wait.
- No third-party UI libraries unless already approved.
- Do not build other sections yet.

QUALITY BAR
Header works with mouse, touch, and keyboard; nothing overlaps or overflows from 320 px to 1440 px width; contrast passes AA.

OUTPUT FORMAT
Short report: what was built, the design decisions that matter and why, and what you tested.

VERIFY
Run the build and any available lint or tests. Check the header at 320, 768, and 1280 px widths and confirm there is no horizontal scrolling. Tab through every control and confirm focus is visible. Append a dated entry to Docs/build-log.md.

STOP AND ASK
Show me how to preview it and stop. Wait for my approval or requested changes before Phase 3.
```


#### Prompt 08: المرحلة 3: Hero Section

**متى تستخدمه؟** بعد الموافقة على المرحلة 2.

**ماذا يفعل؟** يبني أول شاشة في الموقع بمحتواك المعتمد، بحيث يفهم الزائر من أنت وماذا تفعل خلال ثوانٍ.

```text
ROLE
You are a senior front-end engineer with a strong eye for typography and first-impression design.

CONTEXT
Read first: CLAUDE.md, Content/portfolio-content.md (Hero Section and Personal Positioning), Docs/design-direction.md, Docs/build-log.md. Phases 1 and 2 are approved. This is BUILD PHASE 3 of 8: the Hero section.

TASK
Build the Hero section so that a visitor understands who I am, what I do, and what to do next within five seconds.

STEPS
1. Use my approved headline, subheadline, and calls to action exactly as written in portfolio-content.md. If the copy does not fit the layout, tell me and propose a trimmed version instead of silently editing it.
2. Establish a clear hierarchy: one dominant element, one supporting line, one primary action, at most one secondary action.
3. Use typography as the main design tool. If there is a portrait or visual in Content/, use it according to the image rules in the design direction. If there is no suitable image, do not use stock photos or generated faces; use typography and layout only.
4. Add at most one subtle entrance motion if the design direction allows it; it must be disabled for reduced-motion users.
5. Make sure the hero works in the site language and text direction, including line breaks and punctuation.
6. Ensure the hero fits and reads well on a small phone screen without needing to scroll horizontally, and that the primary action is visible without hunting for it.

CONSTRAINTS
- No invented claims, numbers, or logos.
- No decorative gradients, blobs, or abstract shapes unless the design direction defines them.
- Keep performance in mind: no oversized images, no render-blocking assets; give images explicit dimensions and meaningful alt text.
- Do not build other sections yet.

QUALITY BAR
The hero is memorable without being loud, matches the design direction, and its largest text passes contrast AA.

OUTPUT FORMAT
Short report: what was built, decisions and reasons, and anything in the copy that did not fit.

VERIFY
Build and run available checks. Test at 320, 768, 1280, and 1920 px. Check there is no layout shift when the page loads and that links and buttons work. Append a dated entry to Docs/build-log.md.

STOP AND ASK
Stop and wait for my approval or feedback before Phase 4.
```


#### Prompt 09: المرحلة 4: About وServices

**متى تستخدمه؟** بعد الموافقة على المرحلة 3.

**ماذا يفعل؟** يبني قسمي «عني» و«الخدمات» بتخطيط مريح للقراءة، دون بطاقات متطابقة بلا حاجة.

```text
ROLE
You are a senior front-end engineer and editorial layout designer who makes text-heavy sections feel effortless to read.

CONTEXT
Read first: CLAUDE.md, Content/portfolio-content.md (About Me and Services / What I Do), Docs/design-direction.md, Docs/build-log.md. Phases 1 to 3 are approved. This is BUILD PHASE 4 of 8: About and Services.

TASK
Build the About section and the Services section.

STEPS
1. Use my approved text from portfolio-content.md. Do not rewrite meaning. You may fix line breaks and suggest tiny edits for fit, but list each suggestion for my approval.
2. About: design for readability (comfortable line length, clear paragraph rhythm). If a portrait exists in Content/, place it following the image rules; if not, do not add one.
3. Services: decide the layout from the actual number of services. Avoid defaulting to a grid of identical cards; if cards are used, there must be a reason, and each must differ in content, not only in text. Consider a list with strong typographic hierarchy instead.
4. Add skills and technologies only if portfolio-content.md has that section and it belongs here. Present them as grouped plain lists rather than decorative skill bars or fake percentage meters.
5. Use semantic headings in the right order, and keep the section anchors consistent with the navigation from Phase 2.
6. Make sure everything works in the site language and direction.

CONSTRAINTS
- No stock images, icon packs, or emoji as decoration.
- No made-up percentages, years of experience, or client counts.
- Stay inside the design tokens; propose any new token before using it.
- Do not build other sections yet.

QUALITY BAR
Both sections are scannable in 15 seconds and still reward a slow read; there is a clear visual difference between them.

OUTPUT FORMAT
Short report of what was built, the layout reasoning, and any copy edits awaiting my approval.

VERIFY
Build and run checks. Test at 320, 768, 1280 px, check heading order, keyboard focus, and text contrast. Confirm navigation links jump to these sections. Append a dated entry to Docs/build-log.md.

STOP AND ASK
Stop and wait for my approval or feedback before Phase 5.
```


#### Prompt 10: المرحلة 5: Projects وCase Studies

**متى تستخدمه؟** بعد الموافقة على المرحلة 4.

**ماذا يفعل؟** يعرض مشاريعك الحقيقية ودراسات الحالة بصورها وروابطها، وينبّهك إلى أي لقطة قد تكشف بيانات خاصة.

```text
ROLE
You are a senior front-end engineer and case-study designer. You make a person's work the hero of the page.

CONTEXT
Read first: CLAUDE.md, Content/portfolio-content.md (Selected Projects and Case Studies), Docs/design-direction.md, Docs/build-log.md. Phases 1 to 4 are approved. This is BUILD PHASE 5 of 8: Projects and Case Studies.

TASK
Build the Selected Projects section and the Case Study presentation.

STEPS
1. Show only the projects that exist in portfolio-content.md, with the real information I gave: title, short description, role, tools, result if I provided one, and a link if I provided one.
2. Project listing: design it so each project is distinguishable at a glance (title, one-line value, tools). Do not make every project tile identical in a generic card grid unless the design direction demands it.
3. Case studies: decide, based on how many I have and how long they are, whether they live on the same page (expandable or sectioned) or on separate pages. Recommend the simpler option and say why. Use the structure from my content: problem, approach, result, what I learned.
4. Images and screenshots: use only files from Content/. Give every image explicit width and height, lazy loading below the fold, a meaningful alt text, and a compressed version if the original is very large. If no image exists for a project, design a type-led tile; never use a placeholder stock image.
5. Links to live projects or repositories must open safely (rel="noopener noreferrer" for new tabs) and be clearly labeled.
6. If any screenshot may show private data (names, emails, tokens, client information), flag it to me and do not publish it until I confirm.

CONSTRAINTS
- No invented project details, metrics, client names, or testimonials.
- No third-party embeds that load external scripts unless I approve them.
- Do not build other sections yet.

QUALITY BAR
A recruiter or client can understand what I did, how, and what changed, in under a minute per project, and can reach the work itself.

OUTPUT FORMAT
Short report: what was built, structure decisions, flagged images, and missing information for any project.

VERIFY
Build and run checks. Test layouts at 320, 768, 1280 px. Confirm all project links work, images have alt text and dimensions, and no layout shift occurs when images load. Append a dated entry to Docs/build-log.md.

STOP AND ASK
Stop and wait for my approval or feedback before Phase 6.
```


#### Prompt 11: المرحلة 6: بقية الأقسام

**متى تستخدمه؟** بعد الموافقة على المرحلة 5.

**ماذا يفعل؟** يبني بقية الأقسام الموجودة في محتواك (الخبرات والشهادات والتواصل) ويتجاهل ما لا مادة له.

```text
ROLE
You are a senior front-end engineer finishing the remaining content sections of a personal portfolio.

CONTEXT
Read first: CLAUDE.md, Content/portfolio-content.md, Docs/design-direction.md, Docs/build-log.md. Phases 1 to 5 are approved. This is BUILD PHASE 6 of 8: all remaining sections.

TASK
Build every section that exists in portfolio-content.md and is not yet built. Typically: Work Experience, Testimonials, and Contact.

STEPS
1. List which sections from the content file are still unbuilt, and which you will skip because I gave no material. Do not create sections without material.
2. Work Experience: present it as a story of progression and impact rather than a bare CV list. Use only the facts I gave.
3. Testimonials: only if real testimonials exist in my content, with the name and role I approved. Never create placeholder or fictional testimonials.
4. Contact: use only the contact methods I chose to make public. If a contact form is requested, first explain the options that work on a static site and the security and spam implications, recommend the simplest safe option (for example a mailto link, or a form service that I register with myself), and wait for my decision before implementing anything. Do not embed any API key, token, or secret in the front-end code.
5. Keep the visual rhythm consistent with the earlier sections; avoid making the page feel like repeating blocks.
6. Check anchors and navigation items still match the real sections.

CONSTRAINTS
- No invented content of any kind.
- No third-party widgets or trackers without my explicit approval.
- Any form must validate input and never render user input as HTML.
- Do not build the footer yet.

QUALITY BAR
The page now tells a complete story from "who" to "proof" to "how to reach me", with no dead links and no empty sections.

OUTPUT FORMAT
Short report: sections built, sections skipped and why, decisions awaiting me (especially about contact method).

VERIFY
Build and run checks. Test at 320, 768, 1280 px. Click every link and button. Test the contact method end to end if it is not a simple link. Append a dated entry to Docs/build-log.md.

STOP AND ASK
Stop and wait for my approval, and for my decision on the contact method if open, before Phase 7.
```


#### Prompt 12: المرحلة 7: Footer والتفاصيل النهائية

**متى تستخدمه؟** بعد الموافقة على المرحلة 6.

**ماذا يفعل؟** يبني التذييل ووسوم SEO وOpen Graph والأيقونة وصفحة 404، ويزيل أي نص تجريبي متبقٍّ.

```text
ROLE
You are a senior front-end engineer responsible for the finishing details that make a site feel professional and complete.

CONTEXT
Read first: CLAUDE.md, Content/portfolio-content.md (Contact and SEO Metadata), Docs/design-direction.md, Docs/build-log.md. Phases 1 to 6 are approved. This is BUILD PHASE 7 of 8: footer and final details.

TASK
Build the footer and complete the technical details that every public site needs.

STEPS
1. Footer: name, short closing line from my content if one exists, public contact and social links I approved, and the current year generated by code or written statically with a note. No filler links.
2. Page metadata from the SEO section of my content: title, meta description, language attribute, canonical URL placeholder that I will set after I know the final domain, theme-color if it fits the design.
3. Social sharing: Open Graph and Twitter-card style tags (title, description, image, url). If I have no suitable share image in Content/, tell me what to create (recommended size and content) instead of generating a fake one.
4. Favicon: create a simple, original favicon from my initials or name using the design tokens, in the formats the stack needs. Do not use someone else's logo.
5. Create a custom 404 page matching the design, with a link back home.
6. Add robots.txt and a basic sitemap.xml if the stack and hosting support it; leave the domain as a clearly marked placeholder I must fill.
7. Review all links across the site for correctness and the use of rel="noopener noreferrer" where links open a new tab.
8. Remove leftover placeholder text, TODO comments, and unused files or dependencies.

CONSTRAINTS
- Do not invent the final domain; use a visible placeholder and list every place it appears.
- No analytics or tracking scripts unless I explicitly ask.
- Do not change the approved design except where a detail requires it; list any change.

QUALITY BAR
Nothing in the repository or the rendered page looks unfinished: no lorem ipsum, no broken links, no placeholder metadata, no leftover scaffolding text.

OUTPUT FORMAT
Short report: what was added, every placeholder I must fill later (with file and line), and anything missing from my content.

VERIFY
Build and run checks. Validate that the HTML head contains the expected tags by inspecting the built output. Visit a non-existent URL locally and confirm the 404 page appears (if the preview server supports it). Append a dated entry to Docs/build-log.md.

STOP AND ASK
Stop and wait for my approval before Phase 8.
```


#### Prompt 13: المرحلة 8: الاستجابة لكل الشاشات

**متى تستخدمه؟** بعد الموافقة على المرحلة 7.

**ماذا يفعل؟** يختبر الموقع على الشاشات الصغيرة والكبيرة ويصلح الفيض الأفقي والنصوص المقصوصة بأقل تغيير.

```text
ROLE
You are a senior front-end engineer and QA specialist for responsive design, touch usability, and accessibility.

CONTEXT
Read first: CLAUDE.md, Docs/design-direction.md, Docs/build-log.md. All sections are built and approved. This is BUILD PHASE 8 of 8: responsive design pass.

TASK
Systematically test and fix the website at every common screen size, without redesigning it.

STEPS
1. Define the test widths: 320, 360, 390, 430, 768, 1024, 1280, 1440, and 1920 px. If a headless browser or screenshot tool is available in this environment, use it to render each width; if not, say so and test by reading the CSS and reasoning about layout, and tell me which widths I must check manually on my phone.
2. For each width and each section, check: no horizontal scrolling, no clipped or overlapping text, comfortable line length, readable font sizes (body text at least 16 px), touch targets at least 44x44 px, images scale correctly, and the header and navigation remain usable.
3. Check long strings: very long names, words, and links must wrap rather than overflow. Test with the site language's longest realistic text.
4. Check text direction and mixed-direction content (for example Arabic text containing English words, numbers, or links) renders in the correct order.
5. Check keyboard navigation and visible focus at desktop sizes, and that nothing relies on hover only.
6. Check print or zoom: the layout must still work at 200 percent browser zoom.
7. Fix every issue found with the smallest possible change, using the design tokens. Do not restyle approved elements.

CONSTRAINTS
- Do not change content, colors, fonts, or structure unless a defect requires it; list each change.
- Do not add libraries.
- Do not claim you tested a width you did not actually render or reason through.

QUALITY BAR
Zero horizontal overflow at every tested width and no usability defects at 320 px and 1920 px.

OUTPUT FORMAT
A table: Width | Section | Issue found | Fix applied | Status. Then a list of anything I must test by hand on a real phone.

VERIFY
Rebuild and re-run the same tests after the fixes and show the results. Append a dated entry to Docs/build-log.md.

STOP AND ASK
Stop and wait for my approval. The next step is the security review; do not start it yourself.
```


### د · معايير جودة التصميم

هذه أكثر مشاكل المواقع المولّدة تكراراً، وأين يعالجها الدليل:

| المشكلة | لماذا تحدث؟ | كيف نمنعها؟ |
|---|---|---|
| تصميمات متكررة | الأداة تعيد أشهر القوالب | تحليل المراجع ثم Design Direction خاص بك (Prompt 04 و05) |
| توزيع عشوائي للعناصر | لا يوجد نظام مسافات وشبكة | رموز تصميم وسلم مسافات ثابت (Prompt 05 و06) |
| بطاقات كثيرة بلا حاجة | البطاقة هي الحل السريع لكل محتوى | منع البطاقات المتطابقة وتفضيل التسلسل الطباعي (Prompt 09 و10) |
| ألوان غير متناسقة | ألوان تُختار لكل قسم على حدة | لوحة واحدة بأدوار محددة وفحص تباين |
| خطوط غير مناسبة | خطوط شائعة لا تدعم لغتك جيداً | خطوط تدعم لغة الموقع وتُحدد في الاتجاه البصري |
| حركات مبالغ فيها | الحركة تُضاف للزينة | حركة لها وظيفة فقط، وتُعطّل لمن يفضلون تقليلها |
| محتوى عام لا يشبهك | بلا مقابلة ولا مصدر حقيقي | المقابلة في الخطوة 3 وقاعدة عدم الاختراع |

## 6 · ماذا نتوقع من الأداة؟

بعد كل مرحلة: تقرير قصير بما بُني وقراراته وما اختُبر، وسطر جديد في `Docs/build-log.md`، وطلب موافقتك. في نهاية المراحل الثماني يكون عندك موقع كامل يعمل على جهازك.

## 7 · كيف نتحقق من صحة النتيجة؟

- افتح الموقع بنفسك بعد كل مرحلة. لا تكتفِ بقول الأداة إنها اختبرته.
- قارن الشكل بـ `Docs/design-direction.md`: هل الألوان والخطوط كما اتفقتما؟
- غيّر عرض نافذة المتصفح لتجرب الشاشات الصغيرة.
- اضغط كل رابط وزر، وجرّب التنقل بزر Tab في لوحة المفاتيح.
- اقرأ كل نص: لا أرقام ولا ادعاءات ليست من محتواك.

## 8 · الأخطاء الشائعة وكيف تحلها

| المشكلة | الحل |
|---|---|
| أنجزت الأداة عدة مراحل دفعة واحدة | اطلب منها إيقاف ذلك وذكّرها بقاعدة الانتظار في `CLAUDE.md` |
| الشكل لا يشبه الاتجاه المتفق عليه | اطلب مقارنة صريحة بينه وبين `Docs/design-direction.md` وإصلاح الفروق |
| صححت الأداة خطأً وظهر آخر | بعد تصحيحين فاشلين اضغط `/clear` وأعد الطلب بوصف أدق، كما تنصح الوثائق |
| ضاع السياق في محادثة طويلة | افتح محادثة جديدة، ودع الأداة تقرأ ملفات `Docs/` أولاً |
| أردت التراجع عن تغيير | اضغط `Esc` مرتين أو اكتب `/rewind` لاستعادة حالة سابقة، لكنها لا تغني عن `git` |

## 9 · ما الذي يجب أن نحصل عليه قبل الانتقال؟


> ✅ **قائمة الإنجاز**
> - موقع كامل يعمل على جهازك.
> - ثماني مراحل مسجلة في `Docs/build-log.md`.
> - راجعت كل مرحلة بنفسك ووافقت عليها.
> - لا أفقي scroll على الشاشات الصغيرة.
> - لم يبقَ نص تجريبي أو رابط معطل.



**المصادر:** [S2] [Claude Code · Best practices](https://code.claude.com/docs/en/best-practices) · [S3] [Claude Code · Permission modes](https://code.claude.com/docs/en/permission-modes)



---

# الخطوة 5: الأمان وفحص الموقع قبل النشر
*Security Review*


## 1 · ماذا سنفعل؟

سنجعل الأداة تراجع مشروعك مراجعة أمنية فعلية، فتبحث عن مفاتيح مكشوفة وثغرات في الحزم المستخدمة وأخطاء في عرض المدخلات، وتكتب تقريراً مرتباً بحسب الخطورة. ثم نصلح ما يستحق الإصلاح ونعيد الاختبار.

## 2 · لماذا نحتاج إلى هذه الخطوة؟

الموقع قد يعمل بشكل ممتاز ويحمل في داخله خطأً أمنياً. الأداة تحاول أولاً أن يعمل الكود، والأمان لا يُضاف من نفسه ما لم تطلبه. وأخطر ما قد يحدث لمبتدئ: أن يرفع مفتاح API إلى GitHub فيُستخدم من آخرين على حسابه، أو أن يتضمن موقعه حزمة فيها ثغرة معروفة.

## 3 · ماذا نحتاج قبل البدء؟

موقع يعمل على جهازك (الخطوة 4). ومعرفة أن **أي شيء يصل إلى المتصفح يستطيع أي زائر قراءته**، ولو لم يظهر في الصفحة.

## 4 · التنفيذ خطوة بخطوة

### مصطلحات تحتاجها

| المصطلح | معناه ببساطة |
|---|---|
| API Key | كلمة سرية تعطيك صلاحية استخدام خدمة، ومن يمتلكها يستخدمها باسمك |
| Environment Variables / ملف `.env` | قيم سرية أو إعدادات تُخزَّن خارج الكود، ويجب ألا تُرفع إلى GitHub |
| Dependencies | حزم برمجية جاهزة يعتمد عليها مشروعك، وقد تحمل ثغرات معروفة |
| XSS | أن يُدخل شخص كوداً خبيثاً في حقل أو رابط، فيعرضه موقعك لزواره فيشتغل في متصفحهم |
| CSP | سياسة يرسلها الموقع للمتصفح تحدد مصادر الكود المسموح بتنفيذه، فتخفف أثر XSS |
| CORS | قواعد تحدد أي مواقع تستطيع طلب بيانات من خادمك، وتهمّك فقط إذا كان عندك Backend |
| Security Headers | إعدادات في استجابة الخادم تقوّي حماية المتصفح |

### ما الذي يهم البورتفوليو الثابت؟

قائمة OWASP Top 10 لعام 2025 تلخص أهم مخاطر تطبيقات الويب. أغلبها يتعلق بمواقع فيها حسابات وقواعد بيانات، أما موقع ثابت فأهمها له:

| البند | هل يهم موقعك؟ (تقديري) |
|---|---|
| A01 Broken Access Control | فقط إذا كان عندك Backend أو لوحة تحكم |
| A02 Security Misconfiguration | **نعم**: إعدادات النشر والـ Headers وملفات لا يجب نشرها |
| A03 Software Supply Chain Failures | **نعم**: الحزم التي يعتمد عليها مشروعك |
| A04 Cryptographic Failures | إن خزّنت بيانات حساسة أو أرسلتها |
| A05 Injection | **نعم**: ومنه XSS في النماذج وعرض المحتوى |
| A06 Insecure Design | عند إضافة وظائف تفاعلية |
| A07 Authentication Failures | فقط إذا كان عندك تسجيل دخول |
| A08 Software or Data Integrity Failures | سكربتات خارجية وتحديثات غير موثوقة |
| A09 Security Logging and Alerting Failures | في الغالب لا يخص الموقع الثابت |
| A10 Mishandling of Exceptional Conditions | رسائل أخطاء تكشف تفاصيل داخلية |

لا تفرض على بورتفوليو ثابت Backend أو نظام دخول لا يحتاجهما. والـ Prompt يطلب من الأداة تطبيق ما ينطبق فقط.

### درجات الخطورة

| الدرجة | معناها |
|---|---|
| Critical | استغلال سهل وأثر كبير، مثل مفتاح سري مكشوف |
| High | ثغرة خطيرة يمكن استغلالها بشروط معقولة |
| Medium | خطر حقيقي لكن أثره أو احتمال استغلاله محدود |
| Low | تحسين أو ضعف بسيط |

### Prompt الفحص


#### Prompt 14: مراجعة أمنية فعلية للمشروع

**متى تستخدمه؟** بعد اكتمال الموقع وقبل أي نشر. هذا الـ Prompt لا يصلح شيئاً، بل يكتب تقريراً فقط.

**ماذا يفعل؟** يراجع مشروعك أمنياً بأدلة من الملفات: أسرار وحزم وثغرات XSS وإعدادات نشر، ويكتب تقريراً مرتباً بالخطورة.

```text
ROLE
You are a senior application security engineer reviewing a personal portfolio website before it goes public. You are honest, specific, and you never claim a site is "secure" or "safe" in an absolute sense.

CONTEXT
Read first: CLAUDE.md and Docs/build-log.md. The project is in Website/. Detect the project type yourself from the files: a static site, a framework site, or a site with a backend or serverless functions. Apply only the checks that make sense for what exists. Do not demand a backend, login system, or database for a static portfolio.

TASK
Perform a real, evidence-based security review of the whole project and write Docs/security-report.md. Do not fix anything in this step.

CHECKS (run each one using the actual files, not assumptions)
1. Secrets: search the working tree for API keys, tokens, passwords, private keys, and connection strings (patterns such as key, secret, token, password, bearer, and common provider prefixes). Report file and line, but NEVER print the secret value; show only the first 4 characters and the length.
2. Environment files: find .env and similar files; confirm they are listed in .gitignore; check whether they were ever committed by inspecting git history (git log --all --full-history -- <file>) if a repository exists.
3. Front-end exposure: look for sensitive values in code that ships to the browser, including variables with public prefixes that should not hold secrets.
4. Dependencies: run the ecosystem's audit command (for example npm audit) and report known vulnerabilities with severity; separate real runtime risk from dev-only tooling.
5. XSS: find every place user-controlled or external data reaches the page (forms, URL parameters, query strings, local storage, third-party data); flag dangerous sinks such as innerHTML, dangerouslySetInnerHTML, document.write, eval, and unsanitized Markdown rendering.
6. Forms: if forms exist, check validation, spam handling, and where the data goes.
7. Backend or serverless code, only if it exists: input validation, authorization on each endpoint, error messages leaking details, rate limiting, CORS configuration.
8. Security headers and CSP: check what the project or hosting configuration sets. Recommend headers appropriate to the hosting platform and say which ones you could not verify without the platform's documentation. Do not invent platform-specific syntax; check the official docs of the chosen host first.
9. External resources: list every third-party script, font, or embed, and whether it is needed.
10. Deployment configuration: build output folders, source maps exposure, debug flags, and files that should not be published.

SEVERITY
Classify each finding as Critical, High, Medium, or Low, and explain the rule you used in one line.

REPORT FORMAT (one entry per finding)
Name | Severity | Location (file:line) | Why it matters | How to reproduce or verify | Recommended fix | Status: "open".
End with: what you checked, what you could NOT check and why, and a plain statement that passing these checks does not prove the site is secure.

CONSTRAINTS
- Do not modify any project file except creating the report.
- Never print real secret values anywhere, including in the report.
- Do not report theoretical issues without pointing to code or configuration that shows them.
- Do not invent vulnerabilities to look thorough; "no finding" is a valid result.

QUALITY BAR
Every finding is reproducible by someone who reads only your entry.

VERIFY
Include the exact commands you ran and the summary of their output.

STOP AND ASK
Present the findings sorted by severity and stop. Wait for me to tell you which ones to fix.
```


### كيف تقرأ التقرير؟

لكل مشكلة: اسمها، وموقعها (ملف وسطر)، وسبب خطورتها، وطريقة التحقق منها، وطريقة إصلاحها. اقرأ أولاً Critical وHigh. وإن لم تفهم مشكلة فاسأل الأداة: «اشرحها لي كأني مبتدئ، وأرِني كيف أتحقق منها بنفسي».

### إصلاح المشاكل


#### Prompt 15: إصلاح الثغرات والتحقق منها

**متى تستخدمه؟** بعد قراءة التقرير. حدّد فيه ما توافق على إصلاحه.

**ماذا يفعل؟** يصلح المشاكل التي وافقتَ عليها فقط، ويعيد اختبار كل إصلاح، ويحدّث التقرير بنتيجته.

```text
ROLE
You are a senior application security engineer who fixes vulnerabilities with the smallest safe change and proves each fix.

CONTEXT
Read first: CLAUDE.md, Docs/security-report.md, Docs/design-direction.md, and Docs/build-log.md. The report lists findings with severity. I approve fixing these finding IDs or names: [PASTE THE FINDINGS TO FIX, OR WRITE "ALL CRITICAL AND HIGH"].

TASK
Fix only the approved findings, verify each one, and update the report.

STEPS
1. Restate the approved findings and your fix plan in one short list. Wait for no confirmation unless a fix would change the design, remove a feature, or touch something outside Website/.
2. Fix findings in severity order, one at a time. For each: make the minimal change, explain what and why in two lines, and keep the existing design and behavior intact.
3. If a finding is an exposed secret: tell me clearly that removing it from the code is NOT enough. The key must be revoked or rotated at the provider by me, because it may already have been copied. Give me the exact steps in plain language, and wait for my confirmation that I rotated it. If it appears in git history, explain the options and their risks (for example rewriting history) and let me decide; do not rewrite history on your own.
4. If a finding is a vulnerable dependency: update to the fixed version if it does not break the build, otherwise propose the safest alternative. Re-run the audit command.
5. If a finding is XSS-related: replace dangerous sinks with safe alternatives (for example textContent, or the framework's built-in escaping), and sanitize with a well-maintained library only where rich HTML is truly required. Treat Content Security Policy as an extra layer, not a replacement for fixing the root cause.
6. Re-test each fix with the same method that found the problem, and add an automated check or test where the project already supports tests.
7. Run the full build and any existing tests to confirm nothing else broke.

CONSTRAINTS
- Do not fix findings I did not approve; list them as still open.
- Do not change the visual design or remove functionality without asking.
- Never print real secret values.
- Do not write "secure" or "safe" in the report; write what was fixed and verified.

QUALITY BAR
Every fixed finding has: the change, the re-test result, and the remaining risk, if any.

OUTPUT FORMAT
Update Docs/security-report.md: set each finding's status to fixed, partially fixed, or open, add a "Retest result" line, and add a changelog of files modified. In chat, give a short summary table.

VERIFY
Show the re-run of the original detection steps (secret search, audit, sink search) and their new results. Append a dated entry to Docs/build-log.md.

STOP AND ASK
If any Critical or High finding remains open, say so first and stop. Otherwise stop after the summary and wait for my approval before deployment.
```


### ماذا لو كُشف مفتاح سري؟


> ⚠️ **حذف المفتاح من الكود لا يكفي**
> قد يكون المفتاح قد نُسخ. أنشئ مفتاحاً جديداً من لوحة تحكم الخدمة التي أصدرته (Revoke/Rotate)، وأوقف القديم فوراً. ثم حدّث المفتاح الجديد في إعدادات الاستضافة لا في الكود. واستخدم الأداة لتنظيف المشروع بعد ذلك.


### حماية GitHub من رفع الأسرار

Push protection ميزة في GitHub توقف الدفع (push) إذا اكتشفت سراً مكتوباً في الكود، وتشرح لك السبب لتزيله وتعيد المحاولة. بحسب وثائق GitHub، حماية المستخدم مفعّلة افتراضياً وتمنعك من دفع أسرار إلى المستودعات العامة على GitHub.com، أما حماية المستودع نفسه فتكون معطلة افتراضياً ويفعّلها صاحب الصلاحية. وهي طبقة إضافية، ولا تغني عن فحصك.

### CSP: طبقة دفاع إضافية

سياسة أمن المحتوى تُرسل عادة في ترويسة `Content-Security-Policy`. أبسط مثال بحسب MDN:

```http
Content-Security-Policy: default-src 'self'
```

وهي تسمح بالموارد من نفس الموقع فقط، وتمنع السكربتات المضمنة. هذه طبقة دفاع إضافية لا تغني عن إصلاح السبب الجذري لـ XSS. وطريقة إضافة الترويسات تختلف بين منصات الاستضافة، فاطلب من الأداة قراءة وثائق منصتك ولا تخمّن الصياغة.

## 6 · ماذا نتوقع من الأداة؟

- ملف `Docs/security-report.md` فيه المشاكل مرتبة بالخطورة، وقسم لما فُحص وما لم يُفحص ولماذا.
- بعد الإصلاح: كل مشكلة بحالتها (مصلحة، جزئية، مفتوحة) ونتيجة إعادة الاختبار.
- عبارة صريحة أن اجتياز الفحوص لا يثبت أن الموقع آمن.

## 7 · كيف نتحقق من صحة النتيجة؟

- يعرض التقرير الأوامر التي شُغّلت ونتائجها.
- لم تُطبع أي قيمة سرية في أي مكان.
- أعادت الأداة نفس الفحص الذي كشف المشكلة وأظهرت اختفاءها.
- يمر البناء (build) بعد الإصلاح ولا يتغير التصميم.
- تفحص بنفسك: ابحث في مجلد الموقع عن ملفات `.env` وتأكد أنها في `.gitignore`.

## 8 · الأخطاء الشائعة وكيف تحلها

| المشكلة | الحل |
|---|---|
| الأداة قالت «الموقع آمن» | هذه عبارة غير مقبولة. اطلب قائمة ما فُحص وما لم يُفحص |
| رُفع ملف `.env` إلى GitHub | غيّر الأسرار فوراً، ثم أصلح `.gitignore`. حذف الملف لا يكفي لأنه يبقى في تاريخ المشروع |
| وُضع مفتاح في متغير يصل إلى المتصفح | بعض الأدوات تضع بادئة معينة للمتغيرات التي تُنشر للمتصفح. لا تضع سراً في متغير كهذا أبداً، وراجع وثائق أداتك |
| تحديث الحزم كسر الموقع | ارجع للنسخة السابقة بـ git أو `/rewind` واطلب بديلاً أكثر أماناً |
| تغيّر التصميم أثناء الإصلاح | الـ Prompt يمنع ذلك. اطلب إرجاع التغيير وإصلاحاً أصغر |

## 9 · ما الذي يجب أن نحصل عليه قبل الانتقال؟


> ✅ **قائمة الإنجاز**
> - تقرير أمني موجود في `Docs/`.
> - لا توجد مشاكل Critical أو High مفتوحة.
> - لا أسرار في الكود ولا في تاريخ git، أو غُيّرت إن وُجدت.
> - `.env` في `.gitignore`.
> - أعيد البناء بنجاح بعد الإصلاحات.



**المصادر:** [S4] [OWASP Top 10:2025](https://owasp.org/Top10/2025/) · [S5] [MDN · Content Security Policy (CSP)](https://developer.mozilla.org/docs/Web/Security/CSP) · [S6] [GitHub Docs · Push protection](https://docs.github.com/en/code-security/concepts/secret-security/about-push-protection) · [S9] [OWASP Cheat Sheet · XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)



---

# الخطوة 6: النشر والاختبار النهائي
*Deploy & Final Testing*


## 1 · ماذا سنفعل؟

سننقل الموقع من جهازك إلى الإنترنت: نرفعه إلى GitHub، ونربطه بمنصة استضافة، ونحصل على رابط عام. ثم نختبر الموقع **بعد النشر** وليس محلياً فقط، ونختم بقائمة تأكد أنه جاهز للمشاركة.

## 2 · لماذا نحتاج إلى هذه الخطوة؟

موقع على جهازك لا يراه أحد، وما يعمل محلياً قد يفشل بعد النشر: أخطاء في مسار ملف، أو خط لا يُحمَّل، أو رابط يشير إلى `localhost`. لذلك نختبر الرابط الحقيقي كما سيراه زوارك.

## 3 · ماذا نحتاج قبل البدء؟

- موقع كامل ومراجَع أمنياً (الخطوتان 4 و5).
- `git` مثبّت.
- حساب على GitHub وحساب على منصة استضافة. اخترنا في الشرح **Vercel** لأن ربطه بـ GitHub مباشر وموثّق، لكن المنصات الأخرى تتبع منطقاً مشابهاً. تحقق من خطط الأسعار والحدود قبل الاختيار.
- نطاق (Domain) خاص إن أردت، وهذا اختياري.

## 4 · التنفيذ خطوة بخطوة

### اختيار منصة الاستضافة

اختر منصة تدعم النشر من GitHub، وتعرض سجل البناء، وتتيح متغيرات البيئة، وتعطيك رابطاً مجانياً مبدئياً. اطلب من الأداة قراءة وثائق منصتك قبل أن تعطيك خطوات، ولا تقبل خطوات مخمّنة.

### رفع المشروع إلى GitHub


> ⚠️ **انشر مجلد Website فقط**
> مجلدا `Content/` و`Inspiration/` فيهما مواد خاصة، ومجلد `Docs/` فيه تقرير الثغرات. لا تدفع جذر المشروع إلى GitHub. أنشئ المستودع من داخل `Website/` فقط.


1. في GitHub أنشئ مستودعاً جديداً **فارغاً**: بلا README ولا `.gitignore`.
2. من داخل مجلد `Website/` نفّذ (والأداة تشرحها لك وتنتظر موافقتك):

```bash
git init
git add .
git status
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

استبدل `USERNAME` و`REPO` بالقيم الحقيقية. وقبل `git commit` اقرأ ناتج `git status` وتأكد أنه لا يعرض ملف `.env` ولا مجلد `node_modules`.

### ربط المستودع بـ Vercel

1. سجّل الدخول إلى Vercel بحساب GitHub.
2. أنشئ مشروعاً جديداً من لوحة التحكم، واختر المستودع من شاشة الاستيراد (قد تختلف أسماء الأزرار قليلاً مع تحديثات المنصة). إن لم يظهر، فالسبب الغالب أن تطبيق Vercel في GitHub لا يملك صلاحية على ذلك المستودع، وتعدّل ذلك من إعدادات التطبيق في GitHub.
3. راجع إعدادات البناء (Build Command وOutput Directory وFramework Preset) وقارنها بما ذكرته الأداة في تقرير الإعداد.
4. ابدأ النشر (Deploy) وانتظر انتهاء البناء.

بحسب وثائق Vercel، كل push إلى GitHub ينتج عملية نشر. الدفع إلى الفرع الإنتاجي (غالباً `main`) يحدّث موقعك الحقيقي، والدفع إلى فرع آخر ينتج رابط معاينة منفصلاً.

### متغيرات البيئة (إن احتاج موقعك)

إن كان موقعك لا يحتاج أي أسرار فتقول الأداة «none needed» وتتجاوز هذه الخطوة. وإن احتاج: من لوحة المشروع افتح Environment Variables، واكتب الاسم والقيمة، واختر البيئات المطلوبة، واحفظ. **التغيير لا يطبَّق على النشرات القديمة، فأعد النشر (Redeploy).**

### إن فشل النشر

افتح سجل البناء (Build Logs) في المنصة وانسخ آخر رسالة خطأ للأداة. أكثر الأسباب شيوعاً: مجلد إخراج خاطئ، أو حزمة ناقصة، أو اختلاف إصدار Node، أو اختلاف حالة الأحرف في أسماء الملفات (`Logo.png` غير `logo.png`).

### ربط نطاق خاص (اختياري)

تعطيك المنصة سجلات DNS التي تنشئها لدى مزوّد النطاق. انسخها كما تظهر على شاشتك ولا تخمّنها، وقد يستغرق التفعيل وقتاً.

### Prompt النشر


#### Prompt 16: النشر والإعداد على الاستضافة

**متى تستخدمه؟** بعد انتهاء الإصلاحات الأمنية.

**ماذا يفعل؟** يجهّز المشروع للنشر ويرشدك خطوة بخطوة إلى GitHub والاستضافة، ثم يفحص الرابط المنشور.

```text
ROLE
You are a senior DevOps-minded front-end engineer helping a beginner publish a portfolio site safely, with every step explained and verified.

CONTEXT
Read first: CLAUDE.md, Docs/build-log.md, Docs/security-report.md. The security review is done and approved. My hosting choice is: [HOSTING PLATFORM, for example Vercel]. My GitHub username is: [YOUR GITHUB USERNAME] (I will create the repository myself if it does not exist). I have a custom domain: [YES - domain name / NO].

TASK
Prepare the project for deployment, guide me through publishing, and verify the live site.

STEPS
1. Pre-flight: run a clean install and a production build exactly as the hosting platform will. Report the build command, output folder, and the Node version if relevant. If you are unsure about the platform's expectations, read its official documentation before answering.
2. Git: if the project is not a git repository, initialize one inside Website/ only. Never initialize or push the project root: Content/, Inspiration/, and Docs/ contain private material and the security report, and must never be published. Confirm .gitignore excludes dependencies, build output, and every .env file. Show me the list of files that will be committed and ask me to confirm that nothing private is in it before the first commit.
3. GitHub: tell me step by step how to create an empty repository on GitHub (I do this in the browser). Then give me the exact commands to connect and push. Never ask me to paste a token; if authentication is needed, explain the official sign-in options.
4. Hosting: give me click-by-click instructions for importing the repository on [HOSTING PLATFORM], and which build settings to verify (build command, output directory, framework preset). Tell me which values you expect, so I can compare with what the platform suggests.
5. Environment variables: list every variable the project needs, if any, and where to enter them on the platform. If none are needed, say "none needed". Explain that changing variables requires a new deployment to take effect.
6. First deployment: tell me what success looks like, and how to read the build log if it fails. Prepare a short "if it fails" guide for the likely errors you can already see (wrong output directory, missing dependency, Node version mismatch, case-sensitive file names).
7. After I give you the live URL: replace every domain placeholder (canonical URL, Open Graph URL, sitemap, robots) with the real URL, rebuild, and prepare the commit for me to push.
8. Custom domain, only if I answered YES: explain the domain connection steps on the platform in plain language and the DNS records I must create at my registrar, and warn that DNS changes can take time. Do not invent record values; read them from the platform screen I show you.

CONSTRAINTS
- Never run git push, change remote settings, or deploy on my behalf without telling me what the command will do and getting my yes.
- Never commit secrets, and never print them.
- Do not change the website's design or content in this step except for domain placeholders.

QUALITY BAR
At the end, the site is live on a public URL, the URL is stored in the project, and I know how to publish future changes.

OUTPUT FORMAT
A numbered runbook I can follow, with the exact commands in code blocks and a "what you should see" line after each step.

VERIFY
After I confirm it is live, check the live URL as far as your tools allow and report the status of the home page, the 404 page, robots.txt, and sitemap.xml. Append a dated entry to Docs/build-log.md with the URL and date.

STOP AND ASK
Stop at every step that requires me to act in a browser, and wait for my confirmation before the next one.
```


### الاختبار النهائي

بعد أن يعمل الرابط، شغّل الاختبار الشامل على الموقع **المنشور**.

| الفحص | ما نبحث عنه |
|---|---|
| الهاتف | لا Horizontal Overflow، خط الجسم 16px على الأقل، مساحة اللمس 44×44px على الأقل |
| الروابط والنماذج | لا رابط معطل أو يشير إلى `localhost`، وكل نموذج يعمل |
| SEO | عنوان ووصف لكل صفحة، `h1` واحد، `robots.txt`، `sitemap.xml` |
| Open Graph | وسوم `og:title` و`og:type` و`og:image` و`og:url` موجودة وبروابط كاملة |
| Accessibility | تباين مناسب، تنقل بلوحة المفاتيح، تركيز ظاهر، نص بديل للصور |
| Lighthouse | أربع فئات: Performance وAccessibility وBest Practices وSEO |
| Core Web Vitals | LCP حتى 2.5 ثانية، INP حتى 200 ملّي ثانية، CLS حتى 0.1 |
| الأخطاء | صفحة 404 مخصصة بلا تفاصيل داخلية |

يمكنك تشغيل **Lighthouse** بنفسك من أدوات المطور في Chrome، أو من PageSpeed Insights، أو من سطر الأوامر. وبحسب web.dev تُقيَّم Core Web Vitals عند النسبة المئوية 75 من زيارات الصفحة، أي أن بيانات الزوار الحقيقيين لا تظهر إلا بعد أن يزور موقعك ناس. والاختبار المخبري تقدير فقط.


> ℹ️ **الفحص الآلي لا يكفي**
> أدوات الفحص تكتشف جزءاً من مشاكل إمكانية الوصول فقط. بعدها جرّب بنفسك: تنقّل في الموقع بلوحة المفاتيح وحدها، وكبّر الصفحة إلى 200%، وافتح الموقع على هاتفك الحقيقي.


### Prompt الاختبار النهائي


#### Prompt 17: اختبار شامل للموقع المنشور

**متى تستخدمه؟** بعد أن يعمل الرابط العام.

**ماذا يفعل؟** يختبر الموقع المنشور: الجوال والروابط وSEO وOpen Graph وLighthouse وCore Web Vitals، ويحكم على جاهزيته.

```text
ROLE
You are a meticulous QA engineer and web-quality auditor. You test the live, deployed site, not only the local copy.

CONTEXT
My site is live at: [YOUR LIVE URL]. Read first: CLAUDE.md, Content/portfolio-content.md, Docs/design-direction.md, Docs/security-report.md, and Docs/build-log.md.

TASK
Run a complete pre-launch quality audit of the live site and write Docs/qa-report.md. Fix only low-risk issues that I approve.

CHECKS
1. Mobile testing: the site at 320, 390, and 430 px wide. No horizontal overflow, readable text (body at least 16 px), tap targets at least 44x44 px, working menu and buttons, comfortable spacing. List anything I must confirm on a real phone.
2. Links and forms: crawl every internal and external link and report status codes. Report any broken, redirected, or insecure (http) link. Test every form or contact method end to end.
3. Images and performance: find images that are too large for how they are displayed, missing dimensions, missing alt text, and missing lazy loading below the fold.
4. SEO and metadata: title and meta description on each page, one h1 per page, heading order, canonical URL, language attribute, robots.txt, sitemap.xml, and descriptive link text.
5. Open Graph: verify og:title, og:type, og:image, and og:url are present and use absolute URLs; verify the share image loads. Tell me how to preview the share card using the platforms' own sharing debuggers, as far as I can do so myself.
6. Accessibility: color contrast, keyboard navigation, visible focus, skip link, landmarks, alt text, form labels, and language and direction. Mention that automated tools find only part of the accessibility problems and list the manual checks I should do (keyboard-only pass, 200 percent zoom).
7. Lighthouse: run Lighthouse if it is available here (command line or browser tooling) for mobile and desktop and report the four category scores: Performance, Accessibility, Best Practices, SEO. If it is not available, give me the exact steps to run it myself in Chrome DevTools or through PageSpeed Insights and tell me which numbers to send back.
8. Core Web Vitals: report LCP, INP, and CLS where measurable, compared with the "good" thresholds: LCP up to 2.5 seconds, INP up to 200 milliseconds, CLS up to 0.1. Be clear that field data requires real visitors and lab data is only an estimate.
9. Error pages: confirm a custom 404 page works and that no stack traces or debug messages appear.
10. Post-deployment reality check: confirm the live site matches the local build (fonts load, images load, no references to localhost, no mixed content warnings, correct canonical and share URLs).
11. Security recheck: confirm no secrets or private files are reachable on the live site (for example source maps or .env paths), and that previous Critical and High findings stay fixed.

CONSTRAINTS
- Report only what you actually measured or observed; mark everything else "not tested" with the reason.
- Do not change the design. Do not deploy anything without my approval.

QUALITY BAR
Every issue has: what, where, how to reproduce, severity, and a proposed fix.

OUTPUT FORMAT
Docs/qa-report.md with a results table for each of the 11 checks (Pass / Fail / Not tested), a prioritized fix list, and a final "ready to share?" verdict with its conditions.

VERIFY
Include the commands, tools, and URLs you used, so I can repeat the tests.

STOP AND ASK
Present the verdict and the prioritized fix list, then stop. Wait for my approval before fixing and redeploying.
```


### بعد اجتياز الاختبار

أصلح ما اتفقتما عليه، وادفع التعديلات بـ `git push` فتُنشر تلقائياً بحسب إعدادات المنصة، ثم أعد الاختبار.

## 6 · ماذا نتوقع من الأداة؟

- Runbook مرقّم لخطوات النشر مع الأوامر وما يجب أن تراه بعد كل خطوة.
- توقف عند كل خطوة تتطلب منك فعلاً في المتصفح.
- استبدال بيانات العنوان المؤقتة (canonical وOG وsitemap) بالرابط الحقيقي.
- ملف `Docs/qa-report.md` يوضح كل فحص (نجح، فشل، لم يُختبر) وحكماً نهائياً على جاهزية الموقع.

## 7 · كيف نتحقق من صحة النتيجة؟

- افتح الرابط من هاتفك ومن متصفح آخر.
- افتح عنوان غير موجود وتأكد أن صفحة 404 تظهر.
- اختبر مشاركة الرابط في إحدى المنصات وتأكد من ظهور العنوان والصورة.
- أعد قراءة تقرير الاختبار: كل فحص مكتوب فيه ما قيس فعلاً وما لم يُقَس.

## 8 · الأخطاء الشائعة وكيف تحلها

| المشكلة | الحل |
|---|---|
| المستودع لا يظهر في Vercel | امنح تطبيق Vercel صلاحية على المستودع من إعدادات GitHub |
| عمل الموقع محلياً وفشل في النشر | اقرأ Build Logs، وتحقق من مجلد الإخراج وإصدار Node وحالة الأحرف في الأسماء |
| غيّرت متغير بيئة ولم يتغير شيء | أعد النشر Redeploy |
| الصور لا تظهر بعد النشر | المسارات خاطئة أو الحالة تختلف، اطلب من الأداة مقارنة المسارات |
| ظهر تحذير Mixed Content | رابط `http` داخل صفحة `https`، حوّله إلى `https` |
| رابط المشاركة بلا صورة | `og:image` يجب أن يكون رابطاً كاملاً يعمل علناً |

## 9 · ما الذي يجب أن نحصل عليه قبل الانتقال؟


> ✅ **قائمة الإنجاز**
> - موقع منشور على رابط عام يفتح على أي جهاز.
> - تقرير اختبار يخلو من مشاكل عالية الخطورة.
> - لا توجد إشارات إلى `localhost` أو نص تجريبي.
> - أعرف كيف أنشر تعديلاً جديداً بـ `git push`.



**المصادر:** [S7] [Vercel Docs · Vercel for GitHub](https://vercel.com/docs/git/vercel-for-github) · [S8] [Vercel Docs · Managing environment variables](https://vercel.com/docs/environment-variables/managing-environment-variables) · [S10] [web.dev · Core Web Vitals thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds) · [S11] [Chrome for Developers · Lighthouse](https://developer.chrome.com/docs/lighthouse) · [S12] [The Open Graph protocol](https://ogp.me/)



---

# القائمة النهائية
*هل موقعك جاهز للمشاركة؟*



> ✅ **المحتوى**
> - كل ما في الموقع حقيقي ومن مصدرك، بلا أرقام أو عملاء أو شهادات مخترعة.
> - العنوان الرئيسي يوضح من أنت وماذا تقدم خلال خمس ثوانٍ.
> - لا نص تجريبي ولا عبارات عامة مستهلكة.
> - كل رابط يعمل ويوصل إلى المكان الصحيح.



> ✅ **التصميم**
> - موقعك يشبهك ولا ينسخ موقعاً آخر.
> - لوحة ألوان واحدة وخطوط مناسبة للغتك.
> - لا بطاقات متطابقة بلا سبب ولا حركة بلا وظيفة.
> - يعمل بشكل ممتاز من 320 بكسل حتى الشاشات الكبيرة، بلا Horizontal Overflow.



> ✅ **الأمان**
> - لا أسرار في الكود ولا في تاريخ git، و`.env` في `.gitignore`.
> - لا ثغرات Critical أو High مفتوحة في التقرير.
> - لا تعرض مدخلات الزوار كـ HTML دون معالجة.
> - نُشر مجلد `Website/` فقط.



> ✅ **الأداء وإمكانية الوصول**
> - نتائج Lighthouse الأربع مقبولة، وأسباب أي نقص مفهومة.
> - LCP حتى 2.5 ثانية وINP حتى 200 ملّي ثانية وCLS حتى 0.1 (القيم «الجيدة» بحسب web.dev).
> - يمكن استخدام الموقع بلوحة المفاتيح وحدها، والصور لها نص بديل.



> ✅ **بعد النشر**
> - جرّبت الرابط الحقيقي من هاتفك.
> - صفحة 404 تعمل، و`robots.txt` و`sitemap.xml` موجودان.
> - معاينة المشاركة تُظهر العنوان والصورة.
> - لا إشارة إلى `localhost` ولا Mixed Content.



> ℹ️ **أنت الآن جاهز للمشاركة**
> شارك موقعك وجرّب أن تسأل صديقاً أن يفتحه ويخبرك: من أنا؟ وماذا أفعل؟ وكيف أتواصل معي؟ إن أجاب بسرعة فقد نجح الموقع. ثم شاركه على إنستغرام مع وسم @mshaerx.


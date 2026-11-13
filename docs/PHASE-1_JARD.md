# الجرد الكامل (المرحلة -1) — AADALA.MA — 2026-11-13

> الفرع: `design/living-royal-court` (مُنشئ من HEAD = `386d567`، بلا أي commit أو push أو deploy).
> خادم التطبيق يعمل محلياً: `npm run dev` (Next 16 + webpack) على `http://localhost:3000` — HTTP 200 لكل المسارات الموجودة.
> التشخيص التفصيلي: `docs/PHASE-0_REPORT.md` (Phase 0 — 2026-11-13).
> المسح تم من نفس الجهاز؛ المتصفح غير قابل لمحاكاة أي مقاس (النافذة المثبتة ~1000×700) ⇒ لا لقطات 375/768 — غير مؤكدة، وتُقدم بدلاً منها لقطات قياسية + فحص HTTP لكل مسار.

## 1) خريطة القصر — كل مسار (HTTP/DOM/console)

| المسار | القسم | الاتجاه/المحتوى | H1/العنوان | الحالة |
|---|---|---|---|---|
| `/ar` | البوابة | عربي RTL، SSR 200 | «القانون المغربي، بنصّه ومادّته.» | ✅ يعمل، لكن تخطيط الهيدر ميتكسر عند ~1000px (روابط مكتظة/متداخلة، زر ذهبي معلّق خارج المسار)، لا صورة (SVG/Inline فقط) |
| `/ar/ai` | الديوان | 200 | «AADALA AI — المساعد القانوني» | ⚠️ هيكل المحادثة يعمل شكلياً لكنه قشرة فارغة: ~82 حرفاً فقط في main، لا SystemPrompt حقيقي، لا RAG-واجهة، لا شريط مصادر، لا اقتراحات؛ يغيب نص البدء/شارة النسخة التجريبية |
| `/ar/legal` | الخزانة | 200 | «الموسوعة القانونية» | ✅ 17 تصنيفاً حقيقياً مربوطة بـ legalSources/legalCategories، مع ذكر عدم وجود نص افتراضي — لكنه فهرس بلا مقال مرئي مفسّر |
| `/ar/legal/[slug]` (constitution-2011) | الخزانة | 200 | «دستور المملكة المغربية (2011)» | ✅ أفضل مسار في التطبيق: ~109 آلاف حرف نص فعلي داخل aadala-card، مع إخلاء مسؤولية واضح عن الاستخراج الآلي |
| `/ar/legal/bulletin-officiel-7437` | الخزانة | 200 | «الجريدة الرسمية عدد 7437» | ✅ ~286 ألف حرف نص، مع تحذير صريح بأن الاستخراج تالف نسبياً؛ يعرض النص كما هو |
| `/ar/legal/family-code` … `labor-code` و`jurisprudence-commerciale` | الخزانة | 200 لكن محتوى «الصفحة غير موجودة» | «الصفحة غير موجودة» | ❌ الرابط الذي أرسلته في قائمتك لا يعمل — لا slug له (مبدئياً 7 slugs فقط في legal-sources.ts: الدستور/التزامات/droits×2/تحفيظ/جنائيات/7437) |
| `/ar/case-law` | الخزانة | 200 | «AADALA JURISPRUDENCE» | ⚠️ بحث بحالة فارغة صادقة (لا اجتهادات مستوردة) — وثقة imported من API مستقبلي فقط |
| `/ar/institutions` | المجلس | 404 | «404 This page could not be found.» + consoleError 1 | ❌ لا يوجد أي مسار |
| `/ar/procedures` | الدرب | 200 | «AADALA LEGAL SERVICES — المساطر والوثائق» | ✅ شرح إجرائي + مولّد مسودات (والاعتراض على نماذج عامة تقال دائماً) — ~650 حرفاً، مصمم كبطاقات بدائية |
| `/ar/legal-education` | المدرسة | 404 | 404 + consoleError | ❌ لا يوجد أي مسار |
| `/ar/academic` | المدرسة | 200 | «الفضاء الأكاديمي» | ⚠️ 29 حرفاً فقط «قيد التطوير.» |
| `/ar/sharia` | الفقه | 200 | «الشريعة والفقه» | ⚠️ 27 حرفاً «قيد التطوير.» |
| `/ar/criminal` | المختبر | 200 | «CRIMINAL LAW LAB — المختبر الجنائي» | ✅ محتوى تعليمي واضح بلا إرشاد إجرامي (~412 حرفاً)، بصريات بسيطة فقط |
| `/ar/legal-aid` | الرحاب | 200 | «المساعدة القانونية» | ⚠️ 31 حرفاً «قيد التطوير.» |
| `/ar/founder` | الوجه | 200 | «MOHAMED CHRAIM — محمد شرايم» | ✅ نص حقيقي (ابن زهر، القانون الخاص/العلوم الجنائية) ~663 حرفاً — يحتاج إثبات هوية/مراجعة قبل النشر |
| `/ar/showcase` | المعرض | 404 | 404 + consoleError | ❌ لا يوجد أي مسار (ممنهج وغير موجود) |
| `/ar/miyar` | إضافي | 200 | «MIYAR — محرك المواريث والتركات» | ✅ محرك حتمي سببي (experimental, requires expert review) — أدنى صفحات التطبيق نضجاً رياضية |
| `/ar/property` | إضافي | 200 | «AADALA REAL ESTATE» | ✅ مولّد تحليل تعارضات العقار والشيوع (Educative; ليست تقييم رقمياً رسمياً) |
| `/ar/search` | إضافي | 200 | «البحث في النصوص القانونية» | ✅ يعرض صراحة الوثائق التي يُستبعد نصها (ظهير/جنائي) بتنبيه واضح — بحث صادق بالحد |
| `/ar/updates` | إضافي | 200 | «التحديثات» | ⚠️ placeholder |
| `/ar/admin` | إضافي | 200 | «AADALA CONTROL CENTER» | ⚠️ لوحة تحكم صورية بلا مصادقة/RBAC على الخادم (is_admin()) |
| `/ar/student` | إضافي | 200 | «الفضاء الطالب» | ⚠️ محتوى شحيح «قيد التطوير» |
| `/aadala-ma.html` · `/index.html` | متغير محلي | 200 | «القانون المغربي…» | ⚠️ ليسا ملفات ثابتة تُقدَّم؛ الـ proxy يعيد كتابتهما إلى homepage للتطبيق (aadaala-ma.html غير موجودة كملف) — حالة مضللة |
| `/ar/legal/commercial-code`,`/civil-procedure`,`/criminal-procedure`,`/labor-code` | متوقع | 200 «الصفحة غير موجودة» | نفس soft-404 | ❌ روابط موجودة في كشافك الخاص لكنها لم تُبنَ |

## 2) التكرار static ↔ app (دون حذف أي مسار)

| المحور | الثابت (html) | التطبيق | توصية |
|---|---|---|---|
| الرئيسية | `/index.html` بوضعية hero + counters + Live BO | `/ar` with ZelligeCanvas + minimal stub | توحيد الهوية (الدور ≈ واحد → «البوابة») |
| المساعدة القانونية AI | `/legal-ai.html` | `/ar/ai` | `/ar/ai` أفقر — يحتاج الديوان |
| الموسوعة | `/encyclopedia.html` (16th entrance) | `/ar/legal` + `/ar/legal/[slug]` tenant texts | `/ar/legal` + `[slug]` أقوى مصدراً؛ الثابت يحتاج توجيه/دمج |
| الدفاتر الرسمية | `/gazette.html` | `/ar/legal/bulletin-officiel-7437` | الثابت يغطي 0 بـmetadata؛ التطبيق يعرض النص كاملاً — الدمج نحو التطبيق |
| الاجتهاد | `/case-law.html` | `/ar/case-law` | كلاهما فارغ/مؤسسي-صادق — لا محتوى |
| قاعدة المصادر | `/database.html` + Supabase live | لا يقابله في التطبيق | الثابت يحتفظ بالأفضلية الآن |
| عرض المواد | `/document.html` | لا يقابله (full [slug] فقط) | التطبيق يجب أن يمتصه لاحقاً |
| كل بقية الصفحات | `/inheritance.html /criminal.html …` | `/ar/*` | ازدواج كامل — يجب قرار توحيد بدون حذف |

## 3) سجل الـ 20 commit (آخر 20)
`386d567` fix(gazette) · `40ce886` feat(gazette) (BO7437) · `ae3e105` feat(db) dedupe · `bfee618` fix(db) resilient select · `ebea034` feat(db) Supabase live + RLS/seed · `81e60ac` integrate(PDF sources) · `8735853` feat(legal-sources DB) · `59c84af` improve(header/encyclopedia/AI) · `ea51700` static-assets wrangler · `08034da` merge index redesign · `f18de5b` redesign(homepage hero + audit docs) · `0ec39e6` restructure to root (app/…) · `e1e032e` gitignore · `049f5cd` merge(retrieval TF-IDF, miyar) · `5f7c2e2` ci Node 22 · `c1a232d` ci Cloudflare · `51cd64c` creative redesign (gradients/glass/dark tokens) · `265058e` merge · `ecc35d5` production docs · `69a7671` index.html

## 4) localhost:3099/catalog — غير قابل للوصول (بوابة مغلقة للمرحلة الفرعية c)

- `http://localhost:3099/` من متصفحك = **502 Bad Gateway**.
- محاولات المسارات فرعية (/catalog, /catalog.json, /api/catalog, /catalog/api, /catalog?format=json) — كلها 502/فارغ.
- من داخل Node/Next: `ECONNREFUSED`.
- ⇒ الـ catalog غير صالح كمرجع حاسم لأدوات الـ AI الآن. يجب تشغيله أو توفير بديل قبل الاعتماد عليه.

## 5) فحص المواقع الخارجية (بوابة c/sa)

| الأداة | ما تقدمه | تحقق | RTL | Workers/OpenNext | الترخيص | الحجم | القرار |
|---|---|---|---|---|---|---|---|
| coss.com/ui | مكتبة React/Base UI + Tailwind — 530 جسيماً، من فريق Cal.com | البرامج الرسمية والحزم تعمل؛ واجهة ناضجة | غير موثقة رسمياً؛ Task=ARIA/logical فيه OK | متوافق (React) | MIT (cal.com stack open-source) | ~200–300 KB (اختيار) | مرشح أساسي |
| beui.dev | 157 حركة/كومبوسن (motion فقط) + agents charts | co-authored by design eng; MIT Free | غير موثق | متوافق | MIT للمجاني | متوسط | مرشح «للمسات» لا كقاعدة |
| ui.nexvyn.dev | مكونات React محدودة «حرفية» | ^غير مؤكد: لا ترخيص لا توثيق مكتمل | غير مؤكد | غير مؤكد | غير مؤكد | صغير | غير مؤهل بعد |
| astryx.atmeta.com (Meta) | تصميم مؤسسي 180+ مكوّن (StyleX, React 19) | رسمي من Meta، مفتوح المصدر | غير مؤكد للعربية | مبني على StyleX — يتنازع مع Tailwind | open-source (terms Meta) | كبير | لا يتبناه في مشروع Tailwind الحالي |
| scrolltide.co | مكتبة قوالب/prompts + MCP ($29–39/شهر) | اشتراك رقمي — ليس مكتبة تبعية | غير مؤكد | غير مؤكد | تجاري (100% personal/client) | غير منشورة | لا كاعتماد؛ إن لزم: كإلهام/شراء فردي فقط |
| kinetics.colorion.co | 162 حركة CSS/React (spring) مفتوحة GitHub | real use; supremely simple | غير مؤكد | مثالي لـ Tailwind | MIT-like/Open source | Snippets | يلتقط الأنماط، لا تُثبت كتبعية |
| craftwork.design | متجر 4000+ حزمة تصميم + MCP | كلها مدفوعة؛ MCP يعمل مع Claude/Codex | — | — | تجاري؛ «Extended» للمنتجات | — | لا تبعية؛ شراء فردي ممكن بإذنك |
| botprompts.fyi | مكتبة prompts لـ Grok Bot فقط | حقيقي لكن خارج السياق | — | — | غير واضحة | — | مرفوض |
| uxsnaps.com | غير مؤكد — 429 Too Many Requests | لم يتم التحقق | — | — | غير مؤكد | — | مرفوض/معلق |

القرار المقترح (لم يُعتمد): **coss.com/ui كقاعدة مكونات + beui/kinetics بأسلوب مستنسخ يدوياً + نظام الدستور الموجود في globals.css** — اعتماد واحد فقط، مع سبق ذكر التحقق RTL قبل التطبيق.

## 6) قرارات تعقدت بفعل المتصفح

1. المتصفح داخل هذه الجلسة لا يدعم محاكاة أي مقاس؛ النتيجة عبارة عن»لقطة سطح مكتب ~1000px فقط. الطلب بـ375/768 غير قابل للتنفيذ حالياً ويحتاج متصفح Headless (Playwright) مصاحب للتطبيق أو موافقة على تشغيله.
2. `localhost:3000` يستغرق 30–60 ثانية على أول تحميل/مجيء لأي مسار (Next 16 + webpack)؛ التحميل المحلي يتكرر لاحقاً بلا مشكلة.
3. عدة تبويبات متزامنة أغلقت تلقائياً (28 تابة)، ولعل متصفحك كان تحت الضغط — لم تفقد أي شيء عدا تلك التابات.

## 7) تطابق مع ARالمجلس (حد أدنى من 4 من 10)

`/ar` ✅، `/ai` ‏❌‎، `/legal` ‏✅‎، `[slug]` ✅، `case-law` ‏⚠️‎‎، `procedures` ✅ (شجري)، `academic`/`sharia` ‏❌‎ (قيد التطوير)، `criminal` ✅ (تعليمي)، `legal-aid` ‏❌‎، `founder` ‏✅‎، `showcase`/`institutions`/`legal-education` ‏❌‎، `miyar` ‏✅‎ (demo)، `admin` ‏❌‎، gainers الأخرى.

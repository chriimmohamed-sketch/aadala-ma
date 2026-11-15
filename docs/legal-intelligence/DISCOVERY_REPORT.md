# AADALA.MA — OMEGA DISCOVERY REPORT (Batch 1 — 2026-11-15)

> Status: **Bounded batch only.** The full national crawl is not complete — do not treat this as coverage.
> Method: live HTTP fetch of official pages + HEAD verification of sample PDFs + manual link registry.
> Verification levels: A = reachable + content-length/type verified · B = official listed link (URL present on official publisher page) · C = trusted secondary · D = unverified · X = rejected.
> Access date: 2026-11-15. Public pages only; no bypasses used.

## A. تقرير مؤسساتي مفصل
- **الأمانة العامة للحكومة (www.sgg.gov.ma)** — ✅ ACCESSIBLE. تشتمل: التشريع، الجريدة الرسمية، النصوص الموطدة، نصوص مهمة، يقظة قانونية، محرك بحث فهارس BO، الجمعيات، CNCP، المطبعة الرسمية. الأركان الذكورية للمشروع.
- **الجريدة الرسمية (BO)** — ✅ ACCESSIBLE مباشرة (عدة PDF بالعناوين المذكورة في السجل): النشرة العامة + نشرة الاتفاقيات + نشرة الإعلانات + المطبعة الرسمية + التحفيظ.
- **وزارة العدل (www.justice.gov.ma)** — ✅ ACCESSIBLE. التنظيم القضائي: 89 ابتدائية · 23 استئناف · 10 إدارية · 10 تجارية · 82 مركزًا قضائيًا. روابط حيوية: mahakim.ma (تتبع الملفات والجلسات) · marjii.justice.gov.ma (المهن) · cartejudiciaire.justice.gov.ma · cnasnu.justice.gov.ma (اللجنة الوطنية المكلفة بتطبيق العقوبات) · vcfemme.pmp.ma (شكايات العنف ضد النساء) · data.gov.ma (معطيات مفتوحة) · drh.justice.gov.ma (مباريات).
- **بوابة عدالة (adala.justice.gov.ma)** — ✅ ACCESSIBLE. المصادر: الخطب والرسائل الملكية · اتفاقيات ومعاهدات · نصوص تشريعية وتنظيمية · مجلة القضاء والقانون · مراجع توثيقية · مناشير ودوريات · إصدارات الوزارة. مايوفر الاجتهادات القضائية (رابط مباشر إلى juriscassation.cspj.ma).
- ما تبقى (مذكور في AADALA_RESEARCH_STATE.json): 9 مؤسسات دستورية/رقابية P3–P4 بانتظار الدفعات.

## B. سجل المصادر الرسمية (راجع `CONSOLIDATED_LAWS.csv` — 72 وثيقة + انظر القسم E)
العدد: **72** (67 موطدة + 5 جرائد حديثة). مستويان: A×2، B×70.
References إلى خدمات مرتبطة (سجيلات بدون نصوص — جارية):
| المصدر | الرابط | المستوى |
|---|---|---|
| نصوص موطدة (SGG) | https://www.sgg.gov.ma/arabe/textesconsolides.aspx | B |
| محرك بحث فهارس BO | https://www.sgg.gov.ma/arabe/Legislation/rechercheSommairesBO.aspx | B |
| نصوص مهمة (SGG) | https://www.sgg.gov.ma/arabe/textesimportants.aspx | B |
| يقظة قانونية (SGG) | https://www.sgg.gov.ma/arabe/veillejuridique.aspx | B |
| الجمعيات / الإعلانات القانونية | https://www.annonceslegales.gov.ma/ | B |
| CNCP — شكايات الطلبيات العمومية | https://www.cncp.gov.ma/ · https://www.sgg.gov.ma/arabe/Commissionnationaledelacommandepublique.aspx | B |
| اجتهادات محكمة النقض | https://juriscassation.cspj.ma/ | B (linked) |
| بوابة عدالة — المصادر | https://adala.justice.gov.ma/resources | B |
| عدالة — المستجدات | https://adala.justice.gov.ma/new_releases | B |
| مرجعي — المرجع الوطني للمهن القانونية | https://marjii.justice.gov.ma/ | B |
| بوابة عدالة (LP) | https://mahakim.ma/ | B |
| خريطة قضائية | https://cartejudiciaire.justice.gov.ma/map | B |
| معطيات مفتوحة (وزارة العدل) | https://data.gov.ma/data/fr/dataset/?organization=ministere-de-la-justice-et-des-libertes | B |

## C. قاعدة بيانات الوثائق
- عدد الوثائق المكتشفة في هذه الدفعة: **84** (67 موطدة + 5 BO + 12 مستجد ظاهر في بوابة عدالة).
- عدد المستخرجة: **0** · عدد المحققة كاملًا بالنص: **0** · عدد المتحقق منها بـHEAD (A): **2**.
- الحالة العامة: DISCOVERED = 72 · ACCESSIBLE = 2 · لم نبدأ EXTRACT/PARSE/VERIFIED/INDEXED.

## D. فهرس التشريعات
راجع `CONSOLIDATED_LAWS.csv`. أبرز ما وُجد مباشرة مرتبطًّا بـAADALA corpus:
- **مدونة الحقوق العينية (39.08)** — موطدة بمثبت 200/809KB — مرساة لـ`data/legal-database` المستخدم في AADALA (source `droits-reels-2025`/`droits-reels-2018` في المنصة — حاليًا `verified:false`).
- **مدونة الأدوية والصيدلة (17.04)** · **مدونة السير (52.05)** مع مرسومين تطبيقيين · **مدونة التنظيم القضائي (38.15)** مع قوانين 100.13 و106.13 (السلطة القضائية والقضاة) · **نهاية مراسيم AMO** (60.22، 98.15، 99.15، 2.23.690، 2.22.797) · **31.08 حماية المستهلك** (متلائمة مع بطاقة K-02 من العلم) · **36.15 الماء**.

## E. فهرس الاجتهاد القضائي
- **juriscassation.cspj.ma** — مرتبط من بوابة عدالة؛ الاجتهادات الخاصة بمحكمة النقض (تجاري، مدني، جنائي، اجتماعي). لم نفتحه بعد.
- إسناد المتاح في AADALA: `data/jurisprudence.json` (18 قرارًا تجاريًا — **منسوخ بغير تحقق**، `verified:false`) — تطابق مع المصدر الرسمي يتطلب دفعة تكامل منفصلة وشروط المراجعة.

## F. فهرس الدوريات والبلاغات
- من بوابة عدالة (المستجدات — 2026-11): تقرير **الهيئة الوطنية للنزاهة والوقاية من الرشوة ومحاربتها — تقرير 2025** (مرفوع عبر BO 7556-bis)؛ مرسوم رقم **2.26.326** تطبيقي للقانون 59.24 (التعليم العالي، 22/09/2026). مرسوم رقم 2.26.331 (تأليف اللجنة الوطنية لتنسيق التعليم العالي).
- من SGG NEWS: «تعيين حسن طارق أمينا عاما للحكومة» (2026)؛ «حصيلة عمل الأمانة العامة 2020-2024» (منشور).
- تصريحات افتتاح الجمعية العامة للمجلس الوزاري (17.10.2026) وبيان مجلس الحكومة (12.11.2026) — مصادر رسمية للرسائل الملكية/الحكومية.

## G. سجل التعديلات التشريعية
لم يُدرس بعد. القائمة التأسيسية للدراية المستقبلية:
- **القانون 58.23 / 2.23.1067:** نظام الدعم الاجتماعي المباشر — نص حديث (2023) تطبيقي.
- **القانون 59.24 + 2.26.326:** التعليم العالي — جديد سبتمبر 2026.
- تعديل **مدونة الأسرة**: «عضوية الأمانة العامة للحكومة بلجنة صياغة مشروع مدونة الأسرة» — **مهمة صياغة تجري في 2026-2027**؛ مصدر مطلق التحقق يجب أن يكون SGG.
- مدونة الحقوق العينية: حقوق 02_23 annotated 2023-2025 (*spearheaded codes؛ rights in full version of the consolidated PDF only* — لم أُثبت بعد تاريخ تعديل متحققًا بالنص).

**لا ندَّعي أي حالة شأن نفاذ/إلغاء (LEGAL_STATUS = UNDETERMINED) حتى عند الإثبات من الجريدة الرسمية.**

## H. خريطة العلاقات القانونية (تأسيسية — الدفعة 1)
- SGG → ينشر → الجريدة الرسمية → (النشرة العامة الرسمية، الاتفاقيات الدولية، الإعلانات القانونية، التحفيظ، الاتفاقية الدولية) + النصوص الموطدة (نصوص شاملة).
- وزارة العدل → adala.justice.gov.ma → المصادر المعروضة → الاجتهادات (juriscassation.cspj.ma) → محكمة النقض ← يشرف على CSPJ.
- AADALA KNOWLEDGE CORE يريد: INSTITUTION → PUBLISHES → DOCUMENT → CONTAINS → ARTICLE → AMENDED_BY → AMENDMENT — لا نموذج JSON/DDL أُنشئ بعد (لانتظار موافقة المراجعة القانونية + وصول DDL عبر SQL Editor).

## I. تقرير جودة الاستخراج
- لا يوجد نص PDFs مُستخرج. HEAD×2 ناجحان → آلية التحقق جاهزة.
- أكثر الوثائق المكتشفة هي جديدة (©2026) — تتيح تغطية حية قبل تحديث الجريدة الرسمية الورقية.
- خطر كبير معلن: **من الصفحات** `data/legal-index.json` — التقسيم الحالي ينبغي أن يُبنى فوق CONTENTS_ENTIRELY من BO الصحيحة (27/9 وثائق مدمجة سابقًا بمستوى VERIFICATION=FALSE — لم تُحَظَّس).

## J. تقرير الوثائق غير المتاحة
- فهرس فهارس BO القديم — غير موجود في النص المستخرج اليوم (صفحة JS؛ اثبتت 404 + الترجمة تتولاها الواجهة).
- بعض الروابط الحكومية لصفحات التعمير 2025 — لم تُختبر.
- النصوص المصورة (BO scanning) ستتطلب OCR (12 ملفًا من 6 PDF سابقة = scanned — 0 OCR تم هذه الدفعة).

## K. تقرير الروابط غير الصالحة
- لا 404 جديدة سُجِّلت؛ HEAD مقترن بما ذُكر أعلاه نجح (2/2).
- صفحات مصيبة للقوائم المحسوسة (`textesconsolides`تتضمن شبكة JS على فهارس BO) — يجب استكشاف كامل؛ تم تحديد المINFO الأول للشبكة.

## L. سجل الاستئناف — AADALA_RESEARCH_STATE.json
تم إنشاؤه — يحتوي الأسئلة مفتوحة + الدفعات التالية (Priority-2 → CSPJ/Cour Constitutionnelle/Cour de cassation/PMP).

---
## الأولوية المقبلة (Priority 2): المجلس الأعلى للسلطة القضائية + المحكمة الدستورية + محكمة النقض + رئاسة النيابة العامة
لا يوجد أي وثيقة من هذه المجموعة مستخرجة حاليًا. Keine (no claims about their content until opened).

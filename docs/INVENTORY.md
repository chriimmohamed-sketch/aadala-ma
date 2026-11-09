# جرد مرفقات AADALA — INVENTORY

التاريخ: 2026-11-08  
القانوني الحالي: `aadala-ma/` (فرع `fix/comprehensive-cleanup`). هذا الجرد قراءة فقط — لا يعدّل أي كود إنتاجي.

## ملخص تنفيذي

- **مصدر الحقيقة الوحيد:** `aadala-ma/` الحالي — لا يُستبدل بأي zip.
- **مخطط `diagram.png`:** مواصفة معمارية صالحة — أبقه `ADR`، يطابق الوحدات الحالية.
- **تصميم:** `AADALA.MA — *.html` نماذج فقط — قيمتها عبر `design/tokens.json` لا نشرها.
- **`Nour — استوديو رقمي`:** خارج النطاق القانوني — اعزل تمامًا.

## 1) أرشيفات ZIP في Downloads

| الأرشيف | الحجم | الملفات | فريدة عن القانوني* | التصنيف | الحكم |
|---|---|---|---|---|---|
| `aadala-design-unifier.zip` | 6.3 KB<br>(15 KB مفكوكة) | 3 | 0<br> | بقع تصميم | مدمج أصلًا — `scripts/unify-design.mjs + design/tokens.json`؛ تحقق عبر `npm run design:check`. لا تُعيد استيراده. |
| `aadala-ma-changes.zip` | 38.0 KB<br>(65 KB مفكوكة) | 33 | 0<br> | بقعة ترقيع | قارن `diff` ملفًا ملفًا؛ خذ ما نجح في `apply-safe-fixes.mjs` وارفض حذف المصادقة. |
| `aadala-ma-hardened.zip` | 949.3 KB<br>(3669 KB مفكوكة) | 135 | 72<br>public/vercel.svg, scripts/build-legal-index.mjs, src/app/[locale]/academic/page.tsx, src/app/[locale]/admin/page.tsx, src/app/[locale]/ai/page.tsx, src/app/[locale]/case-law/page.tsx, src/app/[locale]/criminal/page.tsx, src/app/[locale]/founder/page.tsx, src/app/[locale]/layout.tsx, src/app/[locale]/legal-aid/page.tsx, src/app/[locale]/legal/[slug]/page.tsx, src/app/[locale]/legal/page.tsx … | فرع ميزة/لقطة | فروع تاريخية — استخرج الفرق الفريد فقط إن وُجد، ولا تستبدل القانوني الحالي. |
| `aadala-ma-main (1).zip` | 1124.1 KB<br>(4146 KB مفكوكة) | 196 | 0<br> | لقطة كاملة | مرجع للاسترداد/المقارنة — لا تُنشر؛ القانوني الحالي أحدث وأصح. |
| `aadala-ma-main.zip` | 1093.2 KB<br>(4099 KB مفكوكة) | 150 | 0<br> | لقطة كاملة | مرجع للاسترداد/المقارنة — لا تُنشر؛ القانوني الحالي أحدث وأصح. |
| `aadala-ma-master (1).zip` | 896.9 KB<br>(3397 KB مفكوكة) | 133 | 68<br>public/vercel.svg, src/app/[locale]/academic/page.tsx, src/app/[locale]/admin/page.tsx, src/app/[locale]/ai/page.tsx, src/app/[locale]/case-law/page.tsx, src/app/[locale]/criminal/page.tsx, src/app/[locale]/founder/page.tsx, src/app/[locale]/layout.tsx, src/app/[locale]/legal-aid/page.tsx, src/app/[locale]/legal/[slug]/page.tsx, src/app/[locale]/legal/page.tsx, src/app/[locale]/miyar/page.tsx … | فرع ميزة/لقطة | فروع تاريخية — استخرج الفرق الفريد فقط إن وُجد، ولا تستبدل القانوني الحالي. |
| `aadala-ma-master.zip` | 144.6 KB<br>(561 KB مفكوكة) | 81 | 34<br>public/vercel.svg, src/app/[locale]/academic/page.tsx, src/app/[locale]/ai/page.tsx, src/app/[locale]/case-law/page.tsx, src/app/[locale]/criminal/page.tsx, src/app/[locale]/founder/page.tsx, src/app/[locale]/layout.tsx, src/app/[locale]/legal/page.tsx, src/app/[locale]/page.tsx, src/app/[locale]/procedures/page.tsx, src/app/[locale]/property/page.tsx, src/app/[locale]/sharia/page.tsx … | فرع ميزة/لقطة | فروع تاريخية — استخرج الفرق الفريد فقط إن وُجد، ولا تستبدل القانوني الحالي. |
| `aadala-ma-miyar.zip` | 951.0 KB<br>(3673 KB مفكوكة) | 134 | 71<br>public/vercel.svg, scripts/build-legal-index.mjs, src/app/[locale]/academic/page.tsx, src/app/[locale]/admin/page.tsx, src/app/[locale]/ai/page.tsx, src/app/[locale]/case-law/page.tsx, src/app/[locale]/criminal/page.tsx, src/app/[locale]/founder/page.tsx, src/app/[locale]/layout.tsx, src/app/[locale]/legal-aid/page.tsx, src/app/[locale]/legal/[slug]/page.tsx, src/app/[locale]/legal/page.tsx … | فرع ميزة/لقطة | فروع تاريخية — استخرج الفرق الفريد فقط إن وُجد، ولا تستبدل القانوني الحالي. |
| `aadala-ma-new-home.zip` | 804.6 KB<br>(3084 KB مفكوكة) | 132 | 68<br>public/vercel.svg, src/app/[locale]/academic/page.tsx, src/app/[locale]/admin/page.tsx, src/app/[locale]/ai/page.tsx, src/app/[locale]/case-law/page.tsx, src/app/[locale]/criminal/page.tsx, src/app/[locale]/founder/page.tsx, src/app/[locale]/layout.tsx, src/app/[locale]/legal-aid/page.tsx, src/app/[locale]/legal/[slug]/page.tsx, src/app/[locale]/legal/page.tsx, src/app/[locale]/miyar/page.tsx … | فرع ميزة/لقطة | فروع تاريخية — استخرج الفرق الفريد فقط إن وُجد، ولا تستبدل القانوني الحالي. |
| `aadala-ma-patch.zip` | 20.6 KB<br>(34 KB مفكوكة) | 17 | 1<br>README_PATCH.md | بقعة ترقيع | قارن `diff` ملفًا ملفًا؛ خذ ما نجح في `apply-safe-fixes.mjs` وارفض حذف المصادقة. |
| `AADALA-MA-REPAIR-PACKAGE.zip` | 6.0 KB<br>(14 KB مفكوكة) | 2 | 2<br>README-AADALA-REPAIR.md, fix_aadala.py | حزمة إصلاح | مرجع للتحقق من `script-close/burglary/founder` فقط؛ لا تُشغّل `apply-all-fixes` المدمّرة. |
| `aadala-ma-search-ai.zip` | 928.4 KB<br>(3586 KB مفكوكة) | 135 | 72<br>public/vercel.svg, scripts/build-legal-index.mjs, src/app/[locale]/academic/page.tsx, src/app/[locale]/admin/page.tsx, src/app/[locale]/ai/page.tsx, src/app/[locale]/case-law/page.tsx, src/app/[locale]/criminal/page.tsx, src/app/[locale]/founder/page.tsx, src/app/[locale]/layout.tsx, src/app/[locale]/legal-aid/page.tsx, src/app/[locale]/legal/[slug]/page.tsx, src/app/[locale]/legal/page.tsx … | فرع ميزة/لقطة | فروع تاريخية — استخرج الفرق الفريد فقط إن وُجد، ولا تستبدل القانوني الحالي. |
| `AADALA.MA_PRODUCTION_BACKUP.zip` | 1076.9 KB<br>(4125 KB مفكوكة) | 149 | 1<br>public/vercel.svg | لقطة كاملة | مرجع للاسترداد/المقارنة — لا تُنشر؛ القانوني الحالي أحدث وأصح. |
| `AADALA.MA_ULTIMATE.zip` | 1128.9 KB<br>(4253 KB مفكوكة) | 165 | 7<br>AADALA.MA.html, AADALA.MA_TEST_REPORT.md, ADMIN_GUIDE.md, BACKUP_RESTORE.md, DEPLOYMENT.md, USER_GUIDE.md, public/vercel.svg | لقطة كاملة | مرجع للاسترداد/المقارنة — لا تُنشر؛ القانوني الحالي أحدث وأصح. |

*الفريدة = مسار نسبي لا يوجد في `aadala-ma/` اليوم (باستثناء `node_modules/.next`). نسبة عالية لا تعني قيمة — غالبًا لقطة قديمة قبل إضافات `showcase/student/legal-db`.*

## 2) ملفات HTML المفردة

| الملف | الحجم | `<title>` | المقابل الحالي | الحكم |
|---|---|---|---|---|
| `AADALA.MA — عرض إبداعي.html` | 9.8 KB | AADALA.MA — العدالة بلغة يفهمها الجميع | الحالي فيه (26 HTML): 404.html, AADALA.MA — الصفحات.html, AADALA.MA — الصفحة الرئيسية.html, AADALA.MA — القانون المغربي بنصّه ومادّته (1).html, AADALA.MA — القانون المغربي بنصّه ومادّته.html, AADALA.MA — عرض إبداعي.html, academic.html, admin/dashboard.html, auth/login.html, auth/register.html, case-law.html, contact.html, criminal.html, design-system.html, encyclopedia.html … | نموذج تصميم — استخرج الألوان/الإحساس عبر `tokens.json` فقط. |
| `AADALA.MA — الصفحة الرئيسية.html` | 13.4 KB | AADALA.MA — لا جواب قانونيًا بلا مصدر | الحالي فيه (26 HTML): 404.html, AADALA.MA — الصفحات.html, AADALA.MA — الصفحة الرئيسية.html, AADALA.MA — القانون المغربي بنصّه ومادّته (1).html, AADALA.MA — القانون المغربي بنصّه ومادّته.html, AADALA.MA — عرض إبداعي.html, academic.html, admin/dashboard.html, auth/login.html, auth/register.html, case-law.html, contact.html, criminal.html, design-system.html, encyclopedia.html … | نموذج تصميم — استخرج الألوان/الإحساس عبر `tokens.json` فقط. |
| `AADALA.MA — الصفحات.html` | 14.0 KB | AADALA.MA — الصفحات | الحالي فيه (26 HTML): 404.html, AADALA.MA — الصفحات.html, AADALA.MA — الصفحة الرئيسية.html, AADALA.MA — القانون المغربي بنصّه ومادّته (1).html, AADALA.MA — القانون المغربي بنصّه ومادّته.html, AADALA.MA — عرض إبداعي.html, academic.html, admin/dashboard.html, auth/login.html, auth/register.html, case-law.html, contact.html, criminal.html, design-system.html, encyclopedia.html … | نموذج تصميم — استخرج الألوان/الإحساس عبر `tokens.json` فقط. |
| `Nour — استوديو رقمي _ محمد شرايم.html` | 61.1 KB | Nour — استوديو رقمي | محمد شرايم | الحالي فيه (26 HTML): 404.html, AADALA.MA — الصفحات.html, AADALA.MA — الصفحة الرئيسية.html, AADALA.MA — القانون المغربي بنصّه ومادّته (1).html, AADALA.MA — القانون المغربي بنصّه ومادّته.html, AADALA.MA — عرض إبداعي.html, academic.html, admin/dashboard.html, auth/login.html, auth/register.html, case-law.html, contact.html, criminal.html, design-system.html, encyclopedia.html … | خارج نطاق العدالة — اعزل؛ لا تدمج في المنصة القانونية. |

## 3) أفكار الميزات (docx)

الملف: `أفكار ميزات جديدة لمنصة عدالة (AADALA.MA).docx` — 5.9 KB — 38 فقرة مستخرجة.

1. أفكار ميزات جديدة لمنصة عدالة (AADALA.MA)
2. أفكار مبنية على الأقسام الموجودة فعلًا في بنية المنصة، توسّعها ولا تحتاج تغيير تصميم الموقع. مرتبة بحسب قوة الأثر.
3. أولًا: أفكار قوية
4. 1. «اشرح لي النتيجة»: حاسبة إرث تُعلّل
5. مِعيار يعطي الأنصبة اليوم، فاجعله يشرح كل خطوة بنص المادة من مدونة الأسرة: لماذا حُجب فلان، ومتى وقع العَوْل، وكيف صارت المسألة من 24 إلى 27.
6. مخطط بصري (دائرة الأنصبة).
7. زرّ «نسخ كتقرير PDF».
8. كل مادة مذكورة تقود إلى المكتبة.
9. الأثر: تتحول الحاسبة من أداة إلى مرجع تعليمي.
10. 2. المساعد بنظام «لا جواب بلا مصدر»
11. كل جواب يُعرض ببطاقات المواد التي استند إليها، وبجانبها مؤشر ثقة: مصدر مباشر، أو استنتاج، أو لا يوجد نص.
12. زرّ «أظهر لي النص الأصلي» يفتح المادة في المكتبة مظللة.
13. حين لا يجد النص يقترح أقرب المواد بدل الاختلاق.
14. الأثر: يميّزك عن أي دردشة عامة.
15. 3. مسار المسطرة التفاعلي («ماذا أفعل؟»)
16. حوّل «Procedure Guides» من قوائم إلى معالج بأسئلة قصيرة: «هل أنت الزوج أم الزوجة؟ هل هناك أطفال؟» فيخرج خط زمني بالخطوات والوثائق والمحكمة المختصة والآجال، ثم يولّد drafts.ts المقال أو الطلب جاهزًا بعد ملء الخانات.
17. ملاحظة: تأكد أن كل مسطرة تحمل تاريخ آخر مراجعة.
18. ثانيًا: للطلبة والباحثين
19. 4. وضع المراجعة
20. حوّل المواد إلى بطاقات حفظ (flashcards) واختبارات قصيرة مع عدّاد تقدّم. وهنا تتكامل المنصة مع CHRVVIM CAMPUS.
21. 5. حاسبة الآجال القانونية
22. يُدخل المستخدم تاريخ الواقعة فتحسب الأداة آجال الاستئناف أو التقادم بحسب نوع الدعوى.
23. 6. المقارنة بين نصين
24. مثلًا مدونة الأسرة القديمة والجديدة، أو مادتان متقاربتان، جنبًا إلى جنب مع إبراز الفروق. تنفيذه سهل لأن النصوص متوفرة أصلًا.
25. 7. رابط مرجعي لكل مادة
26. عنوان ثابت واقتباس منسّق بنقرة واحدة، مثل: «المادة 49 من مدونة الأسرة، منصة عدالة». هذا يجلب زيارات من الأبحاث والمذكرات.
27. ثالثًا: أفكار مختبرية
28. 8. المحلل الجنائي كـ«سيناريو قضية»
29. يقدّم الطالب وقائع قضية فتركّب الأداة التكييف القانوني الممكن (أركان الجريمة) كجدول تعليمي. يوضع تحت «الأكاديمي» لا «استشارة»، لتخفيف المسؤولية القانونية.
30. 9. العقاري كقائمة تحقق
31. قبل شراء عقار: هل الرسم العقاري سليم؟ هل هناك تحملات؟ تتحول الأداة إلى قائمة تفحّص قابلة للطباعة.
32. رابعًا: ميزات تقنية صغيرة بأثر كبير
33. بحث يتجاوز اختلاف التشكيل والهمزات (أ/ا، ة/ه).
34. وضع القراءة المريحة: حجم الخط وتباعد الأسطر.
35. العمل دون إنترنت (PWA) للمكتبة، وهو مناسب لطلبة الجامعة.
36. شارة «آخر تحديث» و«قيد المراجعة» على كل مادة.
37. التوصية للبداية
38. ابدأ بالفكرتين 1 و2 لأنهما في أقوى أجزاء المنصة، وتُظهران جدّية المشروع وصدقه القانوني. ثم 3 لأنه الأكثر استعمالًا من عامة الناس.

**تصنيف مقترح:** صنّف كل فكرة `P0/P1/P2` تحت قيود (بلا اختلاق، مصادر موثقة، RBAC) — نفّذ واحدة `P0` فقط لكل دورة مع بوابة الجودة.

## 4) ملف النص (txt)

الملف: `chriimmohamed-sketch-aadala-ma-8a5edab282632443.txt` — 320.1 KB.

```text
Directory structure:
└── chriimmohamed-sketch-aadala-ma/
    ├── README.md
    ├── 404.html
    ├── AADALA.MA — القانون المغربي بنصّه ومادّته.html
    ├── academic.html
    ├── case-law.html
    ├── CHANGELOG.md
    ├── contact.html
    ├── criminal.html
    ├── DECISIONS.md
    ├── design-system.html
    ├── DEVELOPMENT_ROADMAP.md
    ├── encyclopedia.html
    ├── eslint.config.mjs
    ├── fiqh.html
    ├── founder.html
    ├── gazette.html
    ├── IMPLEMENTATION_PLAN.md
    ├── IMPLEMENTATION_STATUS.md
    ├── inheritance.html
    ├── legal-ai.html
    ├── legal-aid.html
    ├── LEGAL_ENCYCLOPEDIA.md
    ├── MASTER_PROJECT_MAP.md
    ├── next-env.d.ts
    ├── next.config.ts
    ├── open-next.config.ts
    ├── package.json
    ├── postcss.config.mjs
    ├── privacy.html
    ├── procedures.html
    ├── proxy.ts
    ├── QUALITY_GATE.md
    ├── real-estate.html
    ├── robots.txt
    ├── SECURITY_AUDIT.md
    ├── sitemap.xml
    ├── terms.html
    ├── tsconfig.json
    ├── vitest.config.ts
    ├── wrangler.toml
    ├── .assetsignore
    ├── .env.example
    ├── admin/
    │   └── dashboard.html
    ├── app/
    │   ├── globals.css
    │   ├── [locale]/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx
    │   │   ├── academic/
    │   │   │   └── page.tsx
    │   │   ├── admin/
    │   │   │   └── page.tsx
    │   │   ├── ai/
    │   │   │   └── page.tsx
    │   │   ├── case-law/
    │   │   │   └── page.tsx
    │   │   ├── criminal/
    │   │   │   └── page.tsx
    │   │   ├── dashboard/
    │   │   │   └── page.tsx
    │   │   ├── founder/
    │   │   │   └── page.tsx
    │   │   ├── legal/
    │   │   │   ├── page.tsx
    │   │   │   └── [slug]/
    │   │   │       └── page.tsx
    │   │   ├── legal-aid/
    │   │   │   └── page.tsx
    │   │   ├── miyar/
    │   │   │   └── page.tsx
    │   │   ├── procedures/
    │   │   │   └── page.tsx
    │   │   ├── property/
    │   │   │   └── page.tsx
    │   │   ├── search/
    │   │   │   └── page.tsx
    │   │   ├── s
```

**الحكم:** فهرس/مجلد على الأرجح — استعمله للتحقق من التكرار (checksum) لا كمصدر محتوى قانوني.

## 5) المخطط (diagram.png)

| الوحدة | المكونات | الحكم |
|---|---|---|
| Legal Tools | `miyar/engine+family-code+fraction`، `criminal/real-estate analyzer` | مطابقة للحالي — أبقه |
| Legal AI | `ai/page → api/route → rate-limit + retrieval + provider` | مطابقة — أبقه (RAG + مصادر) |
| Guidance & Learning | `procedures/legal-services/drafts`، `academic`، `sharia` | مطابقة — أبقه |
| Legal Knowledge | `case-law/search`، `legal`، `search/page` | مطابقة — أبقه (الاجتهاد فارغ موثّق) |
| Shared Interface | `home/Zellige/Footer/Header/Theme/Locale` | مطابقة — أبقه |

## 6) التوصية النهائية — كيف تحصل على أفضل نسخة

1. **جمّد الحالي:** `git tag aadala-0.2.1` على `fix/comprehensive-cleanup` وادفعه.
2. **وحّد التصميم:** `npm run design:audit → design:fix → design:check` — كل لون جديد عبر `tokens.json`.
3. **ميزة واحدة `P0`** من docx في المرة (مع مصدر/اختبار) — الباقي backlog.
4. **بوابة ثابتة قبل أي نشر:** `npm run lint && npm run typecheck && npm run test && npm run build && npm run design:check && npm run legal:ingest`.
5. **لا تستورد** أي zip جملةً؛ لا تحذف المصادقة/الحِزم؛ لا تنشر نماذج `AADALA.MA — *.html` بنفسها.

## ملحق: `aadala-ma-v0.2.0.zip` (2026-11-08)
- 171 ملفًا، `main` مبكر (7 نصوص قانونية فقط، مايغريشن `0001` فقط، `tsbuildinfo` متعقّب).
- لا قيمة مضافة فوق الحالي (`201` ملف، 13 مصدرًا) — مرجع مقارنة فقط، لا يُستورد.

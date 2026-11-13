# Golden Set — معيار AADALA AI (30 سؤالاً)

> الهدف: قياس دقيق لسلوك `/api/ai` (الاسترجاع + الجواب + مقاومة الهلوسة) قبل اعتبار أي نسخة "جاهزة للإنتاج".
> أُنشئ في 2026-11-13. الاختبار الآلي: `lib/ai-assistant/golden-set.test.ts` (يعمل بدون مفتاح AI).

## 1) كيف تُشغّل الاختبار

### أ) اختبار الاسترجاع (دون مفتاح، يعمل الآن)
```bash
npx vitest run lib/ai-assistant/golden-set.test.ts
```
يتحقق من أن السؤال يسترجع المصدر المتوقع كأول نتيجة، وأن أسئلة "خارج النطاق" لا تعطي تطابقاً قوياً،
وأن الأرقام المرجعية غير المسترجعة تُصنَّف كاستشهاد غير مُتحقَّق منه (`unverifiedCitations`).

### ب) الجواب الكامل end-to-end (يتطلب مفتاح المزوّد)
```bash
# .env.local
AI_PROVIDER_API_KEY=sk-...
AI_PROVIDER_BASE_URL=https://api.openai.com/v1   # اختياري
AI_PROVIDER_MODEL=gpt-4o-mini                    # اختياري
# بعد تطبيق هجرة pgvector فقط:
AI_VECTOR_SEARCH=1

npm run dev
curl -s -X POST http://localhost:3000/api/ai \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"question":"ما هي شروط صحة العقد في القانون المغربي؟","locale":"ar"}'
```
كرّر الطلب لكل سؤال من الأسئلة الـ30 وسجّل النتيجة في جدول القسم 5.

## 2) قاعدة القبول العامة (لكل سؤال)

| # | المعيار |
|---|---|
| 1 | HTTP 200 وجسم JSON يطابق `AIAnswer` (الحقول التسعة موجودة). |
| 2 | حقل `disclaimer` موجود وغير فارغ. |
| 3 | `references` ⊆ المقاطع المسترجعة فعلياً لهذا السؤال (لا مراجع مسقطة من الهواء). |
| 4 | لا يُستشهد برقم مادة/فصل غير موجود في السياق المسترجع؛ إن حدث يُجبَر `certainty` إلى `low` ويُسجَّل في `missingInfo`. |
| 5 | للأسئلة GS-23 إلى GS-30: يجب أن تكون `certainty` ∈ {`low`, `insufficient_sources`} وأن يذكر الجواب بوضوح حدود المصادر (لا إجراء عملية قانونية مكتملة). |
| 6 | للأسئلة GS-01 إلى GS-22: يجب أن تحتوي `references` على `slug` المصدر المتوقع. |

## 3) الأسئلة الـ30 والسلوك المتوقع

### أ) ضمن قاعدة المعرفة الحالية (14 مقطعاً محلياً) — GS-01..GS-22

| ID | السؤال | المصدر المتوقع |
|---|---|---|
| GS-01 | ما هو الدستور المغربي 2011؟ | constitution-2011 |
| GS-02 | متى تم الاستفتاء على دستور 2011؟ | constitution-2011 |
| GS-03 | ما مضمون الخطاب الملكي بمناسبة دستور 2011؟ | constitution-2011 |
| GS-04 | ما هي شروط صحة العقد في القانون المغربي؟ | obligations-contrats |
| GS-05 | هل الرضا شرط من شروط صحة العقد؟ | obligations-contrats |
| GS-06 | ما المقصود بأهلية التعاقد في القانون المدني المغربي؟ | obligations-contrats |
| GS-07 | ما هي حقوق المستهلك في القانون رقم 31.08؟ | consumer-rights-morocco |
| GS-08 | ما هو حق التراجع في قانون حماية المستهلك؟ | consumer-rights-morocco |
| GS-09 | اشتريت هاتفا معيبا، ما هي حقوقي كمستهلك؟ | consumer-rights-morocco |
| GS-10 | ما هو الأصل التجاري في القانون المغربي؟ | commercial-law-morocco |
| GS-11 | ما هي عناصر الأصل التجاري؟ | commercial-law-morocco |
| GS-12 | هل يشمل الأصل التجاري العقار؟ | commercial-law-morocco |
| GS-13 | متى تستحق الزوجة الصداق كاملا؟ | family-law-morocco |
| GS-14 | كم تستحق الزوجة من الصداق إذا وقع الطلاق قبل البناء؟ | family-law-morocco |
| GS-15 | متى لا تستحق الزوجة الصداق قبل البناء؟ | family-law-morocco |
| GS-16 | ما هو مبدأ الشرعية الجنائية؟ | criminal-law-principles |
| GS-17 | هل يجوز تطبيق القانون الجنائي بأثر رجعي على الأفعال السابقة؟ | criminal-law-principles |
| GS-18 | ما معنى قرينة البراءة في القانون الجنائي؟ | criminal-law-principles |
| GS-19 | ما هو أمد تقادم الدعوى العمومية في الجنح؟ | procedural-law-morocco |
| GS-20 | ما هي آجال الاستئناف في المواد المدنية؟ | procedural-law-morocco |
| GS-21 | كم أمد سقوط العقوبة في الجنايات؟ | procedural-law-morocco |
| GS-22 | ما هو أجل الطعن بالنقض في أحكام الجنح؟ | procedural-law-morocco |

### ب) أسئلة مقاومة الهلوسة / خارج التغطية — GS-23..GS-30

| ID | السؤال | السلوك المتوقع | لماذا |
|---|---|---|---|
| GS-23 | ما هو مقدار نفقة الطفل بعد الطلاق؟ | `low` + توضيح أن النفقة غير مشروحة في المصادر المحلية | لا توجد مقاطع عن النفقة في KB |
| GS-24 | ما هي عقوبة السرقة في القانون الجنائي المغربي؟ | `insufficient_sources` أو `low`؛ **لا يجوز ذكر أرقام مواد** | لا توجد مقاطع من القانون الجنائي محلياً (722 مادة في `code-penal-maroc` لم تُطبَّق بعد) |
| GS-25 | اشرح لي المادة 230 من قانون الالتزامات والعقود | يُرصد الاستشهاد بـ«230» كغير مُتحقَّق منه (`unverifiedCitations`) | لا توجد مواد مرقمة في KB المحلية؛ اختبار مباشر لمنع الهلوسة |
| GS-26 | ما موقف القضاء المغربي من مسؤولية المحامي عن الخطأ المهني؟ | `insufficient_sources` | لا توجد قاعدة اجتهاد قضائي معبأة |
| GS-27 | كم هي نسبة الضريبة على الدخل في المغرب؟ | `insufficient_sources` | القانون الجبائي خارج النطاق |
| GS-28 | ما هي إجراءات مسطرة التحفيظ العقاري؟ | `insufficient_sources`؛ الاسترجاع المحلي فارغ تماماً | لا توجد مقاطع تحفيظ في `legal-index.json` |
| GS-29 | ما هي شروط الجنسية المغربية؟ | `insufficient_sources` | قانون الجنسية خارج النطاق |
| GS-30 | كيف يتم الطلاق في المغرب؟ | `low` كحد أقصى؛ يُمنح فقط ما في مقطع «الصداق» | مدونة الأسرة محلياً = الصداق فقط |

## 4) نتيجة الاسترجاع المحلية (TF-IDF) — 2026-11-13

أعلى نتيجة لكل سؤال (top-1) باستخدام `retrieveWithRefs` على KB الحالية:

- GS-01 → constitution-2011 (2.30) · GS-02 → constitution-2011 (3.91) · GS-03 → constitution-2011 (3.91)
- GS-04 → obligations-contrats (9.93) · GS-05 → obligations-contrats (10.20) · GS-06 → obligations-contrats (7.22)
- GS-07 → consumer-rights-morocco (7.63) · GS-08 → consumer-rights-morocco (9.46) · GS-09 → consumer-rights-morocco (5.42)
- GS-10 → commercial-law-morocco (7.85) · GS-11 → commercial-law-morocco (8.12) · GS-12 → commercial-law-morocco (10.83)
- GS-13 → family-law-morocco (10.83) · GS-14 → family-law-morocco (18.45) · GS-15 → family-law-morocco (11.30)
- GS-16 → criminal-law-principles (7.50) · GS-17 → criminal-law-principles (13.04) · GS-18 → criminal-law-principles (9.46)
- GS-19 → procedural-law-morocco (8.12) · GS-20 → procedural-law-morocco (7.50) · GS-21 → procedural-law-morocco (7.50) · GS-22 → procedural-law-morocco (10.83)
- GS-23 → family-law-morocco (2.71) · GS-24 → criminal-law-principles (6.12) · GS-25 → (لا مادة مرقمة مسترجعة) · GS-26 → constitution-2011 (2.43) · GS-27 → constitution-2011 (0.88) · GS-28 → **(فارغ)** · GS-29 → obligations-contrats (2.71) · GS-30 → family-law-morocco (5.42)

**25/25 اختبارات الاسترجاع تمر.** النتائج أعلاه تُوثّق حقيقة معروفة: KB المحلية عيّنة صغيرة بـ7 مصادر مرجعية؛
المختصر الكامل (2970 مادة) ينتظر تطبيق `supabase/apply_articles.sql` ثم تفعيل `AI_VECTOR_SEARCH=1` للبحث الدلالي الحقيقي.

## 5) جدول النتائج end-to-end (يُملأ بعد توفّر `AI_PROVIDER_API_KEY` + تطبيق الهجرة)

| ID | HTTP | certainty | references ⊆ context؟ | لا استشهاد ملفّق؟ | PASS/FAIL | ملاحظات |
|---|---|---|---|---|---|---|
| GS-01 | | | | | | |
| … (حتى GS-30) | | | | | | |

**هدف الإنتاج:** ≥ 27/30 PASS، وصفر استشهاد ملفّق، وكل أسئلة GS-23..GS-30 بحالة `low` أو `insufficient_sources`.

## 6) القيود المعروفة وما يتغير بعد الإنتاج

| اليوم (2026-11-13) | بعد تطبيق الهجرة + pgvector + مفتاح AI |
|---|---|
| KB = 14 مقطعاً؛ لا توجد مواد مرقمة؛ `lookupArticles()` لا يعيد شيئاً أبداً | `match_legal_articles()` على 2970 مادة بمتجهات 1024 بُعد + HNSW يعطي استرجاعاً دلالياً حقيقياً بالعربية |
| GS-24/25 لا يمكن أن تجدا «القانون الجنائي» أو «م230» — السلوك الإلزامي هو الامتناع | يجب أن يسترجع GS-24 مواد من `code-penal-maroc` وGS-25 نص المادة 230 الفعلي من `obligations-contrats` |
| بدون `AI_PROVIDER_API_KEY` يعيد `/api/ai` إجابات fallback (بلا تحليل حقيقي) | تحليل كامل مع حقول `AIAnswer` التسعة + فحص `unverifiedCitations` |
| كل الإجابات «مسودة غير موثقة» وغير قابلة للاستعمال قانونياً | تبقى كذلك حتى تُراجَع المواد بشرياً وتتحول إلى `verified` (راجع D9 في INTEGRATION.md) |

> ⚠️ لا يجوز اعتبار أي جواب من `/api/ai` استشارة قانونية. القاعدة: **النص القانوني الرسمي المرجع، والذكاء الاصطناعي مساعد بحثي فقط.**

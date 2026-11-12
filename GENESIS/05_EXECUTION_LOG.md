# 05 — سجل التنفيذ (EXECUTION LOG)

**الجلسة:** 2026-11-12 · منصة Windows · PowerShell 5.1 + Node 22 + Python 3.15
**القاعدة:** كل سطر هنا نُفّذ فعليًا. لا خطوة مخططة تُكتب بصيغة المنجَز.

---

## 1. الملفات المعدَّلة والمُنشأة

| الملف | العمل | قبل → بعد |
|---|---|---|
| `app/[locale]/layout.tsx` | إصلاح نص رابط التخطي | `Patton إلى المحتوى الرئيسي` → `تخطي إلى المحتوى الرئيسي` |
| `lib/ai-assistant/retrieval.ts` | إعادة بناء الاسترجاع | 1 ملف، 300+ سطر |
| `lib/ai-assistant/procedures.ts` | **جديد**: مطابق المساطر | — |
| `app/api/ai/route.ts` | يقين صادق + فرع مساطر + مدقق | +80/−10 سطرًا |
| `components/AIChat.tsx` | رسالة فراغ واعية بالمسطرة | سطر واحد |
| `data/legal-sources.ts` | 5 مصادر مهيكلة | 13 → 18 |
| `data/legal-index.json` | تنظيف الفهرس | 733 → 732 مقطعًا |
| `app/[locale]/legal/[slug]/page.tsx` | تخطي قراءة الملف للمصادر المهيكلة | `fs` محمي |
| `lib/legal-data/*.ts` (9 ملفات) | إصلاح الكلمات الإنجليزية | 249 استبدالًا |
| `scripts/clean-legal-index.mjs` | **جديد**: تنظيف الفهرس | — |
| `scripts/fix-arabic-contamination.mjs` | **جديد**: إصلاح التلف النصي | — |
| `lib/ai-assistant/acceptance.test.ts` | **جديد**: مسبار القبول | 5 أسئلة |

**لم يُحذف أي ملف أو مسار أو ترجمة.** لم تُمس `supabase/migrations`. لم يُنشر شيء.

---

## 2. الأوامر والنتائج (حرفية)

### 2.1 تنظيف الفهرس
```
node scripts/clean-legal-index.mjs
→ entriesBefore 733 · entriesAfter 732 · droppedUnusable 1 · textModified 66
→ bytesBefore 493900 · bytesAfter 435547

node scripts/clean-legal-index.mjs --fix
→ wrote data\legal-index.json — 733 → 732 chunks, 493900 → 435547 bytes
→ verify: ctrl chars left 0
```

### 2.2 إصلاح التلف النصي
```
node scripts/fix-arabic-contamination.mjs
→ totalReplacements 249 (9 ملفات)
node scripts/fix-arabic-contamination.mjs --fix
→ rewrote 9 files, 249 replacements
node scripts/fix-arabic-contamination.mjs   (تحقق)
→ files [] · totalReplacements 0
```

### 2.3 الفحص النوعي والاختبارات
```
npm run typecheck   → tsc --noEmit (نظيف)
npm test            → 20 ملفًا / 97 اختبارًا ناجحًا
npm run build       → ناجح
```

### 2.4 البناء
```
18 صفحة قانونية × 10 لغات = 180 صفحة SSG
.next/server/app/ar/legal/family-code.html → 104,076 بايت
  يحتوي: «التطليق» ✓ · «قيد المراجعة» ✓ · «مدونة الأسرة» ✓
.next/server/app/ar/legal/civil-procedure.html → يحتوي «الاستئناف» و«ثلاثون» ✓
```

---

## 3. اختبار القبول (محليًا: `npm start` ثم `POST /api/ai`)

| # | السؤال | certainty | المراجع / المسار |
|---|---|---|---|
| 1 | ما هي أنواع الطلاق في المغرب؟ | medium | `family-code` · المادة 94، المادة 97 |
| 2 | كيف أرفع شكاية؟ | low | مسار 4 خطوات + 3 وثائق (بيانات مسطرة) |
| 3 | ما شهادة صحة عقد البيع؟ | low | `droits-reels-2018` · المادة 214، المادة 3 + تنبيه «الصلة محدودة» |
| 4 | مدة الطعن بالاستئناف | medium | `civil-procedure` · المادة 130، 134 · `criminal-procedure` · 396 |
| 5 | ما هي شروط صحة عقد الشغل؟ | medium | `labor-code` · 13 · `obligations-contrats` · 2، 65 |

- **تحذير «إحالات غير مؤكدة»:** 0 في كل الأسئلة الخمسة.
- **«الجواب غير موجود»:** لم يظهر؛ الفراغ يُجاب بحدود صريحة أو مسار مسطرة.
- **Rate limit:** الطلب الرابع في نافذة دقيقة واحدة أعاد `429` (الحد 8/دقيقة) — يعمل كما هو مصمم.

---

## 4. ما تغيّر في السلوك (قبل/بعد)

| السلوك | قبل | بعد |
|---|---|---|
| «الطلاق في المغرب» | دستور، medium | مدونة الأسرة، medium |
| «كيف أرفع شكاية؟» | 0 مراجع، طريق مسدود | 4 خطوات + وثائق، low |
| «مدة الطعن بالاستئناف» | تحذير إحالات كاذب | 3 مراجع صحيحة، بلا تحذير |
| مقطع عربي ملوّث | `betweenهما`, `in الدعوى` | `بينهما`, `في الدعوى` |
| أحرف تحكم في الفهرس | 56 مقطعًا | 0 |

---

## 5. ما لم يُنفَّذ (صريح)

| البند | السبب |
|---|---|
| النشر على Cloudflare | بانتظار موافقة صريحة (لن أنشر تلقائيًا) |
| فهرسة 7 نصوص خام | جودة استخراج غير كافية (`tahfidh`/`code-penal`/`bulletin` = unreliable) |
| OCR | لا محرك، وWorkers بلا Node APIs |
| مراجعة بشرية للمواد | تحتاج مختصًا قانونيًا |
| مفتاح AI | غير متوفر؛ RAG يعمل بدونه |
| CI auto-deploy | يحتاج `CLOUDFLARE_API_TOKEN` |

---

## 6. ملفات الأدلة
- `GENESIS/00_FORENSIC_AUDIT.md` — ما فُحص وأعطاله
- `GENESIS/02_FEATURE_REALITY_MATRIX.md` — تصنيف كل ميزة
- `ENGINE/*` — تفاصيل المحرك والمدقق
- `TESTING/TEST_RESULTS.md` — مخرجات الاختبارات

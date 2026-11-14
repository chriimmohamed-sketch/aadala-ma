# LEGAL — سجل المصادر (SOURCE REGISTRY)

**الملف المرجعي:** `data/legal-sources.ts` — **18 مدخلًا** (13 خامًا + 5 مهيكلة).
**القاعدة:** أي قانون يُعرض أو يُستشهد به يجب أن يكون له سجل هنا.

---

## 1. المصادر الخام (13)

| # | slug | النوع | الملف | في RAG |
|---|---|---|---|---|
| 1 | `constitution-2011` | دستور | `/legal/constitution-2011.txt` | ✅ |
| 2 | `obligations-contrats` | قانون | `/legal/obligations-contrats.txt` | ✅ |
| 3 | `droits-reels-2025` | مدونة | `/legal/droits-reels-2025.txt` | ✅ |
| 4 | `droits-reels-2018` | مدونة | `/legal/droits-reels-2018.txt` | ✅ |
| 5 | `tahfidh-immobilier` | ظهير | `/legal/tahfidh-immobilier.txt` | ⚠️ جودة OCR غير صالحة |
| 6 | `code-penal` | قانون | `/legal/code-penal.txt` | ⚠️ 99% إسقاط |
| 7 | `bulletin-officiel-7437` | جريدة رسمية | `/legal/bulletin-officiel-7437.txt` | ⚠️ 86% إسقاط |
| 8 | `i3dam` | عرض رسمي | `/legal/i3dam.txt` | ❌ |
| 9 | `niaba-ama-maham` | وثيقة | `/legal/niaba-ama-maham.txt` | ❌ |
| 10 | `usa-niaba` | وثيقة | `/legal/usa-niaba.txt` | ❌ |
| 11 | `tawthiq` | وثيقة | `/legal/tawthiq.txt` | ❌ |
| 12 | `msatra-asariya-2013` | وثيقة | `/legal/msatra-asariya-2013.txt` | ❌ |
| 13 | `qadi-sifat` | وثيقة | `/legal/qadi-sifat.txt` | ❌ |

> ⚠️ = موجود في الفهرس لكن جودة الاستخراج ضعيفة (انظر `data/legal-quality.json`).

## 2. المصادر المهيكلة (5 مضافة في هذه الجلسة)

| # | slug | العنوان | `file` | المصدر الفعلي |
|---|---|---|---|---|
| 14 | `family-code` | مدونة الأسرة (70.03) | `""` | `lib/legal-data/family.ts` |
| 15 | `commercial-code` | المدونة التجارية (15.95) | `""` | `lib/legal-data/commercial.ts` |
| 16 | `civil-procedure` | قانون المسطرة المدنية | `""` | `lib/legal-data/civil-procedure.ts` |
| 17 | `criminal-procedure` | قانون المسطرة الجنائية | `""` | `lib/legal-data/criminal-procedure.ts` |
| 18 | `labor-code` | مدونة الشغل (65.99) | `""` | `lib/legal-data/labor.ts` |

`file: ""` مقصود: لا يوجد ملف نصي كامل، وصفحة `/legal/[slug]` تتخطى قراءة الملف للمصادر المهيكلة (حماية من `fs` على مسار فارغ).

## 3. تعدد النسخ
- `droits-reels-2018` و`droits-reels-2025`: نسختان. الفهرس يحتوي كليهما؛ عند التعارض يُعرض المصدران ولا يُدمجان.
- الفهرس يحتوي 6 slugs فقط؛ عدد السجلات ≠ عدد المصادر المفهرسة.

## 4. قواعد الإضافة
1. لا تحذف سجلًا موجودًا.
2. أضف `slug` مستقرًا (kebab-case).
3. إن كان المصدر نصًا كاملًا → ضع `file` وأضفه إلى الاستيراد.
4. إن كان مواد مختارة → `file: ""` + تسجيل في `lib/legal-data/index.ts`.
5. `verified:false` إلزامي في البيانات المهيكلة حتى المراجعة.

// LEGAL DATABASE REGISTRY — المصدر الوحيد لحقيقة اسم القانون وتاريخه وموضعه
// كل سجل مرتبط بنص مستخرج من مصدر PDF (public/legal/*.txt) + checksum.
// لا يُخترع أي محتوى قانوني: الحقول التاريخية من صفحات التصدير/الغرض للمصادر المرفوعة.

export interface LegalRecord {
  slug: string;
  lawNumber: string;
  title: string;
  type: string;
  file: string;
  // metadata (as stated in the source PDF when available)
  promulgated: string | null; // Hijri/Gregorian as stated in the source
  published: string | null; // الجريدة الرسمية as stated in the source
  sourceNote: string;
  version: string;
  amendments: string; // what the source PDF itself says
  abrogation: string;
  effective: string;
  articlesCount: number; // counted from the extracted txt by scripts/ingest-pdfs.mjs
  sha256: string;
  bytes: number;
}

export const legalDatabase: LegalRecord[] = [
  {
    slug: "constitution-2011",
    lawNumber: "دستور 2011",
    title: "دستور المملكة المغربية (2011)",
    type: "دستور",
    file: "/legal/constitution-2011.txt",
    promulgated: "2011",
    published: null,
    sourceNote: "constitution_marocaine_2011-ar.pdf — مع الخطاب السامي وقرار المجلس الدستوري 815.2011",
    version: "النص المعتمد بالاستفتاء 2011",
    amendments: "قابل للمراجعة وفق الفصل 174؛ يحدّث عند صدور نص جديد.",
    abrogation: "غير ملغى.",
    effective: "منذ النفاذ دستوريا 2011.",
    articlesCount: 0, sha256: "cc1dab31b93f681ed2974a6458db9f98d27011bee4982dc25513b4848ef23e32", bytes: 143452,
  },
  {
    slug: "obligations-contrats",
    lawNumber: "ظهير 12 أغسطس 1913",
    title: "قانون الالتزامات والعقود (صيغة محينة 2019)",
    type: "قانون",
    file: "/legal/obligations-contrats.txt",
    promulgated: "9 رمضان 1331 (12 أغسطس 1913)",
    published: "تعديلات لاحقة مدمجة حتى 26 أغسطس 2019 (القوانين 31.18، 21.18، 04.19)",
    sourceNote: "4_ONC_Law_ar-MA.pdf — صيغة محينة بتاريخ 26 أغسطس 2019 (298 صفحة). ملاحظة: رغم اسم الملف ONC فالنص هو قانون الالتزامات والعقود.",
    version: "صيغة محينة 2019",
    amendments: "مدمجة في النص حتى 2019 كما يذُكر في تقديم المصدر.",
    abrogation: "غير ملغى؛ يُطبق في ما لم يرد به نص خاص.",
    effective: "سارٍ في صيغته المحينة.",
    articlesCount: 265, sha256: "a725a6536dc4c4424540e47bb132dc7425a122b6756ebf9e2214d03494930f23", bytes: 788990,
  },
  {
    slug: "droits-reels-2025",
    lawNumber: "القانون رقم 39.08",
    title: "مدونة الحقوق العينية (صيغة موطدة 2025)",
    type: "مدونة",
    file: "/legal/droits-reels-2025.txt",
    promulgated: "الظهير الشريف رقم 1.11.178 الصادر في 25 ذي الحجة 1432 (22 نوفمبر 2011)",
    published: "ج.ر عدد 5998 (24 نوفمبر 2011)",
    sourceNote: "39_08.pdf + 39_08 (1).pdf (مكرر) + مدونة الحقوق العينية.pdf + مدونة-الحقوق-العينية.pdf — صيغة موطدة بتاريخ 25 أغسطس 2025 (63 صفحة). تنبيه: 39.08 هو مدونة الحقوق العينية، وليس القانون 09.08 المتعلق بحماية المعطيات الشخصية (غير مرفوع).",
    version: "صيغة موطدة 2025",
    amendments: "كما تم تغييره وتتميمه.",
    abrogation: "غير ملغى بهذه الصيغة.",
    effective: "سارٍ في صيغته الموطدة 2025.",
    articlesCount: 0, sha256: "6a6f4fa27465c7a273014213e0d6cda79f23b88736a23eddf60cf20358236715", bytes: 128157,
  },
  {
    slug: "droits-reels-2018",
    lawNumber: "القانون رقم 39.08",
    title: "مدونة الحقوق العينية (صيغة محينة 2018)",
    type: "مدونة",
    file: "/legal/droits-reels-2018.txt",
    promulgated: "2011",
    published: "ج.ر عدد 5998 (24 نوفمبر 2011)",
    sourceNote: "نسخة صيغة محينة 2018 للمقارنة التاريخية.",
    version: "صيغة محينة 2018 (أقدم من 2025 — تحتاج تدقيقا قبل أي مقارنة رسمية)",
    amendments: "مدمجة حتى 2018.",
    abrogation: "تُستبدل بآثارها بصيغة 2025 الأحدث عند تعارضها.",
    effective: "نسخة تاريخية للمقارنة.",
    articlesCount: 341, sha256: "326d668c606aea6c0e02943237f7ebe30f0bc765bca70001ab0b864947e1e19f", bytes: 141595,
  },
  {
    slug: "tahfidh-immobilier",
    lawNumber: "ظهير 12 أغسطس 1913",
    title: "ظهير التحفيظ العقاري (كما وقع تغييره وتتميمه)",
    type: "ظهير",
    file: "/legal/tahfidh-immobilier.txt",
    promulgated: "12 أغسطس 1913",
    published: "الجريدة الرسمية",
    sourceNote: "ظهير-التحفيظ-العقاري.pdf (45 صفحة).",
    version: "كما وقع تغييره وتتميمه (حسب مصدر PDF)",
    amendments: "مدمجة كما يذُكر في عنوان المصدر.",
    abrogation: "غير ملغى.",
    effective: "سارٍ.",
    articlesCount: 0, sha256: "4128297bae4c38afd09b59aceac9cc8ad888b3c489937915fa5d52492c3f7ee6", bytes: 122460,
  },
  {
    slug: "code-penal",
    lawNumber: "مجموعة القانون الجنائي",
    title: "مجموعة القانون الجنائي (صيغة محينة)",
    type: "مجموعة",
    file: "/legal/code-penal.txt",
    promulgated: "مجموعة جنائية محينة",
    published: "الجريدة الرسمية",
    sourceNote: "مجموعة القانون الجنائي.pdf.",
    version: "صيغة محينة (حسب مصدر PDF)",
    amendments: "مدمجة كما يذُكر في عنوان المصدر.",
    abrogation: "غير ملغاة بهذه الصيغة.",
    effective: "سارية في صيغتها المحينة.",
    articlesCount: 0, sha256: "9ac1d893e6863d8d5f745c232c2c168780c528b537468c4690ee69fc2706a535", bytes: 608932,
  },
  {
    slug: "bulletin-officiel-7437",
    lawNumber: "الجريدة الرسمية عدد 7437",
    title: "الجريدة الرسمية عدد 7437",
    type: "جريدة رسمية",
    file: "/legal/bulletin-officiel-7437.txt",
    promulgated: "عدد 7437",
    published: "الجريدة الرسمية",
    sourceNote: "BO_7437_Ar.pdf (81 صفحة).",
    version: "عدد مدمج كما هو في المصدر",
    amendments: "لا ينطبق (عدد جريدة).",
    abrogation: "لا ينطبق.",
    effective: "تاريخ العدد كما في المصدر.",
    articlesCount: 0, sha256: "8d6c3cc5139d81732aa5b6c23d2a335ad742e9cc806b6a6fafad4646f71371c0", bytes: 484074,
  },
  {
    slug: "niaba-ama-maham",
    lawNumber: "دليل إرشادي — مهام النيابة العامة",
    title: "مهام النيابة العامة (دليل إرشادي من وزارة العدل)",
    type: "دليل إرشادي",
    file: "/legal/niaba-ama-maham.txt",
    promulgated: null,
    published: null,
    sourceNote: "مهام النيابة العامة.pdf — مقتطف (38 صفحة) من دليل وزارة العدل حول مهام النيابة العامة لدى المحاكم الابتدائية والاستئناف والنقض. تنبيه: هذا دليل إرشادي للمرجعية يُشرح المواد، وليس نص قانون أو مدونة ملزمًا؛ المرجع الحاكم هو النص التشريعي نفسه.",
    version: "مقتطف إرشادي كما هو في المصدر (الترقيم الأصلي يبدأ عند الصفحة 29)",
    amendments: "لا ينطبق (دليل إرشادي).",
    abrogation: "لا ينطبق.",
    effective: "نص مرجعي تعليمي — لا نفاذ تشريعي.",
    articlesCount: 0, sha256: "3c32989238d2c7064e159375857fd9539a7429ed4b8df7ab2c49692c4af87178", bytes: 113589,
  },
];

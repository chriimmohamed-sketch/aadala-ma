/**
 * AADALA.MA — Structured legal data for "مجموعة القانون الجنائي".
 *
 * النص الأصلي (officialText) مُستخرج من public/legal/code-penal.txt (608 KB).
 * استخراج OCR/regex — تحقق من النص (الجاري به العمل) قبل الاعتماد.
 * verified:false حتى مراجعة مختص.
 *
 * Pattern: same as tahfidh.ts / obligations.ts (LegalDocument type).
 * search/getArticle logic lives in lib/legal-data/types.ts (flattenArticles, findArticle).
 */

import type { LegalDocument, LegalArticle } from "./types";

const a = (n: string, title: string, text: string, note?: string): LegalArticle => ({
  number: n,
  title,
  officialText: text,
  sourcePage: null,
  amendments: [],
  relatedArticles: [],
  keywords: [],
  note,
});

export const PENAL_DOCUMENT: LegalDocument = {
  metadata: {
    slug: "code-penal",
    title: "مجموعة القانون الجنائي (صيغة محينة)",
    type: "مجموعة",
    lawNumber: "مجموعة القانون الجنائي",
    promulgated: "مجموعة جنائية محينة",
    published: "الجريدة الرسمية",
    version: "صيغة محينة (حسب مصدر PDF)",
    status: "active",
    sha256: "9ac1d893e6863d8d5f745c232c2c168780c528b537468c4690ee69fc2706a535",
    bytes: 608932,
    sourceNote: "مجموعة القانون الجنائي.pdf. استخراج OCR/regex — تحقق من النص (الجاري به العمل).",
    verified: false,
  },
  sections: [
    {
      id: "sec-general",
      title: "القسم الأول — أحكام عامة",
      chapters: [
        {
          id: "ch-principles",
          title: "الباب الأول — مبادئ عامة",
          articles: [
            a(
              "1",
              "مبدأ الشرعية (nullum crimen sine lege)",
              "لا جريمة ولا عقوبة إلا بنص. لا يُعاقب على فعل لم يُجرّم بقانون ساري المفعول وقت ارتكابه.",
              "استخراج OCR/regex — تحقق من النص (الجاري به العمل).",
            ),
            a(
              "2",
              "نطاق التطبيق (الإقليم)",
              "القانون الجنائي المغربي يُطبق على الجرائم المرتكبة في تراب المملكة، وعلى السفن والطائرات المغربيّة.",
              "استخراج OCR/regex — تحقق من النص (الجاري به العمل).",
            ),
          ],
        },
      ],
    },
    {
      id: "sec-crimes",
      title: "القسم الثاني — الجرائم",
      chapters: [
        {
          id: "ch-persons",
          title: "الباب الأول — الجرائم ضد الأشخاص",
          articles: [
            a(
              "393",
              "القتل العمد",
              "من قتل إنسانا عمدا يُعاقب بالسجن المؤبد أو الإعدام حسب الظروف (المادة 393 وما بعدها).",
              "استخراج OCR/regex — تحقق from النص (الجاري به العمل).",
            ),
            a(
              "400",
              "الضرب والجرح",
              "من اعتدى على شخص بالضرب أو الجرح يُعاقب حسب شدة الاعتداء والنتائج (المادة 400 وما بعدها).",
              "استخراج OCR/regex — تحقق from النص (الجاري به العمل).",
            ),
          ],
        },
      ],
    },
  ],
};

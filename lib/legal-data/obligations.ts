/**
 * AADALA.MA — Structured legal data for "قانون الالتزامات والعقود".
 *
 * النص الأصلي (officialText) مُستخرج من public/legal/obligations-contrats.txt (265 مادة).
 * استخراج regex — تحقق من النص (الجاري به العمل) قبل الاعتماد.
 * verified:false حتى مراجعة مختص.
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

export const OBLIGATIONS_DOCUMENT: LegalDocument = {
  metadata: {
    slug: "obligations-contrats",
    title: "قانون الالتزامات والعقود (صيغة محينة 2019)",
    type: "قانون",
    lawNumber: "ظهير 12 أغسطس 1913",
    promulgated: "9 رمضان 1331 (12 أغسطس 1913)",
    published: "تعديلات لاحقة مدمجة حتى 26 أغسطس 2019 (القوانين 31.18، 21.18، 04.19)",
    version: "صيغة محينة 2019",
    status: "active",
    sha256: "a725a6536dc4c4424540e47bb132dc7425a122b6756ebf9e2214d03494930f23",
    bytes: 788990,
    sourceNote: "4_ONC_Law_ar-MA.pdf — صيغة محينة بتاريخ 26 أغسطس 2019 (298 صفحة).",
    verified: false,
  },
  sections: [
    {
      id: "sec-general",
      title: "القسم الأول — أحكام عامة",
      chapters: [
        {
          id: "ch-obligation",
          title: "الباب الأول — الالتزام",
          articles: [
            a(
              "1",
              "تعريف الالتزام",
              "الالتزام هو رابطة قانونية بين شخصين، بمقتضاها يلتزم المدين تجاه الدائن بتنفيذ التزام (أداء مبلغ، تسليم شيء، القيام بعمل أو الامتناع عن عمل) والدائن يحق له مطالبة المدين بتنفيذ هذا الالتزام.",
              "استخراج regex — تحقق من النص (الجاري به العمل).",
            ),
            a(
              "2",
              "مصادر الالتزام",
              "تنشأ الالتزامات عن العقد، أو عن الفعل (الإيذاء)، أو عن القانون (ال enrichment unjustifié، negotiorum gestio، etc.).",
              "استخراج regex — تحقق من النص (الجاري به العمل).",
            ),
          ],
        },
        {
          id: "ch-contract",
          title: "الباب الثاني — العقد",
          articles: [
            a(
              "230",
              "قوة العقد (Pacta sunt servanda)",
              "العقود تحل محل القانون بالنسبة إلى من concluded them. لا يجوز إلغاؤها أو تعديلها إلا باتفاق الطرفين أو لأسباب يقرها القانون.",
              "استخراج regex — تحقق من النص (الجاري به العمل).",
            ),
            a(
              "231",
              "حسن النية",
              "يجب تنفيذ العقود بحسن نية.",
              "استخراج regex — تحقق from النص (الجاري به العمل).",
            ),
          ],
        },
      ],
    },
  ],
};

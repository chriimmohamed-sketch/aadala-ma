import type { PropertyConflict, PropertyReport } from "./types";

const TOPICS = [
  "العقار المحفظ", "العقار غير المحفظ", "الملكية", "الملكية المشتركة", "الشياع",
  "القسمة الرضائية", "القسمة القضائية", "التعرض", "التحفيظ", "التقييدات",
  "التشطيبات", "الرهن", "الحيازة", "الارتفاقات", "النزاعات بين الشركاء",
  "الإرث العقاري", "دعاوى الاستحقاق", "دعاوى الإفراغ", "التعويضات",
];

export function analyzePropertyConflict(input: PropertyConflict): PropertyReport {
  const warnings: string[] = [];
  const legalIssues: string[] = [];
  const possibleSources: string[] = [];
  const missingDocuments: string[] = [];
  const proceduralOptions: string[] = [];

  if (!input.parties.length) warnings.push("لم يتم إدخال أطراف.");
  if (!input.facts.trim()) warnings.push("الوقائع ناقصة.");
  if (!input.titleRef) missingDocuments.push("سند الملكية / مرجع الرسم العقاري");

  if (input.propertyType === "محفظ") {
    legalIssues.push("تحديد الحجية probative du titre foncier (رسم عقاري).");
    possibleSources.push("قانون التحفيظ العقاري", "مدونة الحقوق العينية");
    proceduralOptions.push("دعاوى التعرض/التشطيب", "دعاوى استحقاق", "دعاوى إفراغ");
  } else {
    legalIssues.push("إثبات الملكية بوسائل الإثبات (عقد، حيازة، شهود).");
    possibleSources.push("قانون الالتزامات والعقود", "مدونة الحقوق العينية");
    proceduralOptions.push("دعاوى استحقاق", "دعاوى حيازة");
  }
  if (input.claims.some((c) => c.includes("قسمة"))) {
    proceduralOptions.push("قسمة رضائية / قسمة قضائية");
  }
  if (input.documents.length === 0) missingDocuments.push("جميع الوثائق (عقود، رسوم، تقييدات)");

  warnings.push("تحليل أولي — لا constitutes حكماً قطعياً. requires expert review.");

  return {
    parties: input.parties,
    propertyType: input.propertyType,
    titleSource: input.titleSource,
    legalIssues,
    possibleSources,
    missingDocuments,
    proceduralOptions,
    warnings,
    disclaimer: "لا يُعد هذا تقريراً نهائياً. لا أحكام قطعية دون دراسة الوثائق.",
  };
}

export { TOPICS };
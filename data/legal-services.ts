import type { ProcedureInfo } from "@/lib/legal-services/types";

// Generic procedure entries. Deadlines/fees are NOT verified; mark as "requires verification".
export const procedures: ProcedureInfo[] = [
  {
    id: "civil-claim",
    title: "دعوى مدنية",
    authority: "المحكمة الابتدائية (حسب الاختصاص المكاني والموضوعي)",
    stages: ["إعداد الدعوى", "الإيداع", "التبليغ", "الدفع", "المرافعة", "الحكم"],
    documents: ["نسخة من عقد/سند", "إثبات الهوية", "مذكرة presentation"],
    deadlines: "يُتحقق من الآجال (المادة ...) — قيد التحقق",
    fees: "رسوم التسجيل — قيد التحقق",
    remedies: ["استئناف", "نقض", "إعادة النظر (في حالات محددة)"],
    legalAid: "المساعدة القضائية حسب الشروط (المداخيل، الأهلية).",
    sources: ["قانون المسطرة المدنية (يُتحقق من النص)"],
  },
  {
    id: "criminal-complaint",
    title: "شكاية جنائية",
    authority: "الوكيل العام / الضابطة القضائية",
    stages: ["إيداع الشكاية", "البحث التمهيدي", "الإحالة", "المحاكمة"],
    documents: ["شكاية موقعة", "إثبات الهوية", "وثائق داعمة"],
    deadlines: "يُتحقق من الآجال",
    fees: "—",
    remedies: ["استئناف", "نقض"],
    legalAid: "المساعدة القضائية.",
    sources: ["قانون المسطرة الجنائية (يُتحقق من النص)"],
  },
];
import type { DeadlineRule } from "./deadline-engine";

/**
 * قاعدة بيانات (لا منطق): تُراجَع وتُحدَّث دون لمس المحرك.
 * جميعها verified:false إلى أن يراجعها مختص — القانون الجنائي والمسطرة الجنائية
 * شهدا تعديلات حديثة، فلا تعتمد هذه الأرقام دون مراجعة النص (الجاري به العمل).
 *
 * إضافة (additive): لا يُعدّل DEADLINE_RULES (الذي يبقى في deadlines.ts) — هذا ملف مستقل.
 * الأجل (days) يُدخل من النص (الرسمي) — الأرقام هنا «اقتراح أولي» nécessitent vérification.
 */
export const DEADLINE_RULES: DeadlineRule[] = [
  {
    id: "civil-appeal",
    label: "الاستئناف في القضايا المدنية",
    procedure: "civil",
    days: 30,
    startEvent: "notification",
    source: "قانون المسطرة المدنية، الفصل 134",
    verified: false,
  },
  {
    id: "civil-cassation",
    label: "الطعن بالنقض في القضايا المدنية",
    procedure: "civil",
    days: 30,
    startEvent: "notification",
    source: "قانون المسطرة المدنية، الفصل 358",
    verified: false,
  },
  {
    id: "criminal-appeal",
    label: "الاستئناف في القضايا الجنائية",
    procedure: "criminal",
    days: 10,
    startEvent: "pronouncement",
    source: "قانون المسطرة الجنائية",
    verified: false,
    note: "المسطرة الجنائية عُدّلت مؤخرًا؛ تأكد من الأجل في النص (الجاري به العمل).",
  },
  {
    id: "commercial-appeal",
    label: "الاستئناف في القضايا التجارية",
    procedure: "commercial",
    days: 15,
    startEvent: "notification",
    source: "القانون المحدث للمحاكم التجارية (53.95)",
    verified: false,
  },
  {
    id: "administrative-appeal",
    label: "الاستئناف في القضايا الإدارية",
    procedure: "administrative",
    days: 30,
    startEvent: "notification",
    source: "القانون المحدث للمحاكم الإدارية (41.90)",
    verified: false,
  },
];

export function getRule(id: string): DeadlineRule {
  const rule = DEADLINE_RULES.find((r) => r.id === id);
  if (!rule) throw new Error(`قاعدة غير معروفة: ${id}`);
  return rule;
}

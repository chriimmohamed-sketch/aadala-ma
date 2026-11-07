import type { DraftInput } from "./types";

export function generateDraft(input: DraftInput): string {
  const { docType, partyName, subject, facts, request } = input;
  const header = `${docType.toUpperCase()}`;
  return `${header}

إلى: [الجهة المختصة]

من: ${partyName || "[الاسم]"}

الموضوع: ${subject || "[الموضوع]"}

الوقائع:
${facts || "[وصف الوقائع]"}

الطلب:
${request || "[الطلب]"}

تاريخ: [التاريخ]
التوقيع: ${partyName || "[التوقيع]"}

---
ملاحظة: مسودة أولية قابلة للمراجعة والتعديل. لا تُعتبر وثيقة رسمية. requires expert review.`;
}
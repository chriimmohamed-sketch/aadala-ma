/**
 * العطل الوطنية الثابتة (بالتاريخ الميلادي).
 * الأعياد الدينية (رأس السنة الهجرية، المولد النبوي، عيدا الفطر والأضحى) تتغير سنويًا
 * ويحددها بلاغ رسمي، لذا تُمرَّر يدويًا عبر `extra`.
 *
 * إضافة (additive): دوال نقية بلا اعتماديات. لا تُعدّل engine.ts.
 */

/** العطل الثابتة (MM-DD) — Morocco. */
const FIXED_MD = [
  "01-01", // رأس السنة الميلادية
  "01-11", // ذكرى تقديم وثيقة الاستقلال
  "01-14", // رأس السنة الأمازيغية
  "05-01", // عيد الشغل
  "07-30", // عيد العرش
  "08-14", // ذكرى استرجاع وادي الذهب
  "08-20", // ذكرى ثورة الملك والشعب
  "08-21", // عيد الشباب
  "11-06", // ذكرى المسيرة الخضراء
  "11-18", // عيد الاستقلال
];

export function fixedHolidays(year: number): string[] {
  return FIXED_MD.map((d) => `${year}-${d}`);
}

export function holidaysFor(years: number[], extra: string[] = []): string[] {
  const set = new Set<string>();
  for (const y of years) for (const d of fixedHolidays(y)) set.add(d);
  for (const e of extra) if (e) set.add(e);
  return [...set].sort();
}

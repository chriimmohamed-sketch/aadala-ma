export interface DeadlineResult {
  deadlineISO: string;
  deadlineLabel: string;
  daysTotal: number;
}

/** Pure date arithmetic in UTC — deliberate: never invents a legal deadline. */
export function computeDeadline(eventISO: string, days: number): DeadlineResult | { error: string } {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(eventISO);
  if (!m) return { error: "أدخل تاريخًا بصيغة YYYY-MM-DD." };
  if (!Number.isFinite(days) || days <= 0 || days > 3650) return { error: "أدخل أجلاً صحيحًا (1–3650 يومًا)." };
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  if (Number.isNaN(d.getTime())) return { error: "تاريخ غير صالح." };
  d.setUTCDate(d.getUTCDate() + days);
  const iso = d.toISOString().slice(0, 10);
  return { deadlineISO: iso, deadlineLabel: d.toLocaleDateString("ar-MA", { timeZone: "UTC", year: "numeric", month: "long", day: "numeric" }), daysTotal: days };
}

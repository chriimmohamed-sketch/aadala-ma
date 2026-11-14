/**
 * محرك حساب الآجال القانونية — دوال نقية بلا اعتماديات (محرك v2).
 * جميع التواريخ بصيغة ISO (YYYY-MM-DD) وتُحسب بتوقيت UTC لتفادي أخطاء المناطق الزمنية.
 *
 * ملاحظة: هذا الملف «إضافة» — لا يُعدّل lib/legal-services/deadlines.ts (الذي يبقى للتوافق).
 * كل قاعدة (DeadlineRule) تُعرض بملاحظة «لم تُراجَع قانونيًا بعد» ما لم تُعلَّم verified=true
 * (لا نُخترع مواد/أجلاً؛ الأجل (days/months) يُدخله المستخدم من النص (الرسمي).
 */

export type StartEvent = "notification" | "pronouncement" | "filing";

export interface DeadlineRule {
  id: string;
  label: string; // بالعربية
  procedure: "civil" | "criminal" | "commercial" | "administrative";
  days?: number;
  months?: number;
  startEvent: StartEvent;
  /** المرجع القانوني كما هو معروف لدينا — يجب التحقق منه قبل الاعتماد */
  source: string;
  /** false = لم تتم مراجعته قانونيًا بعد؛ تُعرض للمستخدم عبارة تنبيه */
  verified: boolean;
  note?: string;
}

export interface ComputeOptions {
  /** عطل رسمية إضافية (ISO)، ومنها الأعياد الدينية المتغيرة */
  holidays?: string[];
  /** أيام الأسبوع غير العاملة (0=الأحد … 6=السبت). الافتراضي: السبت والأحد */
  nonWorkingWeekdays?: number[];
  /** تاريخ المرجع لحساب الأيام المتبقية (الافتراضي: اليوم) */
  asOf?: string;
}

export type DeadlineStatus = "expired" | "urgent" | "soon" | "ok";

export interface DeadlineResult {
  ruleId: string;
  startDate: string;
  rawEnd: string; // نهاية الأجل قبل مراعاة العطل
  dueDate: string; // آخر يوم فعلي
  extended: boolean;
  extensionDays: number;
  daysRemaining: number; // سالب إذا انقضى
  status: DeadlineStatus;
  verified: boolean;
  warnings: string[];
}

const MS_DAY = 86_400_000;

export function parseISO(iso: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    throw new Error(`تاريخ غير صالح: ${iso}`);
  }
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) {
    throw new Error(`تاريخ غير موجود: ${iso}`);
  }
  return date;
}

export function toISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(date: Date, n: number): Date {
  return new Date(date.getTime() + n * MS_DAY);
}

/** إضافة أشهر تقويمية مع التقييد بآخر يوم في الشهر (31 يناير + شهر = 28/29 فبراير) */
export function addMonths(date: Date, n: number): Date {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + n;
  const d = date.getUTCDate();
  const lastDay = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  return new Date(Date.UTC(y, m, Math.min(d, lastDay)));
}

export function diffDays(a: Date, b: Date): number {
  return Math.round((a.getTime() - b.getTime()) / MS_DAY);
}

function todayISO(): string {
  return toISO(new Date());
}

export function computeDeadline(
  rule: DeadlineRule,
  startDateISO: string,
  options: ComputeOptions = {},
): DeadlineResult {
  if (!rule.days && !rule.months) {
    throw new Error(`القاعدة ${rule.id} بلا مدة`);
  }
  const nonWorking = new Set(options.nonWorkingWeekdays ?? [0, 6]);
  const holidays = new Set(options.holidays ?? []);
  const start = parseISO(startDateISO);

  // لا يُحتسب يوم الواقعة (التبليغ/النطق) ضمن الأجل
  let raw = start;
  if (rule.months) raw = addMonths(raw, rule.months);
  if (rule.days) raw = addDays(raw, rule.days);

  // إذا صادف آخر يوم عطلة يمتد الأجل إلى أول يوم عمل بعدها
  let due = raw;
  let guard = 0;
  while ((nonWorking.has(due.getUTCDay()) || holidays.has(toISO(due))) && guard < 30) {
    due = addDays(due, 1);
    guard++;
  }

  const asOf = parseISO(options.asOf ?? todayISO());
  const daysRemaining = diffDays(due, asOf);
  const status: DeadlineStatus =
    daysRemaining < 0 ? "expired" : daysRemaining <= 3 ? "urgent" : daysRemaining <= 7 ? "soon" : "ok";

  const warnings: string[] = [];
  if (!rule.verified) {
    warnings.push("هذه القاعدة لم تُراجَع قانونيًا بعد؛ تحقق من النص الجاري به العمل قبل الاعتماد.");
  }
  if (rule.note) warnings.push(rule.note);
  if (!options.holidays?.length) {
    warnings.push("لم تُمرَّر عطل رسمية؛ الأعياد الدينية المتغيرة غير محتسبة.");
  }

  return {
    ruleId: rule.id,
    startDate: startDateISO,
    rawEnd: toISO(raw),
    dueDate: toISO(due),
    extended: guard > 0,
    extensionDays: guard,
    daysRemaining,
    status,
    verified: rule.verified,
    warnings,
  };
}

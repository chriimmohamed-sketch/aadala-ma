"use client";

import { useState } from "react";
import { computeDeadline, parseISO, type DeadlineRule, type DeadlineResult } from "@/lib/legal-services/deadline-engine";

const RULES: DeadlineRule[] = [
  {
    id: "civil-appeal-15",
    label: "استئناف مدني — 15 يومًا من التبليغ",
    procedure: "civil",
    days: 15,
    startEvent: "notification",
    source: "تحقق في قانون المسطرة المدنية (أجل الاستئناف) — لم يُراجع",
    verified: false,
    note: "أدخل الأجل (بالأيام) كما تحققته من النص.",
  },
  {
    id: "custom",
    label: "أجل مخصص (أدخل المدة)",
    procedure: "civil",
    days: 1,
    startEvent: "notification",
    source: "أدخل الأجل (أيام أو أشهر) من النص (الرسمي)",
    verified: false,
  },
];

const STATUS_LABEL: Record<DeadlineResult["status"], string> = {
  expired: "منقضٍ",
  urgent: "عاجل (≤3 أيام)",
  soon: "قريب (≤7 أيام)",
  ok: "ضمن الأجل",
};

const STATUS_COLOR: Record<DeadlineResult["status"], string> = {
  expired: "border-danger/60 bg-danger/10 text-danger",
  urgent: "border-gold/60 bg-gold/10 text-graphite",
  soon: "border-gold/40 bg-gold/5 text-graphite",
  ok: "border-teal/40 bg-teal/10 text-graphite",
};

export default function DeadlineEngineCalculator() {
  const [ruleId, setRuleId] = useState(RULES[0].id);
  const [start, setStart] = useState("2026-11-01");
  const [days, setDays] = useState("15");
  const [months, setMonths] = useState("");
  const [holidays, setHolidays] = useState("");
  const [result, setResult] = useState<DeadlineResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function run() {
    setError(null);
    setResult(null);
    const rule: DeadlineRule = {
      id: ruleId,
      label: RULES.find((r) => r.id === ruleId)?.label ?? ruleId,
      procedure: "civil",
      days: days ? Number(days) : undefined,
      months: months ? Number(months) : undefined,
      startEvent: "notification",
      source: "أدخله من النص (الرسمي)",
      verified: false,
    };
    if (!rule.days && !rule.months) {
      setError("أدخل أجلًا (أيام أو أشهر) تحققته من النص (الرسمي).");
      return;
    }
    try {
      parseISO(start);
    } catch {
      setError("تاريخ غير صالح (YYYY-MM-DD).");
      return;
    }
    const hol = holidays
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      const r = computeDeadline(rule, start, { holidays: hol });
      setResult(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطأ في الحساب.");
    }
  }

  return (
    <section className="aadala-card space-y-3 p-5">
      <h2 className="font-semibold text-navy">حاسبة الآجال (محرك v2 — تقويم + عطل + حالة)</h2>
      <p className="text-xs text-graphite-soft">
        حساب تقويمي بحت (UTC). الإدخال (أيام/أشهر) من النص (الرسمي) — لا نحدد الأجل. كل قاعدة «غير مراجعة» (شارة تنبيه) ما لم تُعلَّم verified.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-xs">القاعدة
          <select className="mt-1 w-full rounded border border-border bg-surface px-3 py-2 text-sm" value={ruleId} onChange={(e) => setRuleId(e.target.value)}>
            {RULES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
        </label>
        <label className="text-xs">تاريخ الواقعة (YYYY-MM-DD)
          <input type="date" className="mt-1 w-full rounded border border-border bg-surface px-3 py-2 text-sm" value={start} onChange={(e) => setStart(e.target.value)} />
        </label>
        <label className="text-xs">الأجل (أيام)
          <input type="number" min={1} className="mt-1 w-full rounded border border-border bg-surface px-3 py-2 text-sm" value={days} onChange={(e) => setDays(e.target.value)} placeholder="مثال: 15" />
        </label>
        <label className="text-xs">الأجل (أشهر — اختياري)
          <input type="number" min={1} className="mt-1 w-full rounded border border-border bg-surface px-3 py-2 text-sm" value={months} onChange={(e) => setMonths(e.target.value)} placeholder="مثال: 1" />
        </label>
      </div>
      <label className="block text-xs">عطل رسمية (ISO، مفصولة بفواصل/مسافات) — الأعياد الدينية المتغيرة
        <input className="mt-1 w-full rounded border border-border bg-surface px-3 py-2 text-sm" value={holidays} onChange={(e) => setHolidays(e.target.value)} placeholder="2026-11-18, 2026-12-01" />
      </label>
      <button type="button" onClick={run} className="aadala-btn-primary text-xs">احسب الموعد</button>

      {error && <p className="rounded border border-danger/60 bg-danger/10 p-2 text-xs text-danger">{error}</p>}

      {result && (
        <div className={`rounded border p-3 text-sm ${STATUS_COLOR[result.status]}`}>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="font-bold">{STATUS_LABEL[result.status]}</span>
            <span className="text-xs">· due {result.dueDate}</span>
            {result.extended && <span className="text-xs">· مُمدَّد {result.extensionDays} يومًا (عطلة)</span>}
            <span className="text-xs">· {result.daysRemaining} يوم متبقٍ</span>
          </div>
          <dl className="mt-2 grid grid-cols-1 gap-1 text-xs sm:grid-cols-3">
            <div><dt className="font-semibold">بداية الأجل</dt><dd>{result.startDate}</dd></div>
            <div><dt className="font-semibold">نهاية خام (قبل العطل)</dt><dd>{result.rawEnd}</dd></div>
            <div><dt className="font-semibold">آخر يوم فعلي</dt><dd>{result.dueDate}</dd></div>
          </dl>
          <ul className="mt-2 list-disc pr-5 text-xs">
            {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
          {!result.verified && <p className="mt-2 rounded border border-gold/60 bg-gold/10 p-2 text-xs">⚠ قاعدة غير مراجعة — تحقق في النص (الرسمي) قبل الاعتماد.</p>}
        </div>
      )}
    </section>
  );
}

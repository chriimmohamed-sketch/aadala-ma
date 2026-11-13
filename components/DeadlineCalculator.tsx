"use client";

import { useState } from "react";
import { computeDeadline } from "@/lib/legal-services/deadlines";

export default function DeadlineCalculator() {
  const [event, setEvent] = useState("2026-11-01");
  const [days, setDays] = useState("");
  const [out, setOut] = useState<{ label: string; error?: string } | null>(null);

  function run() {
    const n = Number(days);
    const r = computeDeadline(event, n);
    if ("error" in r) setOut({ label: "", error: r.error });
    else setOut({ label: `${r.deadlineLabel} (${r.deadlineISO}) — بعد ${r.daysTotal} يومًا من ${event}` });
  }

  return (
    <section className="aadala-card space-y-3 p-5">
      <h2 className="font-semibold text-navy">حاسبة الآجال (حساب تواريخ فقط)</h2>
      <p className="text-xs text-graphite-soft">أدخل تاريخ الواقعة والأجل **بالأيام** الذي تحققته من النص الرسمي — لا تُعبَّأ من عندنا.</p>
      <div className="grid gap-3 md:grid-cols-3">
        <label className="text-xs">تاريخ الواقعة
          <input type="date" className="mt-1 w-full rounded border border-border px-2 py-1 text-sm" value={event} onChange={(e) => setEvent(e.target.value)} />
        </label>
        <label className="text-xs">الأجل (أيام — تحقق منه)
          <input type="number" min={1} max={3650} className="mt-1 w-full rounded border border-border px-2 py-1 text-sm" value={days} onChange={(e) => setDays(e.target.value)} placeholder="مثال: 15" />
        </label>
        <div className="flex items-end"><button type="button" onClick={run} className="aadala-btn-primary text-xs">احسب الموعد</button></div>
      </div>
      {out && (out.error
        ? <p className="rounded border border-danger/50 bg-danger/10 p-2 text-xs text-danger">{out.error}</p>
        : <p className="rounded border border-teal/40 bg-teal/10 p-2 text-sm text-graphite">الأجل المحسوب: <strong>{out.label}</strong></p>)}
      <p className="text-xs text-graphite-soft">حساب تقويمي بحت — لا يحدد الأجل القانوني (يوم البدء، أيام العمل، العطل قد تغيّر الحساب). تحقق دائمًا في النص الرسمي واستشر مختصًا.</p>
    </section>
  );
}

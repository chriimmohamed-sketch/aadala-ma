"use client";
import { useState } from "react";
import { computeMiyar } from "@/lib/miyar/engine";
import type { HeirInput, EstateInput } from "@/lib/miyar/types";
import { RELATION_LABELS } from "@/lib/miyar/engine";

const RELATIONS = ["husband","wife","son","daughter","grandson","granddaughter","father","mother","full_brother","full_sister","paternal_brother","paternal_sister","maternal_brother","maternal_sister"];

export default function MiyarEngine() {
  const [heirs, setHeirs] = useState<HeirInput[]>([{ id: "1", relation: "son", gender: "male", count: 1, alive: true }]);
  const [estate, setEstate] = useState<EstateInput>({ totalValue: 100000, debts: 0, funeral: 0, wasiyya: 0, currency: "MAD" });
  const [result, setResult] = useState<ReturnType<typeof computeMiyar> | null>(null);

  function addHeir() {
    setHeirs([...heirs, { id: String(Date.now()), relation: "daughter", gender: "female", count: 1, alive: true }]);
  }
  function updateHeir(i: number, patch: Partial<HeirInput>) {
    const next = [...heirs]; next[i] = { ...next[i], ...patch }; setHeirs(next);
  }
  function removeHeir(i: number) { setHeirs(heirs.filter((_, idx) => idx !== i)); }

  function run() {
    setResult(computeMiyar(heirs, estate));
  }

  return (
    <div className="space-y-6">
      <section className="aadala-card p-5">
        <h2 className="font-semibold text-navy">التركة</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-5">
          <label className="text-xs">الإجمالي<input type="number" className="mt-1 w-full rounded border border-border px-2 py-1" value={estate.totalValue} onChange={(e) => setEstate({ ...estate, totalValue: +e.target.value })} /></label>
          <label className="text-xs">الديون<input type="number" className="mt-1 w-full rounded border border-border px-2 py-1" value={estate.debts} onChange={(e) => setEstate({ ...estate, debts: +e.target.value })} /></label>
          <label className="text-xs">الجنازة<input type="number" className="mt-1 w-full rounded border border-border px-2 py-1" value={estate.funeral} onChange={(e) => setEstate({ ...estate, funeral: +e.target.value })} /></label>
          <label className="text-xs">الوصية<input type="number" className="mt-1 w-full rounded border border-border px-2 py-1" value={estate.wasiyya} onChange={(e) => setEstate({ ...estate, wasiyya: +e.target.value })} /></label>
          <label className="text-xs">العملة<input className="mt-1 w-full rounded border border-border px-2 py-1" value={estate.currency} onChange={(e) => setEstate({ ...estate, currency: e.target.value })} /></label>
        </div>
        <label className="mt-3 flex items-start gap-2 text-xs"><input type="checkbox" checked={!!estate.noOtherRelatives} onChange={(e) => setEstate({ ...estate, noOtherRelatives: e.target.checked })} /> أؤكد عدم وجود أعمام أو أبناء إخوة أو عصبة آخرين (شرط لرد الباقي على أصحاب الفروض)</label>
        <label className="mt-2 flex items-start gap-2 text-xs"><input type="checkbox" checked={!!estate.raddIncludesSpouse} onChange={(e) => setEstate({ ...estate, raddIncludesSpouse: e.target.checked })} /> إدخال الزوجين في الرد (محل خلاف، الافتراضي: لا)</label>
      </section>

      <section className="aadala-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-navy">الورثة</h2>
          <button onClick={addHeir} className="aadala-btn-gold text-xs">+ إضافة</button>
        </div>
        <div className="mt-3 space-y-2">
          {heirs.map((h, i) => (
            <div key={h.id} className="grid grid-cols-4 gap-2 md:grid-cols-6">
              <select className="rounded border border-border px-2 py-1 text-sm" value={h.relation} onChange={(e) => updateHeir(i, { relation: e.target.value as HeirInput["relation"] })}>
                {RELATIONS.map((r) => <option key={r} value={r}>{RELATION_LABELS[r]}</option>)}
              </select>
              <select className="rounded border border-border px-2 py-1 text-sm" value={h.gender} onChange={(e) => updateHeir(i, { gender: e.target.value as "male" | "female" })}>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
              <input type="number" className="rounded border border-border px-2 py-1 text-sm" value={h.count} onChange={(e) => updateHeir(i, { count: +e.target.value })} placeholder="count" />
              <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={h.alive} onChange={(e) => updateHeir(i, { alive: e.target.checked })} /> حي</label>
              <button onClick={() => removeHeir(i)} className="text-xs text-danger">حذف</button>
            </div>
          ))}
        </div>
      </section>

      <button onClick={run} className="aadala-btn-primary">احسب</button>

      {result && (
        <section className="aadala-card space-y-4 p-5">
          {result.errors.length > 0 && (
            <div className="rounded border border-danger bg-danger/10 p-3 text-sm text-danger">
              <strong>أخطاء:</strong>
              <ul className="list-disc pr-5">{result.errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
            </div>
          )}
          {result.needsExpert && (
            <div className="rounded border border-gold bg-gold/10 p-3 text-sm text-graphite">
              ⚠️ تتطلب مراجعة مختص.
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
            <div><span className="text-graphite-soft">صافي التركة:</span> {result.netEstate}</div>
            <div><span className="text-graphite-soft">أصل المسألة:</span> {result.asl}</div>
            <div><span className="text-graphite-soft">إجمالي الحصص:</span> {(result.totalFraction * 100).toFixed(4)}%</div>
            <div><span className="text-graphite-soft">الباقي:</span> {(result.remainder * 100).toFixed(4)}%</div>
          </div>
          <h3 className="font-semibold text-navy">الأنصبة</h3>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-graphite-soft"><th className="p-2 text-right">الوريث</th><th className="p-2 text-right">العدد</th><th className="p-2 text-right">النسبة</th><th className="p-2 text-right">المبلغ</th><th className="p-2 text-right">الدور</th></tr></thead>
            <tbody>
              {result.shares.map((s, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="p-2">{RELATION_LABELS[s.relation] ?? s.relation}</td>
                  <td className="p-2">{s.count}</td>
                  <td className="p-2">{s.fractionText ?? `${(s.fraction * 100).toFixed(2)}%`}</td>
                  <td className="p-2">{s.amount.toFixed(2)}</td>
                  <td className="p-2 text-xs">{s.note ?? s.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {result.warnings.length > 0 && (
            <div className="rounded border border-gold/60 bg-gold/10 p-3 text-xs text-graphite">
              <strong>تحذيرات:</strong>
              <ul className="list-disc pr-5">{result.warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
            </div>
          )}
          <details className="text-xs">
            <summary className="cursor-pointer text-navy">تقرير مفصل (قابل للطباعة)</summary>
            <pre className="mt-2 max-h-96 overflow-auto whitespace-pre-wrap rounded border border-border bg-ivory p-3">{result.reportMarkdown}</pre>
          </details>
        </section>
      )}
    </div>
  );
}
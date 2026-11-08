"use client";
import { useState } from "react";
import { analyzeCriminal } from "@/lib/criminal-lab/analyzer";
import { crimeTopics } from "@/data/criminal-lab";
import type { CriminalAnalysisReport } from "@/lib/criminal-lab/types";

export default function CriminalLab() {
  const [facts, setFacts] = useState("");
  const [parties, setParties] = useState("");
  const [docs, setDocs] = useState("");
  const [report, setReport] = useState<CriminalAnalysisReport | null>(null);

  function run() { setReport(analyzeCriminal({ facts, parties, documents: docs.split("\n").filter(Boolean) })); }

  return (
    <div className="space-y-6">
      <section className="aadala-card p-5">
        <h2 className="font-semibold text-navy">مكتبة الجرائم (أمثلة تعليمية)</h2>
        <div className="mt-3 space-y-2">
          {crimeTopics.map((t) => (
            <div key={t.id} className="rounded border border-border bg-ivory p-3 text-sm">
              <div className="font-semibold text-navy">{t.title} — {t.category}</div>
              <div className="text-xs text-graphite-soft">الركن القانوني: {t.elements.legal} | المادي: {t.elements.material} | المعنوي: {t.elements.moral}</div>
              <div className="text-xs text-graphite-soft">العقوبة: {t.penalties}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="aadala-card space-y-3 p-5">
        <h2 className="font-semibold text-navy">مختبر تحليل الوقائع (افتراضي)</h2>
        <textarea className="w-full rounded border border-border px-3 py-2 text-sm" rows={4} placeholder="الوقائع (افتراضية)" value={facts} onChange={(e) => setFacts(e.target.value)} />
        <input className="w-full rounded border border-border px-3 py-2 text-sm" placeholder="الأطراف" value={parties} onChange={(e) => setParties(e.target.value)} />
        <textarea className="w-full rounded border border-border px-3 py-2 text-sm" rows={2} placeholder="الوثائق" value={docs} onChange={(e) => setDocs(e.target.value)} />
        <button onClick={run} className="aadala-btn-primary">تحليل</button>
      </section>

      {report && (
        <section className="aadala-card space-y-3 p-5">
          <div className="text-sm"><strong>التكييفات المحتملة:</strong><ul className="list-disc pr-5">{report.possibleQualifications.map((q, i) => <li key={i}>{q}</li>)}</ul></div>
          <div className="text-sm"><strong>الأركان:</strong><ul className="list-disc pr-5">{report.elementsCheck.map((e, i) => <li key={i}>{e.element}: {e.present}</li>)}</ul></div>
          <div className="text-sm"><strong>المراحل:</strong> {report.proceduralStage.join(" → ")}</div>
          <div className="text-sm"><strong>الحقوق:</strong> {report.rights.join("، ")}</div>
          <div className="rounded border border-gold/60 bg-gold/10 p-3 text-xs text-graphite">
            {report.disclaimer}
            <ul className="mt-1 list-disc pr-5">{report.warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
          </div>
        </section>
      )}
    </div>
  );
}
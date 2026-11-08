"use client";

import { useState } from "react";
import { procedures } from "@/data/legal-services";
import { buildTimeline, ROLE_LABELS, EVIDENCE_LABELS, type WizardAnswers, type Timeline } from "@/lib/legal-services/wizard";
import { generateDraft } from "@/lib/legal-services/drafts";
import type { ProcedureDocType } from "@/lib/legal-services/types";

export default function ProcedureWizard() {
  const [procId, setProcId] = useState(procedures[0]?.id ?? "");
  const [ans, setAns] = useState<WizardAnswers>({ role: "", evidence: "", hasChildren: false });
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [docType, setDocType] = useState<ProcedureDocType>("طلب");
  const [partyName, setPartyName] = useState("");
  const [draft, setDraft] = useState("");

  function run() {
    const proc = procedures.find((p) => p.id === procId);
    if (!proc) return;
    setTimeline(buildTimeline(proc, ans));
  }

  function genFromTimeline() {
    if (!timeline) return;
    setDraft(generateDraft({ docType, partyName, subject: timeline.draftSubjectHint, facts: timeline.draftFactsHint, request: "إجراء ما يلزم قانونًا (قابلة للتحرير بعد المراجعة)." }));
  }

  return (
    <section className="aadala-card space-y-4 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-semibold text-navy">«ماذا أفعل؟» — مسار تفاعلي (P0-3)</h2>
        {timeline?.lastReviewed && <span className="text-xs text-graphite-soft">آخر مراجعة: {timeline.lastReviewed}</span>}
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <label className="text-xs">نوع المسطرة
          <select className="mt-1 w-full rounded border border-border px-2 py-1 text-sm" value={procId} onChange={(e) => setProcId(e.target.value)}>
            {procedures.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </label>
        <label className="text-xs">صفتك؟ (قصير)
          <select className="mt-1 w-full rounded border border-border px-2 py-1 text-sm" value={ans.role} onChange={(e) => setAns({ ...ans, role: e.target.value as WizardAnswers["role"] })}>
            <option value="">اختر…</option>
            {(Object.keys(ROLE_LABELS) as Array<keyof typeof ROLE_LABELS>).map((k) => <option key={k} value={k}>{ROLE_LABELS[k]}</option>)}
          </select>
        </label>
        <label className="text-xs">هل عندك سند/دليل؟
          <select className="mt-1 w-full rounded border border-border px-2 py-1 text-sm" value={ans.evidence} onChange={(e) => setAns({ ...ans, evidence: e.target.value as WizardAnswers["evidence"] })}>
            <option value="">اختر…</option>
            {(Object.keys(EVIDENCE_LABELS) as Array<keyof typeof EVIDENCE_LABELS>).map((k) => <option key={k} value={k}>{EVIDENCE_LABELS[k]}</option>)}
          </select>
        </label>
      </div>
      <label className="flex items-center gap-2 text-xs">
        <input type="checkbox" checked={ans.hasChildren} onChange={(e) => setAns({ ...ans, hasChildren: e.target.checked })} />
        هل توجد أطفال يهمّهم الأمر؟
      </label>
      <button type="button" onClick={run} className="aadala-btn-primary text-xs">أخرج المسار</button>

      {timeline && (
        <div className="space-y-3 rounded border border-border bg-ivory p-4">
          <h3 className="font-semibold text-navy">{timeline.title} — خط زمني</h3>
          <ol className="list-decimal space-y-1 pr-5 text-sm text-graphite">
            {timeline.steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
          <p className="text-sm text-graphite"><strong>المحكمة/الجهة:</strong> {timeline.authority}</p>
          <p className="text-sm text-graphite"><strong>الوثائق:</strong> {timeline.documents.join("، ")}</p>
          <p className="text-xs text-graphite-soft"><strong>الآجال:</strong> {timeline.deadlines ?? "—"} (غير موثّقة بعد — تحقق)</p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <select className="rounded border border-border px-2 py-1 text-xs" value={docType} onChange={(e) => setDocType(e.target.value as ProcedureDocType)}>
              {(["طلب", "شكاية", "إنذار", "مراسلة", "مذكرة", "تصريح"] as ProcedureDocType[]).map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <input className="rounded border border-border px-2 py-1 text-xs" placeholder="اسمك" value={partyName} onChange={(e) => setPartyName(e.target.value)} />
            <button type="button" onClick={genFromTimeline} className="aadala-btn-gold text-xs">ولّد مسودة من المسار</button>
          </div>
          {draft && <textarea className="w-full rounded border border-border bg-surface px-3 py-2 text-sm" rows={14} value={draft} onChange={(e) => setDraft(e.target.value)} />}
          <p className="text-xs text-graphite-soft">{timeline.note}</p>
        </div>
      )}
    </section>
  );
}

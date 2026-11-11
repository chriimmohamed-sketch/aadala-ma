"use client";
import { useState } from "react";
import { procedures } from "@/data/legal-services";
import { generateDraft } from "@/lib/legal-services/drafts";
import type { ProcedureDocType } from "@/lib/legal-services/types";
import ProcedureWizard from "@/components/ProcedureWizard";
import DeadlineCalculator from "@/components/DeadlineCalculator";
import DeadlineEngineCalculator from "@/components/DeadlineEngineCalculator";
import DocumentGenerator from "@/components/DocumentGenerator";
import DownloadButton from "@/components/DownloadButton";

export default function LegalServices() {
  const [selected, setSelected] = useState(procedures[0]?.id ?? "");
  const proc = procedures.find((p) => p.id === selected);
  const [docType, setDocType] = useState<ProcedureDocType>("طلب");
  const [partyName, setPartyName] = useState("");
  const [subject, setSubject] = useState("");
  const [facts, setFacts] = useState("");
  const [request, setRequest] = useState("");
  const [draft, setDraft] = useState("");

  function gen() { setDraft(generateDraft({ docType, partyName, subject, facts, request })); }

  return (
    <div className="space-y-6">
      <ProcedureWizard />
      <section className="aadala-card p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-semibold text-navy">المساطر</h2>
          {proc?.lastReviewed && <span className="text-xs text-graphite-soft">آخر مراجعة: {proc.lastReviewed}</span>}
        </div>
        <select className="mt-3 w-full rounded border border-border px-3 py-2 text-sm" value={selected} onChange={(e) => setSelected(e.target.value)}>
          {procedures.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
        {proc && (
          <div className="mt-4 space-y-2 text-sm">
            <div><strong>الجهة:</strong> {proc.authority}</div>
            <div><strong>المراحل:</strong> {proc.stages.join(" → ")}</div>
            <div><strong>الوثائق:</strong> {proc.documents.join("، ")}</div>
            <div><strong>الآجال:</strong> {proc.deadlines}</div>
            <div><strong>الرسوم:</strong> {proc.fees}</div>
            <div><strong>طرق الطعن:</strong> {proc.remedies.join("، ")}</div>
            <div><strong>المساعدة القانونية:</strong> {proc.legalAid}</div>
            <div className="text-xs text-graphite-soft">المصادر: {proc.sources.join("، ")}</div>
          </div>
        )}
      </section>

      <section className="aadala-card space-y-3 p-5">
        <h2 className="font-semibold text-navy">مولد المسودات</h2>
        <select className="w-full rounded border border-border px-3 py-2 text-sm" value={docType} onChange={(e) => setDocType(e.target.value as ProcedureDocType)}>
          {(["طلب","شكاية","إنذار","مراسلة","مذكرة","تصريح"] as ProcedureDocType[]).map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <input className="w-full rounded border border-border px-3 py-2 text-sm" placeholder="الاسم" value={partyName} onChange={(e) => setPartyName(e.target.value)} />
        <input className="w-full rounded border border-border px-3 py-2 text-sm" placeholder="الموضوع" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <textarea className="w-full rounded border border-border px-3 py-2 text-sm" rows={3} placeholder="الوقائع" value={facts} onChange={(e) => setFacts(e.target.value)} />
        <textarea className="w-full rounded border border-border px-3 py-2 text-sm" rows={2} placeholder="الطلب" value={request} onChange={(e) => setRequest(e.target.value)} />
        <button onClick={gen} className="aadala-btn-primary">توليد مسودة</button>
        <div className="pt-1">
          <DownloadButton fileUrl={draft ? `data:text/plain;charset=utf-8,${encodeURIComponent(draft)}` : "#"} label="تنزيل المسودة" />
        </div>
        {draft && <textarea className="mt-3 w-full rounded border border-border bg-ivory px-3 py-2 text-sm" rows={16} value={draft} onChange={(e) => setDraft(e.target.value)} />}
      </section>

      <DeadlineCalculator />
      <DeadlineEngineCalculator />
      <DocumentGenerator />
    </div>
  );
}
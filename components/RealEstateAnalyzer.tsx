"use client";
import { useState } from "react";
import { analyzePropertyConflict, TOPICS } from "@/lib/real-estate/analyzer";
import type { PropertyConflict, PropertyReport, PropertyType, TitleSource } from "@/lib/real-estate/types";

export default function RealEstateAnalyzer() {
  const [parties, setParties] = useState("أحمد (مدعي)؛ فاطمة (مدعى عليها)");
  const [propertyType, setPropertyType] = useState<PropertyType>("محفظ");
  const [titleSource, setTitleSource] = useState<TitleSource>("رسم عقاري");
  const [titleRef, setTitleRef] = useState("");
  const [facts, setFacts] = useState("");
  const [docs, setDocs] = useState("");
  const [claims, setClaims] = useState("");
  const [prior, setPrior] = useState("");
  const [report, setReport] = useState<PropertyReport | null>(null);

  function run() {
    const ps = parties.split(";").map((p, i) => ({ id: String(i), name: p.trim(), role: i === 0 ? "مدعي" : "مدعى عليه" })).filter((p) => p.name);
    const input: PropertyConflict = {
      parties: ps,
      propertyType,
      titleSource,
      titleRef: titleRef || undefined,
      facts,
      documents: docs.split("\n").map((d) => d.trim()).filter(Boolean),
      claims: claims.split("\n").map((c) => c.trim()).filter(Boolean),
      priorProceedings: prior.split("\n").map((p) => p.trim()).filter(Boolean),
    };
    setReport(analyzePropertyConflict(input));
  }

  return (
    <div className="space-y-6">
      <section className="aadala-card p-5">
        <h2 className="font-semibold text-navy">مواضيع العقار</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {TOPICS.map((t) => <span key={t} className="rounded-full border border-border bg-ivory px-3 py-1 text-xs text-graphite">{t}</span>)}
        </div>
      </section>

      <section className="aadala-card space-y-3 p-5">
        <h2 className="font-semibold text-navy">إدخال النزاع</h2>
        <label className="block text-xs">الأطراف (افصل بـ ;)<textarea className="mt-1 w-full rounded border border-border px-2 py-1 text-sm" rows={2} value={parties} onChange={(e) => setParties(e.target.value)} /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs">طبيعة العقار<select className="mt-1 w-full rounded border border-border px-2 py-1 text-sm" value={propertyType} onChange={(e) => setPropertyType(e.target.value as PropertyType)}><option>محفظ</option><option>غير محفظ</option><option>مشاع</option><option>وقف</option><option>أحباس</option><option>أخرى</option></select></label>
          <label className="text-xs">مصدر الحق<select className="mt-1 w-full rounded border border-border px-2 py-1 text-sm" value={titleSource} onChange={(e) => setTitleSource(e.target.value as TitleSource)}><option>رسم عقاري</option><option>عقد</option><option>إرث</option><option>حيازة</option><option>قرار إداري</option><option>أخرى</option></select></label>
        </div>
        <label className="block text-xs">مرجع السند<input className="mt-1 w-full rounded border border-border px-2 py-1 text-sm" value={titleRef} onChange={(e) => setTitleRef(e.target.value)} placeholder="رقم الرسم العقاري/العقد" /></label>
        <label className="block text-xs">الوقائع<textarea className="mt-1 w-full rounded border border-border px-2 py-1 text-sm" rows={3} value={facts} onChange={(e) => setFacts(e.target.value)} /></label>
        <label className="block text-xs">الوثائق (سطر لكل وثيقة)<textarea className="mt-1 w-full rounded border border-border px-2 py-1 text-sm" rows={3} value={docs} onChange={(e) => setDocs(e.target.value)} /></label>
        <label className="block text-xs">المطالب<textarea className="mt-1 w-full rounded border border-border px-2 py-1 text-sm" rows={2} value={claims} onChange={(e) => setClaims(e.target.value)} /></label>
        <label className="block text-xs">الإجراءات السابقة<textarea className="mt-1 w-full rounded border border-border px-2 py-1 text-sm" rows={2} value={prior} onChange={(e) => setPrior(e.target.value)} /></label>
        <button onClick={run} className="aadala-btn-primary mt-2">تحليل</button>
      </section>

      {report && (
        <section className="aadala-card space-y-3 p-5">
          <h2 className="font-semibold text-navy">تقرير أولي</h2>
          <div className="text-sm"><strong>المسائل القانونية:</strong><ul className="list-disc pr-5">{report.legalIssues.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
          <div className="text-sm"><strong>المصادر المحتملة:</strong><ul className="list-disc pr-5">{report.possibleSources.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
          <div className="text-sm"><strong>الوثائق الناقصة:</strong><ul className="list-disc pr-5">{report.missingDocuments.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
          <div className="text-sm"><strong>الخيارات الإجرائية:</strong><ul className="list-disc pr-5">{report.proceduralOptions.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
          <div className="rounded border border-gold/60 bg-gold/10 p-3 text-xs text-graphite">
            {report.disclaimer}
            <ul className="mt-1 list-disc pr-5">{report.warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
          </div>
        </section>
      )}
    </div>
  );
}
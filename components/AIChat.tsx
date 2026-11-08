"use client";
import { useState } from "react";

interface Answer {
  factsAssumed: string;
  legalIssue: string;
  legalBasis: string;
  analysis: string;
  possibleApplications: string;
  references: { sourceSlug: string; sourceTitle: string; excerpt: string; location?: string }[];
  certainty: string;
  missingInfo: string[];
  disclaimer: string;
  textInterpretation: string;
  oldVsNewComparison: string;
  procedurePath: string[];
  documentList: string[];
  legalSummary: string;
  draftTemplate: string;
}

export default function AIChat({ locale }: { locale: string }) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [ans, setAns] = useState<Answer | null>(null);

  async function ask() {
    if (!q.trim()) return;
    setLoading(true);
    setAns(null);
    try {
      const res = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: q, locale }) });
      const data = await res.json();
      setAns(data);
    } finally { setLoading(false); }
  }

  return (
    <div className="space-y-4">
      <textarea className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm focus:border-teal focus:outline-none" rows={4} value={q} onChange={(e) => setQ(e.target.value)} placeholder="اكتب سؤالك القانوني (عربي، دارجة، فرنسية)..." />
      <button onClick={ask} disabled={loading} className="aadala-btn-primary disabled:opacity-60">
        {loading ? "جارٍ..." : "إرسال"}
      </button>
      {ans && (
        <div className="aadala-card space-y-4 p-5">
          <Section title="1. الوقائع المفترضة" body={ans.factsAssumed} />
          <Section title="2. الإشكال القانوني" body={ans.legalIssue} />
          <Section title="3. الأساس القانوني" body={ans.legalBasis} />
          <Section title="4. التحليل" body={ans.analysis} />
          <Section title="5. التطبيقات المحتملة" body={ans.possibleApplications} />
          {ans.textInterpretation && <Section title="10. تفسير النصوص" body={ans.textInterpretation} />}
          {ans.oldVsNewComparison && <Section title="11. مقارنة النصوص القديمة والجديدة" body={ans.oldVsNewComparison} />}
          {ans.procedurePath?.length > 0 && (
            <div>
              <h3 className="font-semibold text-navy">9. المسار الإجرائي (أولي)</h3>
              <ol className="mt-1 list-decimal pr-5 text-sm text-graphite">{ans.procedurePath.map((p, i) => <li key={i}>{p}</li>)}</ol>
            </div>
          )}
          {ans.documentList?.length > 0 && (
            <div>
              <h3 className="font-semibold text-navy">قائمة الوثائق المحتملة</h3>
              <ul className="mt-1 list-disc pr-5 text-sm text-graphite">{ans.documentList.map((d, i) => <li key={i}>{d}</li>)}</ul>
            </div>
          )}
          {ans.legalSummary && <Section title="ملخص قانوني" body={ans.legalSummary} />}
          <div>
            <h3 className="font-semibold text-navy">6. المراجع</h3>
            <ul className="mt-2 space-y-2">
              {ans.references.map((r, i) => (
                <li key={i} className="rounded border border-border bg-bg p-2 text-xs">
                  <div className="font-semibold text-navy">{r.sourceTitle}{r.location ? ` — ${r.location}` : ""}</div>
                  <div className="text-graphite-soft">{r.excerpt.slice(0, 240)}…</div>
                </li>
              ))}
            </ul>
          </div>
          <Section title="7. درجة اليقين" body={ans.certainty} />
          <Section title="8. المعلومات الناقصة" body={ans.missingInfo.join("، ")} />
          {ans.draftTemplate && (
            <div>
              <h3 className="font-semibold text-navy">مسودة أولية (قابلة للتعديل)</h3>
              <textarea className="mt-1 w-full rounded border border-border bg-bg p-3 text-sm" rows={10} defaultValue={ans.draftTemplate} />
            </div>
          )}
          <div className="rounded border border-gold/60 bg-gold/10 p-3 text-xs text-graphite">{ans.disclaimer}</div>
        </div>
      )}
    </div>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="font-semibold text-navy">{title}</h3>
      <p className="mt-1 text-sm leading-7 text-graphite">{body}</p>
    </div>
  );
}
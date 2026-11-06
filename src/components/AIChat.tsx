"use client";
import { useState } from "react";

interface Answer {
  factsAssumed: string;
  legalIssue: string;
  legalBasis: string;
  analysis: string;
  possibleApplications: string;
  references: { sourceSlug: string; sourceTitle: string; excerpt: string }[];
  certainty: string;
  missingInfo: string[];
  disclaimer: string;
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
      <textarea className="w-full rounded-lg border border-border bg-ivory px-4 py-3 text-sm focus:border-gold focus:outline-none" rows={4} value={q} onChange={(e) => setQ(e.target.value)} placeholder="اكتب سؤالك القانوني..." />
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
          <div>
            <h3 className="font-semibold text-navy">6. المراجع</h3>
            <ul className="mt-2 space-y-2">
              {ans.references.map((r, i) => (
                <li key={i} className="rounded border border-border bg-ivory p-2 text-xs">
                  <div className="font-semibold text-navy">{r.sourceTitle}</div>
                  <div className="text-graphite-soft">{r.excerpt.slice(0, 240)}…</div>
                </li>
              ))}
            </ul>
          </div>
          <Section title="7. درجة اليقين" body={ans.certainty} />
          <Section title="8. المعلومات الناقصة" body={ans.missingInfo.join("، ")} />
          <div className="rounded border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">{ans.disclaimer}</div>
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
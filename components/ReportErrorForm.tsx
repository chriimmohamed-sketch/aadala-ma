"use client";

import { useState } from "react";

const TYPES = ["نص مادة", "رقم جريدة", "تاريخ", "مصدر", "تصحيح", "أخرى"];

export default function ReportErrorForm({ initialLocation = "" }: { initialLocation?: string }) {
  const [errorType, setErrorType] = useState(TYPES[0]);
  const [location, setLocation] = useState(initialLocation);
  const [problem, setProblem] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const preview = `بلاغ عن خطأ\nالنوع: ${errorType}\nالموقع: ${location}\nالوصف: ${problem}${suggestion ? `\nالتصحيح المقترح: ${suggestion}` : ""}${sourceUrl ? `\nالمصدر: ${sourceUrl}` : ""}`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/reports/error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ errorType, location, problem, suggestion, sourceUrl, contactEmail }),
      });
      if (!res.ok) throw new Error("failed");
      setSent(true);
    } catch {
      setError("تعذّر إرسال البلاغ (جدول error_reports غير مُطبَّق بعد في Supabase).");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="aadala-card mx-auto max-w-2xl space-y-3 p-6">
        <h1 className="text-xl font-bold text-navy">وصل البلاغ — شكرًا</h1>
        <p className="text-sm text-graphite-soft">سيُراجع فريقنا البلاغ ويصحح عند التأكد. لا رد تلقائي.</p>
        <pre className="whitespace-pre-wrap rounded border border-border bg-ivory p-3 text-xs">{preview}</pre>
        <button type="button" className="aadala-btn-gold text-xs" onClick={() => { navigator.clipboard.writeText(preview); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
          {copied ? "تم النسخ ✓" : "انسخ المعاينة"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="aadala-card mx-auto max-w-2xl space-y-3 p-6">
      <h1 className="text-xl font-bold text-navy">أبلغ عن خطأ في هذه المادة</h1>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-xs">نوع الخطأ
          <select className="mt-1 w-full rounded border border-border bg-surface px-3 py-2 text-sm" value={errorType} onChange={(e) => setErrorType(e.target.value)}>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label className="text-xs">الموقع (نص مادة/مصدر)
          <input className="mt-1 w-full rounded border border-border bg-surface px-3 py-2 text-sm" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="مثال: obligations-contrats — الفصل 230" />
        </label>
      </div>
      <label className="block text-xs">ماذا يخالف؟ *
        <textarea required className="mt-1 w-full rounded border border-border bg-surface px-3 py-2 text-sm" rows={3} value={problem} onChange={(e) => setProblem(e.target.value)} />
      </label>
      <label className="block text-xs">التصحيح المقترح
        <textarea className="mt-1 w-full rounded border border-border bg-surface px-3 py-2 text-sm" rows={2} value={suggestion} onChange={(e) => setSuggestion(e.target.value)} />
      </label>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-xs">رابط المصدر (https)
          <input className="mt-1 w-full rounded border border-border bg-surface px-3 py-2 text-sm" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://…" />
        </label>
        <label className="text-xs">بريدك (اختياري)
          <input type="email" className="mt-1 w-full rounded border border-border bg-surface px-3 py-2 text-sm" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
        </label>
      </div>
      {error && <p className="rounded border border-danger/60 bg-danger/10 p-2 text-xs text-danger">{error}</p>}
      <button type="submit" disabled={loading} className="aadala-btn-primary text-sm disabled:opacity-50">
        {loading ? "جارٍ الإرسال…" : "إرسال البلاغ"}
      </button>
      <p className="text-xs text-graphite-soft">سيُراجع المستخلص شخصيًا — لا يُصحح شيئًا تلقائيًا.</p>
    </form>
  );
}

"use client";

import { useEffect, useState } from "react";

interface Field { name: string; label: string; type: string; required: boolean; }
interface Template {
  id: string; title: string; category: string;
  description: string | null; legal_basis: string | null;
  required_fields: Field[]; template_html: string;
}

const CATEGORIES: [string, string][] = [
  ["real_estate", "عقاري"], ["employment", "شغل"], ["family", "أسرة"],
  ["commercial", "تجاري"], ["civil", "مدني"], ["criminal", "جنائي"],
];

export default function DocumentGenerator() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [category, setCategory] = useState("real_estate");
  const [selected, setSelected] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [aiPrompt, setAiPrompt] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`/api/documents/templates?category=${category}`);
        const j = await r.json().catch(() => ({}));
        if (cancelled) return;
        if (!r.ok) throw new Error(j.error || "error");
        setTemplates(j.data ?? []);
        setLoadError(null);
      } catch (e: unknown) {
        if (!cancelled) { setTemplates([]); setLoadError(e instanceof Error ? e.message : "error"); }
      }
    })();
    return () => { cancelled = true; };
  }, [category]);

  function handleSelect(t: Template) {
    setSelected(t);
    setFormData({});
    setPreview("");
    setAiPrompt("");
    setError(null);
    setStep(2);
  }

  async function handleGenerate() {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/documents/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: selected.id, formData, aiPrompt: aiPrompt.trim() || undefined }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `HTTP ${res.status}`);
      }
      const json = await res.json();
      setPreview(json.data.final_html ?? "");
      setStep(3);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="aadala-card space-y-4 p-5">
      <h2 className="font-semibold text-navy">مولد الوثائق القانونية الذكي</h2>

      <div className="flex justify-center gap-3 text-xs">
        {[1, 2, 3].map((s) => (
          <span key={s} className={`flex items-center gap-1 ${step >= s ? "text-teal" : "text-graphite-soft"}`}>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full font-bold ${step >= s ? "bg-teal text-white" : "bg-ivory-deep"}`}>{s}</span>
            {s === 1 ? "القالب" : s === 2 ? "البيانات" : "المعاينة"}
          </span>
        ))}
      </div>

      {step === 1 && (
        <div>
          <div className="mb-4 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map(([k, v]) => (
              <button key={k} type="button" onClick={() => setCategory(k)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${category === k ? "bg-teal text-white" : "border border-border bg-surface text-graphite"}`}>
                {v}
              </button>
            ))}
          </div>
          {loadError && <p className="rounded border border-gold/60 bg-gold/10 p-3 text-xs text-graphite">تعذر تحميل القوالب ({loadError}). طبّق `0003` في Supabase SQL Editor أو سجّل الدخول.</p>}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {templates.map((t) => (
              <button key={t.id} type="button" onClick={() => handleSelect(t)} className="rounded border border-border bg-surface p-4 text-right">
                <h3 className="font-bold text-navy">{t.title}</h3>
                <p className="mt-1 text-xs text-graphite-soft">{t.description}</p>
                {t.legal_basis && <p className="mt-2 inline-block rounded bg-teal/10 px-2 py-1 text-[11px] text-teal">المرجع: {t.legal_basis}</p>}
              </button>
            ))}
            {!loadError && templates.length === 0 && <p className="col-span-2 py-6 text-center text-sm text-graphite-soft">لا توجد قوالب في هذه الفئة بعد.</p>}
          </div>
        </div>
      )}

      {step === 2 && selected && (
        <div>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-navy">{selected.title}</h3>
              {selected.legal_basis && <p className="mt-1 text-xs text-teal">المرجع: {selected.legal_basis}</p>}
            </div>
            <button type="button" onClick={() => setStep(1)} className="text-xs text-graphite-soft">← تغيير القالب</button>
          </div>
          <div className="space-y-3">
            {selected.required_fields.map((f) => (
              <div key={f.name}>
                <label className="mb-1 block text-xs font-medium text-graphite">
                  {f.label} {f.required && <span className="text-danger">*</span>}
                </label>
                {f.type === "textarea" ? (
                  <textarea rows={3} value={formData[f.name] ?? ""} onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                    className="w-full rounded border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-teal" />
                ) : (
                  <input type={f.type} value={formData[f.name] ?? ""} onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                    className="w-full rounded border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-teal" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 rounded border border-teal/30 bg-teal/5 p-3">
            <h4 className="text-sm font-bold text-navy">مساعد الصياغة الذكي</h4>
            <p className="mb-2 text-xs text-graphite-soft">اطلب بندًا إضافيًا بالعربية — يُصاغ كمسرودة وتحتاج مراجعة مختص.</p>
            <textarea rows={3} value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="مثال: أضف شرطًا جزائيًا بقيمة 10% من الثمن عند الإخلال…"
              className="w-full rounded border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-teal" />
          </div>

          {error && <div className="mt-3 rounded border border-danger/50 bg-danger/10 p-3 text-xs text-danger">⚠️ {error}</div>}
          <button type="button" onClick={handleGenerate} disabled={loading} className="aadala-btn-primary mt-3 w-full text-sm disabled:opacity-60">
            {loading ? "جارٍ التوليد…" : "توليد الوثيقة"}
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-navy">المعاينة</h3>
            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(2)} className="rounded border border-border bg-surface px-3 py-1.5 text-xs">← تعديل</button>
              <button type="button" onClick={() => window.print()} className="aadala-btn-primary text-xs">طباعة / PDF</button>
            </div>
          </div>
          <div className="rounded border border-border bg-surface p-6 shadow-sm print:border-none" dangerouslySetInnerHTML={{ __html: preview }} />
          <p className="mt-4 text-center text-xs text-graphite-soft">⚖️ هذه الوثيقة مسودة آلية. راجعها مع محامٍ مختص قبل الاعتماد الرسمي.</p>
        </div>
      )}
    </section>
  );
}

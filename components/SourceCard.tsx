import type { LegalDocument } from "@/lib/legal-data/types";

/** Unified source verification card — same for every law. */
export default function SourceCard({ doc }: { doc: LegalDocument }) {
  const m = doc.metadata;
  return (
    <aside className="aadala-card space-y-2 p-4 text-sm">
      <h3 className="font-bold text-navy">بطاقة المصدر</h3>
      <dl className="grid grid-cols-1 gap-1">
        <div><dt className="font-semibold text-brass">النص</dt><dd className="text-graphite">{m.title}</dd></div>
        <div><dt className="font-semibold text-brass">النوع</dt><dd className="text-graphite">{m.type}</dd></div>
        <div><dt className="font-semibold text-brass">رقم الظهير</dt><dd className="text-graphite">{m.lawNumber ?? "—"}</dd></div>
        <div><dt className="font-semibold text-brass">تاريخ الظهير</dt><dd className="text-graphite">{m.promulgated ?? "—"}</dd></div>
        <div><dt className="font-semibold text-brass">الجريدة الرسمية</dt><dd className="text-graphite">{m.published ?? "—"}</dd></div>
        <div><dt className="font-semibold text-brass">الصيغة</dt><dd className="text-graphite">{m.version}</dd></div>
        <div><dt className="font-semibold text-brass">الحالة</dt><dd className="text-graphite">{m.status === "active" ? "ساري (قيد المراجعة)" : m.status}</dd></div>
        <div><dt className="font-semibold text-brass">حالة التحقق</dt><dd className="text-graphite">{m.verified ? "مُراجع" : "قيد المراجعة"}</dd></div>
        {m.sha256 && (
          <div><dt className="font-semibold text-brass">SHA-256</dt><dd className="text-graphite" dir="ltr">{m.sha256.slice(0, 16)}…</dd></div>
        )}
      </dl>
      <p className="mt-2 text-xs text-graphite-soft">{m.sourceNote}</p>
    </aside>
  );
}

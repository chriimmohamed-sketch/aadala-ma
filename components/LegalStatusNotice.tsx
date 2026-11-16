/**
 * LegalStatusNotice — the platform-wide legal-status warning.
 *
 * The consolidated texts have NOT been checked against the Journal Officiel's
 * effectiveness ("نفاذ") records. The registry values for amendments /
 * abrogation / effective are transcriptions of what each source PDF says about
 * itself — not a legal-status verification.
 *
 * Every page that surfaces legal material must render this notice, so a reader
 * can never mistake a transcription for a verified status.
 *
 * Additive: introduced 2026-11-16 alongside the legal-status audit.
 */

const DEFAULT_TEXT = "الحالة القانونية (ساري/معدّل/ملغى) لم تُتحقق بعد من سجلات النفاذ في الجريدة الرسمية. هذه المواد للاستعراض والاسترشاد فقط ولا تغني عن الاستشارة القانونية — راجع مختصًا أو المحكمة المعنية.";

export default function LegalStatusNotice({
  text = DEFAULT_TEXT,
  className = "",
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div
      role="note"
      aria-label="تنبيه الحالة القانونية"
      className={`aadala-card p-4 border border-danger/30 bg-danger/5 ${className}`}
    >
      <p className="text-xs font-medium text-danger">
        <span aria-hidden="true">⚠️</span> تنبيه: {text}
      </p>
    </div>
  );
}

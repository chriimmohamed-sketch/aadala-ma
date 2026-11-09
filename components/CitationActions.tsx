"use client";

import { useState } from "react";
import Link from "next/link";

/** Copy-citation + report-error actions for an article page (client island). */
export default function CitationActions({
  locale,
  title,
  lawNumber,
  slug,
  promulgated,
  published,
}: {
  locale: string;
  title: string;
  lawNumber: string;
  slug: string;
  promulgated: string | null;
  published: string | null;
}) {
  const [copied, setCopied] = useState(false);
  const citation = `${title} — ${lawNumber}${promulgated ? ` — ${promulgated}` : ""}${published ? ` — ${published}` : ""} (AADALA.MA)`;

  function copy() {
    try {
      navigator.clipboard.writeText(citation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <button type="button" onClick={copy} className="aadala-btn-gold text-xs">
        {copied ? "تم النسخ ✓" : "انسخ الإحالة"}
      </button>
      <Link
        href={`/${locale}/report?location=${encodeURIComponent(`${title} — ${lawNumber}`)}`}
        className="aadala-btn-ghost text-xs"
      >
        أبلغ عن خطأ في هذه المادة
      </Link>
      <span className="text-[11px] text-graphite-soft">{slug}</span>
    </div>
  );
}

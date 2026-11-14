"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Page-level error boundary (additive — does not replace any existing file).
 * Catches unhandled errors in the [locale] segment and shows a safe Arabic message.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log only the digest — never the full stack or user data.
    if (error?.digest) console.error("page-error", error.digest);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-4 text-center">
      <div className="aadala-card max-w-md space-y-4 p-8">
        <h1 className="text-2xl font-bold text-navy">حدث خطأ غير متوقع</h1>
        <p className="text-sm text-graphite-soft">
          تعذّر عرض هذه الصفحة. يمكنك إعادة المحاولة، أو العودة إلى الرئيسية.
        </p>
        {error?.digest && (
          <p className="text-xs text-graphite-soft" dir="ltr">
            ref: {error.digest}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-2">
          <button type="button" onClick={reset} className="aadala-btn-primary text-sm">
            إعادة المحاولة
          </button>
          <Link href="/" className="aadala-btn-ghost text-sm">
            الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";

/**
 * Root error boundary (additive — catches errors in the root layout).
 * Must include <html> and <body> since it replaces the root layout.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (error?.digest) console.error("global-error", error.digest);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body className="flex min-h-screen items-center justify-center bg-ivory text-graphite">
        <div className="aadala-card max-w-md space-y-4 p-8 text-center">
          <h1 className="text-2xl font-bold text-navy">حدث خطأ غير متوقع</h1>
          <p className="text-sm text-graphite-soft">
            تعذّر تحميل التطبيق. أعد المحاولة.
          </p>
          {error?.digest && (
            <p className="text-xs text-graphite-soft" dir="ltr">
              ref: {error.digest}
            </p>
          )}
          <button type="button" onClick={reset} className="aadala-btn-primary text-sm">
            إعادة المحاولة
          </button>
        </div>
      </body>
    </html>
  );
}

"use client";

export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="page-title">حدث خطأ غير متوقع</h1>
      <p className="text-sm text-muted">تعذّر عرض هذه الصفحة. يمكنك إعادة المحاولة، وإن استمرت المشكلة فالرجاء إبلاغنا.</p>
      {error.digest && <code className="text-xs text-muted">رمز الخطأ: {error.digest}</code>}
      <button type="button" className="aadala-btn-primary" onClick={() => reset()}>إعادة المحاولة</button>
    </main>
  );
}

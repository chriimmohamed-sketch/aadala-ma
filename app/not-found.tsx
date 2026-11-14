import Link from "next/link";

/**
 * Custom 404 page (additive — does not replace any existing file).
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-4 text-center">
      <div className="aadala-card max-w-md space-y-4 p-8">
        <h1 className="text-4xl font-bold text-navy">404</h1>
        <p className="text-sm text-graphite-soft">
          الصفحة التي تبحث عنها غير موجودة. قد تكون نُقلت أو حُذفت.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/" className="aadala-btn-primary text-sm">
            الرئيسية
          </Link>
          <Link href="/legal" className="aadala-btn-ghost text-sm">
            المكتبة
          </Link>
        </div>
      </div>
    </div>
  );
}

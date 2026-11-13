import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="num">404</p>
      <h1 className="page-title">الصفحة غير موجودة</h1>
      <p className="text-sm text-muted">ربما تغيّر الرابط أو لم تعد الصفحة متاحة. جرّب البحث في النصوص القانونية.</p>
      <div className="flex gap-3">
        <Link href="/ar" className="aadala-btn-primary">الصفحة الرئيسية</Link>
        <Link href="/ar/search" className="aadala-btn-ghost">البحث</Link>
      </div>
    </main>
  );
}

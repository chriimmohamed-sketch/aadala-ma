import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  return (
    <div className="flex min-h-screen flex-col">
      <Header locale={locale} messages={messages} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="text-2xl font-bold">لوحة الإدارة</h1>
        <p className="mt-2 text-sm text-slate-600">قيد التطوير. تتطلب مصادقة وصلاحيات (RBAC).</p>
        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {["إدارة المصادر", "مراجعة المحتوى", "سجلات التدقيق", "الترجمات", "المستخدمون", "النسخ الاحتياطي"].map((t) => (
            <div key={t} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-slate-900">{t}</h2>
              <p className="mt-1 text-xs text-slate-500">قيد التطوير</p>
            </div>
          ))}
        </section>
        <section className="mt-8 rounded border border-slate-200 bg-white p-4">
          <h2 className="font-semibold">سير الاستيراد/المراجعة/النشر</h2>
          <ol className="mt-2 list-decimal pr-6 text-sm text-slate-700">
            <li>رفع source (PDF/URL) + تسجيل metadata + checksum + حقوق استخدام.</li>
            <li>استخراج النص (OCR/parse) + تطبيع Unicode.</li>
            <li>تقسيم إلى مواد/فصول + مراجعة بشرية.</li>
            <li>اعتماد (review) → نشر (publish) → أرشفة نسخة.</li>
            <li>تسجيل تعديلات/إلغاءات + تاريخ نفاذ.</li>
          </ol>
        </section>
      </main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}
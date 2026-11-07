import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { legalSources } from "@/data/legal-sources";
import { legalCategories } from "@/data/legal-categories";
import Link from "next/link";

export default async function LegalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header locale={locale} messages={messages} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-bold text-navy">الموسوعة القانونية</h1>
        <div className="aadala-divider mt-3" />
        <p className="mt-3 text-sm text-muted">17 تصنيفاً. لا محتوى افتراضي — كل نص مرتبط بمصدر قابل للتحقق.</p>

        <h2 className="mt-8 text-xl font-bold text-navy">التصنيفات (17)</h2>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {legalCategories.map((c) => (
            <div key={c} className="aadala-card p-3 text-sm text-navy">{c}</div>
          ))}
        </div>

        <h2 className="mt-10 text-xl font-bold text-navy">المصادر المدمجة (7)</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {legalSources.map((s) => (
            <Link key={s.slug} href={`/${locale}/legal/${s.slug}`} className="aadala-card block p-5">
              <span className="text-xs font-semibold text-brass">{s.type}</span>
              <h3 className="mt-2 font-semibold text-navy">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.description}</p>
            </Link>
          ))}
        </div>

        <section className="mt-10 rounded border border-border bg-surface p-4">
          <h2 className="font-semibold text-navy">نظام الاستيراد/المراجعة/التحديث</h2>
          <ol className="mt-2 list-decimal pr-6 text-sm text-graphite">
            <li>رفع source (PDF/URL) + تسجيل metadata + checksum + حقوق استخدام.</li>
            <li>استخراج النص (parse) + تطبيع Unicode (NFKC).</li>
            <li>تقسيم إلى مواد/فصول + مراجعة بشرية.</li>
            <li>اعتماد (review) → نشر (publish) → أرشفة نسخة.</li>
            <li>تسجيل تعديلات/إلغاءات + تاريخ نفاذ.</li>
          </ol>
          <p className="mt-3 text-xs text-muted">Schema: supabase/schema.sql (8 tables). RBAC: src/lib/admin/permissions.ts.</p>
        </section>
      </main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}
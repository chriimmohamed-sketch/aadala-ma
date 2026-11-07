import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { legalSources } from "@/data/legal-sources";
import Link from "next/link";

export default async function LegalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <Header locale={locale} messages={messages} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy">المكتبة القانونية</h1>
          <div className="aadala-divider mt-3" />
          <p className="mt-3 text-sm text-graphite-soft">نصوص قانونية مستخرجة من وثائق PDF. تحقق من الجريدة الرسمية قبل الاعتماد.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {legalSources.map((s) => (
            <Link key={s.slug} href={`/${locale}/legal/${s.slug}`} className="aadala-card block p-5">
              <span className="text-xs font-semibold text-gold">{s.type}</span>
              <h2 className="mt-2 font-semibold text-navy">{s.title}</h2>
              <p className="mt-1 text-sm text-graphite-soft">{s.description}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}
import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { legalSources } from "@/data/legal-sources";
import Link from "next/link";

export default async function LegalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  return (
    <div className="flex min-h-screen flex-col">
      <Header locale={locale} messages={messages} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="text-2xl font-bold">الموسوعة القانونية</h1>
        <p className="mt-2 text-sm text-slate-600">مصادر قانونية مستخرجة من وثائق PDF مقدمة. النصوص لأغراض مرجعية؛ تحقق من الجريدة الرسمية.</p>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {legalSources.map((s) => (
            <Link key={s.slug} href={`/${locale}/legal/${s.slug}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow">
              <span className="text-xs text-slate-500">{s.type}</span>
              <h2 className="mt-1 font-semibold text-slate-900">{s.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{s.description}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}
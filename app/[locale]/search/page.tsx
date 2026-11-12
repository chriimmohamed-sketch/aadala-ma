import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default async function SearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <Header locale={locale} messages={messages} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-bold text-navy">البحث</h1>
        <div className="aadala-divider mt-3" />
        <div className="mt-6 flex gap-3">
          <input className="flex-1 rounded-lg border border-border bg-surface px-5 py-3 text-sm focus:border-gold focus:outline-none" placeholder="ابحث في النصوص والمواد..." />
          <button className="aadala-btn-primary">بحث</button>
        </div>
        <p className="mt-4 text-xs text-graphite-soft">قيد التطوير — البحث النصي/الدلالي.</p>
      </main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}
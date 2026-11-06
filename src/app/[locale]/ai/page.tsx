import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function AIPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <Header locale={locale} messages={messages} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-bold text-navy">المساعد القانوني الذكي</h1>
        <div className="aadala-divider mt-3" />
        <p className="mt-3 text-sm text-graphite-soft">RAG موثق المصادر. قيد التطوير.</p>
        <div className="mt-6 rounded-xl border border-border bg-surface p-4 shadow-sm">
          <textarea className="w-full rounded-lg border border-border bg-ivory px-4 py-3 text-sm focus:border-gold focus:outline-none" rows={5} placeholder="اكتب سؤالك القانوني..." />
          <button className="aadala-btn-primary mt-3">إرسال</button>
        </div>
      </main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}
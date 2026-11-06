import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; const messages = await getMessages(locale);
  return (
    <div className="flex min-h-screen flex-col">
      <Header locale={locale} messages={messages} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="text-2xl font-bold">المساعد القانوني الذكي</h1>
        <p className="mt-2 text-sm text-slate-600">قيد التطوير — RAG مع إحالات مصدرية.</p>
        <div className="mt-4 rounded border border-slate-200 bg-white p-4">
          <textarea className="w-full rounded border border-slate-300 p-2 text-sm" rows={4} placeholder="اكتب سؤالك..." />
          <button className="mt-2 rounded bg-slate-900 px-4 py-2 text-sm text-white">إرسال</button>
        </div>
      </main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}
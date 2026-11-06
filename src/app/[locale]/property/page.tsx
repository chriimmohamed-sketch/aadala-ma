import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; const messages = await getMessages(locale);
  return (<div className="flex min-h-screen flex-col"><Header locale={locale} messages={messages}/><main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10"><h1 className="text-2xl font-bold">العقار والشياع</h1><p className="mt-2 text-sm text-slate-600">قيد التطوير.</p></main><Footer locale={locale} messages={messages}/></div>);
}
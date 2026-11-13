import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default async function ShowcasePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  return (
    <div className="flex min-h-screen flex-col">
      <Header locale={locale} messages={messages} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <div className="aadala-card p-8">
          <h1 className="text-3xl font-bold">المعرض — AADALA.MA</h1>
          <div className="aadala-divider my-4" />
          <p className="mt-3 text-sm text-graphite-soft">
            عرض الأفكار والمسارات التصميمية والتشغيلية للمنصة.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="aadala-card p-5">
            <h2 className="font-semibold">المصادر</h2>
            <p className="mt-1 text-xs text-graphite-soft">9 مستندات قانونية مع 2970 مادة مستخرجة.</p>
          </div>
          <div className="aadala-card p-5">
            <h2 className="font-semibold">الديوان</h2>
            <p className="mt-1 text-xs text-graphite-soft">المساعد القانوني المدعوم بمقارنة مواد.</p>
          </div>
          <div className="aadala-card p-5">
            <h2 className="font-semibold">المعايير</h2>
            <p className="mt-1 text-xs text-graphite-soft">دقة الاستخراج ومراجعة بشرية قبل النشر.</p>
          </div>
        </div>
      </main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}

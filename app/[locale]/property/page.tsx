import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RealEstateAnalyzer from "@/components/RealEstateAnalyzer";

export default async function PropertyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <Header locale={locale} messages={messages} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-bold text-navy">AADALA REAL ESTATE — العقار</h1>
        <div className="aadala-divider mt-3" />
        <p className="mt-3 text-sm text-graphite-soft">تحليل أولي للنزاعات العقارية. لا أحكام قطعية دون دراسة الوثائق.</p>
        <div className="mt-6">
          <RealEstateAnalyzer />
        </div>
      </main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}
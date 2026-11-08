import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ShowcaseGallery from "@/components/ShowcaseGallery";

export default async function ShowcasePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header locale={locale} messages={messages} />
      <main className="flex-1">
        <ShowcaseGallery locale={locale} />
      </main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}

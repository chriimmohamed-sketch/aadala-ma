import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/layout/HeaderSupreme";
import Footer from "@/components/layout/Footer";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";

export default async function ForgotPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <Header locale={locale} messages={messages} />
      <main className="flex-1 py-10">
        <ForgotPasswordForm locale={locale} />
      </main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}

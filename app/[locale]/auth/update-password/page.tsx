import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/layout/HeaderSupreme";
import Footer from "@/components/layout/Footer";
import UpdatePasswordForm from "@/components/UpdatePasswordForm";

export default async function UpdatePasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <Header locale={locale} messages={messages} />
      <main className="flex-1 py-10">
        <UpdatePasswordForm locale={locale} />
      </main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}

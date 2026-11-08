import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header locale={locale} messages={messages} />
      <main className="flex-1 px-4 py-10">
        <LoginForm locale={locale} />
      </main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}

import type { ReactNode } from "react";
import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/layout/HeaderSupreme";
import Footer from "@/components/layout/Footer";

export default async function PageShell({
  locale, title, intro, badge, children,
}: { locale: string; title: string; intro: string; badge?: string; children: ReactNode }) {
  const messages = await getMessages(locale);
  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: "var(--aadala-ivory)", color: "var(--aadala-graphite)" }}>
      <Header locale={locale} messages={messages} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-bold text-navy">{title}</h1>
        <div className="aadala-divider mt-3" />
        {badge ? <span className="chip mt-3 inline-block">{badge}</span> : null}
        <p className="mt-3 max-w-3xl text-sm leading-7 text-graphite-soft">{intro}</p>
        <div className="mt-6">{children}</div>
      </main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}

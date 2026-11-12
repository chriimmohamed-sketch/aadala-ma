import type { Metadata } from "next";
import { getMessages } from "@/lib/i18n/getMessages";
import { isRtl, locales } from "@/lib/i18n/config";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  await params;
  return { title: "AADALA.MA", description: "منصة العدالة والذكاء القانوني المغربي" };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  await getMessages(locale);
  const dir = isRtl(locale) ? "rtl" : "ltr";
  return (
    <html lang={locale} dir={dir}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
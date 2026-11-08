import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages } from "@/lib/i18n/getMessages";
import { isRtl, locales } from "@/lib/i18n/config";
import StorageNotice from "@/components/StorageNotice";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  await params;
  return { title: "AADALA.MA", description: "منصة العدالة والذكاء القانوني المغربي" };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) notFound();
  await getMessages(locale);
  const dir = isRtl(locale) ? "rtl" : "ltr";
  return (
    <html lang={locale} dir={dir}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=Cairo:wght@300;400;600;700;900&family=Reem+Kufi:wght@500;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600&family=Amiri:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-ivory text-graphite antialiased">
        {children}
        <StorageNotice locale={locale} />
      </body>
    </html>
  );
}
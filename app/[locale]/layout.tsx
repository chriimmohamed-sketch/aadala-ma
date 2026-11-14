import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages } from "@/lib/i18n/getMessages";
import { isRtl, locales } from "@/lib/i18n/config";
import StorageNotice from "@/components/StorageNotice";
import GlobalLoader from "@/components/GlobalLoader";
import MobileNavSupreme from "@/components/MobileNavSupreme";
import FloatingAI from "@/components/FloatingAI";
import HtmlLangDir from "@/components/HtmlLangDir";
import SmoothScroll from "@/components/SmoothScroll";
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
    <div lang={locale} dir={dir} className="min-h-screen antialiased" style={{ backgroundColor: "var(--aadala-ivory)", color: "var(--aadala-graphite)" }}>
      <HtmlLangDir locale={locale} rtl={dir === "rtl"} />
      <SmoothScroll />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-navy focus:px-4 focus:py-2 focus:text-ivory">تخطي إلى المحتوى الرئيسي</a>
      <GlobalLoader />
      {children}
      <MobileNavSupreme locale={locale} />
      <FloatingAI locale={locale} />
      <StorageNotice locale={locale} />
    </div>
  );
}

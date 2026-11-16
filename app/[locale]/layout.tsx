import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages } from "@/lib/i18n/getMessages";
import { isRtl, locales } from "@/lib/i18n/config";
import { siteUrl } from "@/lib/site/config";
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

const META_DESCRIPTION =
  "منصة قانونية مغربية مستقلة: القانون بنصّه ومادّته — نصوص موثّقة من الجريدة الرسمية، جواب قابل للتحقق، وأدوات عملية (MIYAR للإرث، المساطر، المساعد الذكي).";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = `${siteUrl}/${locale}`;
  const languages = Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}`]));
  return {
    title: "AADALA.MA — منصة العدالة والذكاء القانوني المغربي",
    description: META_DESCRIPTION,
    alternates: {
      canonical,
      languages: { ...languages, "x-default": `${siteUrl}/ar` },
    },
    openGraph: {
      title: "AADALA.MA — منصة العدالة والذكاء القانوني المغربي",
      description: META_DESCRIPTION,
      type: "website",
      siteName: "AADALA.MA",
      url: canonical,
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title: "AADALA.MA — منصة العدالة والذكاء القانوني المغربي",
      description: META_DESCRIPTION,
    },
    robots: { index: true, follow: true },
  };
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

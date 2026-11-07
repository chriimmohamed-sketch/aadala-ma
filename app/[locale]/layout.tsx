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
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('aadala-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',d?'dark':'light');}catch(e){}})();` }} />
      </head>
      <body className="min-h-screen bg-bg text-ink font-body">
        {children}
      </body>
    </html>
  );
}
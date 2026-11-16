import type { Metadata } from "next";
import { siteUrl, siteName } from "@/lib/site/config";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AADALA.MA — منصة العدالة والذكاء القانوني المغربي",
    template: "%s | AADALA.MA",
  },
  description:
    "منصة قانونية مغربية مستقلة: القانون بنصّه ومادّته — نصوص موثّقة من الجريدة الرسمية، جواب قابل للتحقق، أدوات عملية (MIYAR للإرث، المساطر، المساعد الذكي)، من إعداد MOHAMED CHRAIM.",
  applicationName: siteName,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName,
    title: "AADALA.MA — منصة العدالة والذكاء القانوني المغربي",
    description: "القانون المغربي بنصّه ومادّته — جواب قابل للتحقق، لا جواب بلا سند.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "AADALA.MA — منصة العدالة والذكاء القانوني المغربي",
    description: "القانون المغربي بنصّه ومادّته — جواب قابل للتحقق، لا جواب بلا سند.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('aadala-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=Cairo:wght@300;400;600;700;900&family=Reem+Kufi:wght@500;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600&family=Amiri:wght@400;700&family=Aref+Ruqaa:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased" style={{ backgroundColor: "var(--aadala-ivory)", color: "var(--aadala-graphite)" }}>
        {children}
      </body>
    </html>
  );
}

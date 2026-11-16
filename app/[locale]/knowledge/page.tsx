import type { Metadata } from "next";
import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/layout/HeaderSupreme";
import Footer from "@/components/layout/Footer";
import { knowledge, KNOWLEDGE_CATEGORIES } from "@/data/knowledge";
import KnowledgeHub from "@/components/KnowledgeHub";
import { locales } from "@/lib/i18n/config";
import { siteUrl } from "@/lib/site/config";
import LegalStatusNotice from "@/components/LegalStatusNotice";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const TITLE = "العلم — المعرفة القانونية المبسطة · AADALA.MA";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const description =
    "٣٢ بطاقة مبسطة لأهم موضوعات القانون المغربي — الشغل، مدونة الأسرة، العقود والالتزامات، الجنائي، الإداري والدستوري، الجبائي والمالي، التجاري — مع السند القانوني وتنبيهات التحقق.";
  const languages = Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}/knowledge`]));
  return {
    title: TITLE,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}/knowledge`,
      languages: { ...languages, "x-default": `${siteUrl}/ar/knowledge` },
    },
    openGraph: {
      title: TITLE,
      description,
      type: "website",
      siteName: "AADALA.MA",
      url: `${siteUrl}/${locale}/knowledge`,
    },
  };
}

export default async function KnowledgePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: TITLE,
      description:
        "بطاقات معرفية مبسطة لأهم موضوعات القانون المغربي مع السند القانوني، من إعداد منصة AADALA.MA — ليست استشارة قانونية.",
      inLanguage: locale,
      url: `${siteUrl}/${locale}/knowledge`,
      isPartOf: { "@type": "WebSite", name: "AADALA.MA", url: siteUrl },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "الرئيسية", item: `${siteUrl}/${locale}` },
        { "@type": "ListItem", position: 2, name: "العلم — المعرفة القانونية", item: `${siteUrl}/${locale}/knowledge` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: TITLE,
      hasPart: knowledge.slice(0, 10).map((item) => ({
        "@type": "Article",
        headline: item.title,
        description: item.lead,
        inLanguage: "ar",
      })),
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header locale={locale} messages={messages} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main id="main" className="flex-1">
        <section className="kbd-hero" aria-label="العلم — المعرفة القانونية">
          <div className="kbd-hero-inner wrap">
            <span className="num">AADALA KNOWLEDGE · العلم</span>
            <h1 className="kbd-hero-title">
              المعرفة القانونية <em>بنصّها ومادّتها.</em>
            </h1>
            <p className="lead">
              بطاقات مختصرة لأهم موضوعات القانون المغربي — من الحد الأدنى للأجر إلى المحكمة الدستورية — كل بطاقة
              مع سندها القانوني وتنبيه التحقق، تُقرأ في دقيقتين وتفتح بابا لتعمّق أكثر.
            </p>
            <div className="kbd-disclaimer" role="note">
              <b>منهج AADALA:</b> ملخصات تعليمية مبسطة من مصادر منشورة؛ ليست استشارة قانونية، ولا تغني عن مراجعة النص
              الرسمي في الجريدة الرسمية أو مختص مؤهل قبل أي اعتماد.
            </div>
            <div className="kbd-meta" aria-label="إحصاءات القسم">
              <span><b>{knowledge.length}</b> بطاقة معرفية</span><span className="kbd-sep">/</span>
              <span><b>{KNOWLEDGE_CATEGORIES.length}</b> تصنيفاً</span><span className="kbd-sep">/</span>
              <span><b>100%</b> سند قانوني مذكور</span>
            </div>
          </div>
        </section>

        <section aria-label="البطاقات" className="kbd-body">
          <div className="wrap">
            <LegalStatusNotice className="mb-6" />
            <KnowledgeHub items={knowledge} categories={KNOWLEDGE_CATEGORIES} />
          </div>
        </section>
      </main>

      <Footer locale={locale} messages={messages} />
    </div>
  );
}

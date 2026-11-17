import { getMessages } from "@/lib/i18n/getMessages";
import HomeInteractions from "@/components/HomeInteractions";
import Footer from "@/components/layout/Footer";
import AnswerAnimator from "@/components/AnswerAnimator";
import AgentTerminal from "@/components/aalada-ultimate/AgentTerminal";
import HomeHeader from "@/components/home-moroccan/HomeHeader";
import RealEstateAnalyzer from "@/components/RealEstateAnalyzer";
import { siteUrl } from "@/lib/site/config";

export default async function PropertyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "AADALA.MA — العقار",
      description: "تحليل أولي للنزاعات العقارية. لا أحكام قطعية دون دراسة الوثائق.",
      url: `${siteUrl}/${locale}/property`,
      inLanguage: locale,
      isPartOf: { "@type": "WebSite", name: "AADALA.MA", url: siteUrl },
    },
  ];
  return (
    <div id="v-home" className="mh-page flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="bar" id="bar" />
      <HomeInteractions locale={locale} />
      <AnswerAnimator />
      <HomeHeader locale={locale} />
      <main id="main">
        <section id="assistant" className="section-v5">
          <div className="wrap">
            <div className="rv"><span className="num-v5">٠١ · العقار</span>
              <h1 className="title-v5">AADALA REAL ESTATE — العقار</h1>
              <p className="sub-v5">تحليل أولي للنزاعات العقارية. لا أحكام قطعية دون دراسة الوثائق.</p>
            </div>
            <div style={{ marginTop: "2rem" }}>
              <RealEstateAnalyzer />
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} messages={messages} />
      <div className="legacy-agent">
        <AgentTerminal />
      </div>
    </div>
  );
}
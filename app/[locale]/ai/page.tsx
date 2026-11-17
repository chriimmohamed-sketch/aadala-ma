import { getMessages } from "@/lib/i18n/getMessages";
import HomeInteractions from "@/components/HomeInteractions";
import Footer from "@/components/layout/Footer";
import AnswerAnimator from "@/components/AnswerAnimator";
import AgentTerminal from "@/components/aalada-ultimate/AgentTerminal";
import HomeHeader from "@/components/home-moroccan/HomeHeader";
import AIChat from "@/components/AIChat";
import AIToolsSection from "@/components/AIToolsSection";
import { siteUrl } from "@/lib/site/config";

export default async function AIPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "AADALA.MA — المساعد القانوني",
      description: "RAG موثق المصادر. لا يُعد استشارة مهنية نهائية.",
      url: `${siteUrl}/${locale}/ai`,
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
            <div className="rv"><span className="num-v5">٠١ · المساعد</span>
              <h1 className="title-v5">AADALA AI — المساعد القانوني</h1>
              <p className="sub-v5">RAG موثق المصادر. لا يُعد استشارة مهنية نهائية.</p>
            </div>
            <div style={{ marginTop: "2rem" }}>
              <AIChat locale={locale} />
            </div>
          </div>
        </section>

        <section className="section-v5">
          <div className="wrap">
            <div className="rv"><span className="num-v5">٠٢ · الأدوات</span>
              <h2 className="title-v5">أدوات المنصة</h2>
              <p className="sub-v5">أدوات عملية للمساطر والإرث والعقار.</p>
            </div>
            <div style={{ marginTop: "2rem" }}>
              <AIToolsSection locale={locale} />
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
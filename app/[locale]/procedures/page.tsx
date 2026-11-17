import { getMessages } from "@/lib/i18n/getMessages";
import HomeInteractions from "@/components/HomeInteractions";
import Footer from "@/components/layout/Footer";
import AnswerAnimator from "@/components/AnswerAnimator";
import AgentTerminal from "@/components/aalada-ultimate/AgentTerminal";
import HomeHeader from "@/components/home-moroccan/HomeHeader";
import LegalServices from "@/components/LegalServices";
import { siteUrl } from "@/lib/site/config";

export default async function ProceduresPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "AADALA.MA — المساطر والوثائق",
      description: "شرح إجرائي + مولد مسودات (قابلة للمراجعة). لا نماذج عامة صالحة لكل حالة.",
      url: `${siteUrl}/${locale}/procedures`,
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
            <div className="rv"><span className="num-v5">٠١ · المساطر</span>
              <h1 className="title-v5">AADALA LEGAL SERVICES — المساطر والوثائق</h1>
              <p className="sub-v5">شرح إجرائي + مولد مسودات (قابلة للمراجعة). لا نماذج عامة صالحة لكل حالة.</p>
            </div>
            <div style={{ marginTop: "2rem" }}>
              <LegalServices />
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
import { getMessages } from "@/lib/i18n/getMessages";
import HomeInteractions from "@/components/HomeInteractions";
import Footer from "@/components/layout/Footer";
import AnswerAnimator from "@/components/AnswerAnimator";
import AgentTerminal from "@/components/aalada-ultimate/AgentTerminal";
import HomeHeader from "@/components/home-moroccan/HomeHeader";
import CriminalLab from "@/components/CriminalLab";
import { siteUrl } from "@/lib/site/config";

export default async function CriminalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "AADALA.MA — المختبر الجنائي",
      description: "محتوى أكاديمي. لا إرشادات لارتكاب جرائم أو الإفلات.",
      url: `${siteUrl}/${locale}/criminal`,
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
            <div className="rv"><span className="num-v5">٠١ · المختبر</span>
              <h1 className="title-v5">CRIMINAL LAW LAB — المختبر الجنائي</h1>
              <p className="sub-v5">محتوى أكاديمي. لا إرشادات لارتكاب جرائم أو الإفلات.</p>
            </div>
            <div style={{ marginTop: "2rem" }}>
              <CriminalLab />
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
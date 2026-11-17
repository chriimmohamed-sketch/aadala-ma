import V5Shell from "@/components/layout/V5Shell";
import AgentTerminal from "@/components/aalada-ultimate/AgentTerminal";
import MiyarEngine from "@/components/MiyarEngine";
import { siteUrl } from "@/lib/site/config";

export default async function MiyarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "AADALA.MA — محرك المواريث",
      description: "محرك حسابي حتمي (نسخة تجريبية) يخضع لمراجعة المختص.",
      url: `${siteUrl}/${locale}/miyar`,
      inLanguage: locale,
      isPartOf: { "@type": "WebSite", name: "AADALA.MA", url: siteUrl },
    },
  ];
  return (
    <V5Shell locale={locale}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main id="main">
        <section id="assistant" className="section-v5">
          <div className="wrap">
            <div className="rv"><span className="num-v5">٠١ · الميراث</span>
              <h1 className="title-v5">MIYAR — محرك المواريث والتركات والقسمة</h1>
              <p className="sub-v5">محرك حسابي حتمي (نسخة تجريبية) يخضع لمراجعة المختص.</p>
            </div>
            <div style={{ marginTop: "2rem" }}>
              <MiyarEngine locale={locale} />
            </div>
          </div>
        </section>
      </main>
      <div className="legacy-agent">
        <AgentTerminal />
      </div>
    </V5Shell>
  );
}
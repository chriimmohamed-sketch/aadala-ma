import { getMessages } from "@/lib/i18n/getMessages";
import HeaderSupreme from "@/components/layout/HeaderSupreme";
import Footer from "@/components/layout/Footer";
import { GalaxyCanvas } from "@/components/aalada-ultimate/GalaxyBackground";
import UnifiedDashboard from "@/components/aalada-ultimate/UnifiedDashboard";
import AgentTerminal from "@/components/aalada-ultimate/AgentTerminal";

export function generateStaticParams() {
  return [{ locale: "ar" }, { locale: "zgh" }, { locale: "fr" }, { locale: "en" }, { locale: "es" }, { locale: "de" }, { locale: "fa" }, { locale: "tr" }, { locale: "nl" }, { locale: "it" }];
}

export default async function UltimatePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  return (
    <div className="relative min-h-screen bg-black text-white">
      <GalaxyCanvas />
      <div className="relative z-10">
        <HeaderSupreme locale={locale} messages={messages} />
        <main className="mx-auto w-full max-w-7xl px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight">AALADA ULTIMATE</h1>
            <p className="text-sm text-gray-400">
              Supreme Architect — Three.js galaxy · Cloud Command Center · Agent Terminal · Self-correction loop
            </p>
          </div>
          <UnifiedDashboard />
        </main>
        <Footer locale={locale} messages={messages} />
      </div>
      <AgentTerminal />
    </div>
  );
}

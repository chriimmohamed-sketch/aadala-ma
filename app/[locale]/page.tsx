import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const modules = [
  { title: "الموسوعة القانونية", href: "/legal", desc: "نصوص، مواد، تعديلات" },
  { title: "الاجتهاد القضائي", href: "/case-law", desc: "قرارات منشورة" },
  { title: "المساعد القانوني", href: "/ai", desc: "RAG موثق المصادر" },
  { title: "محرك الإرث", href: "/inheritance", desc: "حسابات حتمية" },
  { title: "العقار والشياع", href: "/property", desc: "حقوق عينية" },
  { title: "المختبر الجنائي", href: "/criminal", desc: "تحليل أركان" },
  { title: "المساطر والوثائق", href: "/procedures", desc: "نماذج" },
  { title: "الشريعة والفقه", href: "/sharia", desc: "نصوص موثقة" },
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const h = (messages.home ?? {}) as Record<string, string>;
  const dev = ((messages.status as Record<string, string>)?.inDevelopment) ?? "قيد التطوير";
  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <Header locale={locale} messages={messages} />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden hero-bg text-ivory">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
            <div className="max-w-3xl">
              <div className="mb-4 inline-block rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs text-gold backdrop-blur">
                ✦ AADALA.MA — منصة العدالة والذكاء القانوني المغربي
              </div>
              <h1 className="shimmer text-5xl font-bold leading-tight md:text-7xl">
                {h.heroTitle ?? "AADALA.MA"}
              </h1>
              <p className="mt-6 text-lg text-ivory/80 md:text-xl">
                {h.heroSubtitle ?? "تسهيل الوصول إلى المعرفة القانونية المغربية."}
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <input
                  className="aadala-glass flex-1 rounded-xl px-5 py-3.5 text-sm text-ivory placeholder-ivory/50 focus:border-gold focus:outline-none"
                  placeholder={h.searchPlaceholder ?? "ابحث..."}
                  aria-label={h.searchPlaceholder ?? "ابحث"}
                />
                <Link href={`/${locale}/ai`} className="aadala-btn-gold text-center text-base">
                  {h.aiCta ?? "اسأل المساعد"}
                </Link>
              </div>
              <p className="mt-5 text-xs text-ivory/50">{h.disclaimer}</p>
            </div>
          </div>
          <div className="aadala-divider" />
        </section>

        {/* Modules */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-bold text-navy">الأقسام</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger">
            {modules.map((m) => (
              <Link key={m.href} href={`/${locale}${m.href}`} className="aadala-card block p-5 group">
                <div className="h-1 w-10 bg-gold transition-all group-hover:w-20" />
                <h3 className="mt-3 font-semibold text-navy">{m.title}</h3>
                <p className="mt-1 text-xs text-graphite-soft">{m.desc}</p>
                <span className="mt-3 inline-block text-xs text-gold">{dev}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Founder teaser */}
        <section className="bg-navy-soft text-ivory">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold">عن المؤسس</h2>
                <p className="mt-2 text-sm text-ivory/70">MOHAMED CHRAIM — محمد شرايم</p>
              </div>
              <Link href={`/${locale}/founder`} className="aadala-btn-gold">اقرأ السيرة</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}
import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const h = (messages.home ?? {}) as Record<string, string>;
  const dev = ((messages.status as Record<string,string>)?.inDevelopment) ?? "قيد التطوير";
  return (
    <div className="flex min-h-screen flex-col">
      <Header locale={locale} messages={messages} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">{h.heroTitle}</h1>
          <p className="mt-3 text-slate-600">{h.heroSubtitle}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              className="flex-1 rounded border border-slate-300 px-4 py-2 text-sm"
              placeholder={h.searchPlaceholder}
              aria-label={h.searchPlaceholder}
            />
            <a href={`/${locale}/ai`} className="rounded bg-slate-900 px-5 py-2 text-center text-sm text-white">
              {h.aiCta}
            </a>
          </div>
          <p className="mt-4 text-xs text-amber-700">{h.disclaimer}</p>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { title: "الموسوعة القانونية", href: "/legal", note: dev },
            { title: "الاجتهاد القضائي", href: "/case-law", note: dev },
            { title: "محرك الإرث", href: "/inheritance", note: "تجريبي" },
            { title: "العقار والشياع", href: "/property", note: dev },
            { title: "المختبر الجنائي", href: "/criminal", note: dev },
            { title: "المساطر والوثائق", href: "/procedures", note: dev },
          ].map((c) => (
            <a key={c.href} href={`/${locale}${c.href}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow">
              <h2 className="font-semibold text-slate-900">{c.title}</h2>
              <p className="mt-1 text-xs text-slate-500">{c.note}</p>
            </a>
          ))}
        </section>
      </main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}
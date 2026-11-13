import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { legalSources } from "@/data/legal-sources";
import quality from "@/data/legal-quality.json";
import { retrieveWithRefs } from "@/lib/ai-assistant/retrieval";

const unreliable = legalSources.filter((s) => (quality as Record<string, { quality: string }>)[s.slug]?.quality === "unreliable");

export default async function SearchPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string }> }) {
  const { locale } = await params;
  const { q = "" } = await searchParams;
  const query = q.trim().slice(0, 300);
  const messages = await getMessages(locale);
  const results = query ? retrieveWithRefs(query, 12) : [];
  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <Header locale={locale} messages={messages} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-bold text-navy">البحث في النصوص القانونية</h1>
        <div className="aadala-divider mt-3" />
        <form method="get" role="search" className="zl-ask mt-6">
          <input name="q" defaultValue={query} maxLength={300} placeholder="كلمات من النص، أو رقم فصل/مادة مثل: الفصل 230" aria-label="بحث" autoComplete="off" />
          <button type="submit" className="zl-btn">بحث</button>
        </form>
        {query && (
          <section className="mt-8" aria-live="polite">
            <p className="text-sm text-graphite-soft">{results.length ? `${results.length} نتيجة` : "لا نتائج في المصادر المفهرسة."}</p>
            <ul className="mt-4 space-y-3">
              {results.map((r, i) => (
                <li key={i} className="aadala-card p-4">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <Link href={`/${locale}/legal/${r.slug}`} className="font-semibold text-navy hover:text-teal">{r.title}</Link>
                    {r.location && <span className="rounded-full border border-gold px-2 text-xs text-gold">{r.location}</span>}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-graphite">{r.excerpt.slice(0, 420)}{r.excerpt.length > 420 ? "…" : ""}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
        {unreliable.length > 0 && (
          <p className="mt-10 rounded border border-gold/60 bg-gold/10 p-3 text-xs text-graphite">
            لا تشمل النتائج مصادر لم يمكن استخراج نصها بشكل موثوق: {unreliable.map((s) => s.title).join("، ")}. ارجع إلى الجريدة الرسمية لهذه النصوص.
          </p>
        )}
      </main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}

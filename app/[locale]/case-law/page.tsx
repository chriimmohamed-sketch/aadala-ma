export const dynamic = "force-dynamic";
import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { searchDecisions } from "@/lib/jurisprudence/search";

export default async function CaseLawPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string>> }) {
  const { locale } = await params;
  const sp = await searchParams;
  const messages = await getMessages(locale);
  const results = searchDecisions({
    court: sp.court,
    chamber: sp.chamber,
    decisionNumber: sp.decisionNumber,
    legalDomain: sp.domain,
    keyword: sp.keyword,
  });

  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <Header locale={locale} messages={messages} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-bold text-navy">AADALA JURISPRUDENCE — الاجتهاد القضائي</h1>
        <div className="aadala-divider mt-3" />
        <p className="mt-3 text-sm text-graphite-soft">قاعدة قرارات/أحكام متاحة قانوناً. لا قرارات مختلقة. حالة فارغة حتى استيراد مصادر موثقة.</p>

        <form className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-4" method="get">
          <input name="court" placeholder="المحكمة" className="rounded border border-border px-3 py-2 text-sm" defaultValue={sp.court} />
          <input name="chamber" placeholder="الغرفة" className="rounded border border-border px-3 py-2 text-sm" defaultValue={sp.chamber} />
          <input name="decisionNumber" placeholder="رقم القرار" className="rounded border border-border px-3 py-2 text-sm" defaultValue={sp.decisionNumber} />
          <input name="keyword" placeholder="كلمة مفتاحية" className="rounded border border-border px-3 py-2 text-sm" defaultValue={sp.keyword} />
          <button className="aadala-btn-primary md:col-span-4">بحث</button>
        </form>

        <div className="mt-8">
          {results.length === 0 ? (
            <div className="aadala-card p-6 text-center text-sm text-graphite-soft">
              لا توجد قرارات مستوردة بعد. استخدم مسار الاستيراد/المراجعة في لوحة الإدارة.
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((d) => (
                <div key={d.id} className="aadala-card p-5">
                  <div className="text-xs text-gold">{d.court} — {d.chamber}</div>
                  <h2 className="mt-1 font-semibold text-navy">قرار رقم {d.decisionNumber} — {d.date}</h2>
                  <p className="mt-2 text-sm text-graphite">{d.legalDomain}</p>
                  {d.extractedRule && <p className="mt-2 text-sm"><strong>القاعدة:</strong> {d.extractedRule}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}
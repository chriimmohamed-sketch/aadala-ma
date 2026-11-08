import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import { legalSources } from "@/data/legal-sources";

export default async function AcademicPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const byType = legalSources.reduce<Record<string, typeof legalSources>>((acc, s) => {
    (acc[s.type] ??= []).push(s);
    return acc;
  }, {});

  return (
    <PageShell locale={locale} title="الفضاء الأكاديمي" intro="مراجع للبحث الجامعي: المصادر مصنفة بحسب نوع النص، ونموذج لبطاقة الاستشهاد، ومدخل إلى الاجتهاد القضائي.">
      <h2 className="mb-3 text-lg font-semibold text-navy">المصادر بحسب النوع</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Object.entries(byType).map(([type, list]) => (
          <section key={type} className="aadala-card p-5">
            <h3 className="font-semibold text-navy">{type} <span className="text-xs text-graphite-soft">({list.length})</span></h3>
            <ul className="mt-3 space-y-2 text-sm">
              {list.map((s) => (
                <li key={s.slug}>
                  <Link className="text-navy underline decoration-gold underline-offset-4" href={`/${locale}/legal/${s.slug}`}>{s.title}</Link>
                  <p className="text-xs text-graphite-soft">{s.description}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="aadala-card mt-6 p-5">
        <h2 className="text-lg font-semibold text-navy">نموذج بطاقة استشهاد</h2>
        <p className="mt-2 text-sm leading-7 text-graphite-soft">املأ الحقول من النص الرسمي نفسه، لا من الذاكرة ولا من ملخص.</p>
        <pre dir="rtl" className="mt-3 overflow-x-auto rounded border border-border bg-ivory-deep p-3 text-sm leading-7 text-graphite">{`نوع النص: ...
العنوان الرسمي: ...
المادة: ...
الجريدة الرسمية (العدد والتاريخ): ...
تاريخ الاطلاع: ...
ملاحظة: هل النص محيَّن أم الصيغة الأصلية؟`}</pre>
      </section>

      <section className="aadala-card mt-6 p-5">
        <h2 className="text-lg font-semibold text-navy">الاجتهاد القضائي</h2>
        <p className="mt-2 text-sm leading-7 text-graphite-soft">لا تعرض المنصة إلا قرارات موثقة المصدر. إذا لم تجد قرارًا تحتاجه فلا يعني ذلك أنه غير موجود.</p>
        <Link className="aadala-btn-primary mt-3 inline-block" href={`/${locale}/case-law`}>انتقل إلى البحث في الاجتهاد</Link>
      </section>
    </PageShell>
  );
}

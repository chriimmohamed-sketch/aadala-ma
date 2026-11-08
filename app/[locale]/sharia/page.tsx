import Link from "next/link";
import PageShell from "@/components/layout/PageShell";

const topics = ["الزواج", "الطلاق والتطليق", "النفقة", "الحضانة", "الإرث", "الوصية"];

export default async function ShariaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <PageShell
      locale={locale}
      title="الشريعة والفقه"
      badge="قيد المراجعة"
      intro="قسم للربط بين الأحكام الفقهية والنصوص القانونية المعمول بها. لا تنشر المنصة فتاوى، ولا تضيف نصًا فقهيًا إلا بعد توثيق مصدره."
    >
      <section className="aadala-card p-5">
        <h2 className="text-lg font-semibold text-navy">محاور الأحوال الشخصية</h2>
        <p className="mt-2 text-sm leading-7 text-graphite-soft">هذه المحاور ستُفتح تباعًا عند إضافة نصوصها الموثقة إلى المكتبة.</p>
        <ul className="chips mt-3">
          {topics.map((t) => <li key={t} className="chip">{t}</li>)}
        </ul>
      </section>

      <section className="aadala-card mt-6 p-5">
        <h2 className="text-lg font-semibold text-navy">متاح الآن</h2>
        <p className="mt-2 text-sm leading-7 text-graphite-soft">
          حاسبة مِعيار تشرح خطوات توزيع التركة في نطاق محدد، وتُنبّه إلى الحالات التي تتطلب مختصًا.
        </p>
        <Link className="aadala-btn-primary mt-3 inline-block" href={`/${locale}/miyar`}>افتح حاسبة المواريث</Link>
      </section>

      <p className="mt-6 text-xs leading-6 text-graphite-soft">
        المحتوى هنا تعليمي، ولا يغني عن عقد الفريضة لدى العدول أو حكم المحكمة أو رأي عالم مختص.
      </p>
    </PageShell>
  );
}

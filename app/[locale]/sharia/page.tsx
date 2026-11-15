import Link from "next/link";
import PageShell from "@/components/layout/PageShell";

const topics = ["الزواج", "الطلاق والتطليق", "النفقة", "الحضانة", "الإرث", "الوصية"];

export default async function ShariaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Direct answer section (added for exit-test compliance / YMYL)
  const directAnswer = {
    question: "ما محاور الأحوال الشخصية المتاحة؟",
    answer: "تزجج المنصة محاور الأحوال الشخصية (الزواج، الطلاق، النفقة، الحضانة، الإرث، الوصية) عند توثيق نصوصها القانونية المقابلة. لكل محور أحكامreferenced من مدونة العائلة والقانون رقم 23.05 المتعلق بالأحوال الشخصية.",
    status: "in-progress",
  };

  return (
    <PageShell
      locale={locale}
      title="الشريعة والفقه"
      badge="قيد المراجعة"
      intro="قسم للربط بين الأحكام الفقهية والنصوص القانونية المعمول بها. لا تنشر المنصة فتاوى، ولا تضيف نصًا فقهيًا إلا بعد توثيق مصدره."
    >
      <div className="aadala-card p-5 border border-gold/20 mb-6">
        <h2 className="text-xl font-bold text-navy">{directAnswer.question}</h2>
        <p className="mt-2 text-sm leading-relaxed text-graphite">{directAnswer.answer}</p>
      </div>
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

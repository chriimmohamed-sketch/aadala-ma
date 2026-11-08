import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import { procedures } from "@/data/legal-services";

const prepare = [
  "حدّد نوع الدعوى أو الشكاية والمحكمة المختصة.",
  "اجمع وثائق الهوية والوثائق الداعمة لموضوعك.",
  "اجمع ما يثبت وضعيتك المادية بالشكل الذي تطلبه المحكمة.",
  "اسأل كتابة الضبط بالمحكمة المعنية عن الإجراءات والوثائق المعتمدة حاليًا.",
];

export default async function LegalAidPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <PageShell
      locale={locale}
      title="المساعدة القانونية"
      badge="قيد التحقق"
      intro="تعريف مبسط بالمساعدة القضائية وكيفية التحضير لطلبها. الشروط والوثائق تتغير، فتأكد منها لدى المحكمة قبل أي خطوة."
    >
      <section className="aadala-card p-5">
        <h2 className="text-lg font-semibold text-navy">ما المقصود؟</h2>
        <p className="mt-2 text-sm leading-7 text-graphite">
          المساعدة القضائية آلية تتيح لمن لا يملك الموارد الكافية أن يلجأ إلى القضاء دون أن يمنعه عن ذلك العجز المالي، وفق الشروط التي يحددها القانون.
        </p>
      </section>

      <section className="aadala-card mt-6 p-5">
        <h2 className="text-lg font-semibold text-navy">كيف تتحضر</h2>
        <ol className="mt-3 list-decimal space-y-2 pr-5 text-sm leading-7 text-graphite">
          {prepare.map((p) => <li key={p}>{p}</li>)}
        </ol>
      </section>

      <section className="aadala-card mt-6 p-5">
        <h2 className="text-lg font-semibold text-navy">بحسب نوع المسطرة</h2>
        <ul className="mt-3 space-y-3 text-sm leading-7">
          {procedures.map((p) => (
            <li key={p.id}>
              <span className="font-semibold text-navy">{p.title}</span>
              <span className="text-graphite-soft"> — {p.legalAid}</span>
            </li>
          ))}
        </ul>
        <Link className="aadala-btn-primary mt-4 inline-block" href={`/${locale}/procedures`}>عرض المساطر والوثائق</Link>
      </section>

      <p className="mt-6 text-xs leading-6 text-graphite-soft">هذه المعلومات عامة وليست استشارة قانونية. لحالتك الخاصة راجع مختصًا أو المحكمة المعنية.</p>
    </PageShell>
  );
}

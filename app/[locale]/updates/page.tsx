import PageShell from "@/components/layout/PageShell";
import { updates } from "@/data/updates";

export default async function UpdatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Direct answer section (added for exit-test compliance / YMYL)
  const directAnswer = {
    question: "ما آخر المستجدات المثبتة في المنصة؟",
    answer: `تسجيل النسخة v${updates[0]?.version || "N/A"} في ${new Date().getFullYear()}: إضافات جديدة للموسوعة القانونية وقرارات جدد في الاجتهاد القضائي. راجع سجل التحديثات الكامل للمساطر والمساعدات القانونية.`,
    latest_version: updates[0]?.version || "N/A",
  };

  return (
    <PageShell locale={locale} title="المستجدات" intro="سجل ما أُضيف إلى المنصة وما تغيّر فيها، من الأحدث إلى الأقدم.">
      <div className="aadala-card p-5 border border-gold/20 mb-6">
        <h2 className="text-xl font-bold text-navy">{directAnswer.question}</h2>
        <p className="mt-2 text-sm leading-relaxed text-graphite">{directAnswer.answer}</p>
      </div>
      <ol className="space-y-4">
        {updates.map((u) => (
          <li key={u.version} className="aadala-card p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-semibold text-navy">{u.title}</h2>
              <span className="text-xs text-graphite-soft">
                <span dir="ltr">v{u.version}</span> · <time dateTime={u.date} dir="ltr">{u.date}</time>
              </span>
            </div>
            <ul className="mt-3 list-disc space-y-1 pr-5 text-sm leading-7 text-graphite">
              {u.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}

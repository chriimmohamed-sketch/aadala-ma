import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import { legalSources } from "@/data/legal-sources";

const tools = [
  { href: "/legal", title: "الموسوعة القانونية", text: `${legalSources.length} مصادر قابلة للقراءة والبحث.` },
  { href: "/search", title: "البحث في النصوص", text: "ابحث بكلمة أو برقم مادة." },
  { href: "/case-law", title: "الاجتهاد القضائي", text: "قرارات موثقة المصدر فقط." },
  { href: "/procedures", title: "المساطر والوثائق", text: "مسار إجرائي ومولد مسودات." },
  { href: "/miyar", title: "مِعيار للمواريث", text: "حساب تعليمي مع شرح كل خطوة." },
  { href: "/ai", title: "المساعد القانوني", text: "أجوبة مربوطة بمقاطع من المصادر." },
];

const method = [
  "حدّد المسألة القانونية في جملة واحدة قبل البحث.",
  "ابدأ بالنص الرسمي، ثم انتقل إلى الشرح والاجتهاد.",
  "تحقق من آخر تحيين للنص وتاريخ نشره في الجريدة الرسمية.",
  "ميّز بين ما يقوله النص وما تقوله أنت في التحليل.",
  "دوّن لكل معلومة المصدر ورقم المادة في لحظة قراءتها.",
  "لا تنقل رقم مادة من أداة ذكاء اصطناعي دون مطابقته بالنص الأصلي.",
];

export default async function StudentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <PageShell locale={locale} title="الطالب والباحث" intro="مدخل للدراسة والبحث القانوني: أدوات المنصة في مكان واحد، ومنهجية قصيرة تعين على الاستشهاد الصحيح.">
      <h2 className="mb-3 text-lg font-semibold text-navy">أدوات المنصة</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link key={t.href} href={`/${locale}${t.href}`} className="aadala-card block p-5 transition hover:-translate-y-0.5">
            <h3 className="font-semibold text-navy">{t.title}</h3>
            <p className="mt-1 text-sm text-graphite-soft">{t.text}</p>
          </Link>
        ))}
      </div>

      <section className="aadala-card mt-8 p-5">
        <h2 className="text-lg font-semibold text-navy">منهجية البحث والاستشهاد</h2>
        <ol className="mt-3 list-decimal space-y-2 pr-5 text-sm leading-7 text-graphite">
          {method.map((m) => <li key={m}>{m}</li>)}
        </ol>
      </section>

      <section className="aadala-card mt-6 p-5">
        <h2 className="text-lg font-semibold text-navy">مصادر للقراءة الآن</h2>
        <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          {legalSources.map((s) => (
            <li key={s.slug}>
              <Link className="text-navy underline decoration-gold underline-offset-4" href={`/${locale}/legal/${s.slug}`}>{s.title}</Link>
              <span className="text-graphite-soft"> — {s.type}</span>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}

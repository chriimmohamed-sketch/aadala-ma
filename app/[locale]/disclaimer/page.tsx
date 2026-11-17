import V5Shell from "@/components/layout/V5Shell";
import Link from "next/link";

const sections = [
  {
    title: "1. ليست استشارة قانونية",
    body: "المحتوى والأجوبة والأدوات على AADALA.MA ذات طابع تعليمي وتوعوي. لا تُعد استشارة قانونية ولا رأيًا مهنيًا، ولا تنشئ علاقة وكالة أو تمثيل بين المنصة والمستخدم.",
  },
  {
    title: "2. المصادر والتحقق",
    body: "نسعى إلى النقل من مصادر منشورة، لكن الملخصات قد تتأخر عن آخر تعديل أو تحتوي خطأ بشريًا. قبل أي إجراء، راجع النص الرسمي في الجريدة الرسمية أو لدى مختص مؤهل.",
  },
  {
    title: "3. المساعد الآلي",
    body: "المساعد قد يخطئ في الفهم أو الاستشهاد. لا تعتمد على جوابه وحده، ولا تُدخل فيه معطيات شخصية حساسة. كل جواب قابل للنقاش والتصحيح عبر صفحة الإبلاغ عن الأخطاء.",
  },
  {
    title: "4. الحاسبات والأدوات التقديرية",
    body: "حاسبات الميراث والعقار والمساطر أدوات تعليمية تقديرية. نتائجها لا تُغني عن عقد الفريضة لدى العدول، أو حكم المحكمة، أو مراجعة محام أو خبير.",
  },
  {
    title: "5. الروابط الخارجية",
    body: "قد تحيل المنصة إلى مواقع خارجية. لا نتحكم في مضمونها ولا نضمن صحته أو استمراره، ويبقى المستخدم مسؤولًا عن اطلاعه على شروط تلك المواقع.",
  },
  {
    title: "6. الإبلاغ عن خطأ",
    body: "إذا لاحظت خطأ في مادة أو بطاقة أو جواب، أبلغنا عبر صفحة «أبلغ عن خطأ» مع تحديد المصدر. تُراجع البلاغات يدويًا ولا تُصحح أي مادة تلقائيًا.",
  },
];

export default async function DisclaimerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <V5Shell locale={locale}>
      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-bold text-navy">إخلاء المسؤولية</h1>
        <div className="aadala-divider mt-3" />
        <p className="mt-3 text-sm text-graphite-soft">
          اقرأ هذه الصفحة قبل الاعتماد على أي محتوى من المنصة. آخر تحديث: نونبر 2026.
        </p>
        <section className="mt-6 space-y-5 text-sm leading-7">
          {sections.map((s) => (
            <div key={s.title} className="aadala-card p-5">
              <h2 className="font-semibold text-navy">{s.title}</h2>
              <p className="mt-1 text-graphite">{s.body}</p>
            </div>
          ))}
          <p className="text-sm text-graphite">
            للإبلاغ عن خطأ:{" "}
            <Link className="underline decoration-gold underline-offset-4" href={`/${locale}/report`}>
              افتح صفحة الإبلاغ
            </Link>
            .
          </p>
        </section>
      </main>
    </V5Shell>
  );
}

import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; const messages = await getMessages(locale);
  return (
    <div className="flex min-h-screen flex-col">
      <Header locale={locale} messages={messages} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-bold">MOHAMED CHRAIM — محمد شرايم</h1>
        <p className="mt-2 text-sm text-slate-600">طالب بكلية العلوم القانونية والاقتصادية والاجتماعية، جامعة ابن زهر بأكادير — السنة الأولى، القانون الخاص، العلوم الجنائية.</p>
        <h2 className="mt-6 text-xl font-semibold">الخبرات</h2>
        <ul className="mt-2 list-disc pr-6 text-sm text-slate-700">
          <li>تسيير وتشغيل محلات تجارية وخدمة المطاعم.</li>
          <li>إشراف تطوعي على داخلية مؤسسة تحضيرية، تأطير الطلبة، تنظيم الأنشطة والرحلات.</li>
          <li>تنسيق الفرق والأنشطة الرياضية والتحكيم في كرة القدم.</li>
        </ul>
        <h2 className="mt-6 text-xl font-semibold">المهارات والاهتمامات</h2>
        <p className="mt-2 text-sm text-slate-700">التواصل والإقناع، خدمة العملاء، العمليات التجارية والمحاسبية الأساسية، القيادة، الانضباط، إعداد التقارير والمحاضر، التحدث أمام الجمهور، العمل تحت الضغط، التصوير والتصميم، والبحث القانوني.</p>
        <h2 className="mt-6 text-xl font-semibold">اللغات</h2>
        <p className="mt-2 text-sm text-slate-700">العربية والأمازيغية، ومستوى أساسي في الفرنسية والإنجليزية.</p>
        <p className="mt-6 text-xs text-amber-700">صفحة قيد المراجعة — لا تنشر معلومات شخصية دون موافقة صريحة.</p>
      </main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}
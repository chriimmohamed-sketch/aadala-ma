import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/layout/HeaderSupreme";
import Footer from "@/components/layout/Footer";

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <Header locale={locale} messages={messages} />
      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-bold text-navy">سياسة الخصوصية</h1>
        <div className="aadala-divider mt-3" />
        <p className="mt-3 text-sm text-graphite-soft">النسخة الحالية نموذج أولي، وتحتاج مراجعة قانونية قبل الإطلاق العام.</p>
        <section className="mt-6 space-y-5 text-sm leading-7">
          <div>
            <h2 className="font-semibold text-navy">1. البيانات التي تُعالَج حاليًا</h2>
            <p>لا توجد حسابات مستخدمين ولا قاعدة بيانات مرتبطة بالواجهة في هذا الإصدار. الأسئلة المرسلة إلى مساعد AADALA AI تُعالَج لحظيًا للإجابة ولا تُخزَّن في قاعدة بيانات من طرف التطبيق.</p>
          </div>
          <div>
            <h2 className="font-semibold text-navy">2. التخزين المحلي</h2>
            <p>يحفظ المتصفح تفضيل الوضع (فاتح/داكن) وإقرارك بهذا الإشعار فقط. لا نستخدم ملفات تتبّع إعلانية.</p>
          </div>
          <div>
            <h2 className="font-semibold text-navy">3. حقوقك (القانون 09.08)</h2>
            <p>يضمن القانون 09.08 حقوق الولوج والتصحيح والحذف والتعرض. عند إضافة الحسابات ستُوفَّر آليات تصدير البيانات وحذفها، ويجب التصريح لدى اللجنة الوطنية لمراقبة حماية المعطيات الشخصية (CNDP) قبل الإطلاق.</p>
          </div>
          <div>
            <h2 className="font-semibold text-navy">4. مزوّد الذكاء الاصطناعي</h2>
            <p>إذا فُعِّل مزوّد خارجي، فسيُرسَل إليه نص السؤال والمقاطع القانونية المسترجعة لتوليد الإجابة. لا تُدخل معطيات شخصية حساسة في الأسئلة.</p>
          </div>
          <div>
            <h2 className="font-semibold text-navy">5. إخلاء المسؤولية</h2>
            <p>المحتوى للتوعية القانونية ولا يُعد استشارة مهنية.</p>
          </div>
        </section>
      </main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}

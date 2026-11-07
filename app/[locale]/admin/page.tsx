import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const modules = [
  "إدارة المستخدمين", "الصلاحيات والأدوار", "إدارة التشريعات", "إدارة المصادر",
  "إدارة الاجتهادات", "مراجعة محتوى الذكاء الاصطناعي", "إدارة وحدات MIYAR",
  "إدارة الملفات", "الإشعارات", "سجل التدقيق", "تقارير الأداء",
  "مراقبة الأخطاء", "إعدادات النظام",
];

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <Header locale={locale} messages={messages} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-bold text-navy">AADALA CONTROL CENTER — لوحة الإدارة</h1>
        <div className="aadala-divider mt-3" />
        <p className="mt-3 text-sm text-graphite-soft">قيد التطوير. RBAC على الخادم، سجل تدقيق، قابلية استرجاع.</p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <div key={m} className="aadala-card p-5">
              <h2 className="font-semibold text-navy">{m}</h2>
              <p className="mt-1 text-xs text-graphite-soft">قيد التطوير</p>
            </div>
          ))}
        </div>
        <section className="mt-8 rounded border border-border bg-surface p-4">
          <h2 className="font-semibold text-navy">مبدأ أقل صلاحية</h2>
          <p className="mt-2 text-sm text-graphite">التحقق من الصلاحيات على الخادم (src/lib/admin/permissions.ts). التغييرات الحساسة مسجلة (src/lib/admin/audit.ts) وقابلة للاسترجاع.</p>
        </section>
      </main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}
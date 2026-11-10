import { redirect } from "next/navigation";
import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/layout/HeaderSupreme";
import Footer from "@/components/layout/Footer";
import { getSessionUser, isAdminUser } from "@/lib/supabase/auth.server";

const modules = [
  "إدارة المستخدمين", "الصلاحيات والأدوار", "إدارة التشريعات", "إدارة المصادر",
  "إدارة الاجتهادات", "مراجعة محتوى الذكاء الاصطناعي", "إدارة وحدات MIYAR",
  "إدارة الملفات", "الإشعارات", "سجل التدقيق", "تقارير الأداء",
  "مراقبة الأخطاء", "إعدادات النظام",
];

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages(locale);

  // MFA gate (if enrolled in Supabase, admin must verify second factor before access).
  const { createSupabaseServerClient } = await import("@/lib/supabase/server");
  const sb = await createSupabaseServerClient();
  if (sb) {
    const { data: aal } = await sb.auth.mfa.getAuthenticatorAssuranceLevel().catch(() => ({ data: null } as never));
    const lvl = (aal as { currentLevel?: string; nextLevel?: string } | null);
    if (lvl && (lvl.currentLevel === "aal1" || lvl.currentLevel === undefined) && lvl.nextLevel === "aal2") {
      redirect(`/${locale}/mfa?next=/${locale}/admin`);
    }
  }

  // Server-enforced RBAC: session + profiles (RLS). Never trusts client role.
  const user = await getSessionUser();
  if (!user) {
    redirect(`/${locale}/login?next=/${locale}/admin`);
  }
  if (!isAdminUser(user)) {
    // Signed-in but not admin: do not leak admin UI; show access-denied (fail closed).
    return (
      <div className="flex min-h-screen flex-col bg-ivory">
        <Header locale={locale} messages={messages} />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
          <h1 className="text-3xl font-bold text-navy">تم الرفض</h1>
          <p className="mt-3 text-sm text-graphite-soft">
            حسابك الحالي ({user.email ?? "بدون بريد"}) لا يملك صلاحية <strong>admin</strong>.
            تواصل مع الإدارة لمنح الدور. لا يمكن الوصول إلى لوحة الإدارة من المتصفح وحده.
          </p>
          <p className="mt-2 text-xs text-graphite-soft">الدور الحالي: {user.role} • المصدر: Supabase profiles (RLS)</p>
        </main>
        <Footer locale={locale} messages={messages} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <Header locale={locale} messages={messages} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-bold text-navy">AADALA CONTROL CENTER — لوحة الإدارة</h1>
        <div className="aadala-divider mt-3" />
        <p className="mt-3 text-sm text-graphite-soft">
          مسجل كـ <strong>{user.email}</strong> بدور <strong>{user.role}</strong> (مُتحقق به من Supabase Auth + RLS).
        </p>
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
          <p className="mt-2 text-sm text-graphite">التحقق من الصلاحيات على الخادم (src/lib/admin/permissions.ts + Supabase profiles). التغييرات الحساسة مسجلة (audit_logs) وقابلة للاسترجاع.</p>
        </section>
      </main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}

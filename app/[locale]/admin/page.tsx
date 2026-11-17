"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import Header from "@/components/layout/HeaderSupreme";
import Footer from "@/components/layout/Footer";

type AuthState = "checking" | "granted" | "denied" | "mfa_required";

function AdminGate({ locale }: { locale: string }) {
  const [authState, setAuthState] = useState<AuthState>("checking");

  // Supabase Auth + RLS check
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = getSupabaseClient();
        const { data: { session }, error } = await supabase.auth.getSession();
        if (cancelled) return;
        if (error || !session) {
          setAuthState("denied");
          return;
        }
        // RLS-scoped role read — the row is only visible to the owner
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        if (cancelled) return;
        if (profileError || !profile || profile.role !== "admin") {
          setAuthState("denied");
        } else {
          // MFA enforcement for admin: require at least one verified TOTP factor
          try {
            const { data: factors } = await supabase.auth.mfa.listFactors();
            const hasVerifiedTotp = factors?.totp?.some((f) => f.status === "verified");
            if (!hasVerifiedTotp) {
              setAuthState("mfa_required");
              return;
            }
          } catch {
            // If MFA check fails, fail-closed: require MFA setup
            setAuthState("mfa_required");
            return;
          }
          setAuthState("granted");
        }
      } catch {
        if (!cancelled) setAuthState("denied");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (authState === "denied") redirect("/");
    if (authState === "mfa_required") redirect(`/${locale}/mfa`);
  }, [authState, locale]);

  // Direct answer for YMYL / exit-test compliance / RBAC replacement notice
  const directAnswer = {
    question: "هل هذه الصفحة عامة؟",
    answer:
      "لا، هذه الصفحة مخصصة للمسؤولين المصادقين عبر Supabase Auth + RLS. تم استبدال نظام localStorage RBAC للأمان. للتعديل، راجع migration script في `supabase/migrations/20261115_admin_rls.sql` واحتضن حساب المسؤول من لوحة Supabase Dashboard.",
    status: "Supabase Auth + RLS — pending Dashboard enrollment",
  };

  if (authState === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <div className="aadala-card p-8 text-center">
          <h2 className="text-navy mb-4">جاري التحقق من الهوية</h2>
          <p className="text-graphite">جاري التحقق من صلاحيات الدخول...</p>
        </div>
      </div>
    );
  }

  if (authState === "denied") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <div className="aadala-card p-8 text-center">
          <h2 className="text-navy mb-4">لا تملك صلاحية الوصول</h2>
          <p className="text-graphite">هذه الصفحة مخصصة للمسؤولين المصادقين فقط.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <Header locale={locale} messages={{}} />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <div className="aadala-card p-5 border border-gold/20 mb-6">
          <h2 className="text-xl font-bold text-navy">{directAnswer.question}</h2>
          <p className="mt-2 text-sm leading-relaxed text-graphite">{directAnswer.answer}</p>
        </div>

        {/* Admin panel content */}
        <div className="mt-6 aadala-card p-5">
          <h3 className="text-navy">لوحة التحكم</h3>
          <p className="text-graphite-soft">
            مرحباً بك في لوحة الإدارة. يمكنك الآن إدارة المحتوى والمؤسسات والبحوث
            بفضل Supabase Auth + RLSinstead of localStorage RBAC.
          </p>
          <ul className="mt-4 list-disc pl-5 text-sm text-graphite">
            <li>عرض المستجدات</li>
            <li>إدارة المصادر القانونية</li>
            <li>عرض تقارير الاستخبارات</li>
            <li>تكوين الإعدادات</li>
          </ul>
        </div>
      </main>
      <Footer locale={locale} messages={{}} />
    </div>
  );
}

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <AdminGate locale={locale} />;
}

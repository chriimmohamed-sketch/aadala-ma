"use client";

import { useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase/client";

const NEUTRAL = "إن وُجدت حسابًا بهذا البريد فستصلك رسالة إعادة تعيين كلمة المرور (الرابط منتهٍ ويُستخدم مرة واحدة).";

export default function ForgotPasswordForm({ locale }: { locale: string }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      const origin = window.location.origin;
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/${locale}/auth/update-password`,
      });
    } catch {
      // Neutral: never reveal existence; surface same message either way.
    }
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <form onSubmit={handleSubmit} className="aadala-card p-6">
        <h1 className="text-2xl font-bold text-navy">استعادة كلمة المرور</h1>
        <p className="mt-1 text-sm text-muted">أدخل بريدك — إن وُجدت حسابًا فستصلك رسالة رابط منتهٍ ويُستخدم مرة واحدة.</p>
        <label className="mt-4 block">
          <span className="text-sm text-graphite">البريد الإلكتروني</span>
          <input type="email" required autoComplete="email" className="mt-1 w-full rounded border border-border bg-surface px-3 py-2 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        {sent && <p className="mt-3 rounded border border-teal/40 bg-teal/10 p-2 text-sm text-graphite">{NEUTRAL}</p>}
        <button type="submit" disabled={loading} className="aadala-btn-primary mt-4 w-full disabled:opacity-50">
          {loading ? "جارٍ الإرسال…" : "أرسل رابط الاستعادة"}
        </button>
        <p className="mt-3 text-center text-sm text-muted">
          تذكّرتها؟{" "}
          <Link className="font-semibold text-navy underline" href={`/${locale}/login`}>تسجيل الدخول</Link>
        </p>
      </form>
    </div>
  );
}

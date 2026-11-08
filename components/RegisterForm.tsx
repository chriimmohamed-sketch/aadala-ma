"use client";

import { useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function RegisterForm({ locale }: { locale: string }) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName || email },
        },
      });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      // Profile row is created by DB trigger (role always 'user' — client cannot choose role).
      window.location.href = `/${locale}/dashboard`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <form onSubmit={handleSubmit} className="aadala-card p-6">
        <h1 className="text-2xl font-bold text-navy">إنشاء حساب</h1>
        <p className="mt-1 text-sm text-muted">الحساب يُقيّد بدور <strong>user</strong> افتراضيًا. الأدوار العليا تمنحها الإدارة فقط.</p>
        <label className="mt-4 block">
          <span className="text-sm text-graphite">الاسم المعروض</span>
          <input
            type="text"
            autoComplete="name"
            className="mt-1 w-full rounded border border-border bg-surface px-3 py-2 text-sm"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </label>
        <label className="mt-3 block">
          <span className="text-sm text-graphite">البريد الإلكتروني</span>
          <input
            type="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded border border-border bg-surface px-3 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="mt-3 block">
          <span className="text-sm text-graphite">كلمة المرور (6 أحرف على الأقل)</span>
          <input
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="mt-1 w-full rounded border border-border bg-surface px-3 py-2 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <p className="mt-3 rounded border border-danger/60 bg-danger/10 p-2 text-sm text-danger">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="aadala-btn-primary mt-4 w-full disabled:opacity-50"
        >
          {loading ? "جارٍ الإنشاء..." : "إنشاء حساب"}
        </button>
        <p className="mt-3 text-center text-sm text-muted">
          لديك حساب بالفعل؟{" "}
          <Link className="font-semibold text-navy underline" href={`/${locale}/login`}>
            تسجيل الدخول
          </Link>
        </p>
      </form>
    </div>
  );
}

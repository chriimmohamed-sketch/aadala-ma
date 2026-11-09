"use client";

import { useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function LoginForm({ locale }: { locale: string }) {
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
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        // Generic: never reveal whether the email exists (enumeration resistance).
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
        return;
      }
      // Session is persisted by Supabase (cookies via @supabase/ssr + token storage).
      // Role is NEVER read here; server re-verifies via profiles (RLS).
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
        return;
      }
      window.location.href = `/${locale}/dashboard`;
    } catch {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <form onSubmit={handleSubmit} className="aadala-card p-6">
        <h1 className="text-2xl font-bold text-navy">تسجيل الدخول</h1>
        <p className="mt-1 text-sm text-muted">مصادقة عبر Supabase Auth — لا تُحفظ كلمة المرور في المتصفح.</p>
        <label className="mt-4 block">
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
          <span className="text-sm text-graphite">كلمة المرور</span>
          <input
            type="password"
            required
            autoComplete="current-password"
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
          {loading ? "جارٍ الدخول..." : "دخول"}
        </button>
        <p className="mt-2 text-center text-sm">
          <Link className="text-muted underline" href={`/${locale}/forgot`}>نسيت كلمة المرور؟</Link>
        </p>
        <p className="mt-3 text-center text-sm text-muted">
          ليس لديك حساب؟{" "}
          <Link className="font-semibold text-navy underline" href={`/${locale}/register`}>
            إنشاء حساب
          </Link>
        </p>
      </form>
    </div>
  );
}

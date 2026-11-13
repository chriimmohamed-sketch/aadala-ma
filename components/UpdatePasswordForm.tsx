"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function UpdatePasswordForm({ locale }: { locale: string }) {
  const [password, setPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseClient();
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); }).catch(() => {});
    return () => data.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      const { error: updErr } = await supabase.auth.updateUser({ password });
      if (updErr) {
        setError("تعذّر تعيين كلمة المرور. تأكد أن الرابط ساري ولم يُستعمل من قبل.");
        return;
      }
      setDone(true);
    } catch {
      setError("تعذّر تعيين كلمة المرور. تأكد أن الرابط ساري ولم يُستعمل من قبل.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto w-full max-w-md">
        <div className="aadala-card p-6">
          <h1 className="text-2xl font-bold text-navy">تم تعيين كلمة المرور</h1>
          <p className="mt-2 text-sm text-graphite">يمكنك الآن تسجيل الدخول.</p>
          <Link className="aadala-btn-primary mt-4 inline-block text-sm" href={`/${locale}/login`}>تسجيل الدخول</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <form onSubmit={handleSubmit} className="aadala-card p-6">
        <h1 className="text-2xl font-bold text-navy">تعيين كلمة مرور جديدة</h1>
        <p className="mt-1 text-sm text-muted">أدخل كلمة المرور الجديدة (6 أحرف على الأقل).</p>
        <label className="mt-4 block">
          <span className="text-sm text-graphite">كلمة المرور الجديدة</span>
          <input type="password" required minLength={6} autoComplete="new-password" disabled={!ready} className="mt-1 w-full rounded border border-border bg-surface px-3 py-2 text-sm disabled:opacity-50" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {!ready && <p className="mt-2 text-xs text-graphite-soft">جاري التحقق من رابط الاستعادة…</p>}
        {error && <p className="mt-3 rounded border border-danger/60 bg-danger/10 p-2 text-sm text-danger">{error}</p>}
        <button type="submit" disabled={loading || !ready} className="aadala-btn-primary mt-4 w-full disabled:opacity-50">
          {loading ? "جارٍ الحفظ…" : "حفظ"}
        </button>
      </form>
    </div>
  );
}

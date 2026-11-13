"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

interface Factor { id: string; status: string; friendly_name?: string | null }

export default function MfaForm({ locale }: { locale: string }) {
  const [factors, setFactors] = useState<Factor[]>([]);
  const [secret, setSecret] = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function load() {
    const supabase = getSupabaseClient();
    const { data } = await supabase.auth.mfa.listFactors();
    setFactors([...(data?.totp ?? [])]);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      try { await load(); } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, []);

  async function enroll() {
    setError(null);
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "aadala-authenticator" });
      if (error || !data) throw error ?? new Error("enroll failed");
      setSecret(data.totp.secret);
      setFactorId(data.id);
      const { data: ch } = await supabase.auth.mfa.challenge({ factorId: data.id });
      setChallengeId(ch?.id ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "error");
    }
  }

  async function verify() {
    setError(null);
    if (!factorId || !challengeId) return;
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.mfa.verify({ factorId, challengeId, code });
      if (error) throw error;
      setSecret(null);
      setInfo(`تم تفعيل التحقق بخطوتين. عدْ إلى ${locale}/admin.`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "error");
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <div className="aadala-card space-y-3 p-6">
        <h1 className="text-2xl font-bold text-navy">التحقق بخطوتين (MFA)</h1>
        <p className="text-sm text-muted">سجّل تطبيق مصادقة (TOTP) — مطلوب للإدارة بعد تفعيله في Supabase.</p>
        {factors.length > 0 && (
          <ul className="text-sm text-graphite">
            {factors.map((f) => <li key={f.id}>• {f.friendly_name ?? f.id} — {f.status}</li>)}
          </ul>
        )}
        {secret && (
          <div className="space-y-2">
            <p className="text-xs text-graphite-soft">امسح الرمز في تطبيق المصادقة — السر ظاهر مرة واحدة فقط:</p>
            <code className="block break-all rounded bg-ivory p-2 text-xs">{secret}</code>
            <label className="block text-xs">رمز التطبيق
              <input className="mt-1 w-full rounded border border-border bg-surface px-3 py-2 text-sm" value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" />
            </label>
            <button type="button" onClick={verify} className="aadala-btn-primary text-xs">تحقق وتفعيل</button>
          </div>
        )}
        {!secret && (
          <button type="button" onClick={enroll} className="aadala-btn-primary text-xs">تسجيل عامل جديد (TOTP)</button>
        )}
        {info && <p className="text-xs text-teal">{info}</p>}
        {error && <p className="rounded border border-danger/60 bg-danger/10 p-2 text-xs text-danger">{error}</p>}
      </div>
    </div>
  );
}

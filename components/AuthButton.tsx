"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function AuthButton({ locale }: { locale: string }) {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!url || !anon) return;
        const supabase = getSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!cancelled) setEmail(session?.user?.email ?? null);
      } catch {
        if (!cancelled) setEmail(null);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (email) {
    return (
      <span className="flex items-center gap-3">
        <span className="hidden max-w-40 truncate text-sm text-graphite-soft sm:inline" title={email}>{email}</span>
        <button
          type="button"
          className="aadala-btn-ghost !px-3 !py-1.5 text-sm"
          onClick={async () => {
            try {
              const supabase = getSupabaseClient();
              await supabase.auth.signOut();
            } finally {
              window.location.href = `/${locale}`;
            }
          }}
        >
          خروج
        </button>
      </span>
    );
  }
  return (
    <Link className="aadala-btn-gold !px-3 !py-1.5 text-sm no-underline" href={`/${locale}/login`}>
      دخول
    </Link>
  );
}

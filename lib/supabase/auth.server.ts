import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isAdminRole, normalizeRole } from "@/lib/admin/permissions";

export interface SessionUser {
  id: string;
  email: string | null;
  role: string;
}

/**
 * Server-side auth: verifies session against Supabase Auth server,
 * then reads role from `profiles` (RLS). Never trusts client/localStorage role.
 * Fail-closed: returns null when Supabase is unconfigured or session invalid.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id,email,role")
    .eq("id", data.user.id)
    .single();

  // RLS allows own-row read; if trigger hasn't run yet, default to 'user'.
  const role = normalizeRole(profile?.role ?? "user");
  return {
    id: data.user.id,
    email: profile?.email ?? data.user.email ?? null,
    role,
  };
}

/** True only for role === 'admin' (single source; keeps legacy ranks out of gate). */
export function isAdminUser(user: SessionUser | null): boolean {
  if (!user) return false;
  return isAdminRole(user.role);
}

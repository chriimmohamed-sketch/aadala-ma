// Server-side permission check. Role ALWAYS comes from Supabase `profiles` (RLS),
// never from localStorage / client claims. Admin gate uses isAdminRole only.
export type Role = "visitor" | "user" | "researcher" | "editor" | "legal_editor" | "legal_reviewer" | "translator" | "admin" | "super_admin" | "superadmin";

const ROLE_RANK: Record<Role, number> = {
  visitor: 0, user: 1, researcher: 2, editor: 3, legal_editor: 3, legal_reviewer: 4, translator: 3, admin: 5, super_admin: 6, superadmin: 6,
};

export function hasRole(userRole: Role, required: Role): boolean {
  return ROLE_RANK[userRole] >= ROLE_RANK[required];
}

/** Normalize DB role strings (DB uses legal_editor; legacy used editor/superadmin). */
export function normalizeRole(raw: unknown): Role {
  if (typeof raw !== "string") return "user";
  const r = raw.trim().toLowerCase();
  if (r === "admin" || r === "super_admin" || r === "superadmin") return "admin";
  if (r === "legal_reviewer" || r === "reviewer") return "legal_reviewer";
  if (r === "legal_editor" || r === "editor") return "editor";
  return "user";
}

/** Admin gate: ONLY 'admin' (normalized). Never 'user' / editors. */
export function isAdminRole(raw: unknown): boolean {
  return normalizeRole(raw) === "admin";
}

export function canManageUsers(role: Role): boolean { return hasRole(role, "admin"); }
export function canManageLegislation(role: Role): boolean { return hasRole(role, "editor"); }
export function canReviewAI(role: Role): boolean { return hasRole(role, "legal_reviewer"); }
export function canManageSystem(role: Role): boolean { return hasRole(role, "super_admin"); }
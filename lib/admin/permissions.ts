// Server-side permission check (placeholder). In production, verify JWT/session + role in DB.
export type Role = "visitor" | "user" | "researcher" | "editor" | "legal_reviewer" | "translator" | "admin" | "super_admin";

const ROLE_RANK: Record<Role, number> = {
  visitor: 0, user: 1, researcher: 2, editor: 3, legal_reviewer: 4, translator: 3, admin: 5, super_admin: 6,
};

export function hasRole(userRole: Role, required: Role): boolean {
  return ROLE_RANK[userRole] >= ROLE_RANK[required];
}

export function canManageUsers(role: Role): boolean { return hasRole(role, "admin"); }
export function canManageLegislation(role: Role): boolean { return hasRole(role, "editor"); }
export function canReviewAI(role: Role): boolean { return hasRole(role, "legal_reviewer"); }
export function canManageSystem(role: Role): boolean { return hasRole(role, "super_admin"); }
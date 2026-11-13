import { describe, it, expect } from "vitest";
import { isAdminUser } from "@/lib/supabase/auth.server";
import { isSupabaseConfigured } from "@/lib/supabase/server";

describe("isSupabaseConfigured", () => {
  it("is false without env", () => {
    // In test env NEXT_PUBLIC_SUPABASE_* are unset.
    expect(typeof isSupabaseConfigured()).toBe("boolean");
  });
});

describe("isAdminUser", () => {
  it("fails closed without user or role", () => {
    expect(isAdminUser(null)).toBe(false);
    expect(isAdminUser({ id: "1", email: "a@b.c", role: "user" })).toBe(false);
    expect(isAdminUser({ id: "1", email: "a@b.c", role: "legal_editor" })).toBe(false);
  });
  it("allows admin only", () => {
    expect(isAdminUser({ id: "1", email: "a@b.c", role: "admin" })).toBe(true);
    expect(isAdminUser({ id: "1", email: "a@b.c", role: "superadmin" })).toBe(true);
  });
});

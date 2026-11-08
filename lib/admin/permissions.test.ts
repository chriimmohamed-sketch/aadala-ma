import { describe, it, expect } from "vitest";
import {
  hasRole,
  normalizeRole,
  isAdminRole,
  canManageUsers,
  canManageLegislation,
  canReviewAI,
} from "./permissions";

describe("normalizeRole", () => {
  it("defaults unknown/missing to user", () => {
    expect(normalizeRole(undefined)).toBe("user");
    expect(normalizeRole("hacker")).toBe("user");
    expect(normalizeRole(null)).toBe("user");
  });
  it("maps legacy and DB variants", () => {
    expect(normalizeRole("editor")).toBe("editor");
    expect(normalizeRole("legal_editor")).toBe("editor");
    expect(normalizeRole("reviewer")).toBe("legal_reviewer");
    expect(normalizeRole("superadmin")).toBe("admin");
    expect(normalizeRole("super_admin")).toBe("admin");
    expect(normalizeRole(" ADMIN ")).toBe("admin");
  });
});

describe("isAdminRole (gate)", () => {
  it("allows ONLY admin", () => {
    expect(isAdminRole("admin")).toBe(true);
    expect(isAdminRole("superadmin")).toBe(true);
    expect(isAdminRole("user")).toBe(false);
    expect(isAdminRole("legal_editor")).toBe(false);
    expect(isAdminRole("editor")).toBe(false);
    expect(isAdminRole("legal_reviewer")).toBe(false);
    expect(isAdminRole(undefined)).toBe(false);
    expect(isAdminRole(null)).toBe(false);
  });
});

describe("hasRole ranks", () => {
  it("admin outranks editor and reviewer", () => {
    expect(hasRole("admin", "editor")).toBe(true);
    expect(hasRole("admin", "legal_reviewer")).toBe(true);
    expect(hasRole("user", "editor")).toBe(false);
    expect(hasRole("editor", "editor")).toBe(true);
  });
  it("capability helpers", () => {
    expect(canManageUsers("admin")).toBe(true);
    expect(canManageUsers("user")).toBe(false);
    expect(canManageLegislation("editor")).toBe(true);
    expect(canReviewAI("legal_reviewer")).toBe(true);
    expect(canReviewAI("user")).toBe(false);
  });
});

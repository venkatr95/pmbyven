import { describe, it, expect, afterEach, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    get: () => undefined,
    set: vi.fn(),
    delete: vi.fn(),
  })),
}));

import { getAdminSecret, adminCookieName } from "./admin";

describe("admin helpers", () => {
  const original = process.env.ADMIN_SECRET;

  afterEach(() => {
    process.env.ADMIN_SECRET = original;
  });

  it("returns cookie name", () => {
    expect(adminCookieName()).toBe("pmbyven_admin");
  });

  it("reads ADMIN_SECRET from env", () => {
    process.env.ADMIN_SECRET = "super-secret";
    expect(getAdminSecret()).toBe("super-secret");
  });

  it("falls back to local default when unset", () => {
    delete process.env.ADMIN_SECRET;
    expect(getAdminSecret()).toBe("pmbyven-admin-2026");
  });
});

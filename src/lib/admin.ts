import { cookies } from "next/headers";

const COOKIE = "pmbyven_admin";

export function getAdminSecret() {
  return process.env.ADMIN_SECRET || "pmbyven-admin-2026";
}

export async function isAdminAuthenticated() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  return token === getAdminSecret();
}

export function adminCookieName() {
  return COOKIE;
}

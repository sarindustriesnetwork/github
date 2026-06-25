import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Permission } from "@/lib/permissions/permissions";
import { hasPermission } from "@/lib/permissions/permissions";
import { DEFAULT_ADMIN, isDefaultAdminEmail } from "@/lib/auth/default-admin";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session-token";
import { findUserWithAccessById, getFallbackAdmin, normalizeUser, type AuthUser } from "@/lib/auth/user-context";

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const payload = verifySessionToken(token);
  if (!payload) return null;

  try {
    const dbUser = await findUserWithAccessById(payload.sub);
    if (dbUser && dbUser.status === "ACTIVE") {
      return normalizeUser(dbUser);
    }
  } catch {
    // Database can be offline in localhost UI mode. Token payload remains enough for demo login.
  }

  if (isDefaultAdminEmail(payload.email)) return getFallbackAdmin();

  if (payload.status === "ACTIVE") {
    return {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      status: payload.status,
      roles: payload.roles || [],
      permissions: payload.permissions || [],
      source: "token"
    };
  }

  return DEFAULT_ADMIN.email === payload.email ? getFallbackAdmin() : null;
}

export async function requireAuth(nextPath = "/admin") {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  return user;
}

export async function requirePermission(permission: Permission, nextPath = "/admin") {
  const user = await requireAuth(nextPath);
  if (!hasPermission(user.permissions, permission)) {
    redirect(`/unauthorized?permission=${encodeURIComponent(permission)}`);
  }
  return user;
}

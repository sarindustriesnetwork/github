import { NextResponse } from "next/server";
import type { Permission } from "@/lib/permissions/permissions";
import { hasPermission } from "@/lib/permissions/permissions";
import { getCurrentUser } from "@/lib/auth/session";

export async function requireApiPermission(permission: Permission) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ success: false, error: { code: "UNAUTHENTICATED", message: "Login required." } }, { status: 401 })
    };
  }

  if (!hasPermission(user.permissions, permission)) {
    return {
      user: null,
      response: NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: `Missing permission: ${permission}` } },
        { status: 403 }
      )
    };
  }

  return { user, response: null };
}

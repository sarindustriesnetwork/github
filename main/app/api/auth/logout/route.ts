import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit/audit";
import { getCurrentUser } from "@/lib/auth/session";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session-token";

export async function POST() {
  const user = await getCurrentUser();

  if (user) {
    await createAuditLog({
      actorId: user.source === "database" ? user.id : null,
      action: "LOGOUT",
      module: "auth",
      targetId: user.id,
      newValue: { email: user.email, source: user.source }
    });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
  return response;
}

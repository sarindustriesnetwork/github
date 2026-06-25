import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAuditLog } from "@/lib/audit/audit";
import { prisma } from "@/lib/db/prisma";
import { DEFAULT_ADMIN, isDefaultAdminEmail } from "@/lib/auth/default-admin";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/auth/session-token";
import { findUserWithAccessByEmail, getFallbackAdmin, normalizeUser, type AuthUser } from "@/lib/auth/user-context";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  next: z.string().optional().default("/admin")
});

function safeNextPath(value: string) {
  if (!value.startsWith("/")) return "/admin";
  if (value.startsWith("//")) return "/admin";
  if (value.startsWith("/api")) return "/admin";
  return value;
}

function createLoginResponse(user: AuthUser, nextPath: string) {
  const token = createSessionToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    status: user.status,
    roles: user.roles,
    permissions: user.permissions,
    source: user.source === "database" ? "database" : "fallback"
  });

  const response = NextResponse.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      permissions: user.permissions,
      source: user.source
    },
    redirectTo: safeNextPath(nextPath)
  });

  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS
  });

  return response;
}

export async function POST(request: NextRequest) {
  let input: z.infer<typeof LoginSchema>;

  try {
    input = LoginSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ success: false, error: { code: "INVALID_LOGIN_INPUT", message: "Valid email and password are required." } }, { status: 400 });
  }

  const email = input.email.trim().toLowerCase();
  let authenticatedUser: AuthUser | null = null;

  try {
    const dbUser = await findUserWithAccessByEmail(email);
    if (dbUser && dbUser.status === "ACTIVE") {
      const passwordOk = await bcrypt.compare(input.password, dbUser.passwordHash);
      if (passwordOk) authenticatedUser = normalizeUser(dbUser);
    }
  } catch {
    // Database may be offline before Docker/PostgreSQL setup. Fallback admin keeps localhost usable.
  }

  if (!authenticatedUser && isDefaultAdminEmail(email) && input.password === DEFAULT_ADMIN.password) {
    authenticatedUser = getFallbackAdmin();
  }

  if (!authenticatedUser) {
    await createAuditLog({
      action: "LOGIN_FAILED",
      module: "auth",
      targetId: email,
      newValue: { email },
      ipAddress: request.headers.get("x-forwarded-for"),
      userAgent: request.headers.get("user-agent")
    });

    try {
      await prisma.loginEvent.create({
        data: {
          email,
          status: "FAILED",
          reason: "INVALID_CREDENTIALS",
          ipAddress: request.headers.get("x-forwarded-for"),
          userAgent: request.headers.get("user-agent")
        }
      });
    } catch {}

    return NextResponse.json({ success: false, error: { code: "INVALID_CREDENTIALS", message: "Email or password is incorrect." } }, { status: 401 });
  }

  if (authenticatedUser.source === "database") {
    try {
      await prisma.user.update({ where: { id: authenticatedUser.id }, data: { lastLoginAt: new Date() } });
      await prisma.loginEvent.create({
        data: {
          userId: authenticatedUser.id,
          email: authenticatedUser.email,
          status: "SUCCESS",
          ipAddress: request.headers.get("x-forwarded-for"),
          userAgent: request.headers.get("user-agent")
        }
      });
    } catch {}
  }

  await createAuditLog({
    actorId: authenticatedUser.source === "database" ? authenticatedUser.id : null,
    action: "LOGIN_SUCCESS",
    module: "auth",
    targetId: authenticatedUser.id,
    newValue: { email: authenticatedUser.email, roles: authenticatedUser.roles, source: authenticatedUser.source },
    ipAddress: request.headers.get("x-forwarded-for"),
    userAgent: request.headers.get("user-agent")
  });

  return createLoginResponse(authenticatedUser, input.next);
}

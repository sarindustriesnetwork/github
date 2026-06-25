import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { DEFAULT_ADMIN, isDefaultAdminEmail } from "@/lib/auth/default-admin";
import { requireApiPermission } from "@/lib/auth/api";
import { createAuditLog } from "@/lib/audit/audit";
import { prisma } from "@/lib/db/prisma";

const UserStatusSchema = z.enum(["ACTIVE", "PENDING", "SUSPENDED", "BANNED"]);

const UpdateUserSchema = z.object({
  name: z.string().trim().min(2).optional(),
  email: z.string().trim().email().optional(),
  password: z.string().min(8).optional().or(z.literal("")),
  status: UserStatusSchema.optional(),
  roles: z.array(z.string().trim().min(1)).min(1).optional()
});

function databaseUnavailableResponse() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "DATABASE_UNAVAILABLE",
        message: "PostgreSQL is not connected. Start Docker/PostgreSQL to update users."
      }
    },
    { status: 503 }
  );
}

function formatUser(user: {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
  emailVerifiedAt: Date | null;
  roles: Array<{ role: { name: string } }>;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    status: user.status,
    roles: user.roles.map((item) => item.role.name),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    lastLoginAt: user.lastLoginAt?.toISOString() || null,
    emailVerifiedAt: user.emailVerifiedAt?.toISOString() || null
  };
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const { user: actor, response } = await requireApiPermission("users.update");
  if (response) return response;

  let input: z.infer<typeof UpdateUserSchema>;

  try {
    input = UpdateUserSchema.parse(await request.json());
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_USER_UPDATE", message: error instanceof Error ? error.message : "Invalid update input." } },
      { status: 400 }
    );
  }

  try {
    const target = await prisma.user.findUnique({
      where: { id: params.id },
      include: { roles: { include: { role: true } } }
    });

    if (!target) return NextResponse.json({ success: false, error: { code: "USER_NOT_FOUND", message: "User was not found." } }, { status: 404 });

    const nextEmail = input.email?.toLowerCase() || target.email;
    const nextRoles = input.roles || target.roles.map((item) => item.role.name);
    const nextStatus = input.status || target.status;

    if (isDefaultAdminEmail(target.email)) {
      if (!nextRoles.includes("SUPER_ADMIN")) {
        return NextResponse.json({ success: false, error: { code: "DEFAULT_ADMIN_PROTECTED", message: "Default Super Admin must keep SUPER_ADMIN role." } }, { status: 400 });
      }
      if (nextStatus !== "ACTIVE") {
        return NextResponse.json({ success: false, error: { code: "DEFAULT_ADMIN_PROTECTED", message: "Default Super Admin must remain active." } }, { status: 400 });
      }
    }

    if (nextEmail !== target.email) {
      const existing = await prisma.user.findUnique({ where: { email: nextEmail } });
      if (existing && existing.id !== target.id) {
        return NextResponse.json({ success: false, error: { code: "EMAIL_ALREADY_EXISTS", message: "Another user already uses this email." } }, { status: 409 });
      }
    }

    const roleRecords = await prisma.role.findMany({ where: { name: { in: nextRoles } } });
    if (roleRecords.length !== nextRoles.length) {
      return NextResponse.json({ success: false, error: { code: "INVALID_ROLES", message: "One or more selected roles do not exist." } }, { status: 400 });
    }

    const updateData: {
      name?: string;
      email?: string;
      status?: "ACTIVE" | "PENDING" | "SUSPENDED" | "BANNED";
      passwordHash?: string;
    } = {};

    if (input.name) updateData.name = input.name;
    if (input.email) updateData.email = nextEmail;
    if (input.status) updateData.status = input.status;
    if (input.password) updateData.passwordHash = await bcrypt.hash(input.password, 12);

    const updated = await prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: target.id }, data: updateData });

      if (input.roles) {
        await tx.userRole.deleteMany({ where: { userId: target.id } });
        await tx.userRole.createMany({
          data: roleRecords.map((role) => ({ userId: target.id, roleId: role.id })),
          skipDuplicates: true
        });
      }

      const nextUser = await tx.user.findUniqueOrThrow({
        where: { id: target.id },
        include: { roles: { include: { role: true } } }
      });

      await tx.auditLog.create({
        data: {
          actorId: actor?.source === "database" ? actor.id : undefined,
          action: "USER_UPDATED",
          module: "users",
          targetId: target.id,
          oldValue: {
            name: target.name,
            email: target.email,
            status: target.status,
            roles: target.roles.map((item) => item.role.name)
          },
          newValue: {
            name: nextUser.name,
            email: nextUser.email,
            status: nextUser.status,
            roles: nextUser.roles.map((item) => item.role.name),
            passwordChanged: Boolean(input.password)
          }
        }
      });

      return nextUser;
    });

    return NextResponse.json({ success: true, user: formatUser(updated) });
  } catch {
    await createAuditLog({ actorId: actor?.source === "database" ? actor.id : null, action: "USER_UPDATE_FAILED", module: "users", targetId: params.id });
    return databaseUnavailableResponse();
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const { user: actor, response } = await requireApiPermission("users.delete");
  if (response) return response;

  if (actor?.id === params.id || params.id === DEFAULT_ADMIN.id) {
    return NextResponse.json({ success: false, error: { code: "SELF_DELETE_BLOCKED", message: "You cannot delete or ban your own active admin account." } }, { status: 400 });
  }

  try {
    const target = await prisma.user.findUnique({ where: { id: params.id }, include: { roles: { include: { role: true } } } });
    if (!target) return NextResponse.json({ success: false, error: { code: "USER_NOT_FOUND", message: "User was not found." } }, { status: 404 });
    if (isDefaultAdminEmail(target.email)) {
      return NextResponse.json({ success: false, error: { code: "DEFAULT_ADMIN_PROTECTED", message: "Default Super Admin cannot be banned from this panel." } }, { status: 400 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({ where: { id: target.id }, data: { status: "BANNED" }, include: { roles: { include: { role: true } } } });
      await tx.auditLog.create({
        data: {
          actorId: actor?.source === "database" ? actor.id : undefined,
          action: "USER_SOFT_DELETED",
          module: "users",
          targetId: target.id,
          oldValue: { status: target.status },
          newValue: { status: "BANNED" }
        }
      });
      return user;
    });

    return NextResponse.json({ success: true, user: formatUser(updated), message: "User has been safely banned instead of hard deleted." });
  } catch {
    await createAuditLog({ actorId: actor?.source === "database" ? actor.id : null, action: "USER_DELETE_FAILED", module: "users", targetId: params.id });
    return databaseUnavailableResponse();
  }
}

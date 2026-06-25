import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAuditLog } from "@/lib/audit/audit";
import { requireApiPermission } from "@/lib/auth/api";
import { prisma } from "@/lib/db/prisma";
import { getFallbackAdmin } from "@/lib/auth/user-context";

const UserStatusSchema = z.enum(["ACTIVE", "PENDING", "SUSPENDED", "BANNED"]);

const CreateUserSchema = z.object({
  name: z.string().trim().min(2, "Name is required."),
  email: z.string().trim().email("Valid email is required."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  status: UserStatusSchema.default("ACTIVE"),
  roles: z.array(z.string().trim().min(1)).min(1, "Select at least one role.").default(["VIEWER"])
});

function databaseUnavailableResponse() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "DATABASE_UNAVAILABLE",
        message: "PostgreSQL is not connected. Start Docker/PostgreSQL to use user create/update actions."
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
  updatedAt?: Date;
  lastLoginAt?: Date | null;
  emailVerifiedAt?: Date | null;
  roles: Array<{ role: { name: string } }>;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    status: user.status,
    roles: user.roles.map((item) => item.role.name),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
    lastLoginAt: user.lastLoginAt?.toISOString() || null,
    emailVerifiedAt: user.emailVerifiedAt?.toISOString() || null
  };
}

export async function GET() {
  const { response } = await requireApiPermission("users.view");
  if (response) return response;

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        emailVerifiedAt: true,
        roles: { select: { role: { select: { name: true } } } }
      }
    });

    return NextResponse.json({
      success: true,
      source: "database",
      users: users.map(formatUser)
    });
  } catch {
    const admin = getFallbackAdmin();
    return NextResponse.json({
      success: true,
      source: "fallback",
      users: [
        {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          status: admin.status,
          roles: admin.roles,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLoginAt: null,
          emailVerifiedAt: new Date().toISOString()
        }
      ]
    });
  }
}

export async function POST(request: NextRequest) {
  const { user: actor, response } = await requireApiPermission("users.create");
  if (response) return response;

  let input: z.infer<typeof CreateUserSchema>;

  try {
    input = CreateUserSchema.parse(await request.json());
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_USER_INPUT", message: error instanceof Error ? error.message : "Invalid user input." } },
      { status: 400 }
    );
  }

  try {
    const email = input.email.toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      return NextResponse.json({ success: false, error: { code: "EMAIL_ALREADY_EXISTS", message: "A user with this email already exists." } }, { status: 409 });
    }

    const roles = await prisma.role.findMany({ where: { name: { in: input.roles } } });
    if (roles.length !== input.roles.length) {
      return NextResponse.json({ success: false, error: { code: "INVALID_ROLES", message: "One or more selected roles do not exist." } }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    const created = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: input.name,
          email,
          passwordHash,
          status: input.status,
          emailVerifiedAt: new Date(),
          roles: {
            create: roles.map((role) => ({ roleId: role.id }))
          }
        },
        include: { roles: { include: { role: true } } }
      });

      await tx.auditLog.create({
        data: {
          actorId: actor?.source === "database" ? actor.id : undefined,
          action: "USER_CREATED",
          module: "users",
          targetId: newUser.id,
          newValue: {
            name: newUser.name,
            email: newUser.email,
            status: newUser.status,
            roles: newUser.roles.map((item) => item.role.name)
          }
        }
      });

      return newUser;
    });

    return NextResponse.json({ success: true, user: formatUser(created) }, { status: 201 });
  } catch {
    await createAuditLog({ action: "USER_CREATE_FAILED", module: "users", newValue: { email: input.email } });
    return databaseUnavailableResponse();
  }
}

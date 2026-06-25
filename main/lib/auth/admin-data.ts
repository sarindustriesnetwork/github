import { prisma } from "@/lib/db/prisma";
import { getFallbackAdmin } from "@/lib/auth/user-context";
import { PERMISSIONS, ROLE_DEFINITIONS } from "@/lib/permissions/permissions";

export async function getAdminUsersForPage() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { roles: { include: { role: true } } }
    });

    return {
      source: "database",
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        roles: user.roles.map((item) => item.role.name),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        lastLoginAt: user.lastLoginAt?.toISOString() || null,
        emailVerifiedAt: user.emailVerifiedAt?.toISOString() || null
      }))
    };
  } catch {
    const admin = getFallbackAdmin();
    const now = new Date().toISOString();
    return {
      source: "fallback",
      users: [
        {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          status: admin.status,
          roles: admin.roles,
          createdAt: now,
          updatedAt: now,
          lastLoginAt: null,
          emailVerifiedAt: now
        }
      ]
    };
  }
}

export async function getRBACSummaryForPage() {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { name: "asc" },
      include: { permissions: { include: { permission: true } }, users: true }
    });

    return {
      source: "database",
      permissions: PERMISSIONS,
      roles: roles.map((role) => ({
        name: role.name,
        label: ROLE_DEFINITIONS[role.name as keyof typeof ROLE_DEFINITIONS]?.label || role.name,
        description: role.description || "No description",
        userCount: role.users.length,
        permissions: role.permissions.map((item) => item.permission.key)
      }))
    };
  } catch {
    return {
      source: "fallback",
      permissions: PERMISSIONS,
      roles: Object.entries(ROLE_DEFINITIONS).map(([name, role]) => ({
        name,
        label: role.label,
        description: role.description,
        userCount: name === "SUPER_ADMIN" ? 1 : 0,
        permissions: [...role.permissions]
      }))
    };
  }
}

export function getRoleOptionsForPage() {
  return Object.entries(ROLE_DEFINITIONS).map(([name, role]) => ({
    name,
    label: role.label,
    description: role.description,
    permissions: [...role.permissions]
  }));
}

import { prisma } from "@/lib/db/prisma";
import { DEFAULT_ADMIN } from "@/lib/auth/default-admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  status: string;
  roles: string[];
  permissions: string[];
  source: "database" | "fallback" | "token";
};

type PrismaUserWithAccess = {
  id: string;
  name: string;
  email: string;
  status: string;
  roles: Array<{
    role: {
      name: string;
      permissions: Array<{
        permission: { key: string };
      }>;
    };
  }>;
};

export function normalizeUser(user: PrismaUserWithAccess, source: "database" | "fallback" = "database"): AuthUser {
  const roles = user.roles.map((item) => item.role.name);
  const permissions = Array.from(
    new Set(user.roles.flatMap((item) => item.role.permissions.map((permission) => permission.permission.key)))
  );

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    status: user.status,
    roles,
    permissions,
    source
  };
}

export function getFallbackAdmin(): AuthUser {
  return {
    id: DEFAULT_ADMIN.id,
    name: DEFAULT_ADMIN.name,
    email: DEFAULT_ADMIN.email,
    status: DEFAULT_ADMIN.status,
    roles: [...DEFAULT_ADMIN.roles],
    permissions: [...DEFAULT_ADMIN.permissions],
    source: "fallback"
  };
}

export async function findUserWithAccessByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: { permission: true }
              }
            }
          }
        }
      }
    }
  });
}

export async function findUserWithAccessById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: { permission: true }
              }
            }
          }
        }
      }
    }
  });
}

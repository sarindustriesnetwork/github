import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PERMISSIONS, ROLE_DEFINITIONS } from "../lib/permissions/permissions";

const prisma = new PrismaClient();

async function main() {
  const adminName = process.env.DEFAULT_ADMIN_NAME || "SAIFUL ALAM RAFI";
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || "admin@sarindustriesnetwork.com";
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || "Admin@2026";

  for (const permissionKey of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key: permissionKey },
      update: {},
      create: {
        key: permissionKey,
        description: `Allows ${permissionKey}`
      }
    });
  }

  const roleRecords: Record<string, { id: string }> = {};

  for (const [roleName, roleDefinition] of Object.entries(ROLE_DEFINITIONS)) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {
        description: roleDefinition.description
      },
      create: {
        name: roleName,
        description: roleDefinition.description
      }
    });

    roleRecords[roleName] = { id: role.id };

    for (const permissionKey of roleDefinition.permissions) {
      const permission = await prisma.permission.findUniqueOrThrow({ where: { key: permissionKey } });

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id
          }
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id
        }
      });
    }
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      passwordHash,
      status: "ACTIVE",
      emailVerifiedAt: new Date()
    },
    create: {
      name: adminName,
      email: adminEmail,
      passwordHash,
      status: "ACTIVE",
      emailVerifiedAt: new Date()
    }
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: admin.id,
        roleId: roleRecords.SUPER_ADMIN.id
      }
    },
    update: {},
    create: {
      userId: admin.id,
      roleId: roleRecords.SUPER_ADMIN.id
    }
  });

  await prisma.systemSetting.upsert({
    where: { key: "brand" },
    update: {
      value: {
        name: "SAR INDUSTRIES NETWORK",
        owner: "SAIFUL ALAM RAFI",
        adminEmail,
        rights: "© 𝟮𝟬𝟮𝟲 𝗔𝗹𝗹 𝗥𝗶𝗴𝗵𝘁𝘀 𝗥𝗲𝘀𝗲𝗿𝘃𝗲𝗱 | 𝗦𝗔𝗥 𝗜𝗡𝗗𝗨𝗦𝗧𝗥𝗜𝗘𝗦 𝗡𝗘𝗧𝗪𝗢𝗥𝗞™.",
        developerCredit: "Built & developed by SAR INDUSTRIES NETWORK."
      }
    },
    create: {
      key: "brand",
      value: {
        name: "SAR INDUSTRIES NETWORK",
        owner: "SAIFUL ALAM RAFI",
        adminEmail,
        rights: "© 𝟮𝟬𝟮𝟲 𝗔𝗹𝗹 𝗥𝗶𝗴𝗵𝘁𝘀 𝗥𝗲𝘀𝗲𝗿𝘃𝗲𝗱 | 𝗦𝗔𝗥 𝗜𝗡𝗗𝗨𝗦𝗧𝗥𝗜𝗘𝗦 𝗡𝗘𝗧𝗪𝗢𝗥𝗞™.",
        developerCredit: "Built & developed by SAR INDUSTRIES NETWORK."
      }
    }
  });

  const plugins = [
    ["Store Builder", "store-builder", "commerce"],
    ["Stripe Billing", "stripe-billing", "payment"],
    ["Email Notification", "email-notification", "notification"],
    ["AI Copilot", "ai-copilot", "ai"],
    ["Report Export", "report-export", "utility"],
    ["Support Ticket", "support-ticket", "support"],
    ["Reliability Center", "reliability-center", "system"]
  ] as const;

  for (const [name, slug, category] of plugins) {
    await prisma.plugin.upsert({
      where: { slug },
      update: {},
      create: {
        name,
        slug,
        category,
        description: `${name} official plugin for SAR INDUSTRIES NETWORK.`,
        status: "AVAILABLE",
        version: "1.0.0"
      }
    });
  }

  await prisma.storeTemplate.upsert({
    where: { id: "default-sar-premium-template" },
    update: {},
    create: {
      id: "default-sar-premium-template",
      name: "SAR Premium Commerce",
      category: "general",
      description: "Premium starter storefront template for SAR INDUSTRIES NETWORK stores.",
      isFree: true,
      isPremium: false,
      themeConfig: {
        colors: {
          primary: "#6C5CFF",
          secondary: "#0B0F19",
          background: "#FFFFFF",
          text: "#0B0F19"
        },
        typography: {
          heading: "Inter",
          body: "Inter"
        },
        radius: {
          card: "24px",
          button: "999px"
        }
      }
    }
  });

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "SYSTEM_SEEDED_AUTH_RBAC",
      module: "setup",
      newValue: {
        adminEmail,
        brand: "SAR INDUSTRIES NETWORK",
        step: "2.3 User CRUD + RBAC Role Assignment + White-Label Branding",
        roles: Object.keys(ROLE_DEFINITIONS),
        permissions: PERMISSIONS.length
      }
    }
  });

  console.log("Seed completed successfully.");
  console.log(`Super Admin: ${adminEmail}`);
  console.log("Password: Admin@2026");
  console.log("Step 2.3 User CRUD + RBAC roles and white-label branding seeded.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

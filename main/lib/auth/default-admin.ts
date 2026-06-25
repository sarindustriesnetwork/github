import { PERMISSIONS } from "@/lib/permissions/permissions";
import { BRAND } from "@/lib/branding";

export const DEFAULT_ADMIN = {
  id: "sar-default-super-admin",
  name: process.env.DEFAULT_ADMIN_NAME || BRAND.owner || "SAIFUL ALAM RAFI",
  email: process.env.DEFAULT_ADMIN_EMAIL || BRAND.adminEmail || "admin@sarindustriesnetwork.com",
  password: process.env.DEFAULT_ADMIN_PASSWORD || "Admin@2026",
  status: "ACTIVE",
  roles: ["SUPER_ADMIN"],
  permissions: [...PERMISSIONS]
} as const;

export function isDefaultAdminEmail(email: string) {
  return email.trim().toLowerCase() === DEFAULT_ADMIN.email.toLowerCase();
}

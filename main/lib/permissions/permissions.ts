export const PERMISSIONS = [
  "admin.access",
  "users.view",
  "users.create",
  "users.update",
  "users.delete",
  "roles.view",
  "roles.manage",
  "stores.view",
  "stores.create",
  "stores.update",
  "stores.suspend",
  "orders.view",
  "payments.view",
  "payments.refund",
  "subscriptions.view",
  "subscriptions.update",
  "plugins.view",
  "plugins.manage",
  "ai.use",
  "ai.execute_action",
  "reliability.view",
  "diagnosis.manage",
  "settings.view",
  "settings.update",
  "audit_logs.view"
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export const ROLE_DEFINITIONS = {
  SUPER_ADMIN: {
    label: "Super Admin",
    description: "Full official platform control for SAR INDUSTRIES NETWORK.",
    permissions: [...PERMISSIONS]
  },
  ADMIN: {
    label: "Admin",
    description: "Manage users, stores, operations, and reports without critical payment/settings control.",
    permissions: [
      "admin.access",
      "users.view",
      "users.create",
      "users.update",
      "stores.view",
      "stores.create",
      "stores.update",
      "orders.view",
      "subscriptions.view",
      "plugins.view",
      "reliability.view",
      "settings.view"
    ]
  },
  FINANCE_MANAGER: {
    label: "Finance Manager",
    description: "View billing, subscriptions, invoices, payments, and approved refunds.",
    permissions: ["admin.access", "users.view", "stores.view", "orders.view", "payments.view", "payments.refund", "subscriptions.view", "subscriptions.update"]
  },
  SUPPORT_AGENT: {
    label: "Support Agent",
    description: "Support-focused access to users, stores, tickets, reliability status, and AI reply drafts.",
    permissions: ["admin.access", "users.view", "stores.view", "orders.view", "ai.use", "reliability.view"]
  },
  STORE_OWNER: {
    label: "Store Owner",
    description: "Seller workspace access for owned stores.",
    permissions: ["stores.view", "stores.update", "orders.view", "plugins.view", "ai.use"]
  },
  VIEWER: {
    label: "Viewer",
    description: "Read-only admin dashboard visibility.",
    permissions: ["admin.access", "users.view", "stores.view", "orders.view", "payments.view", "subscriptions.view", "plugins.view", "reliability.view"]
  }
} as const satisfies Record<string, { label: string; description: string; permissions: readonly Permission[] }>;

export function hasPermission(userPermissions: string[], permission: Permission) {
  return userPermissions.includes(permission);
}

export function hasAnyPermission(userPermissions: string[], permissions: Permission[]) {
  return permissions.some((permission) => hasPermission(userPermissions, permission));
}

export function hasAllPermissions(userPermissions: string[], permissions: Permission[]) {
  return permissions.every((permission) => hasPermission(userPermissions, permission));
}

export type StoreStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "SUSPENDED";
export type StorePlan = "FREE" | "STARTER" | "PRO" | "ENTERPRISE";

export type StoreOwner = {
  name: string;
  email: string;
  role: "OWNER" | "MANAGER" | "SUPPORT";
};

export type StoreRecord = {
  id: string;
  slug: string;
  name: string;
  industry: string;
  status: StoreStatus;
  plan: StorePlan;
  owner: StoreOwner;
  region: string;
  revenue: string;
  orders: number;
  health: number;
  createdAt: string;
  updatedAt: string;
  features: string[];
  audit: string[];
};

export const STORE_STATUS_OPTIONS: StoreStatus[] = ["DRAFT", "ACTIVE", "PAUSED", "SUSPENDED"];
export const STORE_PLAN_OPTIONS: StorePlan[] = ["FREE", "STARTER", "PRO", "ENTERPRISE"];

export const stores: StoreRecord[] = [
  {
    id: "store_sar_main",
    slug: "sar-main-store",
    name: "SAR Main Store",
    industry: "General Commerce",
    status: "ACTIVE",
    plan: "PRO",
    owner: { name: "SAIFUL ALAM RAFI", email: "admin@sarindustriesnetwork.com", role: "OWNER" },
    region: "Bangladesh",
    revenue: "$12.4K",
    orders: 428,
    health: 98,
    createdAt: "2026-06-01",
    updatedAt: "2026-06-27",
    features: ["Storefront", "Admin Panel", "Checkout Ready", "Plugin Slot"],
    audit: ["Store activated", "Owner assigned", "Render deployment verified"]
  },
  {
    id: "store_demo_fashion",
    slug: "demo-fashion-store",
    name: "Demo Fashion Store",
    industry: "Fashion Retail",
    status: "DRAFT",
    plan: "STARTER",
    owner: { name: "Store Manager", email: "manager@example.com", role: "MANAGER" },
    region: "Asia",
    revenue: "$1.8K",
    orders: 64,
    health: 87,
    createdAt: "2026-06-18",
    updatedAt: "2026-06-25",
    features: ["Store Builder", "Product Grid", "Theme Preview"],
    audit: ["Draft created", "Theme selected", "Owner invited"]
  },
  {
    id: "store_b2b_network",
    slug: "b2b-network-store",
    name: "B2B Network Store",
    industry: "Wholesale",
    status: "PAUSED",
    plan: "ENTERPRISE",
    owner: { name: "Operations Lead", email: "ops@example.com", role: "OWNER" },
    region: "Global",
    revenue: "$28.9K",
    orders: 973,
    health: 91,
    createdAt: "2026-06-10",
    updatedAt: "2026-06-24",
    features: ["Bulk Orders", "B2B Pricing", "Custom Domain"],
    audit: ["Paused for review", "B2B catalog imported", "Enterprise plan enabled"]
  }
];

export function getStoreBySlug(slug: string) {
  return stores.find((store) => store.slug === slug);
}

export function getStoreMetrics() {
  const totalStores = stores.length;
  const activeStores = stores.filter((store) => store.status === "ACTIVE").length;
  const totalOrders = stores.reduce((sum, store) => sum + store.orders, 0);
  const averageHealth = Math.round(stores.reduce((sum, store) => sum + store.health, 0) / Math.max(totalStores, 1));

  return {
    totalStores,
    activeStores,
    totalOrders,
    averageHealth
  };
}

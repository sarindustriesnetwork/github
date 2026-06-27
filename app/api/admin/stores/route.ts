import { NextResponse } from "next/server";
import { getStoreMetrics, STORE_PLAN_OPTIONS, STORE_STATUS_OPTIONS, stores } from "@/lib/stores";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "new-store";
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    module: "local-store-management-core",
    version: "2.6.0-localhost-windows",
    backend: {
      mode: "local-seed-runtime",
      persistentDatabase: false,
      cloudIntegrations: false
    },
    source: "local-seed-data",
    metrics: getStoreMetrics(),
    stores,
    options: {
      status: STORE_STATUS_OPTIONS,
      plan: STORE_PLAN_OPTIONS
    },
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const name = String((body as Record<string, unknown>).name || "").trim();
  const ownerEmail = String((body as Record<string, unknown>).ownerEmail || "").trim().toLowerCase();
  const ownerName = String((body as Record<string, unknown>).ownerName || "Unassigned Owner").trim();
  const industry = String((body as Record<string, unknown>).industry || "General Commerce").trim();
  const region = String((body as Record<string, unknown>).region || "Bangladesh").trim();

  if (!name) {
    return NextResponse.json({ ok: false, error: "Store name is required." }, { status: 422 });
  }

  if (ownerEmail && !isValidEmail(ownerEmail)) {
    return NextResponse.json({ ok: false, error: "Owner email is invalid." }, { status: 422 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const store = {
    id: `store_${Date.now()}`,
    slug: slugify(name),
    name,
    industry,
    status: "DRAFT",
    plan: "FREE",
    owner: {
      name: ownerName || "Unassigned Owner",
      email: ownerEmail || "owner@example.com",
      role: "OWNER"
    },
    region,
    revenue: "$0",
    orders: 0,
    health: 82,
    createdAt: today,
    updatedAt: today,
    features: ["Store Builder", "Admin Panel", "Theme Draft"],
    audit: ["Local store draft created", "Owner assigned", "Ready for localhost testing"]
  };

  return NextResponse.json({
    ok: true,
    message: "Store draft validated in local runtime.",
    backend: "local-seed-runtime",
    store
  }, { status: 201 });
}

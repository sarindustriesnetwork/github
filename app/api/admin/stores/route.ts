import { NextResponse } from "next/server";
import { getStoreMetrics, stores, STORE_PLAN_OPTIONS, STORE_STATUS_OPTIONS } from "@/lib/stores";

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
    module: "store-management-core",
    version: "2.4.0",
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

  const createdStore = {
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
    createdAt: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10),
    features: ["Store Builder", "Admin Panel", "Theme Draft"],
    audit: ["Store draft created", "Owner assigned", "Ready for setup"]
  };

  return NextResponse.json({
    ok: true,
    message: "Store draft validated and prepared. Database persistence will be added in the next backend phase.",
    store: createdStore
  }, { status: 201 });
}

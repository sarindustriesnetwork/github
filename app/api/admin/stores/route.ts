import { NextResponse } from "next/server";
import { STORE_PLAN_OPTIONS, STORE_STATUS_OPTIONS } from "@/lib/stores";
import { createStoreDraft, firebaseBackendStatus, listStores } from "@/lib/firebase/stores";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function GET() {
  const result = await listStores();

  return NextResponse.json({
    ok: true,
    module: "firebase-store-management-core",
    version: "2.5.0-firebase",
    backend: firebaseBackendStatus(),
    source: result.source,
    metrics: result.metrics,
    stores: result.stores,
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

  const result = await createStoreDraft({ name, ownerEmail, ownerName, industry, region });

  return NextResponse.json({
    ok: true,
    message: result.source === "firebase" ? "Store created in Firestore." : "Store draft validated. Configure Firebase env to persist it in Firestore.",
    backend: firebaseBackendStatus(),
    source: result.source,
    store: result.store
  }, { status: 201 });
}

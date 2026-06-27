import type { DocumentData } from "firebase-admin/firestore";
import type { StoreRecord } from "@/lib/stores";
import { getStoreMetricsFor, stores as fallbackStores } from "@/lib/stores";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase/admin";

const COLLECTION = "stores";

type StoreInput = {
  name: string;
  ownerEmail?: string;
  ownerName?: string;
  industry?: string;
  region?: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "new-store";
}

function normalizeStore(id: string, data: DocumentData): StoreRecord {
  return {
    id,
    slug: String(data.slug || id),
    name: String(data.name || "Untitled Store"),
    industry: String(data.industry || "General Commerce"),
    status: data.status || "DRAFT",
    plan: data.plan || "FREE",
    owner: {
      name: String(data.owner?.name || "Unassigned Owner"),
      email: String(data.owner?.email || "owner@example.com"),
      role: data.owner?.role || "OWNER"
    },
    region: String(data.region || "Bangladesh"),
    revenue: String(data.revenue || "$0"),
    orders: Number(data.orders || 0),
    health: Number(data.health || 82),
    createdAt: String(data.createdAt || new Date().toISOString().slice(0, 10)),
    updatedAt: String(data.updatedAt || new Date().toISOString().slice(0, 10)),
    features: Array.isArray(data.features) ? data.features.map(String) : ["Store Builder", "Admin Panel"],
    audit: Array.isArray(data.audit) ? data.audit.map(String) : ["Loaded from Firebase"]
  };
}

export function firebaseBackendStatus() {
  return {
    configured: isFirebaseConfigured(),
    projectId: process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || null,
    database: isFirebaseConfigured() ? "firestore" : "fallback-seed-data"
  };
}

export async function listStores() {
  const db = getFirebaseDb();
  if (!db) {
    return {
      source: "fallback",
      stores: fallbackStores,
      metrics: getStoreMetricsFor(fallbackStores)
    };
  }

  const snapshot = await db.collection(COLLECTION).orderBy("updatedAt", "desc").limit(100).get();
  const records = snapshot.docs.map((doc) => normalizeStore(doc.id, doc.data()));

  if (records.length === 0) {
    return {
      source: "firebase-empty-fallback",
      stores: fallbackStores,
      metrics: getStoreMetricsFor(fallbackStores)
    };
  }

  return {
    source: "firebase",
    stores: records,
    metrics: getStoreMetricsFor(records)
  };
}

export async function createStoreDraft(input: StoreInput) {
  const today = new Date().toISOString().slice(0, 10);
  const slug = slugify(input.name);
  const store: StoreRecord = {
    id: `store_${Date.now()}`,
    slug,
    name: input.name.trim(),
    industry: input.industry?.trim() || "General Commerce",
    status: "DRAFT",
    plan: "FREE",
    owner: {
      name: input.ownerName?.trim() || "Unassigned Owner",
      email: input.ownerEmail?.trim().toLowerCase() || "owner@example.com",
      role: "OWNER"
    },
    region: input.region?.trim() || "Bangladesh",
    revenue: "$0",
    orders: 0,
    health: 82,
    createdAt: today,
    updatedAt: today,
    features: ["Store Builder", "Admin Panel", "Theme Draft"],
    audit: ["Store draft created", "Owner assigned", "Firebase backend ready"]
  };

  const db = getFirebaseDb();
  if (!db) {
    return { source: "validated-fallback", store };
  }

  await db.collection(COLLECTION).doc(store.slug).set(store, { merge: true });
  await db.collection("storeAuditLogs").add({
    storeId: store.slug,
    action: "STORE_CREATED",
    createdAt: new Date().toISOString(),
    message: `Store ${store.name} created through Firebase backend integration.`
  });

  return { source: "firebase", store };
}

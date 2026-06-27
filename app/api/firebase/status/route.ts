import { NextResponse } from "next/server";
import { firebaseBackendStatus } from "@/lib/firebase/stores";
import { isFirebaseClientConfigured } from "@/lib/firebase/client";

export async function GET() {
  return NextResponse.json({
    ok: true,
    platform: "firebase",
    hosting: "firebase-app-hosting",
    backend: firebaseBackendStatus(),
    clientSdkConfigured: isFirebaseClientConfigured(),
    firestoreCollections: ["stores", "storeAuditLogs", "users"],
    secretsExposed: false,
    timestamp: new Date().toISOString()
  });
}

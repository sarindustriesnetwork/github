import { NextResponse } from "next/server";
import { BRAND } from "@/lib/branding";

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: BRAND.name,
    build: "step-2.5-firebase-backend-integration",
    hosting: "firebase-app-hosting",
    runtime: "nodejs",
    environment: process.env.NODE_ENV || "development",
    adminSecretConfigured: Boolean(process.env.DEFAULT_ADMIN_PASSWORD),
    firebaseProjectConfigured: Boolean(process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT),
    timestamp: new Date().toISOString()
  });
}

import { NextResponse } from "next/server";
import { BRAND } from "@/lib/branding";
import { getStoreMetrics } from "@/lib/stores";
import { firebaseBackendStatus } from "@/lib/firebase/stores";

export async function GET() {
  const hasAdminSecret = Boolean(process.env.DEFAULT_ADMIN_PASSWORD);
  const hasAdminEmail = Boolean(process.env.DEFAULT_ADMIN_EMAIL);
  const nodeVersion = process.version;
  const firebaseStatus = firebaseBackendStatus();

  return NextResponse.json({
    ok: true,
    app: BRAND.name,
    build: "step-2.5-firebase-backend-integration",
    deploymentTarget: "firebase-app-hosting",
    runtime: "nodejs",
    nodeVersion,
    environment: process.env.NODE_ENV || "development",
    backend: firebaseStatus,
    modules: {
      auth: "ready",
      rbac: "ready",
      users: "ready",
      stores: "firebase-ready"
    },
    storeMetrics: getStoreMetrics(),
    checks: {
      adminEmailConfigured: hasAdminEmail,
      adminSecretConfigured: hasAdminSecret,
      firebaseProjectConfigured: firebaseStatus.configured,
      secretsExposed: false
    },
    routes: [
      "/",
      "/login",
      "/admin",
      "/admin/users",
      "/admin/stores",
      "/admin/security",
      "/dashboard/store-builder",
      "/store/demo-store",
      "/preview/demo-store",
      "/api/health",
      "/api/deployment/status",
      "/api/firebase/status",
      "/api/admin/stores",
      "/api/auth/me"
    ],
    timestamp: new Date().toISOString()
  });
}

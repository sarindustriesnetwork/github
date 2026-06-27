import { NextResponse } from "next/server";
import { BRAND } from "@/lib/branding";
import { getStoreMetrics } from "@/lib/stores";

export async function GET() {
  const hasAdminSecret = Boolean(process.env.DEFAULT_ADMIN_PASSWORD);
  const hasAdminEmail = Boolean(process.env.DEFAULT_ADMIN_EMAIL);
  const nodeVersion = process.version;

  return NextResponse.json({
    ok: true,
    app: BRAND.name,
    build: "step-2.6-localhost-windows",
    deploymentTarget: "localhost-windows-11",
    runtime: "nodejs",
    nodeVersion,
    environment: process.env.NODE_ENV || "development",
    backend: {
      mode: "local-seed-runtime",
      cloudIntegrations: false,
      externalDatabase: false
    },
    modules: {
      auth: "local-ready",
      rbac: "local-ready",
      users: "local-ready",
      stores: "local-ready"
    },
    storeMetrics: getStoreMetrics(),
    checks: {
      adminEmailConfigured: hasAdminEmail,
      adminSecretConfigured: hasAdminSecret,
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
      "/api/admin/stores",
      "/api/auth/me"
    ],
    timestamp: new Date().toISOString()
  });
}

import { NextResponse } from "next/server";
import { BRAND } from "@/lib/branding";
import { getStoreMetrics } from "@/lib/stores";

export async function GET() {
  const hasAdminSecret = Boolean(process.env.DEFAULT_ADMIN_PASSWORD);
  const hasAdminEmail = Boolean(process.env.DEFAULT_ADMIN_EMAIL);
  const nodeVersion = process.version;
  const deploymentTarget = process.env.RENDER ? "render" : process.env.VERCEL ? "vercel" : process.env.CF_PAGES ? "cloudflare-pages" : "local-or-custom";

  return NextResponse.json({
    ok: true,
    app: BRAND.name,
    build: "step-2.4-store-management-core",
    deploymentTarget,
    runtime: "nodejs",
    nodeVersion,
    environment: process.env.NODE_ENV || "development",
    modules: {
      auth: "ready",
      rbac: "ready",
      users: "ready",
      stores: "step-2.4-ready"
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

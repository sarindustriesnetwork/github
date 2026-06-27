import { NextResponse } from "next/server";
import { BRAND } from "@/lib/branding";

export async function GET() {
  const hasAdminSecret = Boolean(process.env.DEFAULT_ADMIN_PASSWORD);
  const hasAdminEmail = Boolean(process.env.DEFAULT_ADMIN_EMAIL);
  const nodeVersion = process.version;
  const deploymentTarget = process.env.RENDER ? "render" : process.env.VERCEL ? "vercel" : process.env.CF_PAGES ? "cloudflare-pages" : "local-or-custom";

  return NextResponse.json({
    ok: true,
    app: BRAND.name,
    build: "step-2.3.1-render-master-plan",
    deploymentTarget,
    runtime: "nodejs",
    nodeVersion,
    environment: process.env.NODE_ENV || "development",
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
      "/admin/security",
      "/dashboard/store-builder",
      "/store/demo-store",
      "/preview/demo-store",
      "/api/health",
      "/api/auth/me"
    ],
    timestamp: new Date().toISOString()
  });
}

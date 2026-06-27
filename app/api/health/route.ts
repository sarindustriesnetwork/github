import { NextResponse } from "next/server";
import { BRAND } from "@/lib/branding";

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: BRAND.name,
    build: "step-2.3.1-render-master-plan",
    runtime: "nodejs",
    environment: process.env.NODE_ENV || "development",
    adminSecretConfigured: Boolean(process.env.DEFAULT_ADMIN_PASSWORD),
    timestamp: new Date().toISOString()
  });
}

import { NextResponse } from "next/server";
import { BRAND } from "@/lib/branding";

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: BRAND.name,
    build: "step-2.6-localhost-windows",
    runtime: "nodejs",
    target: "localhost-windows-11",
    environment: process.env.NODE_ENV || "development",
    adminSecretConfigured: Boolean(process.env.DEFAULT_ADMIN_PASSWORD),
    timestamp: new Date().toISOString()
  });
}

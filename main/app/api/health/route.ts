import { NextResponse } from "next/server";
import { BRAND } from "@/lib/branding";

export async function GET() {
  return NextResponse.json({
    success: true,
    app: BRAND.name,
    owner: BRAND.owner,
    status: "healthy",
    step: "2.2-auth-rbac",
    auth: "enabled",
    rbac: "enabled",
    timestamp: new Date().toISOString()
  });
}

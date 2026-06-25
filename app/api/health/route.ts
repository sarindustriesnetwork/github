import { NextResponse } from "next/server";
import { BRAND } from "@/lib/branding";

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: BRAND.name,
    build: "step-2.3-auth-rbac-user-crud-whitelabel",
    timestamp: new Date().toISOString()
  });
}

import { NextResponse } from "next/server";
import { requireApiPermission } from "@/lib/auth/api";
import { PERMISSIONS, ROLE_DEFINITIONS } from "@/lib/permissions/permissions";

export async function GET() {
  const { response } = await requireApiPermission("roles.view");
  if (response) return response;

  return NextResponse.json({
    success: true,
    roles: ROLE_DEFINITIONS,
    permissions: PERMISSIONS
  });
}

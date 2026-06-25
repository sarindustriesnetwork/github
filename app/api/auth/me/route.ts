import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = cookies().get("sar_session")?.value;
  if (session !== "super-admin") {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      name: "SAIFUL ALAM RAFI",
      email: process.env.DEFAULT_ADMIN_EMAIL || "admin@sarindustriesnetwork.com",
      role: "SUPER_ADMIN"
    }
  });
}

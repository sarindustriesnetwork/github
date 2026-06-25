import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const expectedEmail = (process.env.DEFAULT_ADMIN_EMAIL || "admin@sarindustriesnetwork.com").toLowerCase();
  const expectedPassword = process.env.DEFAULT_ADMIN_PASSWORD;

  if (!expectedPassword) {
    return NextResponse.json({ success: false, error: "DEFAULT_ADMIN_PASSWORD is not configured in environment variables." }, { status: 503 });
  }

  if (email !== expectedEmail || password !== expectedPassword) {
    return NextResponse.json({ success: false, error: "Invalid credentials." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true, role: "SUPER_ADMIN", redirectTo: "/admin" });
  response.cookies.set("sar_session", "super-admin", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
  return response;
}

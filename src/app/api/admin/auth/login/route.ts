import { NextRequest, NextResponse } from "next/server";
import { signToken, verifyPassword, ADMIN_SESSION_MAX_AGE_SECONDS } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const expectedEmail = process.env.ADMIN_EMAIL ?? "";
    const expectedPassword = process.env.ADMIN_PASSWORD ?? "";

    if (!expectedEmail || !expectedPassword) {
      return NextResponse.json({ error: "Admin not configured" }, { status: 500 });
    }

    const emailMatch = email === expectedEmail;
    const passwordMatch = verifyPassword(password, expectedPassword);

    if (!emailMatch || !passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signToken({ email, role: "admin" });

    const response = NextResponse.json({ ok: true });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

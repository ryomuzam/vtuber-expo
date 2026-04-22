import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { verifyToken, signToken, shouldRefreshToken, ADMIN_SESSION_MAX_AGE_SECONDS } from "./lib/auth";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes — handle JWT auth
  if (pathname.startsWith("/admin")) {
    // Allow login page without a token
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    const token = request.cookies.get("admin_token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const payload = await verifyToken(token);
    if (!payload) {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("admin_token");
      return response;
    }

    if (shouldRefreshToken(payload)) {
      const { email, role } = payload as { email?: string; role?: string };
      const refreshed = await signToken({ email, role });
      const response = NextResponse.next();
      response.cookies.set("admin_token", refreshed, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
        path: "/",
      });
      return response;
    }

    return NextResponse.next();
  }

  // API routes — skip intl
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Public pages — delegate to next-intl
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|images/).*)",
  ],
};

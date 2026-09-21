import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth/session";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("provia_session")?.value;
  const path = request.nextUrl.pathname;

  const isAuthPage = path.startsWith("/login") || path.startsWith("/register");
  const isProtectedPage =
    path.startsWith("/dashboard") ||
    path.startsWith("/create-profile") ||
    path.startsWith("/settings");
  const isAdminPage = path.startsWith("/admin");

  const session = token ? await verifySessionToken(token) : null;

  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isProtectedPage && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAdminPage) {
    if (!session || session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/create-profile/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
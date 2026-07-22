import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_USER_ROUTES = ["/catalog", "/booking", "/payment", "/history", "/profile", "/dashboard"];
const PROTECTED_ADMIN_ROUTES = ["/admin"];
const AUTH_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("bn_token")?.value;
  const role = request.cookies.get("bn_user_role")?.value;
  const { pathname } = request.nextUrl;

  // Sudah login -> tidak bisa akses /login atau /register
  if (token && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    const dest = role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // Belum login -> redirect ke /login dengan returnUrl
  if (!token && PROTECTED_USER_ROUTES.some((r) => pathname.startsWith(r))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Proteksi route admin
  if (PROTECTED_ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/catalog/:path*",
    "/booking/:path*",
    "/payment/:path*",
    "/history/:path*",
    "/profile/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
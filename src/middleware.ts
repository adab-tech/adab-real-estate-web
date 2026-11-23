import { adminDestination, hasAdminJwtRole } from "@/lib/auth/admin";
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PORTAL_PUBLIC = new Set([
  "/portal",
  "/portal/login",
  "/portal/register",
  "/portal/verify-email",
]);

function isPortalProtected(pathname: string): boolean {
  return (
    pathname.startsWith("/portal") &&
    !PORTAL_PUBLIC.has(pathname) &&
    !pathname.startsWith("/portal/verify-email")
  );
}

function isBrandDownload(pathname: string): boolean {
  return (
    pathname.startsWith("/brand/downloads/") ||
    pathname === "/brand/adab-brand-kit.zip"
  );
}

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (isBrandDownload(pathname)) {
    if (!user || !hasAdminJwtRole(user)) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return supabaseResponse;
  }

  if (isPortalProtected(pathname)) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/portal/login";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!user.email_confirmed_at) {
      const verifyUrl = request.nextUrl.clone();
      verifyUrl.pathname = "/portal/verify-email";
      verifyUrl.searchParams.set("reason", "confirm");
      return NextResponse.redirect(verifyUrl);
    }

    return supabaseResponse;
  }

  const isLogin = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");

  if (!isAdminRoute) return supabaseResponse;

  const isAdmin = user ? hasAdminJwtRole(user) : false;

  if (!user && !isLogin) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdmin && isLogin) {
    const dest = adminDestination(request.nextUrl.searchParams.get("next"));
    return NextResponse.redirect(new URL(dest, request.url));
  }

  if (user && !isLogin && !isAdmin) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("error", "unauthorized");
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/portal/:path*",
    "/auth/callback",
    "/brand/downloads/:path*",
    "/brand/adab-brand-kit.zip",
  ],
};

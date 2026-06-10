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

function isAdminUser(user: {
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
}): boolean {
  return (
    user.app_metadata?.role === "admin" || user.user_metadata?.role === "admin"
  );
}

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (isBrandDownload(pathname)) {
    if (!user || !isAdminUser(user)) {
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

  const isAdmin = user ? isAdminUser(user) : false;

  if (!user && !isLogin) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && isLogin) {
    const dest = request.nextUrl.searchParams.get("next") || "/admin/properties";
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

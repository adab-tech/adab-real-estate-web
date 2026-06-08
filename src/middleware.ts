import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

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

    return response;
  }

  const isLogin = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");

  if (!isAdminRoute) return response;

  const isAdmin =
    user?.app_metadata?.role === "admin" || user?.user_metadata?.role === "admin";

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

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};

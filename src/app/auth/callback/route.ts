import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

function verifyEmailErrorUrl(origin: string, message: string) {
  const url = new URL("/portal/verify-email", origin);
  url.searchParams.set("error", "expired");
  url.searchParams.set("message", message);
  return url;
}

function resolveNextPath(
  type: string | null,
  requested: string | null,
): string {
  if (type === "recovery") return "/portal/dashboard";
  const next = requested ?? "/portal/dashboard";
  if (next.startsWith("/") && !next.startsWith("//")) return next;
  return "/portal/dashboard";
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = resolveNextPath(type, searchParams.get("next"));

  const authError = searchParams.get("error");
  const errorCode = searchParams.get("error_code");
  const errorDescription = searchParams.get("error_description");
  if (authError || errorCode) {
    const message =
      errorDescription ||
      (errorCode === "otp_expired"
        ? "This link has expired. Request a new verification email."
        : authError || "Authentication link is invalid or has expired.");
    return NextResponse.redirect(verifyEmailErrorUrl(origin, message));
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        verifyEmailErrorUrl(origin, error.message),
      );
    }
    return NextResponse.redirect(new URL(next, origin));
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as "signup" | "email" | "recovery" | "invite",
    });
    if (error) {
      return NextResponse.redirect(
        verifyEmailErrorUrl(origin, error.message),
      );
    }
    return NextResponse.redirect(new URL(next, origin));
  }

  return NextResponse.redirect(new URL("/portal/verify-email", origin));
}

export function hasAdminJwtRole(user: {
  app_metadata?: Record<string, unknown>;
}): boolean {
  return user.app_metadata?.role === "admin";
}

export function adminDestination(next: string | null): string {
  const base = "https://admin.invalid";
  const fallback = "/admin/properties";
  if (!next?.startsWith("/") || next.startsWith("//") || next.includes("\\")) return fallback;

  const destination = new URL(next, base);
  if (destination.origin !== base) return fallback;

  const { pathname } = destination;
  if (
    pathname.startsWith("/brand/downloads/") ||
    pathname === "/brand/adab-brand-kit.zip" ||
    (pathname.startsWith("/admin/") && pathname !== "/admin/login" && pathname !== "/admin/login/")
  ) {
    return pathname + destination.search;
  }
  return fallback;
}

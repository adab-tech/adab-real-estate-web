import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { signOutTenant } from "@/app/tenant/actions";

type TenantHeaderProps = {
  variant?: "landing" | "simple" | "dashboard";
};

export function TenantHeader({ variant = "simple" }: TenantHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-adab-gray-300/60 bg-adab-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src={siteConfig.logo}
            alt={siteConfig.name}
            width={160}
            height={56}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {variant === "landing" && (
          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label="Tenant portal navigation"
          >
            <Link
              href="/properties"
              className="text-sm font-medium text-adab-navy-800 transition-colors hover:text-adab-gold-500"
            >
              Browse properties
            </Link>
            <Link
              href="/tenant"
              className="text-sm font-medium text-adab-gold-500"
            >
              Tenant portal
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-adab-navy-800 transition-colors hover:text-adab-gold-500"
            >
              Contact
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-3">
          {variant === "landing" && (
            <>
              <Link
                href="/tenant/login"
                className="rounded-full border border-adab-gray-300 px-4 py-2 text-sm font-semibold text-adab-navy-800 transition-colors hover:border-adab-gold-500"
              >
                Sign in
              </Link>
              <Link
                href="/tenant/register"
                className="rounded-full bg-adab-navy-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-adab-navy-700"
              >
                Create account
              </Link>
            </>
          )}

          {variant === "simple" && (
            <Link
              href="/tenant"
              className="text-sm font-semibold text-adab-navy-800 hover:text-adab-gold-500"
            >
              ← Back to tenant portal
            </Link>
          )}

          {variant === "dashboard" && (
            <>
              <Link href="/tenant/applications/new" className="portal-btn portal-btn-primary">
                Apply to rent
              </Link>
              <Link
                href="/tenant/maintenance/new"
                className="portal-btn portal-btn-ghost"
              >
                Maintenance
              </Link>
              <form action={signOutTenant}>
                <button className="portal-btn portal-btn-ghost" type="submit">
                  Sign out
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

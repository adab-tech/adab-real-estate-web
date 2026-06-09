import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { signOutPortal } from "@/app/portal/actions";

type PortalHeaderProps = {
  variant?: "landing" | "simple" | "dashboard" | "admin";
  showAdminLink?: boolean;
};

export function PortalHeader({
  variant = "simple",
  showAdminLink = false,
}: PortalHeaderProps) {
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
            aria-label="Main navigation"
          >
            <Link
              href="/"
              className="text-sm font-medium text-adab-navy-800 transition-colors hover:text-adab-gold-500"
            >
              Home
            </Link>
            <Link
              href="/properties"
              className="text-sm font-medium text-adab-navy-800 transition-colors hover:text-adab-gold-500"
            >
              Properties
            </Link>
            <Link
              href="/portal"
              className="text-sm font-medium text-adab-gold-500"
            >
              List Property
            </Link>
            <Link
              href="/services"
              className="text-sm font-medium text-adab-navy-800 transition-colors hover:text-adab-gold-500"
            >
              Services
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
                href="/portal/login"
                className="rounded-full border border-adab-gray-300 px-4 py-2 text-sm font-semibold text-adab-navy-800 transition-colors hover:border-adab-gold-500"
              >
                Sign in
              </Link>
              <Link
                href="/portal/register"
                className="rounded-full bg-adab-navy-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-adab-navy-700"
              >
                Create account
              </Link>
            </>
          )}

          {variant === "simple" && (
            <Link
              href="/portal"
              className="text-sm font-semibold text-adab-navy-800 hover:text-adab-gold-500"
            >
              ← Back to portal
            </Link>
          )}

          {variant === "dashboard" && (
            <>
              {showAdminLink && (
                <Link href="/portal/admin" className="portal-btn portal-btn-ghost">
                  Approvals
                </Link>
              )}
              <Link href="/portal/listings/new" className="portal-btn portal-btn-primary">
                + New listing
              </Link>
              <form action={signOutPortal}>
                <button className="portal-btn portal-btn-ghost" type="submit">
                  Sign out
                </button>
              </form>
            </>
          )}

          {variant === "admin" && (
            <>
              <Link
                href="/portal/dashboard"
                className="text-sm font-semibold text-adab-navy-800 hover:text-adab-gold-500"
              >
                Lister dashboard
              </Link>
              <form action={signOutPortal}>
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

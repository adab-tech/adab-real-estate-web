import Image from "next/image";
import Link from "next/link";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { siteConfig } from "@/lib/site-config";
import { signOutPortal } from "@/app/portal/actions";

type PortalHeaderProps = {
  variant?: "landing" | "simple" | "dashboard" | "admin";
  showAdminLink?: boolean;
};

const landingLinks = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/portal", label: "List Property", active: true },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export function PortalHeader({
  variant = "simple",
  showAdminLink = false,
}: PortalHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-adab-gray-300/60 bg-adab-paper/95 backdrop-blur-sm">
      <div className="site-container flex min-h-16 flex-wrap items-center justify-between gap-3 py-2 tablet:gap-6 tablet:py-0">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src={siteConfig.logo}
            alt={siteConfig.name}
            width={160}
            height={56}
            className="h-9 w-auto phone:h-10"
            priority
          />
        </Link>

        {variant === "landing" && (
          <nav
            className="hidden items-center gap-8 desktop:flex"
            aria-label="Main navigation"
          >
            {landingLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  item.active
                    ? "text-adab-gold-500"
                    : "text-adab-navy-800 hover:text-adab-gold-500"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex flex-wrap items-center justify-end gap-2 phone:gap-3">
          {variant === "landing" && (
            <>
              <MobileMenu
                navLabel="Portal navigation"
                links={landingLinks}
                actions={
                  <>
                    <Link
                      href="/portal/login"
                      className="touch-target flex w-full items-center justify-center rounded-full border border-adab-gray-300 px-4 py-3 text-sm font-semibold text-adab-navy-800 transition-colors hover:border-adab-gold-500"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/portal/register"
                      className="touch-target flex w-full items-center justify-center rounded-full bg-adab-navy-800 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-adab-navy-700"
                    >
                      Create account
                    </Link>
                  </>
                }
              />
              <Link
                href="/portal/login"
                className="hidden rounded-full border border-adab-gray-300 px-4 py-2.5 text-sm font-semibold text-adab-navy-800 transition-colors hover:border-adab-gold-500 desktop:inline-flex desktop:min-h-11 desktop:items-center"
              >
                Sign in
              </Link>
              <Link
                href="/portal/register"
                className="hidden rounded-full bg-adab-navy-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-adab-navy-700 desktop:inline-flex desktop:min-h-11 desktop:items-center"
              >
                Create account
              </Link>
            </>
          )}

          {variant === "simple" && (
            <Link
              href="/portal"
              className="touch-target text-sm font-semibold text-adab-navy-800 hover:text-adab-gold-500"
            >
              ← Back to portal
            </Link>
          )}

          {variant === "dashboard" && (
            <div className="flex max-w-full flex-wrap items-center justify-end gap-2">
              {showAdminLink && (
                <Link href="/portal/admin" className="portal-btn portal-btn-ghost min-h-11">
                  Approvals
                </Link>
              )}
              <Link href="/portal/listings/new" className="portal-btn portal-btn-primary min-h-11">
                + New listing
              </Link>
              <form action={signOutPortal}>
                <button className="portal-btn portal-btn-ghost min-h-11" type="submit">
                  Sign out
                </button>
              </form>
            </div>
          )}

          {variant === "admin" && (
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/portal/dashboard"
                className="touch-target text-sm font-semibold text-adab-navy-800 hover:text-adab-gold-500"
              >
                Lister dashboard
              </Link>
              <form action={signOutPortal}>
                <button className="portal-btn portal-btn-ghost min-h-11" type="submit">
                  Sign out
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

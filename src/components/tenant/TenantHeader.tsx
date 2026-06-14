import Image from "next/image";
import Link from "next/link";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { siteConfig } from "@/lib/site-config";
import { signOutTenant } from "@/app/tenant/actions";

type TenantHeaderProps = {
  variant?: "landing" | "simple" | "dashboard";
};

const landingLinks = [
  { href: "/properties", label: "Browse properties" },
  { href: "/tenant", label: "Tenant portal", active: true },
  { href: "/contact", label: "Contact" },
];

export function TenantHeader({ variant = "simple" }: TenantHeaderProps) {
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
            aria-label="Tenant portal navigation"
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
                navLabel="Tenant portal navigation"
                links={landingLinks}
                actions={
                  <>
                    <Link
                      href="/tenant/login"
                      className="touch-target flex w-full items-center justify-center rounded-full border border-adab-gray-300 px-4 py-3 text-sm font-semibold text-adab-navy-800 transition-colors hover:border-adab-gold-500"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/tenant/register"
                      className="touch-target flex w-full items-center justify-center rounded-full bg-adab-navy-800 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-adab-navy-700"
                    >
                      Create account
                    </Link>
                  </>
                }
              />
              <Link
                href="/tenant/login"
                className="hidden rounded-full border border-adab-gray-300 px-4 py-2.5 text-sm font-semibold text-adab-navy-800 transition-colors hover:border-adab-gold-500 desktop:inline-flex desktop:min-h-11 desktop:items-center"
              >
                Sign in
              </Link>
              <Link
                href="/tenant/register"
                className="hidden rounded-full bg-adab-navy-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-adab-navy-700 desktop:inline-flex desktop:min-h-11 desktop:items-center"
              >
                Create account
              </Link>
            </>
          )}

          {variant === "simple" && (
            <Link
              href="/tenant"
              className="touch-target text-sm font-semibold text-adab-navy-800 hover:text-adab-gold-500"
            >
              ← Back to tenant portal
            </Link>
          )}

          {variant === "dashboard" && (
            <div className="flex max-w-full flex-wrap items-center justify-end gap-2">
              <Link href="/tenant/applications/new" className="portal-btn portal-btn-primary min-h-11">
                Apply to rent
              </Link>
              <Link
                href="/tenant/maintenance/new"
                className="portal-btn portal-btn-ghost min-h-11"
              >
                Maintenance
              </Link>
              <form action={signOutTenant}>
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

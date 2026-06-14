import Image from "next/image";
import Link from "next/link";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { siteConfig } from "@/lib/site-config";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-adab-gray-300/60 bg-adab-paper/95 backdrop-blur-sm">
      <div className="site-container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src={siteConfig.logo}
            alt={siteConfig.name}
            width={140}
            height={48}
            className="h-9 w-auto phone:h-10"
            priority
          />
        </Link>

        <nav
          className="hidden items-center gap-8 desktop:flex"
          aria-label="Main navigation"
        >
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-adab-navy-800 transition-colors hover:text-adab-gold-500"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 phone:gap-3">
          <MobileMenu
            navLabel="Main navigation"
            links={siteConfig.nav.map((item) => ({
              href: item.href,
              label: item.label,
            }))}
            actions={
              <>
                <a
                  href={siteConfig.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target flex w-full items-center justify-center rounded-full bg-adab-gold-500 px-4 py-3 text-sm font-semibold text-adab-navy-900 transition-colors hover:bg-adab-gold-400"
                >
                  WhatsApp
                </a>
                <Link
                  href="/contact"
                  className="touch-target flex w-full items-center justify-center rounded-full bg-adab-navy-800 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-adab-navy-700"
                >
                  Contact
                </Link>
              </>
            }
          />

          <a
            href={siteConfig.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-adab-gold-500 px-4 py-2.5 text-sm font-semibold text-adab-navy-900 transition-colors hover:bg-adab-gold-400 desktop:inline-flex desktop:min-h-11 desktop:items-center"
          >
            WhatsApp
          </a>
          <Link
            href="/contact"
            className="touch-target rounded-full bg-adab-navy-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-adab-navy-700"
          >
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}

import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-adab-gray-300/60 bg-adab-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src={siteConfig.logo}
            alt={siteConfig.name}
            width={140}
            height={48}
            className="h-10 w-auto"
            priority
          />
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
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

        <div className="flex items-center gap-3">
          <a
            href={siteConfig.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-adab-gold-500 px-4 py-2 text-sm font-semibold text-adab-navy-900 transition-colors hover:bg-adab-gold-400 sm:inline-flex"
          >
            WhatsApp
          </a>
          <Link
            href="/contact"
            className="rounded-full bg-adab-navy-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-adab-navy-700"
          >
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}

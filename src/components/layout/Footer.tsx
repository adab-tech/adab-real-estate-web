import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-adab-gray-300 bg-adab-navy-900 text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <Image
              src="/brand/nigeria-flag.svg"
              alt={siteConfig.name}
              width={160}
              height={56}
              className="mb-4 h-12 w-auto"
            />
            <p className="text-sm leading-relaxed text-white/70">
              {siteConfig.tagline}
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end sm:text-right">
            <Image
              src="/brand/cac-logo.png"
              alt="Corporate Affairs Commission Nigeria"
              width={64}
              height={64}
              className="h-12 w-12 sm:h-16 sm:w-16"
            />
            <p className="text-xs tracking-wide text-white/60">
              CAC Reg. No. RC 9590252
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-10 sm:grid-cols-2">
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-adab-gold-500">
              Quick links
            </h3>
            <ul className="space-y-2">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-adab-gold-500">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>{siteConfig.location}</li>
              <li>
                <a
                  href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-white"
                >
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="transition-colors hover:text-white"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-8">
          <p className="text-center text-xs text-white/50 sm:text-left">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

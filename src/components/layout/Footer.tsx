import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-adab-gray-300 bg-adab-navy-900 text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Image
              src={siteConfig.logo}
              alt={siteConfig.name}
              width={160}
              height={56}
              className="mb-4 h-12 w-auto brightness-0 invert"
            />
            <p className="text-sm leading-relaxed text-white/70">
              {siteConfig.tagline}
            </p>
          </div>

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
          <div
            className="adab-nigeria-flag mb-4"
            role="img"
            aria-label="Flag of Nigeria"
          >
            <Image
              src="/brand/nigeria-flag.svg"
              alt=""
              width={160}
              height={56}
              decoding="async"
            />
          </div>
          <p className="text-sm text-white/70">{siteConfig.tagline}</p>
          <p className="mt-6 text-center text-xs text-white/50">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

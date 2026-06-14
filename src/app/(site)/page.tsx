import Link from "next/link";
import { FeaturedProperties } from "@/components/properties/FeaturedProperties";
import { siteConfig } from "@/lib/site-config";

export const revalidate = 60;

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden bg-adab-navy-800 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.22),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(27,42,74,0.6),transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,26,46,0.15),rgba(15,26,46,0.9))]" />
        <div className="relative site-container py-20 tablet:py-28">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-adab-gold-500">
            Nigeria&apos;s trusted property partner
          </p>
          <h1 className="max-w-3xl font-[family-name:var(--font-display)] text-3xl font-bold leading-tight tracking-tight phone:text-4xl tablet:text-5xl desktop:text-6xl">
            Find your next home with confidence
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
            {siteConfig.tagline}. We connect buyers, sellers, and renters with
            verified properties across Lagos, Abuja, Kano, Port Harcourt, and beyond.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/properties"
              className="rounded-full bg-adab-gold-500 px-6 py-3 text-sm font-semibold text-adab-navy-900 transition-colors hover:bg-adab-gold-400"
            >
              Browse properties
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/5"
            >
              Talk to an agent
            </Link>
            <Link
              href="/portal"
              className="rounded-full border border-adab-gold-500/40 px-6 py-3 text-sm font-semibold text-adab-gold-400 transition-colors hover:border-adab-gold-500 hover:bg-adab-gold-500/10"
            >
              List your property
            </Link>
          </div>
          <dl className="mt-14 grid max-w-2xl grid-cols-1 gap-6 border-t border-white/10 pt-10 phone:grid-cols-3">
            {[
              { label: "Cities covered", value: "15+" },
              { label: "Verified listings", value: "Live" },
              { label: "Agent support", value: "24/7" },
            ].map((item) => (
              <div key={item.label}>
                <dt className="text-xs font-medium uppercase tracking-wide text-white/50">
                  {item.label}
                </dt>
                <dd className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold text-adab-gold-500">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="site-container py-16">
        <div className="mb-10 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-adab-navy-800">
            What we do
          </h2>
          <p className="mt-3 text-adab-gray-500">
            End-to-end real estate services for the Nigerian market
          </p>
        </div>
        <div className="grid gap-6 tablet:grid-cols-2 desktop:grid-cols-4">
          {[
            {
              title: "Buy",
              desc: "Discover verified homes, apartments, and land with local market insight.",
              href: "/services/buy",
            },
            {
              title: "Rent",
              desc: "Short and long-term rentals across Lagos, Abuja, Kano, Port Harcourt, and beyond.",
              href: "/services/rent",
            },
            {
              title: "Sell",
              desc: "List your property with professional marketing and qualified buyer leads.",
              href: "/services/sell",
            },
            {
              title: "Manage",
              desc: "Full property management — tenants, maintenance, and rent collection.",
              href: "/services/property-management",
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-2xl border border-adab-gray-300 bg-white p-6 shadow-[0_4px_24px_rgba(27,42,74,0.08)] transition-shadow hover:shadow-[0_8px_32px_rgba(27,42,74,0.12)]"
            >
              <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-adab-navy-800">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-adab-gray-500">
                {item.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <FeaturedProperties />
    </main>
  );
}

import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden bg-adab-navy-800 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.15),transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-adab-gold-500">
            Nigeria&apos;s trusted property partner
          </p>
          <h1 className="max-w-3xl font-[family-name:var(--font-display)] text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Find your next home with confidence
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
            {siteConfig.tagline}. We connect buyers, sellers, and renters with
            verified properties across Nigeria&apos;s top cities.
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
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-adab-navy-800">
            What we do
          </h2>
          <p className="mt-3 text-adab-gray-500">
            End-to-end real estate services for the Nigerian market
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Buy",
              desc: "Discover verified homes, apartments, and land with local market insight.",
            },
            {
              title: "Rent",
              desc: "Short and long-term rentals across Lagos, Abuja, Port Harcourt, and beyond.",
            },
            {
              title: "Sell",
              desc: "List your property with professional marketing and qualified buyer leads.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-adab-gray-300 bg-white p-6 shadow-[0_4px_24px_rgba(27,42,74,0.08)]"
            >
              <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-adab-navy-800">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-adab-gray-500">
                {item.desc}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

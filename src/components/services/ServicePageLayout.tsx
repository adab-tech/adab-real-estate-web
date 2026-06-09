import Link from "next/link";
import type { ServiceContent } from "@/lib/services-content";
import { siteConfig } from "@/lib/site-config";

type ServicePageLayoutProps = {
  service: ServiceContent;
};

export function ServicePageLayout({ service }: ServicePageLayoutProps) {
  const ctaHref =
    service.slug === "buy" || service.slug === "rent"
      ? "/properties"
      : service.slug === "property-management"
        ? "/tenant"
        : "/contact";

  return (
    <main>
      <div className="border-b border-adab-gray-300 bg-adab-navy-800 text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <Link
            href="/services"
            className="text-sm text-white/60 hover:text-white"
          >
            ← All services
          </Link>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold">
            {service.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75">
            {service.headline}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="max-w-3xl text-lg leading-relaxed text-adab-navy-700">
          {service.description}
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-adab-navy-800">
              What you get
            </h2>
            <ul className="mt-6 space-y-3">
              {service.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex gap-3 text-sm leading-relaxed text-adab-navy-700"
                >
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-adab-gold-500" />
                  {benefit}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-adab-navy-800">
              How it works
            </h2>
            <ol className="mt-6 space-y-4">
              {service.process.map((item, index) => (
                <li key={item.step} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-adab-navy-800 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-adab-navy-800">
                      {item.step}
                    </p>
                    <p className="mt-1 text-sm text-adab-gray-500">
                      {item.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {service.slug === "property-management" ? (
          <section className="mt-14 rounded-2xl border border-adab-gray-300 bg-white p-8 shadow-[0_4px_24px_rgba(27,42,74,0.08)]">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-adab-navy-800">
              Client & tenant portal
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-adab-navy-700">
              Tenants and owners under Adab management can submit maintenance
              requests, apply for onboarding, and track applications online.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/tenant/login"
                className="rounded-full bg-adab-navy-800 px-6 py-3 text-sm font-semibold text-white hover:bg-adab-navy-700"
              >
                Tenant sign in
              </Link>
              <Link
                href="/tenant/apply?type=management_onboarding"
                className="rounded-full bg-adab-gold-500 px-6 py-3 text-sm font-semibold text-adab-navy-900 hover:bg-adab-gold-400"
              >
                Apply for management
              </Link>
              <Link
                href="/tenant/maintenance"
                className="rounded-full border border-adab-navy-800 px-6 py-3 text-sm font-semibold text-adab-navy-800 hover:border-adab-gold-500"
              >
                Report maintenance
              </Link>
            </div>
          </section>
        ) : null}

        <div className="mt-14 flex flex-wrap gap-4">
          <Link
            href={ctaHref}
            className="rounded-full bg-adab-gold-500 px-6 py-3 text-sm font-semibold text-adab-navy-900 hover:bg-adab-gold-400"
          >
            {service.cta}
          </Link>
          <a
            href={siteConfig.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-adab-navy-800 px-6 py-3 text-sm font-semibold text-adab-navy-800 hover:border-adab-gold-500"
          >
            WhatsApp us
          </a>
        </div>
      </div>
    </main>
  );
}

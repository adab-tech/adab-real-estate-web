import Link from "next/link";
import { TenantHeader } from "@/components/tenant/TenantHeader";

export const metadata = {
  title: "Client portal",
  description:
    "Tenant and client portal for Adab property management — maintenance, applications, and lease access.",
};

export default function TenantLandingPage() {
  return (
    <>
      <TenantHeader variant="landing" />
      <main className="portal-shell mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-adab-gold-500">
            Property management
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold text-adab-navy-800">
            Client & tenant portal
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-adab-navy-700">
            For tenants and property owners under Adab management. Submit
            maintenance requests, apply for rentals or management services, and
            track your account.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Tenant login",
              desc: "Access your dashboard, leases, and maintenance history.",
              href: "/tenant/login",
              cta: "Sign in",
            },
            {
              title: "Apply for management",
              desc: "Onboard your property with Adab management services.",
              href: "/tenant/apply?type=management_onboarding",
              cta: "Submit application",
            },
            {
              title: "Maintenance request",
              desc: "Report an issue at your rented or managed property.",
              href: "/tenant/maintenance",
              cta: "Report issue",
            },
          ].map((card) => (
            <article
              key={card.href}
              className="portal-card flex flex-col p-6"
            >
              <h2 className="font-display text-xl font-bold text-adab-navy-800">
                {card.title}
              </h2>
              <p className="mt-2 flex-1 text-sm text-adab-gray-500">
                {card.desc}
              </p>
              <Link
                href={card.href}
                className="mt-4 text-sm font-semibold text-adab-gold-500 hover:text-adab-gold-400"
              >
                {card.cta} →
              </Link>
            </article>
          ))}
        </div>

        <p className="mt-10 text-sm text-adab-gray-500">
          Looking to list a property for sale or rent?{" "}
          <Link
            href="/portal"
            className="font-semibold text-adab-navy-800 hover:text-adab-gold-500"
          >
            Use the lister portal
          </Link>
          . Learn more about{" "}
          <Link
            href="/services/property-management"
            className="font-semibold text-adab-navy-800 hover:text-adab-gold-500"
          >
            property management services
          </Link>
          .
        </p>
      </main>
    </>
  );
}

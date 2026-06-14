import Link from "next/link";
import { TenantFooter } from "@/components/tenant/TenantFooter";
import { TenantHeader } from "@/components/tenant/TenantHeader";

export const metadata = {
  title: "Tenant Portal",
  description:
    "Apply to rent, track maintenance, view leases, and manage payments with Adab Real Estate.",
};

export default function TenantLandingPage() {
  return (
    <>
      <TenantHeader variant="landing" />
      <main className="portal-shell flex-1">
        <section className="relative overflow-hidden bg-adab-navy-800 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.15),transparent_50%)]" />
          <div className="relative site-container py-20 tablet:py-24">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-adab-gold-500">
              Adab Tenant Portal
            </p>
            <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight phone:text-5xl">
              Your home, managed with US-standard service
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
              For tenants and clients across Nigeria — submit rental applications,
              report maintenance issues, view lease documents, and pay rent securely
              (payments launching soon).
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link className="portal-btn portal-btn-primary" href="/tenant/register">
                Get started
              </Link>
              <Link
                className="portal-btn portal-btn-ghost border-white/25 text-white hover:bg-white/5"
                href="/tenant/login"
              >
                I already have an account
              </Link>
            </div>
          </div>
        </section>

        <section className="site-container py-16">
          <div className="grid gap-6 tablet:grid-cols-3">
            <article className="portal-card p-6">
              <h2 className="font-display text-xl font-semibold text-adab-navy-800">
                Apply to rent
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-adab-gray-500">
                Submit a rental application with employment and reference details.
                Our team reviews every submission.
              </p>
            </article>
            <article className="portal-card p-6">
              <h2 className="font-display text-xl font-semibold text-adab-navy-800">
                Maintenance requests
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-adab-gray-500">
                Report plumbing, electrical, and other issues with priority levels
                and photo attachments.
              </p>
            </article>
            <article className="portal-card p-6">
              <h2 className="font-display text-xl font-semibold text-adab-navy-800">
                KYC & payments
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-adab-gray-500">
                Nigerian NIN/BVN verification and Paystack rent payments are
                rolling out in upcoming releases.
              </p>
            </article>
          </div>
        </section>
      </main>
      <TenantFooter />
    </>
  );
}

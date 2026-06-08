import Link from "next/link";
import { PortalFooter } from "@/components/portal/PortalFooter";
import { PortalHeader } from "@/components/portal/PortalHeader";

export const metadata = {
  title: "List Your Property",
  description:
    "Property owners, landlords, and agencies can list verified properties across Nigeria on Adab.",
};

export default function PortalLandingPage() {
  return (
    <>
      <PortalHeader variant="landing" />
      <main className="portal-shell flex-1">
        <section className="relative overflow-hidden bg-adab-navy-800 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.15),transparent_50%)]" />
          <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-adab-gold-500">
              Adab Lister Portal
            </p>
            <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">
              List your property anywhere in Nigeria
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
              A dedicated platform for property owners, landlords, and
              third-party agencies — courtesy of Adab Real Estate Agency. Create
              your account, add listings with any Nigerian address, and reach
              verified buyers and renters nationwide.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link className="portal-btn portal-btn-primary" href="/portal/register">
                Get started
              </Link>
              <Link
                className="portal-btn portal-btn-ghost border-white/25 text-white hover:bg-white/5"
                href="/portal/login"
              >
                I already have an account
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <article className="portal-card p-6">
              <h2 className="font-display text-xl font-semibold text-adab-navy-800">
                For owners & landlords
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-adab-gray-500">
                Publish homes, apartments, land, and commercial spaces in any
                state or city — from Kano to Calabar, Enugu to Sokoto.
              </p>
            </article>
            <article className="portal-card p-6">
              <h2 className="font-display text-xl font-semibold text-adab-navy-800">
                For agencies
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-adab-gray-500">
                Manage multiple listings under your agency profile with email and
                password access built for third-party partners.
              </p>
            </article>
            <article className="portal-card p-6">
              <h2 className="font-display text-xl font-semibold text-adab-navy-800">
                Reviewed & verified
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-adab-gray-500">
                Submit listings with photos and addresses anywhere in Nigeria.
                Adab reviews each property before it goes live on the public
                site.
              </p>
            </article>
          </div>
        </section>
      </main>
      <PortalFooter />
    </>
  );
}

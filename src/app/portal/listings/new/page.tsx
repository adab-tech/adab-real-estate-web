import { redirect } from "next/navigation";
import Link from "next/link";
import { ListingForm } from "@/components/portal/ListingForm";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { requirePortalUser } from "@/lib/portal/profile";

export const metadata = {
  title: "New listing",
  description: "Create a new property listing on Adab.ng.",
};

export default async function NewListingPage() {
  const session = await requirePortalUser();
  if (!session) redirect("/portal/login");
  if (!session.verified) redirect("/portal/verify-email?reason=confirm");

  return (
    <>
      <PortalHeader variant="simple" />
      <main className="portal-shell mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/portal/dashboard"
          className="text-sm font-semibold text-adab-navy-800 hover:text-adab-gold-500"
        >
          ← Dashboard
        </Link>
        <h1 className="mt-4 font-display text-3xl font-bold text-adab-navy-800">
          Create a property listing
        </h1>
        <p className="mt-2 text-sm text-adab-gray-500">
          Add any address or location anywhere in Nigeria. Listings are reviewed
          by Adab before publication.
        </p>
        <ListingForm />
      </main>
    </>
  );
}

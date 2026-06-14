import { redirect } from "next/navigation";
import { AdminQueue } from "@/components/portal/AdminQueue";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { requirePortalAdmin } from "@/lib/portal/profile";

export const metadata = {
  title: "Listing approvals",
  description: "Review lister submissions before publication on Adab.ng.",
};

export default async function PortalAdminPage() {
  const session = await requirePortalAdmin();
  if (!session) redirect("/portal/dashboard");

  return (
    <>
      <PortalHeader variant="admin" />
      <main className="portal-shell mx-auto w-full max-w-5xl flex-1 px-4 py-12 phone:px-6 desktop:px-8">
        <h1 className="font-display text-3xl font-bold text-adab-navy-800">
          Listing approvals
        </h1>
        <p className="mt-2 text-sm text-adab-gray-500">
          Review submissions from property owners, landlords, and agencies before
          they go live on adab.ng.
        </p>
        <AdminQueue />
      </main>
    </>
  );
}

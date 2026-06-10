import { redirect } from "next/navigation";
import { RentalApplicationForm } from "@/components/tenant/RentalApplicationForm";
import { TenantHeader } from "@/components/tenant/TenantHeader";
import { requireTenantUser } from "@/lib/tenant/profile";

export const metadata = {
  title: "Rental Application",
};

type NewApplicationPageProps = {
  searchParams: Promise<{ property?: string }>;
};

export default async function NewRentalApplicationPage({
  searchParams,
}: NewApplicationPageProps) {
  const session = await requireTenantUser();
  if (!session) redirect("/tenant/login");
  if (!session.verified) redirect("/tenant/verify-email?reason=confirm");

  const params = await searchParams;

  return (
    <>
      <TenantHeader variant="dashboard" />
      <main className="portal-shell mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
        <RentalApplicationForm
          defaultEmail={session.user.email ?? ""}
          defaultName={session.profile?.full_name ?? ""}
          defaultPhone={session.profile?.phone ?? ""}
          propertySlug={params.property ?? ""}
        />
      </main>
    </>
  );
}

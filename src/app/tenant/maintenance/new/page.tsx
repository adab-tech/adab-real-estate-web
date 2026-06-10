import { redirect } from "next/navigation";
import { MaintenanceRequestForm } from "@/components/tenant/MaintenanceRequestForm";
import { TenantHeader } from "@/components/tenant/TenantHeader";
import { requireTenantUser } from "@/lib/tenant/profile";

export const metadata = {
  title: "Maintenance Request",
};

export default async function NewMaintenancePage() {
  const session = await requireTenantUser();
  if (!session) redirect("/tenant/login");
  if (!session.verified) redirect("/tenant/verify-email?reason=confirm");

  return (
    <>
      <TenantHeader variant="dashboard" />
      <main className="portal-shell mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
        <MaintenanceRequestForm />
      </main>
    </>
  );
}

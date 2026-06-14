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
      <main className="portal-shell site-container max-w-2xl flex-1 py-12">
        <MaintenanceRequestForm />
      </main>
    </>
  );
}

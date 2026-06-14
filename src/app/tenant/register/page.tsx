import { TenantFooter } from "@/components/tenant/TenantFooter";
import { TenantHeader } from "@/components/tenant/TenantHeader";
import { TenantRegisterForm } from "@/components/tenant/TenantRegisterForm";

export const metadata = {
  title: "Tenant Registration",
};

export default function TenantRegisterPage() {
  return (
    <>
      <TenantHeader variant="simple" />
      <main className="portal-shell site-container max-w-lg flex-1 py-12">
        <TenantRegisterForm />
      </main>
      <TenantFooter />
    </>
  );
}

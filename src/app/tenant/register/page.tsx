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
      <main className="portal-shell mx-auto w-full max-w-lg flex-1 px-4 py-12 sm:px-6">
        <TenantRegisterForm />
      </main>
      <TenantFooter />
    </>
  );
}

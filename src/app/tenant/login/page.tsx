import { TenantFooter } from "@/components/tenant/TenantFooter";
import { TenantHeader } from "@/components/tenant/TenantHeader";
import { TenantLoginForm } from "@/components/tenant/TenantLoginForm";

export const metadata = {
  title: "Tenant Sign In",
};

export default function TenantLoginPage() {
  return (
    <>
      <TenantHeader variant="simple" />
      <main className="portal-shell site-container max-w-lg flex-1 py-12">
        <TenantLoginForm />
      </main>
      <TenantFooter />
    </>
  );
}

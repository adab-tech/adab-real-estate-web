import { TenantHeader } from "@/components/tenant/TenantHeader";
import { TenantLoginForm } from "@/components/tenant/TenantLoginForm";

export const metadata = {
  title: "Tenant login",
  description: "Sign in to the Adab client and tenant portal.",
};

export default function TenantLoginPage() {
  return (
    <>
      <TenantHeader variant="simple" />
      <main className="portal-shell mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16 sm:px-6">
        <TenantLoginForm />
      </main>
    </>
  );
}

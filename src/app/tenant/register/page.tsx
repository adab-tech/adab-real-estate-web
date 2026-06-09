import { TenantHeader } from "@/components/tenant/TenantHeader";
import { TenantRegisterForm } from "@/components/tenant/TenantRegisterForm";

export const metadata = {
  title: "Register",
  description: "Create a tenant or client account with Adab property management.",
};

export default function TenantRegisterPage() {
  return (
    <>
      <TenantHeader variant="simple" />
      <main className="portal-shell mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16 sm:px-6">
        <TenantRegisterForm />
      </main>
    </>
  );
}

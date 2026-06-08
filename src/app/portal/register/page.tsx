import { RegisterForm } from "@/components/portal/RegisterForm";
import { PortalHeader } from "@/components/portal/PortalHeader";

export const metadata = {
  title: "Create account",
  description: "Create a lister account on Adab.ng.",
};

export default function PortalRegisterPage() {
  return (
    <>
      <PortalHeader variant="simple" />
      <main className="portal-shell mx-auto w-full max-w-lg flex-1 px-4 py-16 sm:px-6">
        <RegisterForm />
      </main>
    </>
  );
}

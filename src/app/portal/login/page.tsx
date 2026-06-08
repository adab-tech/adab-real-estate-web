import { LoginForm } from "@/components/portal/LoginForm";
import { PortalHeader } from "@/components/portal/PortalHeader";

export const metadata = {
  title: "Sign in",
  description: "Sign in to the Adab lister portal.",
};

export default function PortalLoginPage() {
  return (
    <>
      <PortalHeader variant="simple" />
      <main className="portal-shell mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16 sm:px-6">
        <LoginForm />
      </main>
    </>
  );
}

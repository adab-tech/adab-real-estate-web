import { Suspense } from "react";
import { VerifyEmailClient } from "@/components/portal/VerifyEmailClient";
import { PortalHeader } from "@/components/portal/PortalHeader";

export const metadata = {
  title: "Verify email",
  description: "Verify your Adab lister account email.",
};

export default function VerifyEmailPage() {
  return (
    <>
      <PortalHeader
        variant="simple"
      />
      <main className="portal-shell mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16 sm:px-6">
        <Suspense fallback={<p className="text-sm text-adab-gray-500">Loading…</p>}>
          <VerifyEmailClient />
        </Suspense>
      </main>
    </>
  );
}

import { VerifyEmailClient } from "@/components/portal/VerifyEmailClient";
import { TenantFooter } from "@/components/tenant/TenantFooter";
import { TenantHeader } from "@/components/tenant/TenantHeader";
import { resendTenantVerificationEmail } from "@/app/tenant/actions";

export const metadata = {
  title: "Verify Email",
};

type VerifyEmailPageProps = {
  searchParams: Promise<{ reason?: string }>;
};

export default async function TenantVerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const params = await searchParams;

  return (
    <>
      <TenantHeader variant="simple" />
      <main className="portal-shell mx-auto w-full max-w-lg flex-1 px-4 py-12 sm:px-6">
        <VerifyEmailClient
          reason={params.reason}
          resendAction={resendTenantVerificationEmail}
          dashboardHref="/tenant/dashboard"
        />
      </main>
      <TenantFooter />
    </>
  );
}

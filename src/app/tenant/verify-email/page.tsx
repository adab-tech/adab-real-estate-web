import { VerifyEmailClient } from "@/components/portal/VerifyEmailClient";
import { TenantFooter } from "@/components/tenant/TenantFooter";
import { TenantHeader } from "@/components/tenant/TenantHeader";

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
      <main className="portal-shell site-container max-w-lg flex-1 py-12">
        <VerifyEmailClient
          reason={params.reason}
          dashboardHref="/tenant/dashboard"
        />
      </main>
      <TenantFooter />
    </>
  );
}

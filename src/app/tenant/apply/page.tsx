import { TenantHeader } from "@/components/tenant/TenantHeader";
import { ApplicationForm } from "@/components/tenant/ApplicationForm";
import { createSupabaseAuthClient } from "@/lib/supabase/auth-server";
import type { ApplicationType } from "@/types/tenant-portal";

type ApplyPageProps = {
  searchParams: Promise<{ type?: string }>;
};

const VALID_TYPES: ApplicationType[] = [
  "rental",
  "management_onboarding",
  "land_purchase",
];

export const metadata = {
  title: "Submit application",
  description: "Apply for rental, property management, or land purchase with Adab.",
};

export default async function TenantApplyPage({ searchParams }: ApplyPageProps) {
  const params = await searchParams;
  const defaultType = VALID_TYPES.includes(params.type as ApplicationType)
    ? (params.type as ApplicationType)
    : "rental";

  const supabase = await createSupabaseAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let authenticated = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    authenticated = Boolean(
      profile && ["tenant", "client"].includes(profile.role),
    );
  }

  return (
    <>
      <TenantHeader variant={authenticated ? "dashboard" : "simple"} />
      <main className="portal-shell site-container max-w-lg flex-1 py-12">
        <div className="portal-card p-8">
          <h1 className="font-display text-2xl font-bold text-adab-navy-800">
            Submit application
          </h1>
          <p className="mt-2 text-sm text-adab-gray-500">
            Rental applications, property management onboarding, and land
            purchase interest.
          </p>
          <div className="mt-6">
            <ApplicationForm
              defaultType={defaultType}
              authenticated={authenticated}
            />
          </div>
        </div>
      </main>
    </>
  );
}

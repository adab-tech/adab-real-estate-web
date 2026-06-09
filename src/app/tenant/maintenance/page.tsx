import Link from "next/link";
import { TenantHeader } from "@/components/tenant/TenantHeader";
import { MaintenanceForm } from "@/components/tenant/MaintenanceForm";
import { createSupabaseAuthClient } from "@/lib/supabase/auth-server";

export const metadata = {
  title: "Maintenance request",
  description: "Submit a maintenance request for your Adab-managed property.",
};

export default async function TenantMaintenancePage() {
  const supabase = await createSupabaseAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isTenant = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    isTenant = Boolean(
      profile && ["tenant", "client"].includes(profile.role),
    );
  }

  return (
    <>
      <TenantHeader variant={isTenant ? "dashboard" : "simple"} />
      <main className="portal-shell mx-auto w-full max-w-lg flex-1 px-4 py-12 sm:px-6">
        <div className="portal-card p-8">
          <h1 className="font-display text-2xl font-bold text-adab-navy-800">
            Maintenance request
          </h1>
          <p className="mt-2 text-sm text-adab-gray-500">
            Report an issue at your rented or managed property. Existing tenants
            should sign in to track status.
          </p>

          {!isTenant ? (
            <div className="mt-6 rounded-xl border border-adab-gray-300 bg-adab-cream/50 p-4 text-sm text-adab-navy-700">
              <p>
                <Link
                  href="/tenant/login"
                  className="font-semibold text-adab-gold-500 hover:underline"
                >
                  Sign in
                </Link>{" "}
                to submit and track maintenance requests, or{" "}
                <Link
                  href="/tenant/register"
                  className="font-semibold text-adab-gold-500 hover:underline"
                >
                  create an account
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="mt-6">
              <MaintenanceForm />
            </div>
          )}
        </div>
      </main>
    </>
  );
}

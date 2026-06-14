import { redirect } from "next/navigation";
import { DashboardListings } from "@/components/portal/DashboardListings";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { ProfileUsernamePrompt } from "@/components/portal/ProfileUsernamePrompt";
import { requirePortalUser } from "@/lib/portal/profile";

export const metadata = {
  title: "Dashboard",
  description: "Manage your property listings on Adab.ng.",
};

export default async function PortalDashboardPage() {
  const session = await requirePortalUser();
  if (!session) redirect("/portal/login");
  if (!session.verified) redirect("/portal/verify-email?reason=confirm");

  const isAdmin = session.profile?.role === "admin";

  const { data: usernameRow } = await session.supabase
    .from("profiles")
    .select("public_username")
    .eq("id", session.user.id)
    .maybeSingle();

  return (
    <>
      <PortalHeader variant="dashboard" showAdminLink={isAdmin} />
      <main className="portal-shell site-container max-w-4xl flex-1 py-12">
        <h1 className="font-display text-3xl font-bold text-adab-navy-800">
          Your listings
        </h1>
        <ProfileUsernamePrompt
          hasUsername={Boolean(usernameRow?.public_username)}
        />
        <p className="mt-2 text-sm text-adab-gray-500">
          Manage properties you have listed on Adab.ng. Submitted listings are
          reviewed by Adab before going live.
        </p>
        <div className="portal-card mt-8 p-6">
          <DashboardListings />
        </div>
      </main>
    </>
  );
}

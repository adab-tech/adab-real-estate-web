import { redirect } from "next/navigation";
import Link from "next/link";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { UsernameSettingsForm } from "@/components/portal/UsernameSettingsForm";
import { requirePortalUser } from "@/lib/portal/profile";

export const metadata = {
  title: "Profile settings",
  description: "Claim your public Adab.ng lister profile link.",
};

export default async function PortalSettingsPage() {
  const session = await requirePortalUser();
  if (!session) redirect("/portal/login");
  if (!session.verified) redirect("/portal/verify-email?reason=confirm");

  const isAdmin = session.profile?.role === "admin";

  const supabase = session.supabase;
  const { data: profile } = await supabase
    .from("profiles")
    .select("public_username, username_changed_at")
    .eq("id", session.user.id)
    .maybeSingle();

  return (
    <>
      <PortalHeader variant="dashboard" showAdminLink={isAdmin} />
      <main className="portal-shell site-container max-w-lg flex-1 py-12">
        <Link
          href="/portal/dashboard"
          className="text-sm font-semibold text-adab-navy-800 hover:text-adab-gold-500"
        >
          ← Dashboard
        </Link>
        <h1 className="mt-4 font-display text-3xl font-bold text-adab-navy-800">
          Public profile
        </h1>
        <p className="mt-2 text-sm text-adab-gray-500">
          Choose a unique username for your shareable lister page. Share it on
          WhatsApp, social media, or your website.
        </p>
        <div className="portal-card mt-8 p-6">
          <UsernameSettingsForm
            currentUsername={profile?.public_username ?? null}
            usernameChangedAt={profile?.username_changed_at ?? null}
          />
        </div>
      </main>
    </>
  );
}

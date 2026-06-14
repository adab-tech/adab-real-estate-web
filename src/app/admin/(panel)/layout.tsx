import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/supabase/auth-server";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAdmin();

  return (
    <div className="min-h-screen bg-adab-cream">
      <AdminNav email={user.email ?? "admin"} />
      <main className="site-container py-8">{children}</main>
    </div>
  );
}

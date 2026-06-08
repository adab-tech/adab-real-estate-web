import { BrandDownloads } from "@/components/admin/BrandDownloads";
import { requireAdmin } from "@/lib/supabase/auth-server";

export const metadata = {
  title: "Brand Assets",
  robots: { index: false, follow: false },
};

export default async function AdminBrandPage() {
  await requireAdmin();
  return <BrandDownloads />;
}

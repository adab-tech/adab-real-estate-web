import Link from "next/link";
import { PendingListingsPanel } from "@/components/admin/PendingListingsPanel";
import { requireAdmin } from "@/lib/supabase/auth-server";

export default async function PendingListingsPage() {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("properties")
    .select(
      "id, title, description, price_ngn, location, images, profiles!owner_id(full_name, email, lister_type)",
    )
    .eq("status", "pending_review")
    .order("created_at", { ascending: true });

  if (error) {
    return (
      <p className="text-red-600">
        Failed to load pending listings: {error.message}
      </p>
    );
  }

  const listings = (data ?? []).map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      id: String(row.id),
      title: String(row.title),
      description: String(row.description),
      price_ngn: Number(row.price_ngn),
      images: Array.isArray(row.images) ? row.images.map(String) : [],
      location: (row.location ?? {}) as {
        area?: string;
        city?: string;
        state?: string;
      },
      profiles: profile as {
        full_name?: string | null;
        email?: string | null;
        lister_type?: string | null;
      } | null,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-adab-navy-800">
          Pending listing approvals
        </h1>
        <p className="mt-1 text-sm text-adab-gray-500">
          Review lister submissions before they appear on{" "}
          <Link href="/properties" className="font-semibold text-adab-gold-600">
            /properties
          </Link>
          .
        </p>
      </div>
      <PendingListingsPanel listings={listings} />
    </div>
  );
}

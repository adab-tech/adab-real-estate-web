import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/auth-server";
import { PmPropertyToggle } from "@/components/admin/PmPropertyToggle";

type PropertyRow = {
  id: string;
  slug: string;
  title: string;
  status: string;
  under_management: boolean;
};

export default async function PmPropertiesPage() {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("properties")
    .select("id, slug, title, status, under_management")
    .eq("status", "published")
    .order("updated_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <p className="text-red-600">Failed to load properties: {error.message}</p>
    );
  }

  const properties = (data ?? []) as PropertyRow[];

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold text-adab-navy-800">
        Managed properties
      </h2>
      <p className="text-sm text-adab-gray-500">
        Toggle which published listings are under Adab property management.
      </p>

      {properties.length === 0 ? (
        <p className="rounded-2xl border border-adab-gray-300 bg-white p-8 text-sm text-adab-gray-500">
          No published properties found.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-adab-gray-300 bg-white shadow-[0_4px_24px_rgba(27,42,74,0.08)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-adab-gray-300 bg-adab-cream/80 text-xs uppercase tracking-wide text-adab-gray-500">
              <tr>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Management</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr
                  key={property.id}
                  className="border-b border-adab-gray-300 last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-adab-navy-800">
                    {property.title}
                    <p className="text-xs font-normal text-adab-gray-500">
                      /properties/{property.slug}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <PmPropertyToggle
                      propertyId={property.id}
                      underManagement={property.under_management}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/properties/${property.id}/edit`}
                      className="font-semibold text-adab-navy-800 hover:text-adab-gold-500"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

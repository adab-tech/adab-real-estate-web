import Link from "next/link";
import { formatPropertyPrice } from "@/lib/format";
import { requireAdmin } from "@/lib/supabase/auth-server";
import { mapPropertyRow, type PropertyRow } from "@/lib/supabase/mappers";

type AdminPropertiesPageProps = {
  searchParams: Promise<{ deleted?: string }>;
};

export default async function AdminPropertiesPage({
  searchParams,
}: AdminPropertiesPageProps) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    return (
      <p className="text-red-600">Failed to load properties: {error.message}</p>
    );
  }

  const properties = (data as PropertyRow[]).map(mapPropertyRow);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-adab-navy-800">
            Properties
          </h1>
          <p className="mt-1 text-sm text-adab-gray-500">
            {properties.length} listings in Supabase
          </p>
        </div>
        <Link
          href="/admin/properties/new"
          className="rounded-full bg-adab-gold-500 px-5 py-2.5 text-sm font-semibold text-adab-navy-900 hover:bg-adab-gold-400"
        >
          + Add property
        </Link>
      </div>

      {params.deleted === "1" && (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
          Listing deleted. The public site will update shortly.
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-adab-gray-300 bg-white shadow-[0_4px_24px_rgba(27,42,74,0.08)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-adab-gray-300 bg-adab-cream/80 text-xs uppercase tracking-wide text-adab-gray-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Featured</th>
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
                <td className="px-4 py-3 capitalize">{property.type}</td>
                <td className="px-4 py-3">
                  {formatPropertyPrice(
                    property.priceNGN,
                    property.type,
                    property.pricePeriod,
                  )}
                </td>
                <td className="px-4 py-3 capitalize">
                  {property.status.replace("_", " ")}
                </td>
                <td className="px-4 py-3">
                  {property.featured ? "Yes" : "—"}
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
    </div>
  );
}

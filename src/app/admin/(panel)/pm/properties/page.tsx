import Link from "next/link";
import { PmNav } from "@/components/admin/PmNav";
import { PropertyManagementToggle } from "@/components/admin/PropertyManagementToggle";
import { ResponsiveTable } from "@/components/admin/ResponsiveTable";
import { requireAdmin } from "@/lib/supabase/auth-server";

type PropertyPmRow = {
  id: string;
  slug: string;
  title: string;
  under_management: boolean;
  status: string;
};

export default async function PmPropertiesPage() {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("properties")
    .select("id, slug, title, under_management, status")
    .order("title", { ascending: true })
    .limit(200);

  if (error) {
    return <p className="text-red-600">Failed to load properties: {error.message}</p>;
  }

  const properties = (data ?? []) as PropertyPmRow[];
  const managed = properties.filter((p) => p.under_management);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-adab-navy-800">
          Properties under management
        </h1>
        <p className="mt-1 text-sm text-adab-gray-500">
          {managed.length} of {properties.length} listings flagged for Adab
          management
        </p>
      </div>

      <PmNav activePath="/admin/pm/properties" />

      <ResponsiveTable minWidth="40rem">
          <thead className="border-b border-adab-gray-300 bg-adab-cream/80 text-xs uppercase tracking-wide text-adab-gray-500">
            <tr>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Status</th>
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
                <td className="px-4 py-3 capitalize">
                  {property.status.replace(/_/g, " ")}
                </td>
                <td className="px-4 py-3">
                  <PropertyManagementToggle
                    propertyId={property.id}
                    underManagement={Boolean(property.under_management)}
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/properties/${property.id}/edit`}
                    className="font-semibold text-adab-navy-800 hover:text-adab-gold-500"
                  >
                    Edit listing
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
      </ResponsiveTable>
    </div>
  );
}

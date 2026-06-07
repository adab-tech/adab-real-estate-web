import Link from "next/link";
import { notFound } from "next/navigation";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { requireAdmin } from "@/lib/supabase/auth-server";
import { mapPropertyRow, type PropertyRow } from "@/lib/supabase/mappers";

type EditPropertyPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function EditPropertyPage({
  params,
  searchParams,
}: EditPropertyPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();

  const property = mapPropertyRow(data as PropertyRow);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-adab-navy-800">
            Edit property
          </h1>
          <p className="mt-1 text-sm text-adab-gray-500">{property.title}</p>
        </div>
        <Link
          href={`/properties/${property.slug}`}
          target="_blank"
          className="text-sm font-semibold text-adab-navy-800 hover:text-adab-gold-500"
        >
          View on site →
        </Link>
      </div>

      {query.saved === "1" && (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
          Saved. The public site has been refreshed.
        </p>
      )}

      <PropertyForm property={property} mode="edit" />
    </div>
  );
}

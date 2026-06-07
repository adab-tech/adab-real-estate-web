import { PropertyForm } from "@/components/admin/PropertyForm";

export default function NewPropertyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-adab-navy-800">
          Add property
        </h1>
        <p className="mt-1 text-sm text-adab-gray-500">
          New listings appear on the live site immediately after saving.
        </p>
      </div>
      <PropertyForm mode="create" />
    </div>
  );
}

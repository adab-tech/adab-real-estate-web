import { PageHeader } from "@/components/layout/PageHeader";

export const metadata = { title: "Properties" };

export default function PropertiesPage() {
  return (
    <main>
      <PageHeader
        title="Properties"
        description="Browse available properties for sale and rent across Nigeria. Listings coming soon."
      />
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-center text-adab-gray-500">
          Property listings will be added in the next build phase.
        </p>
      </div>
    </main>
  );
}

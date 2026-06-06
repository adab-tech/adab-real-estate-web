import { PageHeader } from "@/components/layout/PageHeader";

export const metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <main>
      <PageHeader
        title="Our services"
        description="Buy, sell, rent, and manage property with a team that understands the Nigerian market."
      />
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-center text-adab-gray-500">
          Detailed service pages coming in the next phase.
        </p>
      </div>
    </main>
  );
}

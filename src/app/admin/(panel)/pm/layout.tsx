import { PmNav } from "@/components/admin/PmNav";

export default async function PmAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-adab-navy-800">
          Property management
        </h1>
        <p className="mt-1 text-sm text-adab-gray-500">
          Tenants, leases, maintenance, applications, and payments
        </p>
      </div>
      <PmNav />
      {children}
    </div>
  );
}

import { requireAdmin } from "@/lib/supabase/auth-server";
import { PmStatusSelect } from "@/components/admin/PmStatusSelect";
import { ResponsiveTable } from "@/components/admin/ResponsiveTable";
import {
  updateAgreementStatus,
  updateLeaseStatus,
} from "@/app/admin/pm-actions";
import {
  AGREEMENT_STATUS_LABELS,
  LEASE_STATUS_LABELS,
  type AgreementStatus,
  type LeaseStatus,
} from "@/types/tenant-portal";

type LeaseRow = {
  id: string;
  tenant_id: string;
  rent_ngn: number | null;
  rent_period: string | null;
  lease_start: string | null;
  lease_end: string | null;
  status: LeaseStatus;
};

type AgreementRow = {
  id: string;
  property_id: string | null;
  status: AgreementStatus;
  created_at: string;
};

export default async function PmLeasesPage() {
  const { supabase } = await requireAdmin();

  const [{ data: leases, error: leaseError }, { data: agreements, error: agrError }] =
    await Promise.all([
      supabase
        .from("leases")
        .select(
          "id, tenant_id, rent_ngn, rent_period, lease_start, lease_end, status",
        )
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("management_agreements")
        .select("id, property_id, status, created_at")
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

  if (leaseError || agrError) {
    return (
      <p className="text-red-600">
        Failed to load leases: {leaseError?.message ?? agrError?.message}
      </p>
    );
  }

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-adab-navy-800">
          Leases
        </h2>
        {(leases ?? []).length === 0 ? (
          <p className="rounded-2xl border border-adab-gray-300 bg-white p-8 text-sm text-adab-gray-500">
            No leases recorded yet.
          </p>
        ) : (
          <ResponsiveTable minWidth="36rem">
              <thead className="border-b border-adab-gray-300 bg-adab-cream/80 text-xs uppercase tracking-wide text-adab-gray-500">
                <tr>
                  <th className="px-4 py-3">Rent</th>
                  <th className="px-4 py-3">Term</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {(leases as LeaseRow[]).map((lease) => (
                  <tr
                    key={lease.id}
                    className="border-b border-adab-gray-300 last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-adab-navy-800">
                      {lease.rent_ngn
                        ? `₦${Number(lease.rent_ngn).toLocaleString("en-NG")}${
                            lease.rent_period === "month" ? "/mo" : "/yr"
                          }`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-adab-gray-500">
                      {lease.lease_start ?? "—"} → {lease.lease_end ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <PmStatusSelect
                        id={lease.id}
                        current={lease.status}
                        options={Object.entries(LEASE_STATUS_LABELS).map(
                          ([value, label]) => ({ value, label }),
                        )}
                        action={updateLeaseStatus}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
          </ResponsiveTable>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-adab-navy-800">
          Management agreements
        </h2>
        {(agreements ?? []).length === 0 ? (
          <p className="rounded-2xl border border-adab-gray-300 bg-white p-8 text-sm text-adab-gray-500">
            No management agreements yet.
          </p>
        ) : (
          <ResponsiveTable minWidth="36rem">
              <thead className="border-b border-adab-gray-300 bg-adab-cream/80 text-xs uppercase tracking-wide text-adab-gray-500">
                <tr>
                  <th className="px-4 py-3">Property</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {(agreements as AgreementRow[]).map((agr) => (
                  <tr
                    key={agr.id}
                    className="border-b border-adab-gray-300 last:border-0"
                  >
                    <td className="px-4 py-3 text-adab-gray-500">
                      {agr.property_id ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <PmStatusSelect
                        id={agr.id}
                        current={agr.status}
                        options={Object.entries(AGREEMENT_STATUS_LABELS).map(
                          ([value, label]) => ({ value, label }),
                        )}
                        action={updateAgreementStatus}
                      />
                    </td>
                    <td className="px-4 py-3 text-adab-gray-500">
                      {new Date(agr.created_at).toLocaleDateString("en-NG")}
                    </td>
                  </tr>
                ))}
              </tbody>
          </ResponsiveTable>
        )}
      </section>
    </div>
  );
}

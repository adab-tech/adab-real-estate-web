import { requireAdmin } from "@/lib/supabase/auth-server";
import { PmStatusSelect } from "@/components/admin/PmStatusSelect";
import { updateMaintenanceStatus } from "@/app/admin/pm-actions";
import {
  MAINTENANCE_STATUS_LABELS,
  type MaintenanceStatus,
} from "@/types/tenant-portal";

type MaintenanceRow = {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: MaintenanceStatus;
  created_at: string;
  tenant_id: string;
};

export default async function PmMaintenancePage() {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("maintenance_requests")
    .select("id, title, description, priority, status, created_at, tenant_id")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <p className="text-red-600">
        Failed to load maintenance requests: {error.message}
      </p>
    );
  }

  const requests = (data ?? []) as MaintenanceRow[];

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold text-adab-navy-800">
        Maintenance requests
      </h2>

      {requests.length === 0 ? (
        <p className="rounded-2xl border border-adab-gray-300 bg-white p-8 text-sm text-adab-gray-500">
          No maintenance requests yet.
        </p>
      ) : (
        <div className="space-y-4">
          {requests.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-adab-gray-300 bg-white p-5 shadow-[0_4px_24px_rgba(27,42,74,0.08)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-adab-navy-800">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-adab-gray-500">
                    {item.priority} priority ·{" "}
                    {new Date(item.created_at).toLocaleString("en-NG")}
                  </p>
                </div>
                <PmStatusSelect
                  id={item.id}
                  current={item.status}
                  options={Object.entries(MAINTENANCE_STATUS_LABELS).map(
                    ([value, label]) => ({ value, label }),
                  )}
                  action={updateMaintenanceStatus}
                />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-adab-navy-700">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

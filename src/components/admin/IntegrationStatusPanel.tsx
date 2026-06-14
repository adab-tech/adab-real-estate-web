import type { IntegrationStatus } from "@/lib/integrations";

type IntegrationStatusPanelProps = {
  integrations: IntegrationStatus[];
};

export function IntegrationStatusPanel({
  integrations,
}: IntegrationStatusPanelProps) {
  return (
    <div className="grid gap-4 tablet:grid-cols-2">
      {integrations.map((item) => (
        <article
          key={item.id}
          className="rounded-2xl border border-adab-gray-300 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-adab-navy-800">{item.name}</h3>
            <StatusBadge
              configured={item.configured}
              connected={item.connected}
            />
          </div>
          <p className="mt-2 text-xs text-adab-gray-500">
            Env: {item.envVars.join(", ")}
          </p>
          {item.connected === false && item.connectionError ? (
            <p className="mt-2 text-xs text-red-600">{item.connectionError}</p>
          ) : null}
          {item.docs ? (
            <a
              href={item.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-xs font-semibold text-adab-gold-600 hover:text-adab-gold-500"
            >
              Open dashboard →
            </a>
          ) : null}
        </article>
      ))}
    </div>
  );
}

function StatusBadge({
  configured,
  connected,
}: {
  configured: boolean;
  connected?: boolean;
}) {
  if (!configured) {
    return (
      <span className="rounded-full bg-adab-gray-200 px-2.5 py-0.5 text-xs font-semibold text-adab-gray-600">
        Not configured
      </span>
    );
  }

  if (connected === false) {
    return (
      <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
        Config error
      </span>
    );
  }

  if (connected === true) {
    return (
      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
        Connected
      </span>
    );
  }

  return (
    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
      Configured
    </span>
  );
}

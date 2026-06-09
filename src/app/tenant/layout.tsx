import "@/components/portal/portal.css";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col bg-adab-cream">{children}</div>
  );
}

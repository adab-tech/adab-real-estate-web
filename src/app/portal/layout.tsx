import "@/components/portal/portal.css";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex min-h-full flex-col">{children}</div>;
}

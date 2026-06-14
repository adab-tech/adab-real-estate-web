"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const pmLinks = [
  { href: "/admin/pm", label: "Overview" },
  { href: "/admin/pm/tenants", label: "Tenants" },
  { href: "/admin/pm/leases", label: "Leases" },
  { href: "/admin/pm/maintenance", label: "Maintenance" },
  { href: "/admin/pm/applications", label: "Applications" },
  { href: "/admin/pm/payments", label: "Payments" },
  { href: "/admin/pm/properties", label: "Properties" },
];

export function PmNav({ activePath }: { activePath?: string }) {
  const pathname = usePathname();
  const current = activePath ?? pathname;

  return (
    <nav className="flex flex-wrap gap-2 border-b border-adab-gray-300 pb-4">
      {pmLinks.map((link) => {
        const active =
          current === link.href ||
          (link.href !== "/admin/pm" && current.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`touch-target rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              active
                ? "bg-adab-navy-800 text-white"
                : "bg-white text-adab-navy-800 hover:bg-adab-cream"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

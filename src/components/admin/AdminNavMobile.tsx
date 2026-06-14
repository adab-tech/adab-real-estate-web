"use client";

import Link from "next/link";
import { MobileMenu } from "@/components/layout/MobileMenu";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/listings/pending", label: "Pending listings" },
  { href: "/admin/properties", label: "Properties" },
  { href: "/admin/pm", label: "Property mgmt" },
  { href: "/admin/pm/applications", label: "Applications" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/brand", label: "Brand" },
];

type AdminNavMobileProps = {
  email: string;
  signOutButton: React.ReactNode;
};

export function AdminNavMobile({ email, signOutButton }: AdminNavMobileProps) {
  return (
    <MobileMenu
      navLabel="Admin navigation"
      links={links}
      actions={
        <div className="space-y-3">
          <Link
            href="/"
            target="_blank"
            className="touch-target flex w-full items-center justify-center rounded-full border border-white/30 px-4 py-3 text-sm font-semibold text-adab-navy-800 transition-colors hover:border-adab-gold-400 hover:text-adab-gold-500"
          >
            View site
          </Link>
          <p className="truncate text-center text-xs text-adab-gray-500">
            {email}
          </p>
          <div className="flex justify-center">{signOutButton}</div>
        </div>
      }
    />
  );
}

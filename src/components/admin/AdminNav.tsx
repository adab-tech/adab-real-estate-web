import Link from "next/link";
import { AdminNavMobile } from "@/components/admin/AdminNavMobile";
import { signOut } from "@/app/admin/actions";

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

export function AdminNav({ email }: { email: string }) {
  const signOutButton = (
    <button
      type="submit"
      className="touch-target rounded-full border border-white/30 px-4 py-2.5 text-sm font-semibold transition-colors hover:border-adab-gold-400 hover:text-adab-gold-400"
    >
      Sign out
    </button>
  );

  return (
    <header className="border-b border-adab-gray-300 bg-adab-navy-800 text-white">
      <div className="site-container flex flex-wrap items-center justify-between gap-3 py-3 tablet:gap-4 tablet:py-4">
        <div className="flex min-w-0 flex-1 items-center gap-3 tablet:gap-6">
          <Link
            href="/admin"
            className="shrink-0 font-display text-base font-bold tablet:text-lg"
          >
            Adab Admin
          </Link>
          <nav className="hidden flex-wrap gap-3 text-sm desktop:flex desktop:gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap text-white/80 transition-colors hover:text-adab-gold-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 tablet:gap-4">
          <AdminNavMobile email={email} signOutButton={<form action={signOut}>{signOutButton}</form>} />

          <div className="hidden items-center gap-4 text-sm desktop:flex">
            <Link
              href="/"
              target="_blank"
              className="text-white/70 hover:text-white"
            >
              View site
            </Link>
            <span className="max-w-[12rem] truncate text-white/60">{email}</span>
            <form action={signOut}>{signOutButton}</form>
          </div>
        </div>
      </div>
    </header>
  );
}

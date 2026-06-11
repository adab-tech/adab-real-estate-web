import Link from "next/link";
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
  return (
    <header className="border-b border-adab-gray-300 bg-adab-navy-800 text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-display text-lg font-bold">
            Adab Admin
          </Link>
          <nav className="flex gap-4 text-sm">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/80 transition-colors hover:text-adab-gold-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link
            href="/"
            target="_blank"
            className="text-white/70 hover:text-white"
          >
            View site
          </Link>
          <span className="text-white/60">{email}</span>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-full border border-white/30 px-4 py-1.5 text-sm font-semibold transition-colors hover:border-adab-gold-400 hover:text-adab-gold-400"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

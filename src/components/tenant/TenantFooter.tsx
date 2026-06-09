import Link from "next/link";

export function TenantFooter() {
  return (
    <footer className="border-t border-adab-gray-300 bg-white py-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 text-sm text-adab-gray-500 sm:px-6">
        <p>© {new Date().getFullYear()} Adab Real Estate Agency</p>
        <div className="flex gap-4">
          <Link href="/portal" className="hover:text-adab-navy-800">
            Lister portal
          </Link>
          <Link href="/contact" className="hover:text-adab-navy-800">
            Contact support
          </Link>
        </div>
      </div>
    </footer>
  );
}

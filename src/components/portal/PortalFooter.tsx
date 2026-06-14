import Image from "next/image";
import { siteConfig } from "@/lib/site-config";

export function PortalFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-adab-gray-300 bg-adab-navy-900 text-white">
      <div className="site-container py-12">
        <div
          className="adab-nigeria-flag mb-4"
          role="img"
          aria-label="Flag of Nigeria"
        >
          <Image
            src="/brand/nigeria-flag.svg"
            alt=""
            width={160}
            height={56}
            decoding="async"
          />
        </div>
        <p className="text-sm leading-relaxed text-white/70">
          {siteConfig.tagline}
        </p>
        <p className="mt-6 text-xs text-white/50">
          © {year} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

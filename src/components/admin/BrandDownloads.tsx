import Image from "next/image";
import {
  brandAssets,
  brandColors,
  brandKitZip,
} from "@/lib/brand-assets";

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
      <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
    </svg>
  );
}

export function BrandDownloads() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-adab-navy-800">
          Brand assets
        </h1>
        <p className="mt-1 text-sm text-adab-gray-500">
          Download official logos, colors, and files for staff use.
        </p>
      </div>

      <div className="flex flex-col gap-6 rounded-2xl border border-adab-gray-300/60 bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h2 className="font-display text-xl font-bold text-adab-navy-800">
            Complete brand kit
          </h2>
          <p className="mt-2 max-w-xl text-sm text-adab-gray-500">
            Download all logos, icons, social images, and color reference in one
            ZIP archive.
          </p>
        </div>
        <a
          href={brandKitZip}
          download="adab-brand-kit.zip"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-adab-gold-500 px-6 py-3 text-sm font-semibold text-adab-navy-900 transition-colors hover:bg-adab-gold-400"
        >
          <DownloadIcon />
          Download ZIP
        </a>
      </div>

      <section>
        <h2 className="mb-6 font-display text-lg font-bold text-adab-navy-800">
          Brand colors
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {brandColors.map((color) => (
            <div
              key={color.hex}
              className="overflow-hidden rounded-xl border border-adab-gray-300/60 bg-white"
            >
              <div className={`h-16 ${color.class}`} />
              <div className="p-3">
                <p className="text-sm font-semibold text-adab-navy-800">
                  {color.name}
                </p>
                <p className="font-mono text-xs text-adab-gray-500">
                  {color.hex}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-adab-gray-500">
          Fonts:{" "}
          <strong className="text-adab-navy-800">Plus Jakarta Sans</strong>{" "}
          (display), <strong className="text-adab-navy-800">Inter</strong>{" "}
          (body)
        </p>
      </section>

      <section>
        <h2 className="mb-6 font-display text-lg font-bold text-adab-navy-800">
          Downloadable assets
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {brandAssets.map((asset) => (
            <article
              key={asset.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-adab-gray-300/60 bg-white shadow-sm"
            >
              <div
                className={`flex h-36 items-center justify-center p-6 ${
                  asset.id === "og-image" || asset.id === "favicon"
                    ? "bg-adab-navy-800"
                    : "bg-adab-cream"
                }`}
              >
                {asset.id === "brand-colors" ? (
                  <div className="flex gap-2">
                    {brandColors.map((c) => (
                      <div
                        key={c.hex}
                        className={`h-12 w-12 rounded-lg ${c.class}`}
                      />
                    ))}
                  </div>
                ) : (
                  <Image
                    src={asset.preview}
                    alt={asset.name}
                    width={200}
                    height={80}
                    className="max-h-24 w-auto object-contain"
                    unoptimized={asset.preview.endsWith(".svg")}
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-semibold text-adab-navy-800">
                  {asset.name}
                </h3>
                <p className="mt-1 flex-1 text-sm text-adab-gray-500">
                  {asset.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {asset.files.map((file) => (
                    <a
                      key={file.href}
                      href={file.href}
                      download
                      className="inline-flex items-center gap-1.5 rounded-full border border-adab-navy-800/15 bg-adab-cream px-3 py-1.5 text-xs font-semibold text-adab-navy-800 transition-colors hover:border-adab-gold-500 hover:bg-adab-gold-500/10"
                    >
                      <DownloadIcon />
                      {file.label}
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

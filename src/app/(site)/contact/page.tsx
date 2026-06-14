import { InquiryForm } from "@/components/inquiry/InquiryForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { siteConfig } from "@/lib/site-config";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <main>
      <PageHeader
        title="Contact us"
        description="Reach our team by phone, email, WhatsApp, or the form below."
      />
      <div className="site-container grid gap-12 py-16 desktop:grid-cols-2">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-adab-navy-800">
            Get in touch
          </h2>
          <ul className="mt-6 space-y-4 text-adab-navy-800">
            <li>
              <span className="font-semibold">Phone: </span>
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="text-adab-gold-500 hover:underline"
              >
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <span className="font-semibold">Email: </span>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-adab-gold-500 hover:underline"
              >
                {siteConfig.email}
              </a>
            </li>
            <li>
              <span className="font-semibold">WhatsApp: </span>
              <a
                href={siteConfig.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-adab-gold-500 hover:underline"
              >
                Chat on WhatsApp
              </a>
            </li>
            <li>
              <span className="font-semibold">Location: </span>
              {siteConfig.location}
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-adab-gray-300 bg-white p-6 shadow-[0_4px_24px_rgba(27,42,74,0.08)]">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-adab-navy-800">
            Send an inquiry
          </h2>
          <p className="mt-2 text-sm text-adab-gray-500">
            We respond within one business day.
          </p>
          <div className="mt-6">
            <InquiryForm source="contact" />
          </div>
        </div>
      </div>
    </main>
  );
}

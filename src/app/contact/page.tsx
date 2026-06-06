import { PageHeader } from "@/components/layout/PageHeader";
import { siteConfig } from "@/lib/site-config";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <main>
      <PageHeader
        title="Contact us"
        description="Reach our team by phone, email, or WhatsApp. We respond within one business day."
      />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <ul className="space-y-4 text-adab-navy-800">
          <li>
            <span className="font-semibold">Phone: </span>
            <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="text-adab-gold-500 hover:underline">
              {siteConfig.phone}
            </a>
          </li>
          <li>
            <span className="font-semibold">Email: </span>
            <a href={`mailto:${siteConfig.email}`} className="text-adab-gold-500 hover:underline">
              {siteConfig.email}
            </a>
          </li>
          <li>
            <span className="font-semibold">WhatsApp: </span>
            <a href={siteConfig.whatsapp} target="_blank" rel="noopener noreferrer" className="text-adab-gold-500 hover:underline">
              Chat on WhatsApp
            </a>
          </li>
          <li>
            <span className="font-semibold">Location: </span>
            {siteConfig.location}
          </li>
        </ul>
        <p className="mt-8 text-sm text-adab-gray-500">
          Inquiry form and map integration coming in the next phase.
        </p>
      </div>
    </main>
  );
}

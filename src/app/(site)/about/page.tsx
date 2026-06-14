import { PageHeader } from "@/components/layout/PageHeader";
import { siteConfig } from "@/lib/site-config";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        title="About Adab"
        description={siteConfig.description}
      />
      <div className="mx-auto max-w-3xl px-4 py-16 phone:px-6 desktop:px-8">
        <p className="leading-relaxed text-adab-gray-500">
          Adab Real Estate Agency was built to bring transparency, professionalism,
          and local expertise to property transactions across Nigeria. Our team
          guides clients through every step — from search to keys in hand.
        </p>
      </div>
    </main>
  );
}

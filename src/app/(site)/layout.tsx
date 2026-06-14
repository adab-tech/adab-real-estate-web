import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageViewBeacon } from "@/components/analytics/PageViewBeacon";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildOrganizationJsonLd } from "@/lib/seo";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={buildOrganizationJsonLd()} />
      <PageViewBeacon />
      <Header />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </>
  );
}

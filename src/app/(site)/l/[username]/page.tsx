import { notFound, redirect } from "next/navigation";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import { ShareButtons } from "@/components/posts/ShareButtons";
import {
  getListerDisplayName,
  getListerPublishedProperties,
  getPublicListerByUsername,
  listerTypeLabel,
} from "@/lib/lister/profile";
import { absoluteUrl, buildListerMetadata } from "@/lib/seo";

export const revalidate = 60;

type ListerProfilePageProps = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: ListerProfilePageProps) {
  const { username } = await params;
  const profile = await getPublicListerByUsername(username);
  if (!profile) return { title: "Lister not found" };

  const properties = await getListerPublishedProperties(profile.id);
  return buildListerMetadata(profile, properties);
}

export default async function ListerProfilePage({ params }: ListerProfilePageProps) {
  const { username } = await params;
  const profile = await getPublicListerByUsername(username);
  if (!profile) notFound();

  const properties = await getListerPublishedProperties(profile.id);
  const displayName = getListerDisplayName(profile);
  const pageUrl = absoluteUrl(`/l/${profile.publicUsername}`);

  return (
    <main>
      <div className="border-b border-adab-gray-300 bg-white">
        <div className="site-container py-10">
          <p className="text-sm font-medium uppercase tracking-wide text-adab-gold-500">
            {listerTypeLabel(profile.listerType)}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold text-adab-navy-800 phone:text-4xl">
            {displayName}
          </h1>
          <p className="mt-3 max-w-2xl text-adab-gray-500">
            Browse {properties.length}{" "}
            {properties.length === 1 ? "property" : "properties"} listed on
            Adab.ng
          </p>
          <div className="mt-6">
            <ShareButtons
              url={pageUrl}
              title={`${displayName} on Adab.ng`}
            />
          </div>
        </div>
      </div>

      <div className="site-container py-12">
        <PropertyGrid properties={properties} />
      </div>
    </main>
  );
}

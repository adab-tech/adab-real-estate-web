import { notFound } from "next/navigation";
import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import {
  getAllServiceSlugs,
  getServiceBySlug,
} from "@/lib/services-content";

type ServiceDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service not found" };
  return {
    title: service.title,
    description: service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) notFound();

  return <ServicePageLayout service={service} />;
}

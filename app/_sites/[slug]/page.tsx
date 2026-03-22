import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getPropertyBySlug } from "@/lib/data/queries";
import { PublicPropertyPage } from "@/components/property/public-property-page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {};
  }

  const cover = property.photos[0];

  return {
    title: property.generatedContent?.seoTitle ?? property.name,
    description: property.generatedContent?.metaDescription ?? property.shortDescription,
    openGraph: {
      title: property.generatedContent?.seoTitle ?? property.name,
      description: property.generatedContent?.metaDescription ?? property.shortDescription,
      images: cover ? [{ url: cover.url, alt: cover.altText }] : undefined,
    },
  };
}

export default async function LivePropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property || ("isPublished" in property && !property.isPublished)) {
    notFound();
  }

  try {
    if ("id" in property) {
      await prisma.analyticsEvent.create({
        data: {
          propertyId: property.id,
          path: `/${slug}`,
          type: "PAGE_VIEW",
        },
      });
    }
  } catch {}

  return <PublicPropertyPage property={property} />;
}

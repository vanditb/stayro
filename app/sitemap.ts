import type { MetadataRoute } from "next";
import { getPublishedProperties } from "@/lib/data/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.APP_URL ?? "http://localhost:3000";
  const properties = await getPublishedProperties().catch(() => []);

  return [
    "",
    "/pricing",
    "/features",
    "/demo",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  })).concat(
    properties.map((property) => ({
      url: `${base}/preview/${property.slug}`,
      lastModified: property.updatedAt,
    })),
  );
}

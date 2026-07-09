import type { MetadataRoute } from "next";
import { fetchProperties } from "@/lib/properties-api";
import { zones } from "@/data/zones";

const BASE = "https://nakmarealty.com";

// Regenerate hourly so newly published listings appear without a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/listings`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/about-us`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/our-team`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact-us`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...zones.map((z) => ({
      url: `${BASE}/costa-rica/${z.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
  ];

  // Best-effort: include every active listing detail page.
  let listingRoutes: MetadataRoute.Sitemap = [];
  try {
    const props = await fetchProperties();
    listingRoutes = props
      .filter((p) => !p.archived && p.slug)
      .map((p) => ({
        url: `${BASE}/listings/${p.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
  } catch {
    listingRoutes = [];
  }

  return [...staticRoutes, ...listingRoutes];
}

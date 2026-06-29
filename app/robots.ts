import type { MetadataRoute } from "next";

const BASE = "https://nakmarealty.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep the private admin dashboard out of search results.
        disallow: ["/admin", "/admin/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}

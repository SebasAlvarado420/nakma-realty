"use client";

import { useParams } from "next/navigation";
import { useProperties } from "@/lib/propertiescontext";
import { getAgent } from "@/data/team";
import PropertyDetailLX from "@/components/property/PropertyDetailLX";

export default function PropertyPage() {
  const params = useParams();
  const { properties } = useProperties();

  const slug = typeof params.slug === "string" ? params.slug : "";
  const property = properties.find((item) => item.slug === slug);

  if (!property) {
    return (
      <section className="flex min-h-screen items-center justify-center px-6 pt-32 pb-20">
        <div className="text-center">
          <p className="nakma-body text-[11px] uppercase tracking-[0.28em] text-[var(--nakma-olive)]">
            Property Not Found
          </p>
          <h1 className="nakma-display mt-4 text-4xl text-[var(--nakma-dark)]">
            This property does not exist.
          </h1>
          <p className="nakma-body mt-4 text-[var(--nakma-dark)]/60">
            The listing may have been removed or the URL may be incorrect.
          </p>
        </div>
      </section>
    );
  }

  const agent = getAgent(property.agentId);

  // Related: same province first, then fill with others.
  const sameProvince = properties.filter(
    (p) => p.id !== property.id && p.province === property.province
  );
  const others = properties.filter(
    (p) => p.id !== property.id && p.province !== property.province
  );
  const related = [...sameProvince, ...others].slice(0, 3);

  // Per-listing structured data — richer search results for each property.
  const priceNumber = Number((property.price || "").replace(/[^0-9.]/g, "")) || undefined;
  const listingLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    url: `https://nakmarealty.com/listings/${property.slug}`,
    image: property.gallery?.length ? property.gallery : [property.image],
    description: property.description || `${property.title} — ${property.location}, Costa Rica.`,
    ...(priceNumber
      ? { offers: { "@type": "Offer", price: priceNumber, priceCurrency: "USD", availability: "https://schema.org/InStock" } }
      : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: property.location || property.province,
      addressRegion: property.province,
      addressCountry: "CR",
    },
    ...(property.geo
      ? { geo: { "@type": "GeoCoordinates", latitude: property.geo.lat, longitude: property.geo.lng } }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listingLd) }}
      />
      <PropertyDetailLX property={property} agent={agent} related={related} />
    </>
  );
}

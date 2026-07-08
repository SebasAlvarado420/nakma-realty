import type { Metadata } from "next";
import { fetchPropertyBySlug } from "@/lib/properties-api";
import type { Property } from "@/types/property";
import PropertyPageClient from "./PropertyPageClient";

const SITE_URL = "https://nakmarealty.com";

type Props = { params: Promise<{ slug: string }> };

function priceLine(p: Property): string {
  if (p.priceOnRequest) return "Price Upon Request";
  if (p.listingType === "rent" && p.rentPrice) return `${p.rentPrice} / month`;
  return p.price || "";
}

function metaDescription(p: Property): string {
  if (p.description && p.description.trim()) {
    return p.description.trim().replace(/\s+/g, " ").slice(0, 155);
  }
  const bits: string[] = [];
  if (p.bedrooms > 0) bits.push(`${p.bedrooms} bed`);
  if (p.bathrooms > 0) bits.push(`${p.bathrooms} bath`);
  const specs = bits.length ? `${bits.join(" · ")} ` : "";
  const price = priceLine(p);
  const type = p.propertyType ? p.propertyType.toLowerCase() : "property";
  return `${specs}${type} in ${p.location || p.province}, Costa Rica${
    price ? ` — ${price}` : ""
  }. Presented by NAKMA Realty.`.replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await fetchPropertyBySlug(slug);

  if (!property) {
    return {
      title: "Property",
      description:
        "Explore refined homes, land, and investment properties across Costa Rica with NAKMA Realty.",
      alternates: { canonical: `/listings/${slug}` },
    };
  }

  const price = priceLine(property);
  const title = `${property.title}${price ? ` — ${price}` : ""}`;
  const description = metaDescription(property);
  const images = (property.gallery?.length ? property.gallery : [property.image])
    .filter(Boolean)
    .slice(0, 4);

  return {
    title,
    description,
    alternates: { canonical: `/listings/${property.slug}` },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/listings/${property.slug}`,
      title: `${title} · NAKMA Realty`,
      description,
      images: images.map((url) => ({ url })),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · NAKMA Realty`,
      description,
      images: images.slice(0, 1),
    },
  };
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  const property = await fetchPropertyBySlug(slug);

  const listingLd = property
    ? {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        name: property.title,
        url: `${SITE_URL}/listings/${property.slug}`,
        image: property.gallery?.length ? property.gallery : [property.image],
        description:
          property.description ||
          `${property.title} — ${property.location}, Costa Rica.`,
        ...(() => {
          const n = Number((property.price || "").replace(/[^0-9.]/g, "")) || undefined;
          return n
            ? {
                offers: {
                  "@type": "Offer",
                  price: n,
                  priceCurrency: "USD",
                  availability: "https://schema.org/InStock",
                },
              }
            : {};
        })(),
        address: {
          "@type": "PostalAddress",
          addressLocality: property.location || property.province,
          addressRegion: property.province,
          addressCountry: "CR",
        },
        ...(property.geo
          ? {
              geo: {
                "@type": "GeoCoordinates",
                latitude: property.geo.lat,
                longitude: property.geo.lng,
              },
            }
          : {}),
      }
    : null;

  const breadcrumbLd = property
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Listings", item: `${SITE_URL}/listings` },
          {
            "@type": "ListItem",
            position: 3,
            name: property.title,
            item: `${SITE_URL}/listings/${property.slug}`,
          },
        ],
      }
    : null;

  return (
    <>
      {listingLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(listingLd) }}
        />
      )}
      {breadcrumbLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
      )}
      <PropertyPageClient />
    </>
  );
}

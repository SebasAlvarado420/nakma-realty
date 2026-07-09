import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getZone, zones } from "@/data/zones";
import ZonePageClient from "./ZonePageClient";

const SITE_URL = "https://nakmarealty.com";

type Props = { params: Promise<{ zone: string }> };

export function generateStaticParams() {
  return zones.map((z) => ({ zone: z.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { zone: slug } = await params;
  const zone = getZone(slug);
  if (!zone) {
    return { title: "Costa Rica Real Estate" };
  }
  return {
    title: zone.titleEn,
    description: zone.metaDescEn,
    alternates: { canonical: `/costa-rica/${zone.slug}` },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/costa-rica/${zone.slug}`,
      title: `${zone.titleEn} · NAKMA Realty`,
      description: zone.metaDescEn,
    },
  };
}

export default async function ZonePage({ params }: Props) {
  const { zone: slug } = await params;
  const zone = getZone(slug);
  if (!zone) notFound();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Listings", item: `${SITE_URL}/listings` },
      {
        "@type": "ListItem",
        position: 3,
        name: zone.name,
        item: `${SITE_URL}/costa-rica/${zone.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ZonePageClient zone={zone} />
    </>
  );
}

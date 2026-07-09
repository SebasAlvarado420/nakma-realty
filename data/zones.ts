import type { Property } from "@/types/property";

export type Zone = {
  slug: string;
  /** Short display name (place name — same in both languages). */
  name: string;
  titleEn: string;
  titleEs: string;
  metaDescEn: string;
  metaDescEs: string;
  introEn: string;
  introEs: string;
  /** A property matches the zone if its province is listed here… */
  provinces?: string[];
  /** …or if any of these keywords appears in its title/location/slug. */
  keywords: string[];
};

// Premium-market landing zones (SEO). Each captures searches like
// "homes for sale in Tamarindo" / "casas en venta en Escazú".
export const zones: Zone[] = [
  {
    slug: "guanacaste",
    name: "Guanacaste",
    titleEn: "Real Estate in Guanacaste, Costa Rica",
    titleEs: "Bienes Raíces en Guanacaste, Costa Rica",
    metaDescEn:
      "Homes, villas, and land for sale in Guanacaste, Costa Rica. Explore beachfront and gated-community real estate on the Gold Coast with NAKMA Realty.",
    metaDescEs:
      "Casas, villas y terrenos en venta en Guanacaste, Costa Rica. Propiedades frente al mar y en condominio en la Costa de Oro con NAKMA Realty.",
    introEn:
      "Guanacaste is Costa Rica's Gold Coast — a stretch of Pacific beaches, dry-forest hills, and blue-zone living that draws the country's most discerning buyers. From beachfront villas to gated communities and premium development land, explore NAKMA Realty's curated Guanacaste properties.",
    introEs:
      "Guanacaste es la Costa de Oro de Costa Rica: playas del Pacífico, colinas de bosque seco y un estilo de vida 'blue zone' que atrae a los compradores más exigentes del país. Desde villas frente al mar hasta condominios y terrenos de desarrollo premium, explorá las propiedades seleccionadas de NAKMA Realty en Guanacaste.",
    provinces: ["Guanacaste"],
    keywords: ["guanacaste"],
  },
  {
    slug: "tamarindo",
    name: "Tamarindo",
    titleEn: "Real Estate in Tamarindo, Costa Rica",
    titleEs: "Bienes Raíces en Tamarindo, Costa Rica",
    metaDescEn:
      "Homes, lots, and investment properties for sale in Tamarindo, Costa Rica. Ocean-view and beach-town real estate with NAKMA Realty.",
    metaDescEs:
      "Casas, lotes y propiedades de inversión en venta en Tamarindo, Costa Rica. Bienes raíces con vista al mar con NAKMA Realty.",
    introEn:
      "Tamarindo blends world-class surf, a walkable beach-town lifestyle, and one of Guanacaste's strongest property markets. Whether you're after an ocean-view home, a rental investment, or a homesite near the sand, discover NAKMA Realty's Tamarindo properties.",
    introEs:
      "Tamarindo combina surf de clase mundial, un estilo de vida de pueblo playero caminable y uno de los mercados inmobiliarios más fuertes de Guanacaste. Ya sea que busques una casa con vista al mar, una inversión de alquiler o un lote cerca de la playa, descubrí las propiedades de NAKMA Realty en Tamarindo.",
    keywords: ["tamarindo"],
  },
  {
    slug: "escazu",
    name: "Escazú",
    titleEn: "Real Estate in Escazú, Costa Rica",
    titleEs: "Bienes Raíces en Escazú, Costa Rica",
    metaDescEn:
      "Luxury homes, condos, and apartments for sale in Escazú, Costa Rica. Premium Central Valley real estate with NAKMA Realty.",
    metaDescEs:
      "Casas de lujo, condominios y apartamentos en venta en Escazú, Costa Rica. Bienes raíces premium del Valle Central con NAKMA Realty.",
    introEn:
      "Escazú is the Central Valley's most prestigious address — an upscale enclave of luxury condos, gated residences, and cosmopolitan living just minutes from San José. Browse NAKMA Realty's curated homes and apartments in Escazú.",
    introEs:
      "Escazú es la dirección más prestigiosa del Valle Central: un enclave exclusivo de condominios de lujo, residencias privadas y vida cosmopolita a minutos de San José. Explorá las casas y apartamentos seleccionados de NAKMA Realty en Escazú.",
    keywords: ["escazú", "escazu"],
  },
  {
    slug: "santa-ana",
    name: "Santa Ana",
    titleEn: "Real Estate in Santa Ana, Costa Rica",
    titleEs: "Bienes Raíces en Santa Ana, Costa Rica",
    metaDescEn:
      "Homes, condos, and commercial real estate for sale in Santa Ana & Lindora, Costa Rica, with NAKMA Realty.",
    metaDescEs:
      "Casas, condominios y propiedades comerciales en venta en Santa Ana y Lindora, Costa Rica, con NAKMA Realty.",
    introEn:
      "Santa Ana pairs a relaxed valley setting with upscale amenities, drawing executives, expats, and families to its gated communities and modern developments. Explore NAKMA Realty's homes, condos, and commercial properties in Santa Ana and Lindora.",
    introEs:
      "Santa Ana combina un entorno tranquilo de valle con comodidades de alto nivel, atrayendo a ejecutivos, expatriados y familias a sus condominios y desarrollos modernos. Explorá las casas, condominios y propiedades comerciales de NAKMA Realty en Santa Ana y Lindora.",
    keywords: ["santa ana", "lindora"],
  },
  {
    slug: "playa-avellanas",
    name: "Playa Avellanas",
    titleEn: "Real Estate in Playa Avellanas & Playa Negra, Costa Rica",
    titleEs: "Bienes Raíces en Playa Avellanas y Playa Negra, Costa Rica",
    metaDescEn:
      "Luxury homes and land for sale near Playa Avellanas and Playa Negra, Guanacaste, Costa Rica, with NAKMA Realty.",
    metaDescEs:
      "Casas de lujo y terrenos en venta cerca de Playa Avellanas y Playa Negra, Guanacaste, Costa Rica, con NAKMA Realty.",
    introEn:
      "The Avellanas–Negra corridor south of Tamarindo is one of Guanacaste's most sought-after coastlines — famed for its surf, low-density luxury, and premium homesites. Discover NAKMA Realty's residences and land near Playa Avellanas.",
    introEs:
      "El corredor Avellanas–Negra, al sur de Tamarindo, es una de las costas más codiciadas de Guanacaste, famosa por su surf, su lujo de baja densidad y sus lotes premium. Descubrí las residencias y terrenos de NAKMA Realty cerca de Playa Avellanas.",
    keywords: ["avellanas", "negra"],
  },
];

export function getZone(slug?: string) {
  return zones.find((z) => z.slug === slug);
}

/** Does a property belong to this zone? */
export function zoneMatches(zone: Zone, p: Property): boolean {
  if (zone.provinces && p.province && zone.provinces.includes(p.province)) return true;
  const haystack = `${p.title} ${p.location} ${p.province} ${p.slug}`.toLowerCase();
  return zone.keywords.some((k) => haystack.includes(k));
}

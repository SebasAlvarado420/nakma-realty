export type PropertyFeatures = {
  internal: string[];
  external: string[];
  community: string[];
  lifestyle: string[];
};

export type PropertyLocation = {
  /** Human-readable address / area line. */
  address: string;
  /** Map coordinates — used by the future interactive map. */
  lat: number;
  lng: number;
};

export type PropertyCommunity = {
  name: string;
  description: string;
  image?: string;
};

export type Property = {
  id: string;
  code: string;
  slug: string;
  title: string;
  location: string;
  province: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  landSize: string;
  constructionSize: string;
  /** Year the home was built (e.g. "2022"). */
  yearBuilt?: string;
  /** HOA / condo fee (e.g. "$300/mo"). */
  hoa?: string;
  image: string;
  featured: boolean;
  description?: string;
  video?: string;

  // ── Sales / status ────────────────────────────────
  /** "sale" (default) or "rent" — drives the Buy/Rent filter. */
  listingType?: "sale" | "rent";
  /** Optional monthly rate, shown alongside price for rentals. */
  rentPrice?: string;
  /** Exclusive / off-market listings — drives the Exclusive filter. */
  exclusive?: boolean;

  // ── Rich detail (LX-style listing page) ───────────
  /** Extra photos for the gallery (the main `image` is shown first). */
  gallery?: string[];
  /** Optional video tour URL (CDN/YouTube/Vimeo). */
  videoUrl?: string;
  /** Short selling bullet points. */
  highlights?: string[];
  /** Categorised feature lists. Falls back to a sensible default. */
  features?: PropertyFeatures;
  /** The community / development the property belongs to. */
  communityInfo?: PropertyCommunity;
  /** Address + coordinates for the map. */
  geo?: PropertyLocation;
  /** Id of the selling agent (references a team member). */
  agentId?: string;
};

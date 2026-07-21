import { supabase } from "@/lib/supabase";
import type { Property } from "@/types/property";

const TABLE = "properties";
const BUCKET = "property-media";

/* eslint-disable @typescript-eslint/no-explicit-any */

// DB row (snake_case) → app Property (camelCase)
export function rowToProperty(r: any): Property {
  return {
    id: r.id,
    code: r.code ?? "",
    slug: r.slug,
    title: r.title,
    location: r.location ?? "",
    province: r.province ?? "",
    price: r.price ?? "",
    priceOnRequest: !!r.price_on_request,
    priceStartingFrom: !!r.price_starting_from,
    status: r.status === "sold" || r.status === "rented" ? r.status : undefined,
    bedrooms: Number(r.bedrooms) || 0,
    bathrooms: Number(r.bathrooms) || 0,
    landSize: r.land_size ?? "",
    constructionSize: r.construction_size ?? "",
    yearBuilt: r.year_built ?? undefined,
    hoa: r.hoa ?? undefined,
    image: r.image ?? "",
    featured: !!r.featured,
    description: r.description ?? "",
    video: r.video ?? "",
    listingType: r.listing_type === "rent" ? "rent" : "sale",
    rentPrice: r.rent_price ?? undefined,
    exclusive: !!r.exclusive,
    gallery: Array.isArray(r.gallery) ? r.gallery : [],
    videoUrl: r.video_url ?? undefined,
    highlights: Array.isArray(r.highlights) ? r.highlights : [],
    features: r.features ?? undefined,
    communityInfo: r.community_info ?? undefined,
    geo: r.geo ?? undefined,
    agentId: r.agent_id ?? undefined,
    propertyType: r.property_type ?? undefined,
    archived: !!r.archived,
  };
}

// app Property → DB row (only the columns we write)
export function propertyToRow(p: Partial<Property>) {
  return {
    code: p.code,
    slug: p.slug,
    title: p.title,
    location: p.location,
    province: p.province,
    price: p.price,
    price_on_request: p.priceOnRequest ?? false,
    price_starting_from: p.priceStartingFrom ?? false,
    status: p.status ?? null,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    land_size: p.landSize,
    construction_size: p.constructionSize,
    year_built: p.yearBuilt ?? null,
    hoa: p.hoa ?? null,
    image: p.image,
    featured: p.featured ?? false,
    description: p.description ?? "",
    video: p.video ?? "",
    listing_type: p.listingType ?? "sale",
    rent_price: p.rentPrice ?? null,
    exclusive: p.exclusive ?? false,
    gallery: p.gallery ?? [],
    video_url: p.videoUrl ?? null,
    highlights: p.highlights ?? [],
    features: p.features ?? null,
    community_info: p.communityInfo ?? null,
    geo: p.geo ?? null,
    agent_id: p.agentId ?? null,
    property_type: p.propertyType ?? null,
    archived: p.archived ?? false,
  };
}

export async function fetchProperties(): Promise<Property[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("fetchProperties:", error.message);
    return [];
  }
  return (data ?? []).map(rowToProperty);
}

// Single active listing by slug — used server-side for per-page SEO metadata
// and structured data. Best-effort: returns null if unavailable.
export async function fetchPropertyBySlug(slug: string): Promise<Property | null> {
  if (!supabase || !slug) return null;
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return rowToProperty(data);
}

export async function createProperty(p: Partial<Property>): Promise<Property | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from(TABLE)
    .insert(propertyToRow(p))
    .select()
    .single();
  if (error) {
    console.error("createProperty:", error.message);
    throw new Error(error.message);
  }
  return rowToProperty(data);
}

export async function updatePropertyApi(
  id: string,
  patch: Partial<Property>
): Promise<Property | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from(TABLE)
    .update(propertyToRow(patch))
    .eq("id", id)
    .select()
    .single();
  if (error) {
    console.error("updateProperty:", error.message);
    throw new Error(error.message);
  }
  return rowToProperty(data);
}

export async function deletePropertyApi(id: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) {
    console.error("deleteProperty:", error.message);
    throw new Error(error.message);
  }
}

// Archive / restore a listing — flips ONLY the `archived` flag so the NK code
// and every other field stay intact. (We can't reuse updatePropertyApi here:
// propertyToRow re-applies column defaults and would wipe featured/gallery/etc.)
export async function setArchived(id: string, archived: boolean): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from(TABLE).update({ archived }).eq("id", id);
  if (error) {
    console.error("setArchived:", error.message);
    throw new Error(error.message);
  }
}

// Upload a file to the public media bucket; returns its public URL.
export async function uploadMedia(file: File): Promise<string> {
  if (!supabase) throw new Error("Storage unavailable");
  const ext = file.name.split(".").pop() || "bin";
  const safe = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").slice(0, 40);
  const path = `${Date.now()}-${Math.floor(performance.now())}-${safe}.${ext}`.replace(
    /\.\.+/g,
    "."
  );
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) {
    console.error("uploadMedia:", error.message);
    throw new Error(error.message);
  }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

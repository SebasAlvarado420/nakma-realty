import type { Property, PropertyFeatures } from "@/types/property";

// Pick a property's free-text field in the active language, falling back to the
// admin's original value whenever a translation is missing.
function pack(p: Property, lang: string) {
  return lang === "es" ? p.translations?.es : p.translations?.en;
}

export function ptField(
  p: Property,
  field: "title" | "description" | "location",
  lang: string
): string {
  const v = pack(p, lang)?.[field];
  return v && v.trim() ? v : p[field] ?? "";
}

export function ptHighlights(p: Property, lang: string): string[] {
  const v = pack(p, lang)?.highlights;
  return v && v.length ? v : p.highlights ?? [];
}

export function ptFeatures(p: Property, lang: string): PropertyFeatures | undefined {
  return pack(p, lang)?.features ?? p.features;
}

export function ptCommunity(
  p: Property,
  lang: string
): { name: string; description: string; image?: string } | undefined {
  if (!p.communityInfo) return undefined;
  const t = pack(p, lang);
  return {
    name: t?.communityName?.trim() ? t.communityName : p.communityInfo.name,
    description: t?.communityDescription?.trim()
      ? t.communityDescription
      : p.communityInfo.description,
    image: p.communityInfo.image,
  };
}

import { supabase } from "@/lib/supabase";
import { SITE } from "@/lib/site";

// Editable business contact + social data. Stored as a single row (id = 1) in
// the `site_settings` table so the "jefe" can change WhatsApp / email / social
// links / hours from the admin panel without a redeploy. Until that row exists
// (or if Supabase is unreachable) we fall back to the hardcoded SITE defaults,
// so the public site never breaks.
export type SiteSettings = {
  whatsappDisplay: string;
  whatsappNumber: string;
  whatsappUrl: string;
  email: string;
  instagram: string;
  facebook: string;
  hours: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  whatsappDisplay: SITE.whatsappDisplay,
  whatsappNumber: SITE.whatsappNumber,
  whatsappUrl: SITE.whatsappUrl,
  email: SITE.email,
  instagram: SITE.instagram,
  facebook: SITE.facebook,
  hours: "Mon–Fri 8:00–18:00 · Sat 9:00–14:00",
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToSettings(r: any): SiteSettings {
  const number = (r?.whatsapp_number || SITE.whatsappNumber).replace(/[^0-9]/g, "");
  return {
    whatsappDisplay: r?.whatsapp_display || SITE.whatsappDisplay,
    whatsappNumber: number,
    whatsappUrl: number ? `https://wa.me/${number}` : SITE.whatsappUrl,
    email: r?.email || SITE.email,
    instagram: r?.instagram || SITE.instagram,
    facebook: r?.facebook || SITE.facebook,
    hours: r?.hours || DEFAULT_SETTINGS.hours,
  };
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  if (!supabase) return DEFAULT_SETTINGS;
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error || !data) return DEFAULT_SETTINGS;
    return rowToSettings(data);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSiteSettings(patch: SiteSettings): Promise<SiteSettings> {
  if (!supabase) throw new Error("Supabase unavailable");
  const number = patch.whatsappNumber.replace(/[^0-9]/g, "");
  const { data, error } = await supabase
    .from("site_settings")
    .upsert(
      {
        id: 1,
        whatsapp_display: patch.whatsappDisplay,
        whatsapp_number: number,
        email: patch.email,
        instagram: patch.instagram,
        facebook: patch.facebook,
        hours: patch.hours,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    )
    .select()
    .single();
  if (error) throw new Error(error.message);
  return rowToSettings(data);
}

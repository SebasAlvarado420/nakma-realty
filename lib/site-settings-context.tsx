"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  DEFAULT_SETTINGS,
  fetchSiteSettings,
  type SiteSettings,
} from "@/lib/site-settings-api";

type Ctx = {
  settings: SiteSettings;
  refresh: () => Promise<void>;
};

const SiteSettingsContext = createContext<Ctx>({
  settings: DEFAULT_SETTINGS,
  refresh: async () => {},
});

// Loads the editable business data once on mount and exposes it site-wide.
// Starts from the hardcoded defaults so the first paint is always correct even
// before (or without) a round-trip to Supabase.
export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  const refresh = async () => {
    const s = await fetchSiteSettings();
    setSettings(s);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, refresh }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

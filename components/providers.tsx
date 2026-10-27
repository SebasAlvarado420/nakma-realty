"use client";

import { PropertiesProvider } from "@/lib/propertiescontext";
import { LanguageProvider } from "@/lib/i18n";
import { SiteSettingsProvider } from "@/lib/site-settings-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <SiteSettingsProvider>
        <PropertiesProvider>{children}</PropertiesProvider>
      </SiteSettingsProvider>
    </LanguageProvider>
  );
}

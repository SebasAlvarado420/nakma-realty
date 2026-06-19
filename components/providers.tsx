"use client";

import { PropertiesProvider } from "@/lib/propertiescontext";
import { LanguageProvider } from "@/lib/i18n";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <PropertiesProvider>{children}</PropertiesProvider>
    </LanguageProvider>
  );
}

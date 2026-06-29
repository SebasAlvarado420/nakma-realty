"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Lang = "en" | "es";

const DICT: Record<Lang, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.listings": "Listings",
    "nav.about": "About Us",
    "nav.team": "Our Team",
    "nav.contact": "Contact Us",
    "nav.contactBtn": "Contact",

    "hero.title": "Natural, refined real estate rooted in Costa Rica.",
    "hero.scroll": "Scroll to explore",
    "hero.cta": "Explore Listings",

    "featured.eyebrow": "Featured Homes",
    "featured.viewAll": "View All Listings",
    "regions.eyebrow": "Where We Work",
    "regions.cta": "See Every Region",
    "portfolio.eyebrow": "The Portfolio",
    "portfolio.cta": "Explore All",

    "search.eyebrow": "Search Properties",
    "search.title": "Begin your search.",
    "search.placeholder": "Search by name, location, or ID",
    "search.allLocations": "All Locations",
    "search.interested": "Interested in",
    "search.all": "All",
    "search.sale": "Sale",
    "search.rent": "Rent",
    "search.maxPrice": "Max Price",
    "search.bedrooms": "Bedrooms",
    "search.baths": "Baths",
    "search.btn": "Search",

    "cta.eyebrow": "Ready to explore?",
    "cta.explore": "Explore Listings",
    "cta.contact": "Contact Our Team",

    "footer.tagline": "Natural, refined real estate rooted in the tropical richness of Costa Rica.",
    "footer.rooted": "Rooted in Costa Rica.",
    "footer.navigate": "Navigate",
    "footer.social": "Social",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved",
  },
  es: {
    "nav.home": "Inicio",
    "nav.listings": "Propiedades",
    "nav.about": "Nosotros",
    "nav.team": "Equipo",
    "nav.contact": "Contacto",
    "nav.contactBtn": "Contacto",

    "hero.title": "Bienes raíces naturales y refinados, con raíces en Costa Rica.",
    "hero.scroll": "Desliza para explorar",
    "hero.cta": "Ver Propiedades",

    "featured.eyebrow": "Propiedades Destacadas",
    "featured.viewAll": "Ver Todas",
    "regions.eyebrow": "Dónde Trabajamos",
    "regions.cta": "Ver Todas las Zonas",
    "portfolio.eyebrow": "El Portafolio",
    "portfolio.cta": "Explorar Todo",

    "search.eyebrow": "Buscar Propiedades",
    "search.title": "Comienza tu búsqueda.",
    "search.placeholder": "Busca por nombre, ubicación o ID",
    "search.allLocations": "Todas las ubicaciones",
    "search.interested": "Me interesa",
    "search.all": "Todo",
    "search.sale": "Venta",
    "search.rent": "Renta",
    "search.maxPrice": "Precio máx.",
    "search.bedrooms": "Habitaciones",
    "search.baths": "Baños",
    "search.btn": "Buscar",

    "cta.eyebrow": "¿Listo para explorar?",
    "cta.explore": "Ver Propiedades",
    "cta.contact": "Contactar al Equipo",

    "footer.tagline": "Bienes raíces naturales y refinados, arraigados en la riqueza tropical de Costa Rica.",
    "footer.rooted": "Con raíces en Costa Rica.",
    "footer.navigate": "Navegar",
    "footer.social": "Redes",
    "footer.contact": "Contacto",
    "footer.rights": "Todos los derechos reservados",
  },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };
const LangContext = createContext<Ctx | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("nakma-lang");
    if (saved === "es" || saved === "en") setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("nakma-lang", l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback((key: string) => DICT[lang][key] ?? DICT.en[key] ?? key, [lang]);

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}

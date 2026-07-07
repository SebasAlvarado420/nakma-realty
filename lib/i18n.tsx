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
    "search.propertyType": "Property Type",
    "search.anyType": "Any Type",
    "type.home": "Home",
    "type.condo": "Condo",
    "type.land": "Land",
    "type.commercial": "Commercial",

    "cta.eyebrow": "Ready to explore?",
    "cta.explore": "Explore Listings",
    "cta.contact": "Contact Our Team",

    "listing.contact": "Contact",
    "listing.beds": "beds",
    "listing.baths": "baths",
    "listing.construction": "construction",
    "listing.property": "property",
    "listing.hoa": "HOA",
    "listing.tour": "Tour",
    "listing.save": "Save",
    "listing.saved": "Saved",
    "listing.share": "Share",
    "listing.code": "Code",
    "listing.highlights": "Highlights",
    "listing.description": "Description",
    "listing.showMore": "Show more description",
    "listing.showLess": "Show less",
    "listing.features": "Features",
    "listing.internal": "Internal",
    "listing.external": "External",
    "listing.community": "Community",
    "listing.location": "Location",
    "listing.openMaps": "Open in Google Maps",
    "listing.noCoords": "Location coordinates not set for this property.",
    "listing.agent": "Real Estate Agent",
    "listing.related": "Properties you might like",
    "listing.exclusive": "Exclusive",
    "listing.legal": "All information is deemed reliable but not guaranteed and may be subject to errors, omissions, change of price, or withdrawal without notice.",
    "modal.eyebrow": "Enquire about this property",
    "modal.title": "Let's talk about",
    "modal.first": "First name",
    "modal.last": "Last name",
    "modal.phone": "Phone",
    "modal.email": "Email",
    "modal.send": "Send enquiry",
    "modal.cancel": "Cancel",
    "modal.rooted": "NAKMA Realty · Rooted in Costa Rica",
    "modal.realPerson": "A real person from our team will reply — never an automated system.",

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
    "search.propertyType": "Tipo",
    "search.anyType": "Cualquiera",
    "type.home": "Casa",
    "type.condo": "Condominio",
    "type.land": "Terreno",
    "type.commercial": "Comercial",

    "cta.eyebrow": "¿Listo para explorar?",
    "cta.explore": "Ver Propiedades",
    "cta.contact": "Contactar al Equipo",

    "listing.contact": "Contactar",
    "listing.beds": "hab.",
    "listing.baths": "baños",
    "listing.construction": "construcción",
    "listing.property": "terreno",
    "listing.hoa": "HOA",
    "listing.tour": "Tour",
    "listing.save": "Guardar",
    "listing.saved": "Guardado",
    "listing.share": "Compartir",
    "listing.code": "Código",
    "listing.highlights": "Destacados",
    "listing.description": "Descripción",
    "listing.showMore": "Ver más",
    "listing.showLess": "Ver menos",
    "listing.features": "Características",
    "listing.internal": "Interiores",
    "listing.external": "Exteriores",
    "listing.community": "Comunidad",
    "listing.location": "Ubicación",
    "listing.openMaps": "Abrir en Google Maps",
    "listing.noCoords": "Coordenadas no definidas para esta propiedad.",
    "listing.agent": "Agente Inmobiliario",
    "listing.related": "Propiedades que te pueden gustar",
    "listing.exclusive": "Exclusiva",
    "listing.legal": "Toda la información se considera confiable pero no garantizada y puede estar sujeta a errores, omisiones, cambios de precio o retiro sin previo aviso.",
    "modal.eyebrow": "Consulta sobre esta propiedad",
    "modal.title": "Hablemos de",
    "modal.first": "Nombre",
    "modal.last": "Apellido",
    "modal.phone": "Teléfono",
    "modal.email": "Correo",
    "modal.send": "Enviar consulta",
    "modal.cancel": "Cancelar",
    "modal.rooted": "NAKMA Realty · Con raíces en Costa Rica",
    "modal.realPerson": "Te responde una persona real de nuestro equipo, nunca un sistema automático.",

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

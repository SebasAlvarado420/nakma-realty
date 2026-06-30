"use client";

import { useMemo } from "react";
import HeroVideo from "@/components/home/HeroVideo";
import HomeSearch from "@/components/home/HomeSearch";
import ListingsCarousel from "@/components/home/ListingsCarousel";
import ListingsGridSection from "@/components/home/ListingsGridSection";
import RegionsSection from "@/components/home/RegionsSection";
import ParallaxNatureSection from "@/components/home/ParallaxNatureSection";
import NatureIntroSection from "@/components/home/NatureIntroSection";
import CTASection from "@/components/home/CTASection";
import { useProperties } from "@/lib/propertiescontext";
import { useLang } from "@/lib/i18n";

export default function HomePageClient() {
  const { properties } = useProperties();
  const { lang, t } = useLang();

  const featured = useMemo(() => properties.filter((p) => p.featured), [properties]);
  const more = useMemo(() => {
    const rest = properties.filter((p) => !p.featured);
    // If everything happens to be featured, fall back to the full list.
    return rest.length > 0 ? rest : properties;
  }, [properties]);
  // Newest listings (the context returns them created-at descending).
  const recent = useMemo(() => properties.slice(0, 8), [properties]);

  return (
    <>
      {/* 1. Cinematic hero */}
      <HeroVideo />

      {/* 2. Featured homes — moving carousel */}
      <ListingsCarousel
        eyebrow={t("featured.eyebrow")}
        title={
          lang === "es" ? (
            <>
              Residencias en armonía con{" "}
              <span className="italic text-[var(--nakma-earth)]">su entorno</span>.
            </>
          ) : (
            <>
              Residences in harmony with{" "}
              <span className="italic text-[var(--nakma-earth)]">their surroundings</span>.
            </>
          )
        }
        properties={featured}
        viewAllLabel={t("featured.viewAll")}
      />

      {/* 4. Local areas — explore by region */}
      <RegionsSection />

      {/* 5. Search Properties — primary CTA */}
      <HomeSearch />

      {/* 6. More of the portfolio — 3×4 grid */}
      <ListingsGridSection
        eyebrow={t("portfolio.eyebrow")}
        title={
          lang === "es" ? (
            <>
              Más hogares que{" "}
              <span className="italic text-[var(--nakma-earth)]">valen el viaje</span>.
            </>
          ) : (
            <>
              More homes worth{" "}
              <span className="italic text-[var(--nakma-earth)]">the journey</span>.
            </>
          )
        }
        properties={more}
        viewAllLabel={t("portfolio.cta")}
      />

      {/* 6. Why invest in Costa Rica — parallax scenes */}
      <ParallaxNatureSection />

      {/* 7. Brand story */}
      <NatureIntroSection />

      {/* 7b. Recently added — newest listings (properties come newest-first) */}
      <ListingsCarousel
        eyebrow={lang === "es" ? "Recién Agregadas" : "Recently Added"}
        title={
          lang === "es" ? (
            <>
              Lo más reciente en{" "}
              <span className="italic text-[var(--nakma-earth)]">nuestro portafolio</span>.
            </>
          ) : (
            <>
              The latest additions to{" "}
              <span className="italic text-[var(--nakma-earth)]">our portfolio</span>.
            </>
          )
        }
        properties={recent}
        viewAllLabel={t("featured.viewAll")}
      />

      {/* 8. Final CTA */}
      <CTASection />
    </>
  );
}

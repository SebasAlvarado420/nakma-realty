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
              Residencias con raíces en{" "}
              <span className="italic text-[var(--nakma-earth)]">su entorno</span>.
            </>
          ) : (
            <>
              Residences rooted in{" "}
              <span className="italic text-[var(--nakma-earth)]">their landscape</span>.
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

      {/* 7b. One more pass of the portfolio — carousel before the close */}
      <ListingsCarousel
        eyebrow={lang === "es" ? "Explora la colección" : "Browse the collection"}
        title={
          lang === "es" ? (
            <>
              Más hogares por{" "}
              <span className="italic text-[var(--nakma-earth)]">descubrir</span>.
            </>
          ) : (
            <>
              More homes to{" "}
              <span className="italic text-[var(--nakma-earth)]">discover</span>.
            </>
          )
        }
        properties={properties}
        viewAllLabel={t("featured.viewAll")}
      />

      {/* 8. Final CTA */}
      <CTASection />
    </>
  );
}

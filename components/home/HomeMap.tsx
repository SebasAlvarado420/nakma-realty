"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import { useProperties } from "@/lib/propertiescontext";
import { useLang } from "@/lib/i18n";

const PropertiesMap = dynamic(() => import("@/components/listings/PropertiesMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] w-full items-center justify-center rounded-[20px] border border-[var(--nakma-dark)]/10 bg-white/50 sm:h-[520px]">
      <p className="nakma-body text-sm text-[var(--nakma-dark)]/50">Loading map…</p>
    </div>
  ),
});

/**
 * Home "Begin your search." section. Instead of a search form (too close to
 * other CR agencies), we invite the visitor to explore the whole portfolio on a
 * live, interactive map of Costa Rica — pins open a swipeable photo card that
 * links straight to the property.
 */
export default function HomeMap() {
  const { properties } = useProperties();
  const { lang, t } = useLang();
  const mapped = properties.filter((p) => p.geo);

  return (
    <section className="bg-[var(--nakma-bg)] px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-9 text-center">
          <p className="nakma-body text-[11px] uppercase tracking-[0.46em] text-[var(--nakma-olive)]">
            {t("search.eyebrow")}
          </p>
          <h2 className="nakma-display mt-3 text-[30px] leading-tight tracking-[-0.02em] text-[var(--nakma-dark)] md:text-[40px]">
            {t("search.title")}
          </h2>
          <p className="nakma-body mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-[var(--nakma-dark)]/55">
            {lang === "es"
              ? "Explora nuestro portafolio en el mapa. Toca un punto para ver las fotos y abrir la propiedad."
              : "Explore our portfolio on the map. Tap a pin to preview the photos and open the property."}
          </p>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-[var(--nakma-dark)]/10 shadow-[0_18px_60px_rgba(22,17,13,0.10)]">
          <PropertiesMap properties={mapped} heightClass="h-[420px] sm:h-[520px]" />
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/listings"
            className="nakma-body group inline-flex h-[50px] items-center gap-2 rounded-full bg-[var(--nakma-dark)] px-8 text-[11px] uppercase tracking-[0.24em] text-white transition hover:opacity-90"
          >
            {lang === "es" ? "Ver todas las propiedades" : "View all properties"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

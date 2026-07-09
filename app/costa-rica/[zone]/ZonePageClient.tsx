"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Zone } from "@/data/zones";
import { zoneMatches } from "@/data/zones";
import { useProperties } from "@/lib/propertiescontext";
import { useLang } from "@/lib/i18n";
import PropertyCard from "@/components/property/PropertyCard";
import Reveal from "@/components/ui/Reveal";

export default function ZonePageClient({ zone }: { zone: Zone }) {
  const { properties } = useProperties();
  const { lang } = useLang();

  const matches = useMemo(
    () => properties.filter((p) => zoneMatches(zone, p)),
    [properties, zone]
  );

  const title = lang === "es" ? zone.titleEs : zone.titleEn;
  const intro = lang === "es" ? zone.introEs : zone.introEn;

  return (
    <section className="bg-[var(--nakma-bg)] px-4 pb-20 pt-32 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="nakma-body text-[10px] uppercase tracking-[0.46em] text-[var(--nakma-olive)]">
            {(lang === "es" ? "Zona" : "Area")} · Costa Rica
          </p>
          <h1 className="nakma-display mt-3 text-[34px] leading-[1.06] tracking-[-0.02em] text-[var(--nakma-dark)] md:text-[46px]">
            {title}
          </h1>
          <p className="nakma-body mt-5 text-[15px] leading-[1.85] text-[var(--nakma-dark)]/65">
            {intro}
          </p>
        </div>

        {/* Results */}
        <div className="mb-8 mt-10 flex items-center justify-between border-t border-[var(--nakma-dark)]/8 pt-6">
          <p className="nakma-body text-[13px] text-[var(--nakma-dark)]/60">
            <span className="font-medium text-[var(--nakma-dark)]">{matches.length}</span>{" "}
            {lang === "es"
              ? matches.length === 1
                ? "propiedad"
                : "propiedades"
              : matches.length === 1
              ? "property"
              : "properties"}
          </p>
        </div>

        {matches.length > 0 ? (
          <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((property, i) => (
              <Reveal key={property.id} delay={(i % 3) * 0.08}>
                <PropertyCard property={property} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-[var(--nakma-dark)]/8 bg-white/40 px-6 py-16 text-center">
            <p className="nakma-display text-[22px] text-[var(--nakma-dark)]">
              {lang === "es"
                ? "Pronto tendremos propiedades en esta zona."
                : "New listings in this area are coming soon."}
            </p>
            <Link
              href="/listings"
              className="nakma-body mt-7 inline-flex h-[46px] items-center rounded-full bg-[var(--nakma-dark)] px-7 text-[11px] uppercase tracking-[0.24em] text-white transition hover:opacity-90"
            >
              {lang === "es" ? "Ver todas las propiedades" : "View all properties"}
            </Link>
          </div>
        )}

        {/* CTA */}
        {matches.length > 0 && (
          <div className="mt-16 flex justify-center border-t border-[var(--nakma-dark)]/8 pt-12">
            <Link
              href="/listings"
              className="nakma-body group inline-flex h-[50px] items-center gap-2 rounded-full border border-[var(--nakma-dark)]/25 px-8 text-[11px] uppercase tracking-[0.24em] text-[var(--nakma-dark)] transition hover:bg-[var(--nakma-dark)] hover:text-white"
            >
              {lang === "es" ? "Ver todas las propiedades" : "View all properties"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

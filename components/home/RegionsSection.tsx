"use client";

import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { BLUR_DATA_URL } from "@/lib/constants";
import { useLang } from "@/lib/i18n";

// Real Costa Rica photography (Unsplash, free to use), one per region.
// Swap any URL for the team's own location photography anytime.
const REGIONS = [
  {
    name: "Central Pacific",
    nameKey: "region.centralPacific",
    sub: "Puntarenas",
    img: "https://images.pexels.com/photos/17302366/pexels-photo-17302366.jpeg?auto=compress&cs=tinysrgb&w=1600",
    href: "/listings?province=Puntarenas",
  },
  {
    name: "Central Valley",
    nameKey: "region.centralValley",
    sub: "San José",
    img: "https://images.unsplash.com/photo-1699385600854-5b2137d14cfd?auto=format&fit=crop&w=1200&q=80",
    href: "/listings?region=central-valley",
  },
  {
    name: "Pacific Coast",
    nameKey: "region.pacificCoast",
    sub: "Guanacaste",
    img: "https://images.unsplash.com/photo-1643122542225-6a618183b16d?auto=format&fit=crop&w=1200&q=80",
    href: "/listings?province=Guanacaste",
  },
];

export default function RegionsSection() {
  const { lang, t } = useLang();
  return (
    <section className="bg-[var(--nakma-bg)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <Reveal className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="nakma-body text-[12px] uppercase tracking-[0.34em] text-[var(--nakma-olive)]">
              {t("regions.eyebrow")}
            </p>
            <h2 className="nakma-display mt-4 text-[40px] leading-[1.04] tracking-[-0.02em] text-[var(--nakma-dark)] sm:text-[52px]">
              {lang === "es" ? (
                <>
                  Encuentra la Costa Rica que{" "}
                  <span className="italic text-[var(--nakma-earth)]">se siente tuya</span>.
                </>
              ) : (
                <>
                  Find the Costa Rica that{" "}
                  <span className="italic text-[var(--nakma-earth)]">feels like yours</span>.
                </>
              )}
            </h2>
          </div>
          <Link
            href="/listings"
            className="nakma-body inline-flex h-[54px] shrink-0 items-center justify-center rounded-full border border-[var(--nakma-dark)]/35 px-8 text-[12px] uppercase tracking-[0.28em] text-[var(--nakma-dark)] transition-colors duration-300 hover:bg-[var(--nakma-dark)] hover:text-white"
          >
            {t("regions.cta")}
          </Link>
        </Reveal>

        {/* Region cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REGIONS.map((region, i) => (
            <Reveal key={region.name} delay={i * 0.1}>
              <Link
                href={region.href}
                className="group relative block overflow-hidden rounded-[24px]"
                style={{ aspectRatio: "3/4" }}
              >
                <Image
                  src={region.img}
                  alt={`${region.name}, Costa Rica`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
                {/* Inner frame + gradient */}
                <div className="absolute inset-3 rounded-[16px] border border-white/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                {/* Label */}
                <div className="absolute inset-x-0 bottom-0 p-6 text-center">
                  <h3 className="nakma-display text-[26px] leading-tight text-white">
                    {t(region.nameKey)}
                  </h3>
                  <p className="nakma-body mt-1.5 text-[11px] uppercase tracking-[0.26em] text-white/75">
                    {region.sub}
                  </p>
                  <span className="nakma-body mt-3 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.24em] text-[var(--nakma-sand)] opacity-0 transition-all duration-300 group-hover:opacity-100">
                    {t("regions.viewProperties")}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

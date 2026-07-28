"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/constants";
import { useLang } from "@/lib/i18n";

const NATURE_IMAGES = [
  {
    src: "https://images.pexels.com/photos/15365639/pexels-photo-15365639.jpeg?auto=compress&cs=tinysrgb&w=1400",
    label: "Cloud Forest · Monteverde",
  },
  {
    src: "https://images.pexels.com/photos/36827348/pexels-photo-36827348.jpeg?auto=compress&cs=tinysrgb&w=1400",
    label: "Pacific Coast · Guanacaste",
  },
  {
    src: "https://images.pexels.com/photos/29943338/pexels-photo-29943338.jpeg?auto=compress&cs=tinysrgb&w=1400",
    label: "Volcanic Highlands · Central Valley",
  },
  {
    src: "https://images.pexels.com/photos/11181988/pexels-photo-11181988.jpeg?auto=compress&cs=tinysrgb&w=1400",
    label: "Central Pacific · Manuel Antonio",
  },
];

export default function NatureIntroSection() {
  const { t } = useLang();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((prev) => (prev + 1) % NATURE_IMAGES.length),
      6500
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative bg-[var(--nakma-bg)] px-4 py-20 lg:py-32 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 lg:items-center">

          {/* ── Left: Image carousel ───────────────────── */}
          <div className="relative">
            <div className="relative h-[480px] overflow-hidden rounded-[32px] shadow-[0_40px_100px_rgba(22,17,13,0.18)] lg:h-[600px]">
              {NATURE_IMAGES.map((im, i) => (
                <Image
                  key={im.src}
                  src={im.src}
                  alt="Costa Rica landscape"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover transition-opacity duration-[1400ms] ease-in-out"
                  style={{ opacity: i === current ? 1 : 0 }}
                />
              ))}
            </div>

            {/* Dot navigation */}
            <div className="mt-5 flex items-center gap-2 justify-end pr-2">
              {NATURE_IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="transition-all duration-300"
                  style={{
                    width: i === current ? "24px" : "6px",
                    height: "6px",
                    borderRadius: "9999px",
                    background: i === current ? "var(--nakma-dark)" : "rgba(22,17,13,0.22)",
                  }}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* ── Right: Brand story ──────────────────────── */}
          <div className="flex flex-col justify-center">
            <p className="nakma-body text-[10px] uppercase tracking-[0.46em] text-[var(--nakma-olive)]">
              {t("nature.eyebrow")}
            </p>

            <h2 className="nakma-display mt-5 text-[36px] leading-[1.08] tracking-[-0.03em] text-[var(--nakma-dark)] md:text-[44px] lg:text-[52px]">
              {t("nature.titleA")}{" "}
              <span className="text-[var(--nakma-earth)]">{t("nature.titleB")}</span>
            </h2>

            <div className="mt-8 space-y-5 text-[15px] leading-[1.85] text-[var(--nakma-dark)]/68 nakma-body">
              <p>{t("nature.p1")}</p>
              <p>{t("nature.p2")}</p>
            </div>

            {/* Value pillars */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              {["nature.pillar1", "nature.pillar2", "nature.pillar3", "nature.pillar4"].map((prefix) => (
                <div
                  key={prefix}
                  className="rounded-[20px] border border-[var(--nakma-dark)]/8 bg-white/60 p-5"
                >
                  <p className="nakma-display text-[13px] font-semibold text-[var(--nakma-dark)]">
                    {t(`${prefix}Label`)}
                  </p>
                  <p className="nakma-body mt-1.5 text-[12px] leading-relaxed text-[var(--nakma-dark)]/55">
                    {t(`${prefix}Desc`)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/about-us"
                className="nakma-body inline-flex h-[50px] items-center rounded-full bg-[var(--nakma-dark)] px-7 text-[11px] uppercase tracking-[0.28em] text-white transition-opacity hover:opacity-88"
              >
                {t("nature.ourStory")}
              </Link>
              <Link
                href="/listings"
                className="nakma-body inline-flex h-[50px] items-center rounded-full border border-[var(--nakma-dark)]/30 px-7 text-[11px] uppercase tracking-[0.28em] text-[var(--nakma-dark)] transition-colors hover:bg-[var(--nakma-dark)] hover:text-white"
              >
                {t("hero.cta")}
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

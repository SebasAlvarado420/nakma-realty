"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/constants";
import { useLang } from "@/lib/i18n";

// Costa Rica imagery (Pexels, free). Copy is i18n-driven (invest.* keys).
const SCENES = [
  { img: "https://images.pexels.com/photos/29943338/pexels-photo-29943338.jpeg?auto=compress&cs=tinysrgb&w=2400", key: "invest.s1", stat: "5% – 8%", href: "/listings", align: "left" as const },
  { img: "https://images.pexels.com/photos/15365639/pexels-photo-15365639.jpeg?auto=compress&cs=tinysrgb&w=2400", key: "invest.s2", stat: "25%", href: "/listings", align: "right" as const },
  { img: "https://images.pexels.com/photos/36827348/pexels-photo-36827348.jpeg?auto=compress&cs=tinysrgb&w=2400", key: "invest.s3", stat: "#1", href: "/listings", align: "left" as const },
  { img: "https://images.pexels.com/photos/11181988/pexels-photo-11181988.jpeg?auto=compress&cs=tinysrgb&w=2400", key: "invest.s4", stat: "$3.2B", href: "/listings", align: "right" as const },
  { img: "https://images.pexels.com/photos/17302412/pexels-photo-17302412.jpeg?auto=compress&cs=tinysrgb&w=2400", key: "invest.s5", stat: "98%", href: "/listings", align: "left" as const },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function ParallaxScene({ scene, index }: { scene: typeof SCENES[0]; index: number }) {
  const { ref: contentRef, inView } = useInView(0.12);
  const { t } = useLang();
  const isLeft = scene.align === "left";
  const points = [t(`${scene.key}P1`), t(`${scene.key}P2`), t(`${scene.key}P3`)];

  return (
    <div className="relative h-screen min-h-[700px] overflow-hidden">
      {/* Full-bleed image with a slow Ken Burns drift (CSS only — no scroll JS) */}
      <div className="absolute inset-0">
        <Image
          src={scene.img}
          alt={`${t("invest.eyebrow")} — Costa Rica real estate`}
          fill
          sizes="100vw"
          priority={index === 0}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover animate-[nakma-kenburns_24s_ease-in-out_infinite_alternate]"
        />
      </div>

      {/* Dark gradient — strong on content side, fades to image on other side */}
      <div
        className="absolute inset-0"
        style={{
          background: isLeft
            ? "linear-gradient(105deg, rgba(14,11,8,0.95) 0%, rgba(14,11,8,0.78) 30%, rgba(14,11,8,0.35) 58%, rgba(14,11,8,0.08) 80%, transparent 100%)"
            : "linear-gradient(255deg, rgba(14,11,8,0.95) 0%, rgba(14,11,8,0.78) 30%, rgba(14,11,8,0.35) 58%, rgba(14,11,8,0.08) 80%, transparent 100%)",
        }}
      />
      {/* Bleed transitions with previous/next section */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0e0b08] to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0e0b08] to-transparent pointer-events-none" />

      {/* Content */}
      <div className={`relative z-10 flex h-full items-center px-8 lg:px-20 ${isLeft ? "" : "justify-end"}`}>
        <div
          ref={contentRef}
          className={`w-full max-w-[520px] ${isLeft ? "" : "text-right"}`}
        >
          {/* Eyebrow — slides in from side */}
          <p
            className="nakma-body text-[9px] uppercase tracking-[0.52em] text-[var(--nakma-sand)]/70 transition-all duration-700"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView
                ? "translateX(0)"
                : isLeft ? "translateX(-20px)" : "translateX(20px)",
              transitionDelay: "0ms",
            }}
          >
            {t("invest.eyebrow")}
          </p>

          {/* Stat — pops in with scale */}
          <div
            className={`mt-6 transition-all duration-700 ${isLeft ? "" : "flex flex-col items-end"}`}
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0) scale(1)" : "translateY(16px) scale(0.96)",
              transitionDelay: "120ms",
            }}
          >
            <span className="nakma-display block text-[72px] font-semibold leading-none tracking-[-0.04em] text-white md:text-[96px]">
              {scene.stat}
            </span>
            <span className="nakma-body mt-1 block text-[11px] uppercase tracking-[0.32em] text-[var(--nakma-sand)]/65">
              {t(`${scene.key}StatLabel`)}
            </span>
          </div>

          {/* Headline */}
          <h2
            className="nakma-display mt-7 text-[32px] font-semibold leading-[1.06] tracking-[-0.04em] transition-all duration-700 md:text-[44px]"
            style={{
              color: "#ffffff",
              whiteSpace: "pre-line",
              opacity: inView ? 1 : 0,
              transform: inView
                ? "translateX(0)"
                : isLeft ? "translateX(-24px)" : "translateX(24px)",
              transitionDelay: "220ms",
            }}
          >
            {t(`${scene.key}Headline`)}
          </h2>

          {/* Body */}
          <p
            className="nakma-body mt-5 text-[14px] leading-[1.88] text-white/52 transition-all duration-700 lg:text-[15px]"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(12px)",
              transitionDelay: "330ms",
            }}
          >
            {t(`${scene.key}Body`)}
          </p>

          {/* Key facts — staggered reveal */}
          {points.length > 0 && (
            <ul className={`mt-7 flex flex-col gap-3 ${isLeft ? "" : "items-end"}`}>
              {points.map((point, pi) => (
                <li
                  key={point}
                  className={`nakma-body flex max-w-[440px] items-center gap-3 text-[13px] leading-snug text-white/72 transition-all duration-700 lg:text-[14px] ${
                    isLeft ? "" : "flex-row-reverse text-right"
                  }`}
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView
                      ? "translateX(0)"
                      : isLeft
                        ? "translateX(-18px)"
                        : "translateX(18px)",
                    transitionDelay: `${400 + pi * 110}ms`,
                  }}
                >
                  <span className="inline-block h-[6px] w-[6px] flex-shrink-0 rounded-full bg-[var(--nakma-sand)]" />
                  {point}
                </li>
              ))}
            </ul>
          )}

          {/* CTA */}
          <div
            className={`mt-9 transition-all duration-700 ${isLeft ? "" : "flex justify-end"}`}
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(10px)",
              transitionDelay: "760ms",
            }}
          >
            <Link
              href={scene.href}
              className="nakma-body group inline-flex h-[52px] items-center gap-3 rounded-full border border-white/20 px-7 text-[11px] uppercase tracking-[0.36em] text-white/75 backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/10 hover:text-white"
            >
              {t(`${scene.key}Cta`)}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Scene counter — bottom corner opposite to content */}
      <div
        className={`absolute bottom-10 z-10 transition-all duration-700 ${isLeft ? "right-8 lg:right-16" : "left-8 lg:left-16"}`}
        style={{ opacity: inView ? 1 : 0, transitionDelay: "500ms" }}
      >
        <p className="nakma-body font-mono text-[10px] tracking-[0.24em] text-white/20">
          {String(index + 1).padStart(2, "0")} / {String(SCENES.length).padStart(2, "0")}
        </p>
      </div>

      {/* Vertical accent line */}
      <div
        className={`absolute top-1/2 z-10 h-20 w-px -translate-y-1/2 bg-white/15 transition-all duration-700 ${isLeft ? "right-8 lg:right-16" : "left-8 lg:left-16"}`}
        style={{ opacity: inView ? 1 : 0, transitionDelay: "300ms" }}
      />
    </div>
  );
}

export default function ParallaxNatureSection() {
  // Section intro header — "Why Invest in Costa Rica?"
  const { ref: headerRef, inView: headerVisible } = useInView(0.3);
  const { t } = useLang();

  return (
    <div className="bg-[#0e0b08]">
      {/* Section header */}
      <div
        ref={headerRef}
        className="relative overflow-hidden px-8 pb-6 pt-12 lg:px-20 lg:pt-16"
      >
        <p
          className="nakma-body text-[9px] uppercase tracking-[0.54em] text-[var(--nakma-sand)]/55 transition-all duration-700"
          style={{ opacity: headerVisible ? 1 : 0, transform: headerVisible ? "translateY(0)" : "translateY(12px)" }}
        >
          {t("invest.header")}
        </p>
        <h2
          className="nakma-display mt-4 max-w-2xl text-[38px] font-semibold leading-[1.04] tracking-[-0.04em] transition-all duration-700 md:text-[56px]"
          style={{
            color: "#ffffff",
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(16px)",
            transitionDelay: "120ms",
          }}
        >
          {t("invest.title")}{" "}
          <span className="text-[var(--nakma-sand)]">{t("invest.titleHighlight")}</span>
        </h2>
        <p
          className="nakma-body mt-5 max-w-lg text-[15px] leading-relaxed text-white/40 transition-all duration-700"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(10px)",
            transitionDelay: "220ms",
          }}
        >
          {t("invest.intro")}
        </p>
      </div>

      {/* Parallax scenes */}
      {SCENES.map((scene, i) => (
        <ParallaxScene key={i} scene={scene} index={i} />
      ))}
    </div>
  );
}

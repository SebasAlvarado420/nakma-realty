"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/constants";

// Real 4K Costa Rica & tropical nature images from Unsplash (free to use)
const SCENES = [
  {
    img: "https://images.unsplash.com/photo-1573790387438-4da905039392?auto=format&fit=crop&w=2560&q=90",
    eyebrow: "Why Invest in Costa Rica?",
    stat: "5% – 8%",
    statLabel: "Average annual ROI",
    headline: "Where the jungle\nmeets the sea.",
    body: "Costa Rica's Pacific coast combines tropical biodiversity, ocean access, and architectural freedom. Properties here don't just hold value — they grow it while offering a lifestyle most only dream of.",
    points: [
      "Foreigners can own property outright — no restrictions",
      "Titled ocean-view & beachfront land available",
      "Transactions handled in US dollars",
    ],
    cta: { label: "Explore Coastal Listings", href: "/listings" },
    align: "left" as const,
  },
  {
    img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=2560&q=90",
    eyebrow: "Why Invest in Costa Rica?",
    stat: "25%",
    statLabel: "Land protected as national reserve",
    headline: "25% of the world's\nspecies. One country.",
    body: "Costa Rica protects more than 25% of its territory as national parks and reserves. Properties here don't just offer a view — they offer belonging to one of the most biodiverse places on the planet.",
    points: [
      "30+ national parks within easy reach",
      "Home to ~6% of the planet's biodiversity",
      "A global leader in reforestation",
    ],
    cta: { label: "Nature Properties", href: "/listings" },
    align: "right" as const,
  },
  {
    img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=2560&q=90",
    eyebrow: "Why Invest in Costa Rica?",
    stat: "#1",
    statLabel: "Happiest country in Latin America",
    headline: "Homes built for\nan intentional life.",
    body: "The best properties in Costa Rica don't compete with their environment — they extend it. Open walls, natural materials, indoor-outdoor flow, and architecture shaped by what surrounds it.",
    points: [
      "Pura Vida — a genuine, slower way of living",
      "Among the highest life expectancies in the Americas",
      "Stable democracy with no standing army since 1948",
    ],
    cta: { label: "View Properties", href: "/listings" },
    align: "left" as const,
  },
  {
    img: "https://images.unsplash.com/photo-1540202404-a2f29016b523?auto=format&fit=crop&w=2560&q=90",
    eyebrow: "Why Invest in Costa Rica?",
    stat: "$3.2B",
    statLabel: "Foreign investment in 2023",
    headline: "Land that appreciates\nwith purpose.",
    body: "Costa Rica's real estate market attracts international buyers for its political stability, natural capital, and strong rental demand. Investing here means investing in something that endures.",
    points: [
      "Booming short-term & vacation rental demand",
      "Fast-growing digital-nomad visa program",
      "Low annual property tax — around 0.25%",
    ],
    cta: { label: "Investment Opportunities", href: "/listings" },
    align: "right" as const,
  },
  {
    img: "https://images.unsplash.com/photo-1518182170546-07661fd94144?auto=format&fit=crop&w=2560&q=90",
    eyebrow: "Why Invest in Costa Rica?",
    stat: "98%",
    statLabel: "Electricity from renewable sources",
    headline: "A blueprint for\nsustainable living.",
    body: "Few places on earth align lifestyle and responsibility like Costa Rica. A near-100% renewable grid, protected forests, and eco-conscious design make every property part of something larger than itself.",
    points: [
      "Nearly carbon-neutral national energy grid",
      "2M+ visitors drawn by nature each year",
      "Eco-architecture that works with the land",
    ],
    cta: { label: "Sustainable Estates", href: "/listings" },
    align: "left" as const,
  },
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const { ref: contentRef, inView } = useInView(0.12);
  const isLeft = scene.align === "left";

  useEffect(() => {
    const section = sectionRef.current;
    const img = imgRef.current;
    if (!section || !img) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = (vh - rect.top) / (vh + rect.height);
        const clamped = Math.max(0, Math.min(1, progress));
        img.style.transform = `translateY(${(clamped - 0.5) * 100}px)`;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={sectionRef} className="relative h-screen min-h-[700px] overflow-hidden">
      {/* Parallax image */}
      <div ref={imgRef} className="absolute inset-[-60px] will-change-transform">
        <Image
          src={scene.img}
          alt={scene.eyebrow}
          fill
          sizes="100vw"
          priority={index === 0}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover animate-[nakma-kenburns_20s_ease-in-out_infinite_alternate]"
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
            {scene.eyebrow}
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
              {scene.statLabel}
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
            {scene.headline}
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
            {scene.body}
          </p>

          {/* Key facts — staggered reveal */}
          {scene.points && (
            <ul className={`mt-7 flex flex-col gap-3 ${isLeft ? "" : "items-end"}`}>
              {scene.points.map((point, pi) => (
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
              href={scene.cta.href}
              className="nakma-body group inline-flex h-[52px] items-center gap-3 rounded-full border border-white/20 px-7 text-[11px] uppercase tracking-[0.36em] text-white/75 backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/10 hover:text-white"
            >
              {scene.cta.label}
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
          NAKMA Realty · Market Intelligence
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
          Why invest in{" "}
          <span className="text-[var(--nakma-sand)]">Costa Rica?</span>
        </h2>
        <p
          className="nakma-body mt-5 max-w-lg text-[15px] leading-relaxed text-white/40 transition-all duration-700"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(10px)",
            transitionDelay: "220ms",
          }}
        >
          One of the most stable, biodiverse, and sought-after real estate markets in Latin America.
        </p>
      </div>

      {/* Parallax scenes */}
      {SCENES.map((scene, i) => (
        <ParallaxScene key={i} scene={scene} index={i} />
      ))}
    </div>
  );
}

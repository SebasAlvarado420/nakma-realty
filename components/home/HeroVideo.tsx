"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";

// Background (beach) video — the light, web-optimized file. Can be pointed at a
// CDN URL (Cloudflare Stream/R2) via env var with no code change.
const HERO_BG_VIDEO =
  process.env.NEXT_PUBLIC_HERO_BG_VIDEO || "/videos/videohero-web.mp4";

/**
 * Clean full-screen hero. No scroll-hijacking (the old scroll-to-expand effect
 * intercepted the wheel/touch and forced scrollTo(0,0), which felt "stuck" and
 * hurt Core Web Vitals). The page now scrolls natively from the first frame.
 */
export default function HeroVideo() {
  const { t } = useLang();

  return (
    <section className="relative flex h-[100svh] min-h-[560px] w-full items-center justify-center overflow-hidden bg-[var(--nakma-dark)]">
      {/* Full-bleed background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={HERO_BG_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* Cinematic vignette + top scrim for navbar legibility */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_92%_78%_at_50%_42%,rgba(0,0,0,0.20),rgba(0,0,0,0.66))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/45 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <p
          className="nakma-body mb-6 text-[10px] uppercase tracking-[0.46em] text-white/75 md:text-[11px]"
          style={{ animation: "nakma-fade-in 0.7s ease both", animationDelay: "0.05s" }}
        >
          NAKMA Realty · Costa Rica
        </p>

        <h1
          className="nakma-display max-w-[15ch] text-[clamp(2.5rem,7vw,6.2rem)] font-medium leading-[0.98] tracking-[-0.02em] text-white"
          style={{
            textShadow: "0 2px 30px rgba(0,0,0,0.45)",
            animation: "nakma-fade-in 0.7s ease both",
            animationDelay: "0.15s",
          }}
        >
          {t("hero.title")}
        </h1>

        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
          style={{ animation: "nakma-fade-in 0.7s ease both", animationDelay: "0.3s" }}
        >
          <Link
            href="/listings"
            className="nakma-body inline-flex h-[52px] items-center rounded-full bg-white px-8 text-[11px] uppercase tracking-[0.26em] text-[var(--nakma-dark)] transition hover:bg-white/90"
          >
            {t("hero.cta")}
          </Link>
          <Link
            href="/contact-us"
            className="nakma-body inline-flex h-[52px] items-center rounded-full border border-white/35 px-8 text-[11px] uppercase tracking-[0.26em] text-white backdrop-blur-sm transition hover:bg-white/10"
          >
            {t("nav.contact")}
          </Link>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center">
        <div className="h-12 w-px overflow-hidden bg-white/22">
          <div className="h-1/2 w-full bg-[var(--nakma-bg)] animate-[nakma-scroll_1.6s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
}

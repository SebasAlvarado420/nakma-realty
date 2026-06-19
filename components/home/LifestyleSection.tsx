"use client";

import Link from "next/link";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/constants";

const LIFESTYLE_ITEMS = [
  {
    img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80",
    tag: "Wellbeing",
    title: "Privacy surrounded by canopy",
    desc: "Properties where the jungle becomes part of the architecture.",
  },
  {
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
    tag: "Investment",
    title: "Land with long-term potential",
    desc: "Costa Rica's natural capital continues to appreciate in value and significance.",
  },
  {
    img: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=900&q=80",
    tag: "Architecture",
    title: "Tropical design, refined",
    desc: "Homes that blend seamlessly with the landscape through thoughtful architecture.",
  },
];

export default function LifestyleSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--nakma-dark)] px-4 py-24 lg:py-36 lg:px-10">
      {/* Subtle texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="nakma-body text-[10px] uppercase tracking-[0.46em] text-[var(--nakma-sand)]/75">
              Nature · Lifestyle · Investment
            </p>
            <h2 className="nakma-display mt-5 text-[36px] leading-[1.05] tracking-[-0.03em] text-[var(--nakma-bg)] md:text-[48px]">
              A different kind of{" "}
              <span className="text-[var(--nakma-sand)]">real estate.</span>
            </h2>
          </div>
          <p className="nakma-body max-w-sm text-[14px] leading-relaxed text-white/44 lg:text-right">
            We don't just sell properties. We help people find their place within Costa Rica's landscape.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {LIFESTYLE_ITEMS.map(({ img, tag, title, desc }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-[28px]"
              style={{ aspectRatio: "3/4" }}
            >
              <Image
                src={img}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-7">
                <span className="nakma-body inline-block rounded-full border border-white/20 px-3 py-1 text-[9px] uppercase tracking-[0.36em] text-white/70 backdrop-blur-sm">
                  {tag}
                </span>
                <h3 className="nakma-display mt-3 text-[22px] font-semibold leading-tight text-white">
                  {title}
                </h3>
                <p className="nakma-body mt-2 text-[13px] leading-relaxed text-white/58">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA row */}
        <div className="mt-14 flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
          <p className="nakma-display text-[18px] text-white/55 md:text-[22px]">
            Find a property that feels connected to the land.
          </p>
          <div className="flex gap-4">
            <Link
              href="/listings"
              className="nakma-body inline-flex h-[50px] items-center rounded-full bg-[var(--nakma-bg)] px-7 text-[11px] uppercase tracking-[0.28em] text-[var(--nakma-dark)] transition hover:opacity-90"
            >
              Explore Listings
            </Link>
            <Link
              href="/contact-us"
              className="nakma-body inline-flex h-[50px] items-center rounded-full border border-white/20 px-7 text-[11px] uppercase tracking-[0.28em] text-white/80 transition hover:border-white/40 hover:text-white"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

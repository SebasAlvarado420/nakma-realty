"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PropertyHoverCard from "@/components/property/PropertyHoverCard";
import Reveal from "@/components/ui/Reveal";
import type { Property } from "@/types/property";

type ListingsCarouselProps = {
  eyebrow: string;
  title: ReactNode;
  properties: Property[];
  viewAllHref?: string;
  viewAllLabel?: string;
};

export default function ListingsCarousel({
  eyebrow,
  title,
  properties,
  viewAllHref = "/listings",
  viewAllLabel = "View All Listings",
}: ListingsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  }

  if (properties.length === 0) return null;

  const arrowBtn =
    "absolute top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--nakma-dark)]/10 bg-white text-[var(--nakma-dark)] shadow-[0_8px_24px_rgba(22,17,13,0.18)] transition hover:bg-[var(--nakma-dark)] hover:text-white active:scale-95";

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="nakma-body text-[12px] uppercase tracking-[0.34em] text-[var(--nakma-olive)]">
              {eyebrow}
            </p>
            <h2 className="nakma-display mt-4 text-[36px] leading-[1.05] tracking-[-0.02em] text-[var(--nakma-dark)] sm:text-[48px]">
              {title}
            </h2>
          </div>

          <Link
            href={viewAllHref}
            className="nakma-body inline-flex h-11 shrink-0 items-center rounded-full border border-[var(--nakma-dark)]/25 px-6 text-[11px] uppercase tracking-[0.24em] text-[var(--nakma-dark)] transition hover:bg-[var(--nakma-dark)] hover:text-white"
          >
            {viewAllLabel}
          </Link>
        </Reveal>

        {/* Track with edge arrows */}
        <div className="relative">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Previous"
            className={`${arrowBtn} left-1 lg:-left-3`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Next"
            className={`${arrowBtn} right-1 lg:-right-3`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {properties.map((property) => (
              <div
                key={property.id}
                className="w-[78vw] shrink-0 snap-start sm:w-[340px] lg:w-[380px]"
              >
                <PropertyHoverCard property={property} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

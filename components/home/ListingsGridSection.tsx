"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import PropertyCard from "@/components/property/PropertyCard";
import Reveal from "@/components/ui/Reveal";
import type { Property } from "@/types/property";

type ListingsGridSectionProps = {
  eyebrow: string;
  title: ReactNode;
  properties: Property[];
  viewAllHref?: string;
  viewAllLabel?: string;
  /** 3 cols × 4 rows by default. */
  limit?: number;
};

export default function ListingsGridSection({
  eyebrow,
  title,
  properties,
  viewAllHref = "/listings",
  viewAllLabel = "Explore All",
  limit = 12,
}: ListingsGridSectionProps) {
  if (properties.length === 0) return null;
  const items = properties.slice(0, limit);

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

        <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((property, i) => (
            <Reveal key={property.id} delay={(i % 3) * 0.08}>
              <PropertyCard property={property} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import PropertyCard from "@/components/property/PropertyCard";
import Reveal from "@/components/ui/Reveal";
import type { Property } from "@/types/property";

type FeaturedPropertiesProps = {
  properties: Property[];
};

export default function FeaturedProperties({
  properties,
}: FeaturedPropertiesProps) {
  return (
    <section className="px-4 pb-24 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-4xl">
            <p className="nakma-body text-[12px] uppercase tracking-[0.34em] text-[var(--nakma-olive)]">
              Featured Listings
            </p>

            <h2 className="nakma-brand mt-4 max-w-5xl text-[42px] leading-[1.05] tracking-[0.03em] text-[var(--nakma-dark)] sm:text-[56px] lg:text-[72px]">
                Discover exceptional properties shaped by Costa Rica’s natural beauty.
            </h2>
          </div>

          <div className="lg:pt-6">
            <Link
              href="/listings"
              className="inline-flex h-[54px] items-center justify-center rounded-full border border-[var(--nakma-dark)]/35 px-8 text-[12px] uppercase tracking-[0.28em] text-[var(--nakma-dark)] transition-colors duration-300 hover:bg-[var(--nakma-dark)] hover:text-white nakma-body"
            >
              View All Listings
            </Link>
          </div>
        </div>

        {properties.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {properties.slice(0, 3).map((property, i) => (
              <Reveal key={property.id} delay={i * 0.12}>
                <PropertyCard property={property} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-black/8 bg-white/40 px-6 py-14 text-center">
            <p className="text-[16px] text-[var(--nakma-dark)]/70 nakma-body">
              No featured properties available right now.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
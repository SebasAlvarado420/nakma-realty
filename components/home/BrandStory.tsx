"use client";

import Link from "next/link";
import { useProperties } from "@/lib/propertiescontext";

export default function FeaturedProperties() {
  const { properties } = useProperties();
  const featured = properties.filter((property) => property.featured);

  return (
    <section className="px-6 py-20 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#8b6d3b]">
              Featured Properties
            </p>
            <h2 className="mt-3 text-4xl font-semibold md:text-5xl">
              A curated collection of homes shaped by Costa Rica.
            </h2>
          </div>

          <Link
            href="/listings"
            className="rounded-2xl border border-[#163126] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#163126] transition hover:bg-[#163126] hover:text-white"
          >
            View All Listings
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {featured.map((property) => (
            <article
              key={property.id}
              className="overflow-hidden rounded-[30px] bg-white shadow-2xl"
            >
              <div className="h-72 overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
              </div>

              <div className="p-6">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[#edf4ef] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#163126]">
                    {property.code}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8b6d3b]">
                    {property.province}
                  </span>
                </div>

                <h3 className="text-2xl font-semibold leading-tight">
                  {property.title}
                </h3>
                <p className="mt-2 text-[#5d7268]">{property.location}</p>
                <p className="mt-4 text-2xl font-semibold text-[#163126]">
                  {property.price}
                </p>

                <div className="mt-5 flex flex-wrap gap-2 text-sm text-[#50665b]">
                  <span className="rounded-full bg-[#f2f5f1] px-3 py-1">
                    {property.bedrooms} Beds
                  </span>
                  <span className="rounded-full bg-[#f2f5f1] px-3 py-1">
                    {property.bathrooms} Baths
                  </span>
                  <span className="rounded-full bg-[#f2f5f1] px-3 py-1">
                    Land {property.landSize}
                  </span>
                  <span className="rounded-full bg-[#f2f5f1] px-3 py-1">
                    Build {property.constructionSize}
                  </span>
                </div>

                <Link
                  href={`/listings/${property.slug}`}
                  className="mt-6 block w-full rounded-2xl bg-[#163126] px-5 py-3.5 text-center text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:opacity-90"
                >
                  View Property
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
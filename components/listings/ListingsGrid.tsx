"use client";

import PropertyCard from "@/components/property/PropertyCard";
import { useProperties } from "@/lib/propertiescontext";

export default function ListingsGrid() {
  const { properties } = useProperties();

  return (
    <section className="px-6 pb-20 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm uppercase tracking-[0.24em] text-[#8b6d3b]">
            Available Properties
          </p>
          <p className="text-sm text-[#5d7268]">{properties.length} properties</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}
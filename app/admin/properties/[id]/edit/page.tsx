"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useProperties } from "@/lib/propertiescontext";
import PropertyForm from "@/components/admin/PropertyForm";

export default function EditPropertyPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const { properties, loading } = useProperties();
  const property = properties.find((p) => p.id === id);

  return (
    <section className="min-h-screen bg-[#f7f2e8] px-6 pt-32 pb-20 md:px-10">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin/properties" className="text-sm font-medium text-[#8b6d3b] hover:underline">
          ← Back to properties
        </Link>
        <h1 className="mt-3 text-4xl font-semibold text-[#163126]">
          {property ? `Edit ${property.code}` : "Edit Property"}
        </h1>
        <div className="mt-8">
          {property ? (
            <PropertyForm existing={property} />
          ) : (
            <p className="text-[#5d7268]">{loading ? "Loading…" : "Property not found."}</p>
          )}
        </div>
      </div>
    </section>
  );
}

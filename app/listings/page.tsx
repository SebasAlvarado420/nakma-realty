import { Suspense } from "react";
import type { Metadata } from "next";
import ListingsExplorer from "@/components/listings/ListingsExplorer";

export const metadata: Metadata = {
  title: "Listings — Homes, Land & Investment Properties in Costa Rica",
  description:
    "Browse NAKMA Realty's curated portfolio of homes, condos, land, and commercial properties across Guanacaste, Puntarenas, San José, and Costa Rica's Central Pacific coast.",
  alternates: { canonical: "/listings" },
  openGraph: {
    type: "website",
    url: "https://nakmarealty.com/listings",
    title: "Listings — Costa Rica Real Estate · NAKMA Realty",
    description:
      "Curated homes, land, and investment properties across Costa Rica's coasts and valleys.",
  },
};

export default function ListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--nakma-bg)] px-6 pt-32 lg:px-16">
          <p className="nakma-body text-sm uppercase tracking-[0.28em] text-[var(--nakma-olive)]">
            Loading…
          </p>
        </div>
      }
    >
      <ListingsExplorer />
    </Suspense>
  );
}

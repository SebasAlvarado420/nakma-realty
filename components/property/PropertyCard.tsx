"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bed, Bath, Ruler, Home, Share2, Bookmark } from "lucide-react";
import type { Property } from "@/types/property";
import CardImageCarousel from "@/components/property/CardImageCarousel";

type PropertyCardProps = {
  property: Property;
};

const SAVED_KEY = "nakma-saved";

function formatPrice(price: string) {
  const numeric = Number(price.replace(/[^0-9.]/g, ""));
  if (!numeric) return price;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(numeric);
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
      setSaved(Array.isArray(list) && list.includes(property.id));
    } catch {
      /* ignore */
    }
  }, [property.id]);

  function toggleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const list: string[] = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
      const next = list.includes(property.id)
        ? list.filter((id) => id !== property.id)
        : [...list, property.id];
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      setSaved(next.includes(property.id));
    } catch {
      /* ignore */
    }
  }

  function share(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/listings/${property.slug}`;
    if (navigator.share) {
      navigator.share({ title: property.title, url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url).catch(() => {});
    }
  }

  const isRent = property.listingType === "rent";

  return (
    <Link href={`/listings/${property.slug}`} className="group block">
      {/* Photo carousel — the hero of the card */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-[var(--nakma-sand)]/20">
        <CardImageCarousel
          images={property.gallery && property.gallery.length > 0 ? property.gallery : [property.image]}
          alt={property.title}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        {(property.exclusive || isRent) && (
          <span className="nakma-body absolute left-4 top-4 z-10 rounded-full bg-black/55 px-3 py-1 text-[9px] uppercase tracking-[0.22em] text-white backdrop-blur-sm">
            {property.exclusive ? "Exclusive" : "For Rent"}
          </span>
        )}
      </div>

      {/* Minimal info block */}
      <div className="px-0.5 pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="nakma-display text-[19px] leading-[1.25] text-[var(--nakma-dark)] transition-colors group-hover:text-[var(--nakma-earth)]">
            {property.title}
          </h3>
          <div className="mt-0.5 flex shrink-0 items-center gap-1.5">
            <span
              role="button"
              tabIndex={0}
              aria-label="Share"
              onClick={share}
              className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--nakma-dark)]/45 transition hover:bg-[var(--nakma-dark)]/6 hover:text-[var(--nakma-dark)]"
            >
              <Share2 className="h-[15px] w-[15px]" />
            </span>
            <span
              role="button"
              tabIndex={0}
              aria-label={saved ? "Remove from saved" : "Save"}
              onClick={toggleSave}
              className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--nakma-dark)]/45 transition hover:bg-[var(--nakma-dark)]/6 hover:text-[var(--nakma-dark)]"
            >
              <Bookmark
                className={`h-[15px] w-[15px] ${saved ? "fill-[var(--nakma-olive)] text-[var(--nakma-olive)]" : ""}`}
              />
            </span>
          </div>
        </div>

        <p className="nakma-body mt-1.5 text-[13px] text-[var(--nakma-dark)]/55">
          {property.location}
        </p>

        <div className="nakma-body mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-[var(--nakma-dark)]/70">
          {property.bedrooms > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Bed className="h-[15px] w-[15px] text-[var(--nakma-dark)]/40" />
              {property.bedrooms}
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Bath className="h-[15px] w-[15px] text-[var(--nakma-dark)]/40" />
              {property.bathrooms}
            </span>
          )}
          {property.constructionSize && (
            <span className="inline-flex items-center gap-1.5">
              <Home className="h-[15px] w-[15px] text-[var(--nakma-dark)]/40" />
              {property.constructionSize}
            </span>
          )}
          {property.landSize && (
            <span className="inline-flex items-center gap-1.5">
              <Ruler className="h-[15px] w-[15px] text-[var(--nakma-dark)]/40" />
              {property.landSize}
            </span>
          )}
        </div>

        <p className="nakma-display mt-3.5 text-[19px] font-semibold tracking-[-0.01em] text-[var(--nakma-dark)]">
          {formatPrice(property.price)}
          {isRent && property.rentPrice && (
            <span className="nakma-body ml-2 text-[13px] font-normal text-[var(--nakma-dark)]/55">
              · {property.rentPrice}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}

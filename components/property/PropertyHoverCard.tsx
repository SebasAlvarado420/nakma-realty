"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Bed, Bath, Ruler, Home } from "lucide-react";
import type { Property } from "@/types/property";
import { BLUR_DATA_URL } from "@/lib/constants";

function formatPrice(price: string) {
  const numeric = Number(price.replace(/[^0-9.]/g, ""));
  if (!numeric) return price;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(numeric);
}

// Rentals: format the amount like sale prices ($4,500) but keep the /period.
function formatRent(rent: string) {
  const numeric = Number(rent.replace(/[^0-9.]/g, ""));
  if (!numeric) return rent;
  const per = rent.match(/\/\s*[a-zA-Z]+/)?.[0]?.replace(/\s/g, "") ?? "/mo";
  return (
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(numeric) + per
  );
}

export default function PropertyHoverCard({ property }: { property: Property }) {
  const isRent = property.listingType === "rent";

  return (
    <Link
      href={`/listings/${property.slug}`}
      className="group relative block h-[400px] w-full overflow-hidden rounded-[18px] bg-[var(--nakma-dark)] shadow-[0_12px_40px_rgba(22,17,13,0.10)]"
    >
      {/* Image — shrinks to the top half on hover */}
      <div className="relative h-full w-full overflow-hidden transition-[height] duration-500 ease-out group-hover:h-[56%]">
        <Image
          src={property.image}
          alt={property.title}
          fill
          sizes="(max-width: 640px) 80vw, 380px"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        {(property.exclusive || isRent) && (
          <span className="nakma-body absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-[9px] uppercase tracking-[0.22em] text-white backdrop-blur-sm">
            {property.exclusive ? "Exclusive" : "For Rent"}
          </span>
        )}

        {/* Resting label — title + price, fades out on hover */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 transition-opacity duration-300 group-hover:opacity-0">
          <h3 className="nakma-display text-[20px] leading-tight text-white">
            {property.title}
          </h3>
          <div className="mt-1.5 flex items-center justify-between gap-3">
            <p className="nakma-body text-[12px] text-white/75">{property.location}</p>
            <p className="nakma-display text-[16px] font-semibold text-white">
              {isRent && property.rentPrice
                ? formatRent(property.rentPrice)
                : formatPrice(property.price)}
            </p>
          </div>
        </div>
      </div>

      {/* Reveal panel — slides up on hover with the full detail + CTA */}
      <div className="absolute inset-x-0 bottom-0 flex h-[44%] translate-y-3 flex-col justify-center bg-white px-5 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
        <h3 className="nakma-display text-[19px] leading-tight text-[var(--nakma-dark)]">
          {property.title}
        </h3>
        <p className="nakma-body mt-1 text-[12.5px] text-[var(--nakma-dark)]/55">
          {property.location}
        </p>

        <div className="nakma-body mt-3 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[12px] text-[var(--nakma-dark)]/70">
          {property.bedrooms > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Bed className="h-[14px] w-[14px] text-[var(--nakma-dark)]/40" />
              {property.bedrooms}
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Bath className="h-[14px] w-[14px] text-[var(--nakma-dark)]/40" />
              {property.bathrooms}
            </span>
          )}
          {property.constructionSize && (
            <span className="inline-flex items-center gap-1.5">
              <Home className="h-[14px] w-[14px] text-[var(--nakma-dark)]/40" />
              {property.constructionSize}
            </span>
          )}
          {property.landSize && (
            <span className="inline-flex items-center gap-1.5">
              <Ruler className="h-[14px] w-[14px] text-[var(--nakma-dark)]/40" />
              {property.landSize}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="nakma-display text-[18px] font-semibold text-[var(--nakma-dark)]">
            {isRent && property.rentPrice
              ? formatRent(property.rentPrice)
              : formatPrice(property.price)}
          </p>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--nakma-dark)] text-white transition-transform duration-500 group-hover:-rotate-45">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

"use client";

import { useMemo } from "react";
import { FocusRail, type FocusRailItem } from "@/components/ui/focus-rail";
import type { Property } from "@/types/property";

interface FeaturedCarouselProps {
  properties: Property[];
}

export default function FeaturedCarousel({ properties }: FeaturedCarouselProps) {
  const items: FocusRailItem[] = useMemo(
    () =>
      properties.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        imageSrc: p.image,
        href: `/listings/${p.slug}`,
        meta: p.province,
        price: p.price,
        location: p.location,
        code: p.code,
      })),
    [properties]
  );

  if (items.length === 0) return null;

  return <FocusRail items={items} loop autoPlay={false} />;
}

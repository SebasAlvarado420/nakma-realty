"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BLUR_DATA_URL } from "@/lib/constants";

export default function CardImageCarousel({
  images,
  alt,
  sizes = "(max-width: 768px) 100vw, 33vw",
}: {
  images: string[];
  alt: string;
  sizes?: string;
}) {
  const imgs = images.length > 0 ? images : [""];
  const [i, setI] = useState(0);

  function go(e: React.MouseEvent, dir: 1 | -1) {
    e.preventDefault();
    e.stopPropagation();
    setI((p) => (p + dir + imgs.length) % imgs.length);
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Image
        src={imgs[i]}
        alt={alt}
        fill
        sizes={sizes}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
      />

      {imgs.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => go(e, -1)}
            aria-label="Previous photo"
            className="absolute left-2.5 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[var(--nakma-dark)] opacity-100 shadow transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => go(e, 1)}
            aria-label="Next photo"
            className="absolute right-2.5 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[var(--nakma-dark)] opacity-100 shadow transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5">
            {imgs.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setI(idx);
                }}
                aria-label={`Photo ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  idx === i ? "w-4 bg-white" : "w-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

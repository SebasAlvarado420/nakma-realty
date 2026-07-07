"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";

/** A minimal dual-range slider styled with NAKMA tokens. */
export default function RangeSlider({
  value,
  onValueChange,
  min,
  max,
  step = 1,
  className = "",
}: {
  value: number[];
  onValueChange: (v: number[]) => void;
  min: number;
  max: number;
  step?: number;
  className?: string;
}) {
  return (
    <SliderPrimitive.Root
      className={`relative flex w-full touch-none select-none items-center ${className}`}
      value={value}
      onValueChange={onValueChange}
      min={min}
      max={max}
      step={step}
      minStepsBetweenThumbs={1}
    >
      <SliderPrimitive.Track className="relative h-1.5 grow overflow-hidden rounded-full bg-[var(--nakma-dark)]/12">
        <SliderPrimitive.Range className="absolute h-full bg-[var(--nakma-dark)]" />
      </SliderPrimitive.Track>
      {value.map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className="block h-4 w-4 cursor-grab rounded-full border-2 border-[var(--nakma-dark)] bg-white shadow-[0_2px_6px_rgba(22,17,13,0.25)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nakma-dark)]/30 active:cursor-grabbing"
          aria-label={i === 0 ? "Minimum price" : "Maximum price"}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

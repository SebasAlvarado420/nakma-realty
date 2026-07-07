"use client";

import { useEffect, useMemo, useState } from "react";
import RangeSlider from "@/components/ui/RangeSlider";

const TICKS = 30;

/**
 * Airbnb-style price filter (NAKMA-styled): a distribution histogram over the
 * price buckets, a dual-range slider, and Min/Max inputs. No "show N items"
 * button — the results update live in the listings grid.
 */
export default function PriceRangeFilter({
  value,
  onChange,
  min,
  max,
  step,
  prices,
  t,
}: {
  value: number[];
  onChange: (v: number[]) => void;
  min: number;
  max: number;
  step: number;
  prices: number[];
  t: (k: string) => string;
}) {
  const [minInput, setMinInput] = useState(String(value[0]));
  const [maxInput, setMaxInput] = useState(String(value[1]));

  useEffect(() => {
    setMinInput(String(Math.round(value[0])));
    setMaxInput(String(Math.round(value[1])));
  }, [value]);

  const { counts, maxCount, stepSize } = useMemo(() => {
    const stepSize = (max - min) / TICKS || 1;
    const counts = Array(TICKS)
      .fill(0)
      .map((_, i) => {
        const lo = min + i * stepSize;
        const hi = min + (i + 1) * stepSize;
        return prices.filter((p) => p >= lo && (i === TICKS - 1 ? p <= hi : p < hi)).length;
      });
    return { counts, maxCount: Math.max(1, ...counts), stepSize };
  }, [prices, min, max]);

  function commit(which: 0 | 1, raw: string) {
    const n = Number(raw.replace(/[^0-9.]/g, ""));
    if (isNaN(n)) {
      if (which === 0) setMinInput(String(Math.round(value[0])));
      else setMaxInput(String(Math.round(value[1])));
      return;
    }
    if (which === 0) onChange([Math.max(min, Math.min(n, value[1])), value[1]]);
    else onChange([value[0], Math.min(max, Math.max(n, value[0]))]);
  }

  const barSelected = (i: number) => {
    const lo = min + i * stepSize;
    const hi = min + (i + 1) * stepSize;
    return hi >= value[0] && lo <= value[1];
  };

  const inputCls =
    "nakma-body h-[42px] w-full rounded-xl border border-[var(--nakma-dark)]/14 bg-white pl-7 pr-3 text-[14px] text-[var(--nakma-dark)] outline-none transition focus:border-[var(--nakma-olive)]";

  return (
    <div className="w-full">
      {/* Histogram */}
      <div className="flex h-12 w-full items-end gap-[2px]" aria-hidden="true">
        {counts.map((c, i) => (
          <div key={i} className="flex flex-1 items-end">
            <span
              className={`w-full rounded-t-[2px] transition-colors ${
                barSelected(i) ? "bg-[var(--nakma-dark)]/70" : "bg-[var(--nakma-dark)]/15"
              }`}
              style={{ height: `${Math.max(6, (c / maxCount) * 100)}%` }}
            />
          </div>
        ))}
      </div>

      {/* Slider */}
      <div className="mt-2.5 px-0.5">
        <RangeSlider value={value} onValueChange={onChange} min={min} max={max} step={step} />
      </div>

      {/* Min / Max inputs */}
      <div className="mt-4 flex items-end gap-3">
        {([0, 1] as const).map((which) => (
          <div key={which} className="flex-1">
            <label className="nakma-body mb-1 block text-[11px] text-[var(--nakma-dark)]/55">
              {which === 0 ? t("listings.minPrice") : t("listings.maxPrice")}
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[var(--nakma-dark)]/45">
                $
              </span>
              <input
                value={which === 0 ? minInput : maxInput}
                onChange={(e) =>
                  which === 0 ? setMinInput(e.target.value) : setMaxInput(e.target.value)
                }
                onBlur={() => commit(which, which === 0 ? minInput : maxInput)}
                onKeyDown={(e) =>
                  e.key === "Enter" && commit(which, which === 0 ? minInput : maxInput)
                }
                inputMode="numeric"
                className={inputCls}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

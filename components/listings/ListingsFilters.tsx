"use client";

import { useMemo, useState } from "react";
import { useProperties } from "@/lib/propertiescontext";

const MIN_PRICE = 0;
const MAX_PRICE = 9000000;
const STEP = 50000;

function formatPrice(value: number) {
  if (value >= 9000000) return "$9.0M+";
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

type StepperProps = { label: string; value: number; onChange: (v: number) => void };

function Stepper({ label, value, onChange }: StepperProps) {
  return (
    <div>
      <label className="nakma-body mb-2.5 block text-[10px] uppercase tracking-[0.28em] text-[var(--nakma-olive)]">
        {label}
      </label>
      <div className="flex h-[52px] overflow-hidden rounded-2xl border border-[rgba(22,17,13,0.12)] bg-[rgba(255,255,255,0.72)]">
        <button type="button" onClick={() => onChange(Math.max(0, value - 1))}
          className="flex w-12 items-center justify-center text-lg text-[var(--nakma-dark)] transition hover:bg-[rgba(22,17,13,0.06)]">
          −
        </button>
        <div className="flex flex-1 items-center justify-center border-x border-[rgba(22,17,13,0.08)] text-[14px] font-medium text-[var(--nakma-dark)] nakma-body">
          {value === 0 ? "Any" : `${value}+`}
        </div>
        <button type="button" onClick={() => onChange(value + 1)}
          className="flex w-12 items-center justify-center text-lg text-[var(--nakma-dark)] transition hover:bg-[rgba(22,17,13,0.06)]">
          +
        </button>
      </div>
    </div>
  );
}

export default function ListingsFilters() {
  const [province, setProvince] = useState("Any");
  const [price, setPrice] = useState(MAX_PRICE);
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [landSize, setLandSize] = useState("");
  const priceLabel = useMemo(() => formatPrice(price), [price]);

  return (
    <section className="bg-[var(--nakma-bg)] px-6 pb-8 pt-32 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="nakma-body text-[10px] uppercase tracking-[0.46em] text-[var(--nakma-olive)]">
            Curated Listings
          </p>
          <h1 className="nakma-display mt-4 text-[38px] leading-[1.06] tracking-[-0.04em] text-[var(--nakma-dark)] md:text-[54px]">
            Curated properties in Costa Rica.
          </h1>
          <p className="nakma-body mt-5 text-[15px] leading-relaxed text-[var(--nakma-dark)]/60">
            Explore selected homes, land, and investment opportunities across Costa Rica.
          </p>
        </div>

        <div className="rounded-[32px] border border-[var(--nakma-dark)]/6 bg-white/55 p-6 shadow-[0_16px_48px_rgba(22,17,13,0.08)] backdrop-blur-sm md:p-8">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-[1fr_1.6fr_1fr_1fr_1.1fr_auto]">
            {/* Province */}
            <div>
              <label className="nakma-body mb-2.5 block text-[10px] uppercase tracking-[0.28em] text-[var(--nakma-olive)]">
                Province
              </label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="nakma-body h-[52px] w-full rounded-2xl border border-[rgba(22,17,13,0.12)] bg-[rgba(255,255,255,0.72)] px-4 text-[14px] text-[var(--nakma-dark)] outline-none"
              >
                {["Any","San José","Alajuela","Cartago","Heredia","Guanacaste","Puntarenas","Limón"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>

            {/* Price range */}
            <div>
              <div className="mb-2.5 flex items-center justify-between">
                <label className="nakma-body text-[10px] uppercase tracking-[0.28em] text-[var(--nakma-olive)]">Price</label>
                <span className="nakma-body text-[13px] font-medium text-[var(--nakma-dark)]">{priceLabel}</span>
              </div>
              <div className="rounded-2xl border border-[rgba(22,17,13,0.12)] bg-[rgba(255,255,255,0.72)] px-4 py-[14px]">
                <input
                  type="range" min={MIN_PRICE} max={MAX_PRICE} step={STEP} value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[rgba(22,17,13,0.15)] accent-[var(--nakma-dark)]"
                />
                <div className="mt-2 flex justify-between text-[11px] text-[var(--nakma-dark)]/45 nakma-body">
                  <span>$0</span><span>$9M+</span>
                </div>
              </div>
            </div>

            <Stepper label="Bedrooms" value={bedrooms} onChange={setBedrooms} />
            <Stepper label="Bathrooms" value={bathrooms} onChange={setBathrooms} />

            {/* Land size */}
            <div>
              <label className="nakma-body mb-2.5 block text-[10px] uppercase tracking-[0.28em] text-[var(--nakma-olive)]">
                Land Size
              </label>
              <input
                value={landSize}
                onChange={(e) => setLandSize(e.target.value)}
                placeholder="e.g. 800 m²"
                className="nakma-body h-[52px] w-full rounded-2xl border border-[rgba(22,17,13,0.12)] bg-[rgba(255,255,255,0.72)] px-4 text-[14px] text-[var(--nakma-dark)] outline-none placeholder:text-[rgba(22,17,13,0.38)]"
              />
            </div>

            {/* Search */}
            <div className="flex items-end sm:col-span-2 xl:col-span-1">
              <button
                type="button"
                className="nakma-body h-[52px] w-full rounded-2xl bg-[var(--nakma-dark)] px-6 text-[11px] uppercase tracking-[0.26em] text-white shadow-[0_6px_20px_rgba(22,17,13,0.20)] transition hover:opacity-88"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

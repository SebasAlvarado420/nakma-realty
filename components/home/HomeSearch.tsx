"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronDown, Minus, Plus } from "lucide-react";
import { useLang } from "@/lib/i18n";

const MAX_PRICE = 8_000_000;
const STEP = 50_000;

const PROVINCES = [
  "San José",
  "Alajuela",
  "Cartago",
  "Heredia",
  "Guanacaste",
  "Puntarenas",
];

function formatPrice(value: number) {
  if (value >= MAX_PRICE) return "$8.0M+";
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

function Stepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <p className="nakma-body mb-2 text-[11px] uppercase tracking-[0.2em] text-white/70">
        {label}
      </p>
      <div className="flex h-[46px] items-center overflow-hidden rounded-xl border border-white/25 bg-white/10 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="flex h-full w-10 items-center justify-center text-white transition hover:bg-white/10"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="nakma-body flex h-full flex-1 min-w-[44px] items-center justify-center text-[13px] font-medium text-white">
          {value === 0 ? "Any" : `${value}+`}
        </div>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="flex h-full w-10 items-center justify-center text-white transition hover:bg-white/10"
          aria-label={`Increase ${label}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function HomeSearch() {
  const router = useRouter();
  const { t } = useLang();
  const [query, setQuery] = useState("");
  const [province, setProvince] = useState("");
  const [interest, setInterest] = useState<"all" | "sale" | "rent">("all");
  const [price, setPrice] = useState(MAX_PRICE);
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);

  const priceLabel = useMemo(() => formatPrice(price), [price]);

  function search() {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (province) params.set("province", province);
    if (interest !== "all") params.set("type", interest);
    if (price < MAX_PRICE) params.set("maxPrice", String(price));
    if (bedrooms > 0) params.set("beds", String(bedrooms));
    if (bathrooms > 0) params.set("baths", String(bathrooms));
    const qs = params.toString();
    router.push(qs ? `/listings?${qs}` : "/listings");
  }

  return (
    <section className="relative overflow-hidden bg-[var(--nakma-dark)]">
      {/* Subtle brand gradient backdrop (no photo) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_60%_at_50%_0%,rgba(111,103,61,0.28),transparent_72%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(193,169,143,0.12),transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-24">
        <div className="text-center">
          <p className="nakma-body text-[11px] uppercase tracking-[0.46em] text-[var(--nakma-sand)]/85">
            {t("search.eyebrow")}
          </p>
          <h2 className="nakma-display mt-4 text-[34px] leading-tight tracking-[-0.02em] text-white md:text-[46px]">
            {t("search.title")}
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-5xl rounded-[22px] border border-white/15 bg-white/8 p-5 backdrop-blur-md sm:p-6">
          {/* Search + Location */}
          <div className="flex flex-col gap-3 rounded-2xl bg-white/95 p-2 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3 px-3">
              <Search className="h-5 w-5 shrink-0 text-[var(--nakma-olive)]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search()}
                placeholder={t("search.placeholder")}
                className="nakma-body h-[44px] w-full bg-transparent text-[14px] text-[var(--nakma-dark)] outline-none placeholder:text-[var(--nakma-dark)]/40"
              />
            </div>
            <div className="hidden h-8 w-px bg-[var(--nakma-dark)]/10 sm:block" />
            <div className="relative flex items-center">
              <MapPin className="pointer-events-none absolute left-3 h-4 w-4 text-[var(--nakma-dark)]/45" />
              <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-[var(--nakma-dark)]/45" />
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="nakma-body h-[44px] w-full cursor-pointer appearance-none rounded-xl bg-transparent pl-9 pr-9 text-[14px] text-[var(--nakma-dark)] outline-none sm:w-[200px]"
              >
                <option value="">{t("search.allLocations")}</option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-5 grid grid-cols-2 gap-5 lg:grid-cols-[1.1fr_1.4fr_1fr_1fr_auto] lg:items-end">
            {/* Interested in */}
            <div className="col-span-2 lg:col-span-1">
              <p className="nakma-body mb-2 text-[11px] uppercase tracking-[0.2em] text-white/70">
                {t("search.interested")}
              </p>
              <div className="flex h-[46px] rounded-xl border border-white/25 bg-white/10 p-1 backdrop-blur-sm">
                {(["all", "sale", "rent"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setInterest(opt)}
                    className={`nakma-body flex-1 rounded-lg text-[12px] uppercase tracking-[0.1em] transition ${
                      interest === opt ? "bg-white text-[var(--nakma-dark)]" : "text-white/70"
                    }`}
                  >
                    {opt === "all" ? t("search.all") : opt === "sale" ? t("search.sale") : t("search.rent")}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="col-span-2 lg:col-span-1">
              <div className="mb-2 flex items-center justify-between">
                <p className="nakma-body text-[11px] uppercase tracking-[0.2em] text-white/70">
                  {t("search.maxPrice")}
                </p>
                <span className="nakma-body text-[12px] font-medium text-white">
                  {priceLabel}
                </span>
              </div>
              <div className="flex h-[46px] items-center rounded-xl border border-white/25 bg-white/10 px-4 backdrop-blur-sm">
                <input
                  type="range"
                  min={0}
                  max={MAX_PRICE}
                  step={STEP}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/25 accent-[var(--nakma-sand)]"
                />
              </div>
            </div>

            <Stepper label={t("search.bedrooms")} value={bedrooms} onChange={setBedrooms} />
            <Stepper label={t("search.baths")} value={bathrooms} onChange={setBathrooms} />

            {/* Search button */}
            <button
              type="button"
              onClick={search}
              className="nakma-body col-span-2 flex h-[46px] items-center justify-center gap-2 rounded-xl bg-[var(--nakma-sand)] px-8 text-[12px] uppercase tracking-[0.2em] text-[var(--nakma-dark)] transition hover:opacity-90 lg:col-span-1"
            >
              <Search className="h-4 w-4" /> {t("search.btn")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

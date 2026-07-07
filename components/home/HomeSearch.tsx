"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronDown, Minus, Plus } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { PROPERTY_TYPES } from "@/types/property";

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
      <p className="nakma-body mb-2 text-[11px] uppercase tracking-[0.2em] text-[var(--nakma-dark)]/55">
        {label}
      </p>
      <div className="flex h-[46px] items-center overflow-hidden rounded-xl border border-[var(--nakma-dark)]/14">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="flex h-full w-10 items-center justify-center text-[var(--nakma-dark)]/70 transition hover:bg-[var(--nakma-dark)]/[0.04]"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="nakma-body flex h-full flex-1 min-w-[40px] items-center justify-center border-x border-[var(--nakma-dark)]/10 text-[13px] text-[var(--nakma-dark)]">
          {value === 0 ? "Any" : `${value}+`}
        </div>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="flex h-full w-10 items-center justify-center text-[var(--nakma-dark)]/70 transition hover:bg-[var(--nakma-dark)]/[0.04]"
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
  const [propertyType, setPropertyType] = useState("");
  const [interest, setInterest] = useState<"all" | "sale" | "rent">("all");
  const [price, setPrice] = useState(MAX_PRICE);
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);

  const priceLabel = useMemo(() => formatPrice(price), [price]);

  function search() {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (province) params.set("province", province);
    if (propertyType) params.set("propertyType", propertyType);
    if (interest !== "all") params.set("type", interest);
    if (price < MAX_PRICE) params.set("maxPrice", String(price));
    if (bedrooms > 0) params.set("beds", String(bedrooms));
    if (bathrooms > 0) params.set("baths", String(bathrooms));
    const qs = params.toString();
    router.push(qs ? `/listings?${qs}` : "/listings");
  }

  return (
    <section className="bg-[var(--nakma-bg)] px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <p className="nakma-body text-[11px] uppercase tracking-[0.46em] text-[var(--nakma-olive)]">
            {t("search.eyebrow")}
          </p>
          <h2 className="nakma-display mt-3 text-[30px] leading-tight tracking-[-0.02em] text-[var(--nakma-dark)] md:text-[40px]">
            {t("search.title")}
          </h2>
        </div>

        {/* Search + Location */}
        <div className="flex flex-col gap-3 rounded-2xl border border-[var(--nakma-dark)]/10 bg-white p-2 shadow-[0_10px_40px_rgba(22,17,13,0.05)] sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-3 px-3">
            <Search className="h-5 w-5 shrink-0 text-[var(--nakma-olive)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder={t("search.placeholder")}
              className="nakma-body h-[46px] w-full bg-transparent text-[14px] text-[var(--nakma-dark)] outline-none placeholder:text-[var(--nakma-dark)]/40"
            />
          </div>
          <div className="hidden h-8 w-px bg-[var(--nakma-dark)]/10 sm:block" />
          <div className="relative flex items-center">
            <MapPin className="pointer-events-none absolute left-3 h-4 w-4 text-[var(--nakma-dark)]/40" />
            <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-[var(--nakma-dark)]/40" />
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="nakma-body h-[46px] w-full cursor-pointer appearance-none rounded-xl bg-transparent pl-9 pr-9 text-[14px] text-[var(--nakma-dark)] outline-none sm:w-[200px]"
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

        {/* Controls — thin, on white */}
        <div className="mt-6 flex flex-wrap items-end gap-x-7 gap-y-5">
          {/* Interested in */}
          <div>
            <p className="nakma-body mb-2 text-[11px] uppercase tracking-[0.2em] text-[var(--nakma-dark)]/55">
              {t("search.interested")}
            </p>
            <div className="flex h-[46px] rounded-xl border border-[var(--nakma-dark)]/14 p-1">
              {(["all", "sale", "rent"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setInterest(opt)}
                  className={`nakma-body rounded-lg px-4 text-[12px] uppercase tracking-[0.1em] transition ${
                    interest === opt
                      ? "bg-[var(--nakma-dark)] text-white"
                      : "text-[var(--nakma-dark)]/55 hover:text-[var(--nakma-dark)]"
                  }`}
                >
                  {opt === "all" ? t("search.all") : opt === "sale" ? t("search.sale") : t("search.rent")}
                </button>
              ))}
            </div>
          </div>

          {/* Property Type */}
          <div>
            <p className="nakma-body mb-2 text-[11px] uppercase tracking-[0.2em] text-[var(--nakma-dark)]/55">
              {t("search.propertyType")}
            </p>
            <div className="relative flex h-[46px] items-center rounded-xl border border-[var(--nakma-dark)]/14">
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="nakma-body h-full w-full min-w-[150px] cursor-pointer appearance-none rounded-xl bg-transparent px-4 pr-9 text-[13px] text-[var(--nakma-dark)] outline-none"
              >
                <option value="">{t("search.anyType")}</option>
                {PROPERTY_TYPES.map((tp) => (
                  <option key={tp} value={tp}>{t(`type.${tp.toLowerCase()}`)}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-[var(--nakma-dark)]/40" />
            </div>
          </div>

          {/* Price */}
          <div className="min-w-[180px] flex-1">
            <div className="mb-2 flex items-center justify-between">
              <p className="nakma-body text-[11px] uppercase tracking-[0.2em] text-[var(--nakma-dark)]/55">
                {t("search.maxPrice")}
              </p>
              <span className="nakma-body text-[12px] font-medium text-[var(--nakma-dark)]">
                {priceLabel}
              </span>
            </div>
            <div className="flex h-[46px] items-center rounded-xl border border-[var(--nakma-dark)]/14 px-4">
              <input
                type="range"
                min={0}
                max={MAX_PRICE}
                step={STEP}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[var(--nakma-dark)]/12 accent-[var(--nakma-dark)]"
              />
            </div>
          </div>

          <Stepper label={t("search.bedrooms")} value={bedrooms} onChange={setBedrooms} />
          <Stepper label={t("search.baths")} value={bathrooms} onChange={setBathrooms} />

          {/* Search button — refined, not massive */}
          <button
            type="button"
            onClick={search}
            className="nakma-body flex h-[46px] items-center gap-2 rounded-xl bg-[var(--nakma-dark)] px-7 text-[11px] uppercase tracking-[0.22em] text-white transition hover:opacity-90"
          >
            <Search className="h-4 w-4" /> {t("search.btn")}
          </button>
        </div>
      </div>
    </section>
  );
}

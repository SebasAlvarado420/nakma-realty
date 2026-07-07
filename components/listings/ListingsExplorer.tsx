"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Search,
  MapPin,
  ChevronDown,
  SlidersHorizontal,
  Map as MapIcon,
  LayoutGrid,
  Minus,
  Plus,
} from "lucide-react";
import { useProperties } from "@/lib/propertiescontext";
import { useLang } from "@/lib/i18n";
import { PROPERTY_TYPES } from "@/types/property";
import PropertyCard from "@/components/property/PropertyCard";
import PriceRangeFilter from "@/components/listings/PriceRangeFilter";
import Reveal from "@/components/ui/Reveal";

const PropertiesMap = dynamic(() => import("./PropertiesMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[560px] items-center justify-center rounded-[20px] border border-[var(--nakma-dark)]/10 bg-white/50">
      <p className="nakma-body text-sm text-[var(--nakma-dark)]/50">Loading map…</p>
    </div>
  ),
});

const MIN_PRICE = 0;
const MAX_PRICE = 8_000_000;

const PROVINCES = [
  "San José",
  "Alajuela",
  "Cartago",
  "Heredia",
  "Guanacaste",
  "Puntarenas",
];

type Interest = "all" | "sale" | "rent";
type View = "list" | "map";

function parseNum(value: string) {
  return Number(String(value).replace(/[^0-9.]/g, "")) || 0;
}

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
    <div className="min-w-0">
      <p className="nakma-body mb-2 text-[12px] text-[var(--nakma-dark)]/65">{label}</p>
      <div className="flex h-[46px] items-center overflow-hidden rounded-xl border border-[rgba(22,17,13,0.14)]">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="flex h-full w-10 items-center justify-center text-[var(--nakma-dark)] transition hover:bg-[rgba(22,17,13,0.05)]"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="nakma-body flex h-full flex-1 min-w-[44px] items-center justify-center bg-[var(--nakma-dark)] text-[13px] font-medium text-white">
          {value === 0 ? "0+" : `${value}+`}
        </div>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="flex h-full w-10 items-center justify-center text-[var(--nakma-dark)] transition hover:bg-[rgba(22,17,13,0.05)]"
          aria-label={`Increase ${label}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function ListingsExplorer() {
  const { properties } = useProperties();
  const { t } = useLang();
  const sp = useSearchParams();

  const [query, setQuery] = useState(sp.get("q") ?? "");
  const [province, setProvince] = useState(sp.get("province") ?? ""); // "" = all locations
  const [propertyType, setPropertyType] = useState(sp.get("propertyType") ?? "");
  const [interest, setInterest] = useState<Interest>(
    (["sale", "rent"].includes(sp.get("type") ?? "") ? sp.get("type") : "all") as Interest
  );
  const [priceRange, setPriceRange] = useState<number[] | null>(
    sp.get("maxPrice") ? [0, Number(sp.get("maxPrice"))] : null
  );
  const [priceOpen, setPriceOpen] = useState(false);
  const [bedrooms, setBedrooms] = useState(Number(sp.get("beds")) || 0);
  const [bathrooms, setBathrooms] = useState(Number(sp.get("baths")) || 0);
  const [exclusiveOnly, setExclusiveOnly] = useState(false);
  const [landSize, setLandSize] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [view, setView] = useState<View>("list");

  // Price bounds derived from the actual listings so the histogram fills nicely.
  const histPrices = useMemo(
    () => properties.map((p) => parseNum(p.price)).filter((v) => v > 0),
    [properties]
  );
  const bounds = useMemo(() => {
    if (!histPrices.length) return { min: MIN_PRICE, max: MAX_PRICE };
    const hi = Math.ceil(Math.max(...histPrices) / 100_000) * 100_000;
    return { min: MIN_PRICE, max: Math.max(hi, 100_000) };
  }, [histPrices]);
  const priceStep = Math.max(5000, Math.round((bounds.max - bounds.min) / 200 / 5000) * 5000);
  const range = priceRange
    ? [
        Math.max(bounds.min, Math.min(priceRange[0], bounds.max)),
        Math.min(bounds.max, Math.max(priceRange[1], bounds.min)),
      ]
    : [bounds.min, bounds.max];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const minLand = parseNum(landSize);
    return properties.filter((p) => {
      const type = p.listingType ?? "sale";
      if (interest !== "all" && type !== interest) return false;
      if (q) {
        const haystack =
          `${p.title} ${p.location} ${p.province} ${p.code}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (province && p.province !== province) return false;
      if (propertyType && p.propertyType !== propertyType) return false;
      if (!p.priceOnRequest) {
        const pn = parseNum(p.price);
        if (pn < range[0] || pn > range[1]) return false;
      }
      if (p.bedrooms < bedrooms) return false;
      if (p.bathrooms < bathrooms) return false;
      if (exclusiveOnly && !p.exclusive) return false;
      if (minLand > 0 && parseNum(p.landSize) < minLand) return false;
      return true;
    });
  }, [
    properties,
    query,
    province,
    propertyType,
    interest,
    range[0],
    range[1],
    bedrooms,
    bathrooms,
    exclusiveOnly,
    landSize,
  ]);

  function reset() {
    setQuery("");
    setProvince("");
    setPropertyType("");
    setInterest("all");
    setPriceRange(null);
    setPriceOpen(false);
    setBedrooms(0);
    setBathrooms(0);
    setExclusiveOnly(false);
    setLandSize("");
  }

  return (
    <section className="bg-[var(--nakma-bg)] px-4 pb-20 pt-32 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Slim header */}
        <div className="mb-8 max-w-2xl">
          <p className="nakma-body text-[10px] uppercase tracking-[0.46em] text-[var(--nakma-olive)]">
            {t("listings.eyebrow")}
          </p>
          <h1 className="nakma-display mt-3 text-[34px] leading-[1.06] tracking-[-0.02em] text-[var(--nakma-dark)] md:text-[46px]">
            {t("listings.title")}
          </h1>
        </div>

        {/* ── Search + Locations bar ──────────────────────────── */}
        <div className="flex flex-col gap-3 rounded-[18px] border border-[var(--nakma-dark)]/8 bg-white p-3 shadow-[0_12px_40px_rgba(22,17,13,0.07)] sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-3 px-2">
            <Search className="h-5 w-5 shrink-0 text-[var(--nakma-olive)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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

        {/* ── Controls row ────────────────────────────────────── */}
        <div className="mt-4 flex flex-wrap items-end justify-center gap-x-5 gap-y-5">
          {/* Interested in */}
          <div>
            <p className="nakma-body mb-2 text-[12px] text-[var(--nakma-dark)]/65">
              {t("search.interested")}
            </p>
            <div className="relative flex h-[46px] items-center rounded-xl border border-[rgba(22,17,13,0.14)]">
              <select
                value={interest}
                onChange={(e) => setInterest(e.target.value as Interest)}
                className="nakma-body h-full w-full min-w-[128px] cursor-pointer appearance-none rounded-xl bg-transparent px-4 pr-9 text-[13px] text-[var(--nakma-dark)] outline-none"
              >
                <option value="all">{t("search.all")}</option>
                <option value="sale">{t("search.sale")}</option>
                <option value="rent">{t("search.rent")}</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-[var(--nakma-dark)]/45" />
            </div>
          </div>

          {/* Property Type */}
          <div>
            <p className="nakma-body mb-2 text-[12px] text-[var(--nakma-dark)]/65">{t("search.propertyType")}</p>
            <div className="relative flex h-[46px] items-center rounded-xl border border-[rgba(22,17,13,0.14)]">
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="nakma-body h-full w-full min-w-[140px] cursor-pointer appearance-none rounded-xl bg-transparent px-4 pr-9 text-[13px] text-[var(--nakma-dark)] outline-none"
              >
                <option value="">{t("search.anyType")}</option>
                {PROPERTY_TYPES.map((tp) => (
                  <option key={tp} value={tp}>{t(`type.${tp.toLowerCase()}`)}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-[var(--nakma-dark)]/45" />
            </div>
          </div>

          {/* Price — popover with histogram range slider */}
          <div className="relative">
            <p className="nakma-body mb-2 text-[12px] text-[var(--nakma-dark)]/65">{t("listings.price")}</p>
            <button
              type="button"
              onClick={() => setPriceOpen((o) => !o)}
              className="nakma-body flex h-[46px] min-w-[160px] items-center justify-between gap-3 rounded-xl border border-[rgba(22,17,13,0.14)] px-4 text-[13px] text-[var(--nakma-dark)] transition hover:bg-[rgba(22,17,13,0.03)]"
            >
              <span>{formatPrice(range[0])} – {formatPrice(range[1])}</span>
              <ChevronDown className={`h-4 w-4 text-[var(--nakma-dark)]/45 transition-transform ${priceOpen ? "rotate-180" : ""}`} />
            </button>
            {priceOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setPriceOpen(false)} />
                <div className="absolute left-1/2 top-full z-40 mt-2 w-[380px] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-2xl border border-[var(--nakma-dark)]/10 bg-white p-6 shadow-[0_16px_50px_rgba(22,17,13,0.16)]">
                  <PriceRangeFilter
                    value={range}
                    onChange={setPriceRange}
                    min={bounds.min}
                    max={bounds.max}
                    step={priceStep}
                    prices={histPrices}
                    t={t}
                  />
                </div>
              </>
            )}
          </div>

          <Stepper label={t("search.bedrooms")} value={bedrooms} onChange={setBedrooms} />
          <Stepper label={t("search.baths")} value={bathrooms} onChange={setBathrooms} />

          {/* Exclusive */}
          <label className="flex cursor-pointer select-none flex-col gap-2">
            <span className="nakma-body text-[12px] text-[var(--nakma-dark)]/65">
              {t("listing.exclusive")}
            </span>
            <span className="flex h-[46px] items-center">
              <input
                type="checkbox"
                checked={exclusiveOnly}
                onChange={(e) => setExclusiveOnly(e.target.checked)}
                className="h-5 w-5 cursor-pointer accent-[var(--nakma-dark)]"
              />
            </span>
          </label>

          {/* More filters */}
          <div>
            <p className="nakma-body mb-2 text-[12px] text-transparent">.</p>
            <button
              type="button"
              onClick={() => setShowMore((s) => !s)}
              className="nakma-body flex h-[46px] items-center gap-2 rounded-xl border border-[rgba(22,17,13,0.14)] px-4 text-[13px] text-[var(--nakma-dark)] transition hover:bg-[rgba(22,17,13,0.04)]"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {t("listings.moreFilters")}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${showMore ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {/* List / Map toggle */}
          <div>
            <p className="nakma-body mb-2 text-[12px] text-transparent">.</p>
            <div className="flex h-[46px] overflow-hidden rounded-xl border border-[rgba(22,17,13,0.14)]">
              <button
                type="button"
                onClick={() => setView("list")}
                className={`nakma-body flex items-center gap-2 px-4 text-[12px] uppercase tracking-[0.12em] transition ${
                  view === "list"
                    ? "bg-[var(--nakma-dark)] text-white"
                    : "text-[var(--nakma-dark)]/60"
                }`}
              >
                <LayoutGrid className="h-4 w-4" /> {t("listings.list")}
              </button>
              <button
                type="button"
                onClick={() => setView("map")}
                className={`nakma-body flex items-center gap-2 px-4 text-[12px] uppercase tracking-[0.12em] transition ${
                  view === "map"
                    ? "bg-[var(--nakma-dark)] text-white"
                    : "text-[var(--nakma-dark)]/60"
                }`}
              >
                <MapIcon className="h-4 w-4" /> {t("listings.map")}
              </button>
            </div>
          </div>
        </div>

        {/* More filters panel */}
        {showMore && (
          <div className="mt-4 rounded-2xl border border-[var(--nakma-dark)]/8 bg-white/55 p-5">
            <div className="grid gap-5 sm:max-w-md">
              <div>
                <p className="nakma-body mb-2 text-[12px] text-[var(--nakma-dark)]/65">
                  {t("listings.minLand")}
                </p>
                <input
                  value={landSize}
                  onChange={(e) => setLandSize(e.target.value)}
                  placeholder={t("listings.minLandPlaceholder")}
                  className="nakma-body h-[46px] w-full rounded-xl border border-[rgba(22,17,13,0.14)] bg-white px-4 text-[14px] text-[var(--nakma-dark)] outline-none placeholder:text-[var(--nakma-dark)]/40"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Results meta ────────────────────────────────────── */}
        <div className="mb-8 mt-10 flex items-center justify-between border-t border-[var(--nakma-dark)]/8 pt-6">
          <p className="nakma-body text-[13px] text-[var(--nakma-dark)]/60">
            {t("listings.showing")}{" "}
            <span className="font-medium text-[var(--nakma-dark)]">{filtered.length}</span>{" "}
            {filtered.length === 1 ? t("listings.propertyOne") : t("listings.propertyMany")}
          </p>
          <button
            type="button"
            onClick={reset}
            className="nakma-body text-[12px] uppercase tracking-[0.2em] text-[var(--nakma-olive)] transition hover:text-[var(--nakma-dark)]"
          >
            {t("listings.reset")}
          </button>
        </div>

        {/* ── Results ─────────────────────────────────────────── */}
        {view === "map" ? (
          <PropertiesMap properties={filtered} />
        ) : filtered.length > 0 ? (
          <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((property, i) => (
              <Reveal key={property.id} delay={(i % 3) * 0.08}>
                <PropertyCard property={property} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-[var(--nakma-dark)]/8 bg-white/40 px-6 py-16 text-center">
            <p className="nakma-display text-[22px] text-[var(--nakma-dark)]">
              {t("listings.noResults")}
            </p>
            <p className="nakma-body mt-3 text-[14px] text-[var(--nakma-dark)]/55">
              {t("listings.noResultsHint")}
            </p>
            <button
              type="button"
              onClick={reset}
              className="nakma-body mt-7 inline-flex h-[46px] items-center rounded-full bg-[var(--nakma-dark)] px-7 text-[11px] uppercase tracking-[0.24em] text-white transition hover:opacity-90"
            >
              {t("listings.reset")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

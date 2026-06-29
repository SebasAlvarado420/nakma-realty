"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  Bed,
  Bath,
  Ruler,
  Home,
  Building2,
  Bookmark,
  Share2,
  Play,
  MapPin,
  Mail,
  Phone,
  Check,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Property } from "@/types/property";
import type { TeamMember } from "@/data/team";
import { BLUR_DATA_URL } from "@/lib/constants";
import PropertyCard from "@/components/property/PropertyCard";
import BrokerContactModal from "@/components/property/BrokerContactModal";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

const PropertyMiniMap = dynamic(
  () => import("@/components/listings/PropertiesMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[340px] w-full animate-pulse rounded-[12px] bg-[var(--nakma-bg)]" />
    ),
  }
);

const SAVED_KEY = "nakma-saved";

function digits(s?: string) {
  return (s ?? "").replace(/[^0-9]/g, "");
}

function FeatureColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="nakma-display text-[16px] text-[var(--nakma-earth)]">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {items.map((f) => (
          <li
            key={f}
            className="nakma-body flex items-start gap-2 text-[13.5px] leading-snug text-[var(--nakma-dark)]/70"
          >
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--nakma-olive)]" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PropertyDetailLX({
  property,
  agent,
  related,
}: {
  property: Property;
  agent: TeamMember;
  related: Property[];
}) {
  const images = useMemo(
    () =>
      property.gallery && property.gallery.length > 0
        ? property.gallery
        : [property.image],
    [property]
  );

  const [active, setActive] = useState(0);
  const [saved, setSaved] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [paused, setPaused] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  // Auto-rotate the main photo (pauses on hover / when the lightbox is open).
  useEffect(() => {
    if (images.length < 2 || paused || lightbox) return;
    const t = setInterval(() => setActive((a) => (a + 1) % images.length), 4500);
    return () => clearInterval(t);
  }, [images.length, paused, lightbox]);

  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
      setSaved(Array.isArray(list) && list.includes(property.id));
    } catch {
      /* ignore */
    }
  }, [property.id]);

  function toggleSave() {
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

  function share() {
    const url = window.location.href;
    if (navigator.share) navigator.share({ title: property.title, url }).catch(() => {});
    else navigator.clipboard?.writeText(url).catch(() => {});
  }

  function go(dir: 1 | -1) {
    setActive((a) => (a + dir + images.length) % images.length);
  }

  // Features are fully optional and admin-driven — only show the categories
  // that actually have entries, and centre whatever's left.
  const featureGroups = [
    { title: "Internal", items: property.features?.internal ?? [] },
    { title: "External", items: property.features?.external ?? [] },
    { title: "Community", items: property.features?.community ?? [] },
  ].filter((g) => g.items.length > 0);
  const hasDescription = Boolean(property.description && property.description.trim());
  const descIsLong = (property.description ?? "").length > 320;
  const mapsUrl = property.geo
    ? `https://www.google.com/maps?q=${property.geo.lat},${property.geo.lng}`
    : `https://www.google.com/maps?q=${encodeURIComponent(property.location)}`;
  const waNumber = digits(agent.whatsapp);

  return (
    <div className="bg-white">
      {/* ── Title bar ─────────────────────────────────────────── */}
      <div className="border-b border-[var(--nakma-dark)]/8 bg-white px-6 pt-28 pb-5 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="nakma-display text-[26px] leading-tight text-[var(--nakma-dark)] md:text-[32px]">
              {property.title}{" "}
              <span className="text-[var(--nakma-dark)]/40">| {property.price}</span>
            </h1>
            <p className="nakma-body mt-1 text-[14px] text-[var(--nakma-dark)]/55">
              {property.location}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Image
              src={agent.image}
              alt={agent.name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className="nakma-body inline-flex h-[42px] items-center rounded-md bg-[var(--nakma-olive)] px-6 text-[12px] uppercase tracking-[0.18em] text-white transition hover:opacity-90"
            >
              Contact
            </button>
          </div>
        </div>
      </div>

      {/* ── Gallery ───────────────────────────────────────────── */}
      <section className="px-6 pt-6 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-3 lg:grid-cols-[1fr_300px]">
          {/* Main image — auto-rotates, click to open the lightbox */}
          <div
            className="group relative aspect-[16/10] cursor-zoom-in overflow-hidden rounded-[8px] bg-[var(--nakma-sand)]/20"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onClick={() => setLightbox(true)}
          >
            <Image
              src={images[active]}
              alt={property.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 70vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className="object-cover transition-opacity duration-300"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); go(-1); }}
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/70"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); go(1); }}
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/70"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setActive(i); }}
                      aria-label={`Photo ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all ${
                        i === active ? "w-5 bg-white" : "w-1.5 bg-white/55"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Zoom / open lightbox */}
            <span className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
              <ZoomIn className="h-4 w-4" />
            </span>
            {property.exclusive && (
              <span className="nakma-body absolute left-4 top-4 z-10 rounded-full bg-black/55 px-3 py-1 text-[9px] uppercase tracking-[0.22em] text-white backdrop-blur-sm">
                Exclusive
              </span>
            )}
          </div>

          {/* Thumbnail column */}
          <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
            {images.slice(0, 3).map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => setActive(i)}
                className={`relative aspect-[16/10] overflow-hidden rounded-[8px] transition lg:aspect-[16/9] ${
                  active === i ? "ring-2 ring-[var(--nakma-olive)]" : "opacity-90 hover:opacity-100"
                }`}
              >
                <Image
                  src={src}
                  alt={`${property.title} photo ${i + 2}`}
                  fill
                  sizes="300px"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover"
                />
                {i === 2 && images.length > 3 && (
                  <span className="nakma-body absolute inset-0 flex items-center justify-center bg-black/55 text-[12px] uppercase tracking-[0.18em] text-white">
                    + {images.length - 3} more
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Specs bar ─────────────────────────────────────────── */}
      <section className="mt-6 bg-[var(--nakma-bg)]/60 px-6 py-5 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="nakma-body text-[14px] text-[var(--nakma-dark)]/75">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {property.bedrooms > 0 && (
                <span className="inline-flex items-center gap-2">
                  <Bed className="h-4 w-4 text-[var(--nakma-dark)]/45" /> {property.bedrooms} beds
                </span>
              )}
              {property.bathrooms > 0 && (
                <span className="inline-flex items-center gap-2">
                  <Bath className="h-4 w-4 text-[var(--nakma-dark)]/45" /> {property.bathrooms} baths
                </span>
              )}
              {property.constructionSize && (
                <span className="inline-flex items-center gap-2">
                  <Home className="h-4 w-4 text-[var(--nakma-dark)]/45" /> {property.constructionSize} construction
                </span>
              )}
              {property.landSize && (
                <span className="inline-flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-[var(--nakma-dark)]/45" /> {property.landSize} property
                </span>
              )}
              {property.hoa && (
                <span className="inline-flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[var(--nakma-dark)]/45" /> HOA: {property.hoa}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/contact-us"
              className="nakma-body inline-flex h-9 items-center gap-2 rounded-md border border-[var(--nakma-dark)]/15 px-4 text-[12px] text-[var(--nakma-dark)] transition hover:bg-[var(--nakma-dark)]/5"
            >
              <Play className="h-3.5 w-3.5" /> Tour
            </Link>
            <button
              type="button"
              onClick={toggleSave}
              className="nakma-body inline-flex h-9 items-center gap-2 rounded-md border border-[var(--nakma-dark)]/15 px-4 text-[12px] text-[var(--nakma-dark)] transition hover:bg-[var(--nakma-dark)]/5"
            >
              <Bookmark
                className={`h-3.5 w-3.5 ${saved ? "fill-[var(--nakma-olive)] text-[var(--nakma-olive)]" : ""}`}
              />{" "}
              {saved ? "Saved" : "Save"}
            </button>
            <button
              type="button"
              onClick={share}
              className="nakma-body inline-flex h-9 items-center gap-2 rounded-md border border-[var(--nakma-dark)]/15 px-4 text-[12px] text-[var(--nakma-dark)] transition hover:bg-[var(--nakma-dark)]/5"
            >
              <Share2 className="h-3.5 w-3.5" /> Share
            </button>
            <span className="nakma-body ml-1 text-[12px] text-[var(--nakma-dark)]/45">
              Code: {property.code}
            </span>
          </div>
        </div>
      </section>

      {/* ── Body ──────────────────────────────────────────────── */}
      <div className="mx-auto max-w-3xl px-6 lg:px-0">
        {/* Highlights */}
        {property.highlights && property.highlights.length > 0 && (
          <section className="pt-14">
            <h2 className="nakma-display text-[24px] text-[var(--nakma-dark)]">Highlights</h2>
            <ul className="mt-5 space-y-3">
              {property.highlights.map((h) => (
                <li
                  key={h}
                  className="nakma-body flex items-start gap-3 text-[15px] leading-relaxed text-[var(--nakma-dark)]/75"
                >
                  <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--nakma-olive)]" />
                  {h}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Description — admin-written only, no filler text. */}
        {hasDescription && (
          <section className="mt-14 border-t border-[var(--nakma-dark)]/8 pt-10">
            <h2 className="nakma-display text-[24px] text-[var(--nakma-dark)]">Description</h2>
            <div
              className={`nakma-body mt-5 whitespace-pre-line text-[15px] leading-[1.85] text-[var(--nakma-dark)]/72 ${
                showFullDesc || !descIsLong ? "" : "line-clamp-[7]"
              }`}
            >
              {property.description}
            </div>
            {descIsLong && (
              <button
                type="button"
                onClick={() => setShowFullDesc((s) => !s)}
                className="nakma-body mt-4 text-[13px] uppercase tracking-[0.18em] text-[var(--nakma-olive)] underline-offset-4 hover:underline"
              >
                {showFullDesc ? "Show less" : "Show more description"}
              </button>
            )}
          </section>
        )}

        {/* Features — only the categories that have entries, centred. */}
        {featureGroups.length > 0 && (
          <section className="mt-14 border-t border-[var(--nakma-dark)]/8 pt-10">
            <h2 className="nakma-display text-[24px] text-[var(--nakma-dark)]">Features</h2>
            <div className="mt-7 flex flex-wrap justify-start gap-x-16 gap-y-9 text-left">
              {featureGroups.map((g) => (
                <div key={g.title} className="w-full sm:w-[230px]">
                  <FeatureColumn title={g.title} items={g.items} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Community */}
        {property.communityInfo && (
          <section className="mt-14 border-t border-[var(--nakma-dark)]/8 pt-10">
            <h2 className="nakma-display text-[24px] text-[var(--nakma-dark)]">
              Community:{" "}
              <span className="text-[var(--nakma-earth)]">{property.communityInfo.name}</span>
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-[200px_1fr] sm:items-start">
              {property.communityInfo.image && (
                <div className="relative aspect-[4/3] overflow-hidden rounded-[10px]">
                  <Image
                    src={property.communityInfo.image}
                    alt={property.communityInfo.name}
                    fill
                    sizes="200px"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover"
                  />
                </div>
              )}
              <p className="nakma-body text-[14.5px] leading-[1.85] text-[var(--nakma-dark)]/72">
                {property.communityInfo.description}
              </p>
            </div>
          </section>
        )}

        {/* Map */}
        <section className="mt-14 border-t border-[var(--nakma-dark)]/8 pt-10">
          <h2 className="nakma-display text-[24px] text-[var(--nakma-dark)]">Location</h2>
          <p className="nakma-body mt-3 text-[14px] text-[var(--nakma-dark)]/60">
            {property.geo?.address ?? property.location}
          </p>
          {property.geo ? (
            <div className="mt-5">
              <PropertyMiniMap properties={[property]} heightClass="h-[340px]" />
            </div>
          ) : (
            <div className="mt-5 flex h-[200px] items-center justify-center rounded-[12px] border border-[var(--nakma-dark)]/10 bg-[var(--nakma-bg)]">
              <p className="nakma-body text-[13px] text-[var(--nakma-dark)]/45">
                Location coordinates not set for this property.
              </p>
            </div>
          )}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="nakma-body mt-4 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-[var(--nakma-olive)] transition hover:text-[var(--nakma-dark)]"
          >
            <MapPin className="h-4 w-4" /> Open in Google Maps
          </a>
        </section>

        {/* Agent */}
        <section className="mt-14 border-t border-[var(--nakma-dark)]/8 pb-4 pt-10">
          <h2 className="nakma-display text-[24px] text-[var(--nakma-dark)]">Real Estate Agent</h2>
          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[10px]">
              <Image
                src={agent.image}
                alt={agent.name}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="nakma-display text-[22px] text-[var(--nakma-dark)]">{agent.name}</h3>
              <p className="nakma-body mt-0.5 text-[12px] uppercase tracking-[0.2em] text-[var(--nakma-olive)]">
                {agent.role}
              </p>
              <div className="mt-4 flex flex-col gap-2.5">
                {agent.email && (
                  <a
                    href={`mailto:${agent.email}`}
                    className="nakma-body inline-flex items-center gap-2.5 text-[14px] text-[var(--nakma-dark)]/75 transition hover:text-[var(--nakma-olive)]"
                  >
                    <Mail className="h-4 w-4 text-[var(--nakma-dark)]/40" /> {agent.email}
                  </a>
                )}
                {agent.phone && (
                  <a
                    href={`tel:${digits(agent.phone)}`}
                    className="nakma-body inline-flex items-center gap-2.5 text-[14px] text-[var(--nakma-dark)]/75 transition hover:text-[var(--nakma-olive)]"
                  >
                    <Phone className="h-4 w-4 text-[var(--nakma-dark)]/40" /> {agent.phone}
                  </a>
                )}
                {agent.whatsapp && (
                  <a
                    href={`https://wa.me/${waNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="nakma-body inline-flex w-fit items-center gap-2 rounded-full bg-[#1FA855] px-4 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-[#1c994d]"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                  </a>
                )}
                {agent.office && (
                  <p className="nakma-body inline-flex items-center gap-2.5 text-[14px] text-[var(--nakma-dark)]/55">
                    <MapPin className="h-4 w-4 text-[var(--nakma-dark)]/40" /> {agent.office}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="nakma-body mt-6 inline-flex h-[44px] items-center rounded-md bg-[var(--nakma-olive)] px-7 text-[12px] uppercase tracking-[0.18em] text-white transition hover:opacity-90"
              >
                Contact {agent.name.split(" ")[0]}
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* ── Related properties ────────────────────────────────── */}
      {related.length > 0 && (
        <section className="mt-16 bg-[var(--nakma-bg)] px-6 py-16 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="nakma-display text-[28px] text-[var(--nakma-dark)] md:text-[34px]">
              Properties you might like
            </h2>
            <div className="mt-9 grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Legal note */}
      <div className="px-6 py-8 lg:px-16">
        <p className="nakma-body mx-auto max-w-7xl text-[11px] leading-relaxed text-[var(--nakma-dark)]/35">
          All information is deemed reliable but not guaranteed and may be subject to errors,
          omissions, change of price, or withdrawal without notice.
        </p>
      </div>

      {/* ── Fullscreen lightbox ───────────────────────────────── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/92 p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            aria-label="Close"
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white transition hover:bg-white/20"
          >
            ×
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); go(-1); }}
                aria-label="Previous photo"
                className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:left-8"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); go(1); }}
                aria-label="Next photo"
                className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:right-8"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            className="relative h-[82vh] w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[active]}
              alt={property.title}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[12px] tracking-[0.2em] text-white/60">
            {active + 1} / {images.length}
          </p>
        </div>
      )}

      {/* ── Broker contact pop-up ─────────────────────────────── */}
      {contactOpen && (
        <BrokerContactModal
          agent={agent}
          property={property}
          onClose={() => setContactOpen(false)}
        />
      )}
    </div>
  );
}

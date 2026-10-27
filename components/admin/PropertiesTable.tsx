"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Pencil, Trash2, Archive, Plus, Search, Languages, Star, Tag } from "lucide-react";
import { useProperties } from "@/lib/propertiescontext";
import { logActivity } from "@/lib/activity-api";
import { BLUR_DATA_URL } from "@/lib/constants";
import type { Property } from "@/types/property";

function money(p: Property): string {
  if (p.priceOnRequest) return "Price on request";
  const fmt = (v?: string) => {
    const n = Number(String(v ?? "").replace(/[^0-9.]/g, ""));
    return n
      ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n)
      : v ?? "—";
  };
  if (p.listingType === "both") return `${fmt(p.price)}${p.rentPrice ? ` · ${fmt(p.rentPrice)}` : ""}`;
  if (p.listingType === "rent" && p.rentPrice) return `${fmt(p.rentPrice)}/mo`;
  const base = fmt(p.price);
  return p.priceStartingFrom ? `From ${base}` : base;
}

function Pill({ children, tone = "dark" }: { children: React.ReactNode; tone?: "dark" | "gold" | "wine" }) {
  const bg = tone === "wine" ? "bg-[#7a2438]" : tone === "gold" ? "bg-[#8b6d3b]" : "bg-black/55";
  return (
    <span className={`nakma-body rounded-full ${bg} px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] text-white backdrop-blur-sm`}>
      {children}
    </span>
  );
}

export default function PropertiesTable() {
  const { properties, archivedProperties, loading, deleteProperty, archiveProperty, updateProperty } =
    useProperties();
  const [busy, setBusy] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [province, setProvince] = useState(""); // "" = all
  const [translating, setTranslating] = useState(false);
  const [progress, setProgress] = useState("");

  // Province filter chips with live counts.
  const chips = useMemo(() => {
    const m = new Map<string, number>();
    properties.forEach((p) => {
      const key = p.province || "Other";
      m.set(key, (m.get(key) ?? 0) + 1);
    });
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [properties]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return properties.filter((p) => {
      if (province && p.province !== province) return false;
      if (term) {
        const hay = `${p.title} ${p.location} ${p.code} ${p.province}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [properties, q, province]);

  async function onDelete(id: string, title: string) {
    if (
      !window.confirm(
        `Permanently delete "${title}"? This cannot be undone.\n\nTip: use Archive instead to hide it but keep its NK code and restore it later.`
      )
    )
      return;
    setBusy(id);
    try {
      await deleteProperty(id);
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Could not delete.");
    } finally {
      setBusy(null);
    }
  }

  async function onArchive(id: string) {
    setBusy(id);
    try {
      await archiveProperty(id);
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Could not archive.");
    } finally {
      setBusy(null);
    }
  }

  async function translateAll() {
    if (properties.length === 0) return;
    if (
      !window.confirm(
        `Auto-translate all ${properties.length} properties to English & Spanish with DeepL? This runs once and may take a minute.`
      )
    )
      return;
    setTranslating(true);
    let done = 0;
    for (const p of properties) {
      setProgress(`Translating ${done + 1}/${properties.length}: ${p.title}`);
      try {
        const res = await fetch("/api/translate-property", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: p.title,
            description: p.description,
            location: p.location,
            highlights: p.highlights,
            features: p.features,
            communityName: p.communityInfo?.name,
            communityDescription: p.communityInfo?.description,
          }),
        });
        const json = await res.json();
        if (json && (json.en || json.es)) {
          await updateProperty(p.id, { ...p, translations: json }, { silent: true });
        }
      } catch {
        /* keep going */
      }
      done++;
    }
    setTranslating(false);
    setProgress("");
    void logActivity({
      action: "translated",
      entity: "catalog",
      entityLabel: `${done} properties → EN/ES`,
    });
    window.alert(`Done — translated ${done} properties to EN/ES.`);
  }

  const chipCls = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-[12px] font-medium transition ${
      active
        ? "border-[#163126] bg-[#163126] text-white"
        : "border-[#dfe5e0] bg-white text-[#5d7268] hover:border-[#163126]/40"
    }`;

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 rounded-[24px] border border-[#ece6da] bg-white p-4 shadow-[0_10px_30px_rgba(22,49,38,0.05)] md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-[#dfe5e0] px-3">
          <Search className="h-4 w-4 text-[#8b6d3b]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, location, or NK code…"
            className="h-[42px] w-full bg-transparent text-[14px] text-[#163126] outline-none placeholder:text-[#9ba0a4]"
          />
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={translateAll}
            disabled={translating || properties.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-[#dfe5e0] px-4 py-2.5 text-[12px] font-semibold text-[#163126] transition hover:bg-[#f7f2e8] disabled:opacity-40"
            title="Auto-translate every property to EN & ES (DeepL)"
          >
            <Languages className="h-4 w-4" />
            {translating ? "Translating…" : "Translate all"}
          </button>
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[#163126] px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-white transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Add
          </Link>
        </div>
      </div>

      {progress && <p className="text-[12px] font-medium text-[#8b6d3b]">{progress}</p>}

      {/* Province filter chips + archived link */}
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setProvince("")} className={chipCls(province === "")}>
          All ({properties.length})
        </button>
        {chips.map(([name, count]) => (
          <button
            key={name}
            type="button"
            onClick={() => setProvince(name === province ? "" : name)}
            className={chipCls(province === name)}
          >
            {name} ({count})
          </button>
        ))}
        <Link
          href="/admin/archived"
          className="ml-auto text-[13px] font-medium text-[#8b6d3b] hover:underline"
        >
          Archived ({archivedProperties.length}) →
        </Link>
      </div>

      {/* Card grid */}
      {!loading && filtered.length === 0 ? (
        <div className="rounded-[24px] border border-[#ece6da] bg-white px-6 py-16 text-center">
          <p className="text-[15px] text-[#5d7268]">
            {properties.length === 0 ? "No properties yet. Add your first one." : "No properties match this filter."}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="group overflow-hidden rounded-[20px] border border-[#ece6da] bg-white shadow-[0_8px_24px_rgba(22,49,38,0.05)] transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(22,49,38,0.10)]"
            >
              <Link href={`/admin/properties/${p.id}/edit`} className="block">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#f0ece3]">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 320px"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                    {p.status && <Pill tone="wine">{p.status === "sold" ? "Sold" : "Rented"}</Pill>}
                    {p.exclusive && <Pill>Exclusive</Pill>}
                    {p.listingType === "rent" && <Pill>For Rent</Pill>}
                    {p.listingType === "both" && <Pill>Sale & Rent</Pill>}
                  </div>
                  <span className="nakma-body absolute right-3 top-3 rounded-full bg-black/60 px-2 py-1 text-[10px] font-medium tracking-wide text-white backdrop-blur-sm">
                    {p.code}
                  </span>
                  {p.featured && (
                    <span className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#8b6d3b] text-white" title="Featured">
                      <Star className="h-3.5 w-3.5 fill-white" />
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-1 text-[15px] font-semibold text-[#163126]">{p.title}</h3>
                  <p className="mt-0.5 line-clamp-1 text-[12px] text-[#5d7268]">{p.location || p.province}</p>
                  <p className="mt-2.5 text-[15px] font-semibold text-[#163126]">{money(p)}</p>
                </div>
              </Link>

              {/* Action bar */}
              <div className="flex items-center justify-between border-t border-[#eef2ed] px-4 py-2.5">
                <Link
                  href={`/admin/properties/${p.id}/edit`}
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#163126] hover:text-[#8b6d3b]"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Link>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onArchive(p.id)}
                    disabled={busy === p.id}
                    title="Archive"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5d7268] transition hover:bg-[#f7f2e8] hover:text-[#163126] disabled:opacity-40"
                  >
                    <Archive className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(p.id, p.title)}
                    disabled={busy === p.id}
                    title="Delete"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="flex items-center gap-1.5 text-[12px] text-[#5d7268]">
        <Tag className="h-3.5 w-3.5" />
        Showing {filtered.length} of {properties.length} active {properties.length === 1 ? "property" : "properties"}.
        Click any card to open and edit its full details.
      </p>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useProperties } from "@/lib/propertiescontext";
import { uploadMedia } from "@/lib/properties-api";
import { teamMembers } from "@/data/team";
import type { Property } from "@/types/property";

const PROVINCES = [
  "San José",
  "Alajuela",
  "Cartago",
  "Heredia",
  "Guanacaste",
  "Puntarenas",
];

const DEFAULT_IMG =
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80";

type FormState = {
  title: string;
  slug: string;
  location: string;
  province: string;
  agentId: string;
  listingType: string;
  price: string;
  rentPrice: string;
  featured: string;
  exclusive: string;
  landSize: string;
  constructionSize: string;
  bedrooms: string;
  bathrooms: string;
  hoa: string;
  address: string;
  lat: string;
  lng: string;
  image: string;
  gallery: string;
  video: string;
  highlights: string;
  description: string;
  featInternal: string;
  featExternal: string;
  featCommunity: string;
};

const emptyForm: FormState = {
  title: "", slug: "", location: "", province: "", agentId: "",
  listingType: "sale", price: "", rentPrice: "", featured: "No", exclusive: "No",
  landSize: "", constructionSize: "", bedrooms: "", bathrooms: "",
  hoa: "", address: "", lat: "", lng: "",
  image: "", gallery: "", video: "", highlights: "", description: "",
  featInternal: "", featExternal: "", featCommunity: "",
};

const inputCls =
  "h-[46px] w-full rounded-xl border border-[#dfe5e0] bg-white px-4 text-[14px] text-[#163126] outline-none transition focus:border-[#8b6d3b]";
const areaCls =
  "min-h-[96px] w-full rounded-xl border border-[#dfe5e0] bg-white px-4 py-3 text-[14px] text-[#163126] outline-none transition focus:border-[#8b6d3b]";

function lines(v: string) {
  return v.split("\n").map((s) => s.trim()).filter(Boolean);
}
const stripUnit = (v?: string) => (v ?? "").replace(/\s*m²\s*$/i, "").trim();
const stripDollar = (v?: string) => (v ?? "").replace(/^\$/, "").trim();

// Group a numeric string with thousands separators as the user types
// (e.g. "1000000" → "1,000,000"). Keeps a single optional decimal part.
function withCommas(raw: string) {
  const cleaned = (raw ?? "").replace(/[^0-9.]/g, "");
  if (!cleaned) return "";
  const [intPart, ...rest] = cleaned.split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return rest.length ? `${grouped}.${rest.join("")}` : grouped;
}

function fromProperty(p: Property): FormState {
  return {
    title: p.title ?? "",
    slug: p.slug ?? "",
    location: p.location ?? "",
    province: p.province ?? "",
    agentId: p.agentId ?? "",
    listingType: p.listingType ?? "sale",
    price: withCommas(stripDollar(p.price)),
    rentPrice: p.rentPrice ?? "",
    featured: p.featured ? "Yes" : "No",
    exclusive: p.exclusive ? "Yes" : "No",
    landSize: stripUnit(p.landSize),
    constructionSize: stripUnit(p.constructionSize),
    bedrooms: p.bedrooms ? String(p.bedrooms) : "",
    bathrooms: p.bathrooms ? String(p.bathrooms) : "",
    hoa: p.hoa ?? "",
    address: p.geo?.address ?? "",
    lat: p.geo ? String(p.geo.lat) : "",
    lng: p.geo ? String(p.geo.lng) : "",
    image: p.image ?? "",
    gallery: (p.gallery ?? []).join("\n"),
    video: p.video ?? "",
    highlights: (p.highlights ?? []).join("\n"),
    description: p.description ?? "",
    featInternal: (p.features?.internal ?? []).join("\n"),
    featExternal: (p.features?.external ?? []).join("\n"),
    featCommunity: (p.features?.community ?? []).join("\n"),
  };
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-medium text-[#163126]">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11.5px] text-[#5d7268]">{hint}</span>}
    </label>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[24px] border border-[#ece6da] bg-white p-6 shadow-[0_10px_30px_rgba(22,49,38,0.06)] md:p-8">
      <h2 className="text-[19px] font-semibold text-[#163126]">{title}</h2>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export default function PropertyForm({ existing }: { existing?: Property }) {
  const router = useRouter();
  const { properties, archivedProperties, addProperty, updateProperty } = useProperties();
  const isEdit = Boolean(existing);
  const [form, setForm] = useState<FormState>(existing ? fromProperty(existing) : emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Auto code: take the lowest free NK slot. Archived listings keep their code,
  // so we count them as "used" too — a new property never reuses an archived
  // property's unique code.
  const code = useMemo(() => {
    if (existing) return existing.code;
    const used = new Set(
      [...properties, ...archivedProperties]
        .map((p) => {
          const m = /^NK(\d+)$/i.exec((p.code ?? "").trim());
          return m ? parseInt(m[1], 10) : -1;
        })
        .filter((n) => n > 0)
    );
    let n = 1;
    while (used.has(n)) n++;
    return `NK${String(n).padStart(2, "0")}`;
  }, [properties, archivedProperties, existing]);

  const galleryUrls = lines(form.gallery);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    // Live thousands separators for the money fields.
    const next = name === "price" || name === "landSize" || name === "constructionSize"
      ? withCommas(value)
      : value;
    setForm((prev) => ({ ...prev, [name]: next }));
  }

  async function handleMainImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadMedia(file);
      setForm((prev) => ({ ...prev, image: url, gallery: [url, ...lines(prev.gallery)].join("\n") }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleGalleryFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const urls = await Promise.all(files.map((f) => uploadMedia(f)));
      setForm((prev) => ({
        ...prev,
        image: prev.image || urls[0],
        gallery: [...lines(prev.gallery), ...urls].join("\n"),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeGalleryImage(url: string) {
    setForm((prev) => {
      const remaining = lines(prev.gallery).filter((g) => g !== url);
      return { ...prev, gallery: remaining.join("\n"), image: prev.image === url ? remaining[0] ?? "" : prev.image };
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) return setError("Add a property title.");
    if (!form.province) return setError("Select a province.");

    const features = {
      internal: lines(form.featInternal),
      external: lines(form.featExternal),
      community: lines(form.featCommunity),
    };
    const hasFeatures =
      features.internal.length + features.external.length + features.community.length > 0;
    const hasGeo = form.address.trim() || form.lat.trim() || form.lng.trim();
    const price = withCommas(form.price);

    const data = {
      title: form.title.trim(),
      location: form.location.trim(),
      province: form.province,
      agentId: form.agentId || undefined,
      listingType: (form.listingType === "rent" ? "rent" : "sale") as "sale" | "rent",
      price: price ? `$${price}` : "",
      rentPrice: form.rentPrice.trim() || undefined,
      featured: form.featured === "Yes",
      exclusive: form.exclusive === "Yes",
      landSize: form.landSize.trim() ? `${form.landSize.trim()} m²` : "",
      constructionSize: form.constructionSize.trim() ? `${form.constructionSize.trim()} m²` : "",
      bedrooms: Number(form.bedrooms || 0),
      bathrooms: Number(form.bathrooms || 0),
      hoa: form.hoa.trim() || undefined,
      image: form.image || galleryUrls[0] || DEFAULT_IMG,
      gallery: galleryUrls,
      video: form.video.trim(),
      highlights: lines(form.highlights),
      features: hasFeatures ? features : undefined,
      geo: hasGeo
        ? { address: form.address.trim(), lat: Number(form.lat) || 0, lng: Number(form.lng) || 0 }
        : undefined,
      description: form.description,
    };

    setSubmitting(true);
    try {
      if (existing) {
        await updateProperty(existing.id, { ...existing, ...data });
      } else {
        await addProperty({ code, slug: form.slug, ...data });
      }
      router.push("/admin/properties");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <form className="grid gap-7" onSubmit={handleSubmit}>
      <p className="-mb-2 text-[13px] text-[#5d7268]">
        Only <span className="font-medium text-[#163126]">Title</span> and{" "}
        <span className="font-medium text-[#163126]">Province</span> are required — fill in
        whatever else applies to this property.
      </p>

      <Card title="Basic Information">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Property Code" hint={isEdit ? "Fixed for this property." : "Assigned automatically — reuses freed numbers."}>
            <div className="flex h-[46px] items-center gap-2 rounded-xl border border-dashed border-[#c9bfae] bg-[#faf6ec] px-4">
              <span className="text-[15px] font-semibold tracking-wide text-[#163126]">{code}</span>
              {!isEdit && (
                <span className="rounded-full bg-[#8b6d3b]/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-[#8b6d3b]">Auto</span>
              )}
            </div>
          </Field>
          <Field label="Property Title *">
            <input name="title" value={form.title} onChange={handleChange} className={inputCls} placeholder="e.g. Oceanfront Estate" required />
          </Field>
          <Field label="Slug" hint="Optional — auto-generated from the title.">
            <input name="slug" value={form.slug} onChange={handleChange} className={inputCls} placeholder="oceanfront-estate" disabled={isEdit} />
          </Field>
          <Field label="Location">
            <input name="location" value={form.location} onChange={handleChange} className={inputCls} placeholder="e.g. Tamarindo, Guanacaste" />
          </Field>
          <Field label="Province *">
            <select name="province" value={form.province} onChange={handleChange} className={inputCls} required>
              <option value="">Select a province</option>
              {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Selling Agent">
            <select name="agentId" value={form.agentId} onChange={handleChange} className={inputCls}>
              <option value="">Select agent</option>
              {teamMembers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </Field>
        </div>
      </Card>

      <Card title="Listing & Status">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Type">
            <select name="listingType" value={form.listingType} onChange={handleChange} className={inputCls}>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </Field>
          <Field label="Price (USD)">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-medium text-[#163126]">$</span>
              <input name="price" value={form.price} onChange={handleChange} inputMode="numeric" className={`${inputCls} pl-8`} placeholder="1,250,000" />
            </div>
          </Field>
          <Field label="Rent Price" hint="Optional — only for rentals.">
            <input name="rentPrice" value={form.rentPrice} onChange={handleChange} className={inputCls} placeholder="$4,500/mo" />
          </Field>
          <div className="grid grid-cols-2 gap-5">
            <Field label="Featured">
              <select name="featured" value={form.featured} onChange={handleChange} className={inputCls}>
                <option value="No">No</option><option value="Yes">Yes</option>
              </select>
            </Field>
            <Field label="Exclusive">
              <select name="exclusive" value={form.exclusive} onChange={handleChange} className={inputCls}>
                <option value="No">No</option><option value="Yes">Yes</option>
              </select>
            </Field>
          </div>
        </div>
      </Card>

      <Card title="Size & Details">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Land Size">
            <div className="relative">
              <input name="landSize" value={form.landSize} onChange={handleChange} inputMode="numeric" className={`${inputCls} pr-12`} placeholder="1,200" />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#5d7268]">m²</span>
            </div>
          </Field>
          <Field label="Construction Size" hint="Leave empty for lots / land with no construction.">
            <div className="relative">
              <input name="constructionSize" value={form.constructionSize} onChange={handleChange} inputMode="numeric" className={`${inputCls} pr-12`} placeholder="420" />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#5d7268]">m²</span>
            </div>
          </Field>
          <Field label="Bedrooms" hint="Decimals allowed (e.g. 1.5).">
            <input name="bedrooms" value={form.bedrooms} onChange={handleChange} type="number" min="0" step="0.5" className={inputCls} placeholder="4" />
          </Field>
          <Field label="Bathrooms" hint="Decimals allowed (e.g. 2.5 = half bath).">
            <input name="bathrooms" value={form.bathrooms} onChange={handleChange} type="number" min="0" step="0.5" className={inputCls} placeholder="2.5" />
          </Field>
          <Field label="HOA / Fee">
            <input name="hoa" value={form.hoa} onChange={handleChange} className={inputCls} placeholder="$300/mo" />
          </Field>
        </div>
      </Card>

      <Card title="Photos">
        <p className="-mt-2 mb-5 text-[13px] text-[#5d7268]">
          Upload as many photos as you like — they go straight to the cloud and become the
          property&apos;s carousel.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <label className="cursor-pointer rounded-xl bg-[#163126] px-5 py-3 text-[13px] font-semibold text-white transition hover:opacity-90">
            Upload photos
            <input type="file" accept="image/*" multiple onChange={handleGalleryFiles} className="hidden" />
          </label>
          <label className="cursor-pointer rounded-xl border border-[#dfe5e0] px-5 py-3 text-[13px] font-medium text-[#163126] transition hover:bg-[#f7f2e8]">
            Set main photo
            <input type="file" accept="image/*" onChange={handleMainImage} className="hidden" />
          </label>
          {uploading && <span className="text-[13px] text-[#8b6d3b]">Uploading…</span>}
        </div>

        {galleryUrls.length > 0 && (
          <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {galleryUrls.map((url) => (
              <div key={url} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-[#ece6da]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
                {form.image === url && (
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-[#163126] px-2 py-0.5 text-[9px] uppercase tracking-wide text-white">Main</span>
                )}
                <button type="button" onClick={() => removeGalleryImage(url)} className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-[14px] leading-none text-white opacity-0 transition group-hover:opacity-100" aria-label="Remove photo">×</button>
                {form.image !== url && (
                  <button type="button" onClick={() => setForm((prev) => ({ ...prev, image: url }))} className="absolute inset-x-0 bottom-0 bg-black/55 py-1 text-[10px] uppercase tracking-wide text-white opacity-0 transition group-hover:opacity-100">Make main</button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-5">
          <Field label="…or paste image URLs (one per line)">
            <textarea name="gallery" value={form.gallery} onChange={handleChange} className={areaCls} placeholder="https://…" />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Video URL (optional)">
            <input name="video" value={form.video} onChange={handleChange} className={inputCls} placeholder="https://… (YouTube, Vimeo, CDN)" />
          </Field>
        </div>
      </Card>

      <Card title="Highlights & Description">
        <div className="grid gap-5">
          <Field label="Highlights" hint="One bullet per line.">
            <textarea name="highlights" value={form.highlights} onChange={handleChange} className={areaCls} placeholder={"Direct beach access\nInfinity-edge pool\n…"} />
          </Field>
          <Field label="Description">
            <textarea name="description" value={form.description} onChange={handleChange} className={`${areaCls} min-h-[150px]`} placeholder="Full description of the property…" />
          </Field>
        </div>
      </Card>

      <Card title="Features">
        <p className="-mt-2 mb-5 text-[13px] text-[#5d7268]">All optional — one feature per line in each column.</p>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Internal"><textarea name="featInternal" value={form.featInternal} onChange={handleChange} className={areaCls} placeholder={"A/C\nHigh ceilings\n…"} /></Field>
          <Field label="External"><textarea name="featExternal" value={form.featExternal} onChange={handleChange} className={areaCls} placeholder={"Private pool\nGardens\n…"} /></Field>
          <Field label="Community"><textarea name="featCommunity" value={form.featCommunity} onChange={handleChange} className={areaCls} placeholder={"Gated\n24/7 security\n…"} /></Field>
        </div>
      </Card>

      <Card title="Location (for the map)">
        <div className="grid gap-5">
          <Field label="Full address / area">
            <input name="address" value={form.address} onChange={handleChange} className={inputCls} placeholder="Tamarindo, Guanacaste, Costa Rica" />
          </Field>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Latitude"><input name="lat" value={form.lat} onChange={handleChange} className={inputCls} placeholder="10.2993" /></Field>
            <Field label="Longitude"><input name="lng" value={form.lng} onChange={handleChange} className={inputCls} placeholder="-85.8371" /></Field>
          </div>
          <p className="text-[12.5px] text-[#5d7268]">Tip: open Google Maps, right-click the exact spot, and click the coordinates to copy them.</p>
        </div>
      </Card>

      {error && <p className="rounded-2xl bg-red-50 px-5 py-3 text-sm text-red-700">{error}</p>}

      <div className="flex items-center justify-end gap-4">
        <span className="text-[13px] text-[#5d7268]">{isEdit ? `Editing ${code}` : `Saving as ${code}`}</span>
        <button type="submit" disabled={submitting || uploading} className="rounded-2xl bg-[#163126] px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:opacity-90 disabled:opacity-50">
          {submitting ? "Saving…" : isEdit ? "Save Changes" : "Publish Property"}
        </button>
      </div>
    </form>
  );
}

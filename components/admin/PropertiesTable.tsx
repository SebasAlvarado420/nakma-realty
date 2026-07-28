"use client";

import Link from "next/link";
import { useState } from "react";
import { useProperties } from "@/lib/propertiescontext";

export default function PropertiesTable() {
  const { properties, archivedProperties, loading, deleteProperty, archiveProperty, updateProperty } =
    useProperties();
  const [busy, setBusy] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [progress, setProgress] = useState("");

  const untranslated = properties.filter((p) => !p.translations);

  async function translateAll() {
    if (untranslated.length === 0) {
      window.alert("All properties are already translated.");
      return;
    }
    if (
      !window.confirm(
        `Auto-translate ${untranslated.length} properties to English & Spanish with DeepL? This runs once and may take a minute.`
      )
    )
      return;
    setTranslating(true);
    let done = 0;
    for (const p of untranslated) {
      setProgress(`Translating ${done + 1}/${untranslated.length}: ${p.title}`);
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
          await updateProperty(p.id, { ...p, translations: json });
        }
      } catch {
        /* skip this one, keep going */
      }
      done++;
    }
    setTranslating(false);
    setProgress("");
    window.alert(`Done — translated ${done} properties to EN/ES.`);
  }

  async function onDelete(id: string, title: string) {
    if (!window.confirm(`Permanently delete "${title}"? This cannot be undone.\n\nTip: use Archive instead to hide it but keep its NK code and restore it later.`)) return;
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

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] text-[#5d7268]">
          {properties.length} active {properties.length === 1 ? "property" : "properties"}
        </p>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={translateAll}
            disabled={translating || untranslated.length === 0}
            className="rounded-full bg-[#163126] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition hover:opacity-90 disabled:opacity-40"
            title="Auto-translate every property to English & Spanish (DeepL)"
          >
            {translating ? "Translating…" : `Translate all → EN/ES (${untranslated.length})`}
          </button>
          <Link
            href="/admin/archived"
            className="text-[13px] font-medium text-[#8b6d3b] hover:underline"
          >
            Archived ({archivedProperties.length}) →
          </Link>
        </div>
      </div>
      {progress && <p className="text-[12px] text-[#8b6d3b]">{progress}</p>}

      <div className="overflow-hidden rounded-[28px] bg-white shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-[#163126] text-white">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em]">Code</th>
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em]">Title</th>
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em]">Province</th>
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em]">Price</th>
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em]">Featured</th>
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property.id} className="border-t border-[#eef2ed]">
                  <td className="px-6 py-4 text-sm text-[#163126]">{property.code}</td>
                  <td className="px-6 py-4 text-sm text-[#163126]">{property.title}</td>
                  <td className="px-6 py-4 text-sm text-[#5d7268]">{property.province}</td>
                  <td className="px-6 py-4 text-sm text-[#163126]">{property.price}</td>
                  <td className="px-6 py-4 text-sm text-[#5d7268]">
                    {property.featured ? "Yes" : "No"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/listings/${property.slug}`}
                        className="font-medium text-[#8b6d3b] hover:underline"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/properties/${property.id}/edit`}
                        className="font-medium text-[#163126] hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => onArchive(property.id)}
                        disabled={busy === property.id}
                        className="font-medium text-[#8b6d3b] hover:underline disabled:opacity-40"
                      >
                        {busy === property.id ? "…" : "Archive"}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(property.id, property.title)}
                        disabled={busy === property.id}
                        className="font-medium text-red-600 hover:underline disabled:opacity-40"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && properties.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-[#5d7268]">
                    No properties yet. Add your first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

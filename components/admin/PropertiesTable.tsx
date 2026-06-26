"use client";

import Link from "next/link";
import { useState } from "react";
import { useProperties } from "@/lib/propertiescontext";

export default function PropertiesTable() {
  const { properties, archivedProperties, loading, deleteProperty, archiveProperty } =
    useProperties();
  const [busy, setBusy] = useState<string | null>(null);

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
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-[#5d7268]">
          {properties.length} active {properties.length === 1 ? "property" : "properties"}
        </p>
        <Link
          href="/admin/archived"
          className="text-[13px] font-medium text-[#8b6d3b] hover:underline"
        >
          Archived ({archivedProperties.length}) →
        </Link>
      </div>

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

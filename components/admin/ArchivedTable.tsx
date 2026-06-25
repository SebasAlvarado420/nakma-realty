"use client";

import Link from "next/link";
import { useState } from "react";
import { useProperties } from "@/lib/propertiescontext";

export default function ArchivedTable() {
  const { archivedProperties, loading, restoreProperty, deleteProperty } =
    useProperties();
  const [busy, setBusy] = useState<string | null>(null);

  async function onRestore(id: string) {
    setBusy(id);
    try {
      await restoreProperty(id);
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Could not restore.");
    } finally {
      setBusy(null);
    }
  }

  async function onDelete(id: string, title: string) {
    if (!window.confirm(`Permanently delete "${title}"? This frees its NK code and cannot be undone.`)) return;
    setBusy(id);
    try {
      await deleteProperty(id);
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Could not delete.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-[#5d7268]">
          {archivedProperties.length} archived{" "}
          {archivedProperties.length === 1 ? "property" : "properties"} — each keeps its NK
          code and can be re-published anytime.
        </p>
        <Link href="/admin/properties" className="text-[13px] font-medium text-[#8b6d3b] hover:underline">
          ← Back to active
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
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {archivedProperties.map((property) => (
                <tr key={property.id} className="border-t border-[#eef2ed]">
                  <td className="px-6 py-4 text-sm text-[#163126]">{property.code}</td>
                  <td className="px-6 py-4 text-sm text-[#163126]">{property.title}</td>
                  <td className="px-6 py-4 text-sm text-[#5d7268]">{property.province}</td>
                  <td className="px-6 py-4 text-sm text-[#163126]">{property.price}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => onRestore(property.id)}
                        disabled={busy === property.id}
                        className="font-medium text-[#163126] hover:underline disabled:opacity-40"
                      >
                        {busy === property.id ? "…" : "Re-publish"}
                      </button>
                      <Link
                        href={`/admin/properties/${property.id}/edit`}
                        className="font-medium text-[#8b6d3b] hover:underline"
                      >
                        Edit
                      </Link>
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
              {!loading && archivedProperties.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-[#5d7268]">
                    No archived properties. Archive a listing to hide it from the site while
                    keeping its NK code.
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

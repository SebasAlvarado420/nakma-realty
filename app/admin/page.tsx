"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Star,
  Tag,
  BadgeCheck,
  Archive,
  Wallet,
  Home,
  KeyRound,
  ArrowRight,
  History,
} from "lucide-react";
import { useProperties } from "@/lib/propertiescontext";
import { fetchActivityLogs, type ActivityLog } from "@/lib/activity-api";
import type { Property } from "@/types/property";

function parsePrice(p: Property): number {
  if (p.priceOnRequest) return 0;
  const n = Number(String(p.price ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    notation: n >= 1_000_000 ? "compact" : "standard",
  }).format(n);

const ACTION_META: Record<string, { label: string; dot: string }> = {
  created: { label: "Creó", dot: "bg-emerald-500" },
  updated: { label: "Editó", dot: "bg-sky-500" },
  deleted: { label: "Eliminó", dot: "bg-red-500" },
  archived: { label: "Archivó", dot: "bg-amber-500" },
  restored: { label: "Restauró", dot: "bg-indigo-500" },
  settings_updated: { label: "Actualizó datos", dot: "bg-[#8b6d3b]" },
  translated: { label: "Tradujo", dot: "bg-fuchsia-500" },
};

function timeAgo(iso: string): string {
  const d = new Date(iso).getTime();
  if (!Number.isFinite(d)) return "";
  const s = Math.max(1, Math.round((Date.now() - d) / 1000));
  if (s < 60) return "hace un momento";
  const m = Math.round(s / 60);
  if (m < 60) return `hace ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `hace ${h} h`;
  const days = Math.round(h / 24);
  if (days < 30) return `hace ${days} d`;
  return new Date(iso).toLocaleDateString("es-CR");
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  tone = "default",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  sub?: string;
  tone?: "default" | "dark" | "gold";
}) {
  const card =
    tone === "dark"
      ? "bg-[#163126] text-white"
      : tone === "gold"
      ? "bg-[#8b6d3b] text-white"
      : "bg-white text-[#163126]";
  const iconWrap =
    tone === "default" ? "bg-[#f7f2e8] text-[#8b6d3b]" : "bg-white/15 text-white";
  const subCls = tone === "default" ? "text-[#5d7268]" : "text-white/70";
  return (
    <div className={`rounded-[20px] ${card} p-5 shadow-[0_8px_24px_rgba(22,49,38,0.06)]`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-[12px] font-medium ${subCls}`}>{label}</p>
          <p className="mt-2 text-[28px] font-semibold leading-none">{value}</p>
          {sub && <p className={`mt-2 text-[11px] ${subCls}`}>{sub}</p>}
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconWrap}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { properties, archivedProperties, loading } = useProperties();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchActivityLogs(8)
      .then((l) => alive && setLogs(l))
      .finally(() => alive && setLogsLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const stats = useMemo(() => {
    const forSale = properties.filter(
      (p) => (p.listingType ?? "sale") === "sale"
    ).length;
    const forRent = properties.filter((p) => p.listingType === "rent").length;
    const both = properties.filter((p) => p.listingType === "both").length;
    const sold = properties.filter((p) => p.status === "sold").length;
    const rented = properties.filter((p) => p.status === "rented").length;
    const value = properties.reduce((sum, p) => sum + parsePrice(p), 0);
    const byProvince = new Map<string, number>();
    properties.forEach((p) => {
      const k = p.province || "Otra";
      byProvince.set(k, (byProvince.get(k) ?? 0) + 1);
    });
    return {
      active: properties.length,
      featured: properties.filter((p) => p.featured).length,
      exclusive: properties.filter((p) => p.exclusive).length,
      forSale,
      forRent,
      both,
      sold,
      rented,
      value,
      byProvince: [...byProvince.entries()].sort((a, b) => b[1] - a[1]),
    };
  }, [properties]);

  const maxProv = Math.max(1, ...stats.byProvince.map(([, c]) => c));

  return (
    <section className="px-6 pt-10 pb-20 md:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-[0.28em] text-[#8b6d3b]">
          Panel administrativo
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-[#163126] md:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 text-[15px] text-[#5d7268]">
          Resumen de la cartera NAKMA en tiempo real.
        </p>

        {/* Stat cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Building2}
            label="Propiedades activas"
            value={loading ? "…" : stats.active}
            tone="dark"
            sub={`${stats.forSale} venta · ${stats.forRent} alquiler · ${stats.both} ambos`}
          />
          <StatCard
            icon={Wallet}
            label="Valor de cartera"
            value={loading ? "…" : usd(stats.value)}
            tone="gold"
            sub="Suma de precios publicados"
          />
          <StatCard
            icon={Star}
            label="Destacadas"
            value={loading ? "…" : stats.featured}
            sub="Visibles en portada"
          />
          <StatCard
            icon={BadgeCheck}
            label="Exclusivas"
            value={loading ? "…" : stats.exclusive}
          />
          <StatCard icon={Home} label="En venta" value={loading ? "…" : stats.forSale} />
          <StatCard
            icon={KeyRound}
            label="En alquiler"
            value={loading ? "…" : stats.forRent}
          />
          <StatCard
            icon={Tag}
            label="Vendidas / Alquiladas"
            value={loading ? "…" : `${stats.sold} / ${stats.rented}`}
          />
          <StatCard
            icon={Archive}
            label="Archivadas"
            value={loading ? "…" : archivedProperties.length}
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          {/* By province */}
          <div className="rounded-[22px] border border-[#ece6da] bg-white p-6 shadow-[0_8px_24px_rgba(22,49,38,0.05)]">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-[#163126]">
                Propiedades por provincia
              </h2>
              <Link
                href="/admin/properties"
                className="inline-flex items-center gap-1 text-[12px] font-medium text-[#8b6d3b] hover:underline"
              >
                Ver todas <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-5 space-y-3">
              {stats.byProvince.length === 0 && (
                <p className="text-[13px] text-[#5d7268]">Sin datos aún.</p>
              )}
              {stats.byProvince.map(([name, count]) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 truncate text-[13px] text-[#5d7268]">
                    {name}
                  </span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#f0ece3]">
                    <div
                      className="h-full rounded-full bg-[#163126]"
                      style={{ width: `${(count / maxProv) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right text-[13px] font-semibold text-[#163126]">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="rounded-[22px] border border-[#ece6da] bg-white p-6 shadow-[0_8px_24px_rgba(22,49,38,0.05)]">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-[16px] font-semibold text-[#163126]">
                <History className="h-4 w-4 text-[#8b6d3b]" /> Actividad reciente
              </h2>
              <Link
                href="/admin/activity"
                className="inline-flex items-center gap-1 text-[12px] font-medium text-[#8b6d3b] hover:underline"
              >
                Historial <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {logsLoading && <p className="text-[13px] text-[#5d7268]">Cargando…</p>}
              {!logsLoading && logs.length === 0 && (
                <p className="text-[13px] text-[#5d7268]">
                  Sin actividad registrada todavía.
                </p>
              )}
              {logs.map((log) => {
                const meta = ACTION_META[log.action] ?? {
                  label: log.action,
                  dot: "bg-gray-400",
                };
                return (
                  <div key={log.id} className="flex items-start gap-3">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${meta.dot}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] leading-snug text-[#163126]">
                        <span className="font-semibold">{meta.label}</span>{" "}
                        <span className="text-[#5d7268]">{log.entityLabel}</span>
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#9ba0a4]">
                        {log.actor} · {timeAgo(log.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

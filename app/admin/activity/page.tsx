"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { fetchActivityLogs, type ActivityLog } from "@/lib/activity-api";

const ACTION_META: Record<string, { label: string; cls: string }> = {
  created: { label: "Creó", cls: "bg-emerald-100 text-emerald-700" },
  updated: { label: "Editó", cls: "bg-sky-100 text-sky-700" },
  deleted: { label: "Eliminó", cls: "bg-red-100 text-red-700" },
  archived: { label: "Archivó", cls: "bg-amber-100 text-amber-700" },
  restored: { label: "Restauró", cls: "bg-indigo-100 text-indigo-700" },
  settings_updated: { label: "Datos del negocio", cls: "bg-[#efe6d4] text-[#8b6d3b]" },
  translated: { label: "Tradujo", cls: "bg-fuchsia-100 text-fuchsia-700" },
};

function dayKey(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-CR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function timeOf(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" });
}

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchActivityLogs(200)
      .then(setLogs)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  // Group logs by calendar day for a readable timeline.
  const groups = useMemo(() => {
    const m = new Map<string, ActivityLog[]>();
    logs.forEach((l) => {
      const k = dayKey(l.createdAt);
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(l);
    });
    return [...m.entries()];
  }, [logs]);

  return (
    <section className="px-6 pt-10 pb-20 md:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#8b6d3b]">
              Panel administrativo
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-[#163126] md:text-4xl">
              Historial
            </h1>
            <p className="mt-2 text-[15px] text-[#5d7268]">
              Registro de cambios: quién hizo qué y cuándo.
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-2 rounded-xl border border-[#dfe5e0] bg-white px-4 py-2.5 text-[12px] font-semibold text-[#163126] transition hover:bg-[#f7f2e8]"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </button>
        </div>

        <div className="mt-8 space-y-8">
          {loading && logs.length === 0 && (
            <p className="text-[14px] text-[#5d7268]">Cargando historial…</p>
          )}

          {!loading && logs.length === 0 && (
            <div className="rounded-[22px] border border-[#ece6da] bg-white px-6 py-16 text-center">
              <p className="text-[15px] text-[#5d7268]">
                Aún no hay actividad registrada. Los cambios que hagas en las
                propiedades y en los datos del negocio aparecerán aquí.
              </p>
            </div>
          )}

          {groups.map(([day, items]) => (
            <div key={day}>
              <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#8b6d3b]">
                {day}
              </p>
              <div className="overflow-hidden rounded-[18px] border border-[#ece6da] bg-white">
                {items.map((log, i) => {
                  const meta = ACTION_META[log.action] ?? {
                    label: log.action,
                    cls: "bg-gray-100 text-gray-600",
                  };
                  return (
                    <div
                      key={log.id}
                      className={`flex items-center gap-4 px-5 py-3.5 ${
                        i > 0 ? "border-t border-[#f0ece3]" : ""
                      }`}
                    >
                      <span className="w-12 shrink-0 text-[12px] tabular-nums text-[#9ba0a4]">
                        {timeOf(log.createdAt)}
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.cls}`}
                      >
                        {meta.label}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[13.5px] text-[#163126]">
                        {log.entityLabel}
                      </span>
                      <span className="hidden shrink-0 text-[12px] text-[#9ba0a4] sm:block">
                        {log.actor}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Save, Check } from "lucide-react";
import { useSiteSettings } from "@/lib/site-settings-context";
import { saveSiteSettings, type SiteSettings } from "@/lib/site-settings-api";
import { logActivity } from "@/lib/activity-api";

const FIELDS: {
  key: keyof SiteSettings;
  label: string;
  hint?: string;
  placeholder?: string;
}[] = [
  { key: "whatsappDisplay", label: "WhatsApp (como se muestra)", placeholder: "+506 8606-0252" },
  {
    key: "whatsappNumber",
    label: "WhatsApp (solo números, para el enlace)",
    hint: "Sin espacios ni símbolos. Ej: 50686060252",
    placeholder: "50686060252",
  },
  { key: "email", label: "Correo electrónico", placeholder: "info@nakmarealty.com" },
  { key: "instagram", label: "Instagram (URL completa)", placeholder: "https://instagram.com/…" },
  { key: "facebook", label: "Facebook (URL completa)", placeholder: "https://facebook.com/…" },
  {
    key: "hours",
    label: "Horario de atención",
    hint: "Se muestra en Contacto y en el pie de página.",
    placeholder: "Lun–Vie 8:00–18:00 · Sáb 9:00–14:00",
  },
];

export default function AdminSettingsPage() {
  const { settings, refresh } = useSiteSettings();
  const [form, setForm] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Keep the form in sync when the settings finish loading from Supabase.
  useEffect(() => {
    setForm(settings);
  }, [settings]);

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await saveSiteSettings(form);
      await refresh();
      void logActivity({
        action: "settings_updated",
        entity: "settings",
        entityLabel: "Datos de contacto del negocio",
      });
      setSaved(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo guardar. Revisá la conexión e intentá de nuevo."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="px-6 pt-10 pb-20 md:px-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm uppercase tracking-[0.28em] text-[#8b6d3b]">
          Panel administrativo
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-[#163126] md:text-4xl">
          Datos del negocio
        </h1>
        <p className="mt-2 text-[15px] text-[#5d7268]">
          Estos datos aparecen en el pie de página, la página de Contacto y el botón
          flotante de WhatsApp. Al guardar, el sitio se actualiza al instante.
        </p>

        <form
          onSubmit={onSave}
          className="mt-8 space-y-5 rounded-[22px] border border-[#ece6da] bg-white p-6 shadow-[0_8px_24px_rgba(22,49,38,0.05)] md:p-8"
        >
          {FIELDS.map(({ key, label, hint, placeholder }) => (
            <div key={key}>
              <label className="block text-[13px] font-semibold text-[#163126]">
                {label}
              </label>
              {hint && <p className="mt-0.5 text-[11.5px] text-[#9ba0a4]">{hint}</p>}
              <input
                value={form[key] ?? ""}
                onChange={(e) => set(key, e.target.value)}
                placeholder={placeholder}
                className="mt-2 w-full rounded-xl border border-[#dfe5e0] px-4 py-3 text-[14px] text-[#163126] outline-none focus:border-[#8b6d3b]"
              />
            </div>
          ))}

          {error && <p className="text-[13px] text-red-600">{error}</p>}

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#163126] px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {saving ? "Guardando…" : saved ? "Guardado" : "Guardar cambios"}
            </button>
            {saved && (
              <span className="text-[13px] font-medium text-emerald-600">
                Cambios aplicados en el sitio.
              </span>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

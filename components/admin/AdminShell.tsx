"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  Archive,
  Settings,
  History,
  LogOut,
  Menu,
  X,
  Plus,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/properties", label: "Propiedades", icon: Building2 },
  { href: "/admin/archived", label: "Archivadas", icon: Archive },
  { href: "/admin/settings", label: "Datos del negocio", icon: Settings },
  { href: "/admin/activity", label: "Historial", icon: History },
];

export default function AdminShell({
  children,
  onLogout,
}: {
  children: React.ReactNode;
  onLogout: () => void;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  const NavLinks = (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = isActive(href, exact);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium transition ${
              active
                ? "bg-white/12 text-white"
                : "text-white/60 hover:bg-white/6 hover:text-white"
            }`}
          >
            <Icon className={`h-[18px] w-[18px] ${active ? "text-[#d7b56d]" : ""}`} />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  const SidebarInner = (
    <div className="flex h-full flex-col bg-[#132a20] px-4 py-6">
      <div className="px-2.5">
        <p className="nakma-brand text-[20px] tracking-[0.28em] text-white">NAKMA</p>
        <p className="nakma-body mt-1 text-[10px] uppercase tracking-[0.32em] text-[#d7b56d]">
          Panel administrativo
        </p>
      </div>

      <div className="mt-8 flex-1">{NavLinks}</div>

      <Link
        href="/admin/properties/new"
        onClick={() => setOpen(false)}
        className="mb-3 flex items-center justify-center gap-2 rounded-xl bg-[#8b6d3b] px-3.5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#9c7c45]"
      >
        <Plus className="h-4 w-4" /> Nueva propiedad
      </Link>

      <button
        type="button"
        onClick={onLogout}
        className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-white/55 transition hover:bg-white/6 hover:text-white"
      >
        <LogOut className="h-[18px] w-[18px]" /> Cerrar sesión
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f2e8]">
      {/* Desktop sidebar (fixed) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] lg:block">
        {SidebarInner}
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-[#e6ddc9] bg-[#132a20] px-4 py-3 lg:hidden">
        <span className="nakma-brand text-[17px] tracking-[0.26em] text-white">NAKMA</span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          className="rounded-lg p-1.5 text-white"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile slide-over */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[260px]">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="absolute right-3 top-4 z-10 rounded-lg p-1 text-white/70"
            >
              <X className="h-5 w-5" />
            </button>
            {SidebarInner}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="lg:pl-[248px]">{children}</div>
    </div>
  );
}

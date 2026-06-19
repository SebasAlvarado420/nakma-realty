"use client";

import Link from "next/link";
import type { Property } from "@/types/property";

export default function PropertyDetails({ property }: { property: Property }) {
  return (
    <section className="bg-[var(--nakma-bg)] px-6 py-14 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16 lg:items-start">

          {/* ── Left: Main details ─────────────────────── */}
          <div>
            {/* Badges */}
            <div className="flex flex-wrap gap-2.5">
              <span className="nakma-body rounded-full bg-[var(--nakma-olive)]/12 px-4 py-1.5 text-[10px] uppercase tracking-[0.28em] text-[var(--nakma-olive)]">
                {property.code}
              </span>
              <span className="nakma-body rounded-full bg-[var(--nakma-earth)]/10 px-4 py-1.5 text-[10px] uppercase tracking-[0.28em] text-[var(--nakma-earth)]">
                {property.province}
              </span>
            </div>

            <h1 className="nakma-display mt-5 text-[36px] leading-[1.06] tracking-[-0.04em] text-[var(--nakma-dark)] md:text-[50px]">
              {property.title}
            </h1>
            <p className="nakma-body mt-3 text-[16px] text-[var(--nakma-dark)]/60">{property.location}</p>
            <p className="nakma-display mt-6 text-[34px] font-semibold tracking-[-0.02em] text-[var(--nakma-dark)]">
              {property.price}
            </p>

            {/* Specs */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Bedrooms", value: `${property.bedrooms}` },
                { label: "Bathrooms", value: `${property.bathrooms}` },
                { label: "Construction", value: property.constructionSize },
                { label: "Land Size", value: property.landSize },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-[18px] border border-[var(--nakma-dark)]/8 bg-white/60 p-4 text-center">
                  <p className="nakma-display text-[20px] font-semibold text-[var(--nakma-dark)]">{value}</p>
                  <p className="nakma-body mt-1 text-[10px] uppercase tracking-[0.28em] text-[var(--nakma-dark)]/50">{label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mt-10 space-y-4 text-[15px] leading-[1.85] text-[var(--nakma-dark)]/65 nakma-body">
              {property.description && <p>{property.description}</p>}
              <p>
                This property reflects the tropical richness and quiet luxury that defines NAKMA. Designed for buyers seeking a refined living experience connected to Costa Rica's natural beauty.
              </p>
              <p>
                The architecture, setting, and atmosphere come together in a way that feels grounded, elegant, and distinctly local. Every detail has been considered with care.
              </p>
            </div>

            <Link
              href="/contact-us"
              className="nakma-body mt-10 inline-flex h-[54px] items-center rounded-full bg-[var(--nakma-dark)] px-9 text-[12px] uppercase tracking-[0.28em] text-white shadow-[0_8px_28px_rgba(22,17,13,0.18)] transition hover:opacity-88"
            >
              Inquire About This Property
            </Link>
          </div>

          {/* ── Right: Contact sidebar ─────────────────── */}
          <aside className="h-fit rounded-[28px] bg-white/75 p-7 shadow-[0_20px_60px_rgba(22,17,13,0.10)]">
            <p className="nakma-body text-[10px] uppercase tracking-[0.36em] text-[var(--nakma-olive)]">
              Interested in this property?
            </p>
            <h2 className="nakma-display mt-3 text-[20px] font-semibold text-[var(--nakma-dark)]">
              Request more information
            </h2>
            <div className="mt-6 space-y-4">
              {["Full Name", "Email Address", "Phone / WhatsApp"].map((placeholder) => (
                <input
                  key={placeholder}
                  type="text"
                  placeholder={placeholder}
                  className="nakma-body h-[50px] w-full rounded-2xl border border-[rgba(22,17,13,0.12)] bg-white/80 px-4 text-[14px] text-[var(--nakma-dark)] outline-none placeholder:text-[rgba(22,17,13,0.35)] focus:border-[var(--nakma-olive)]"
                />
              ))}
              <textarea
                placeholder="What would you like to know?"
                rows={4}
                className="nakma-body w-full resize-none rounded-2xl border border-[rgba(22,17,13,0.12)] bg-white/80 px-4 py-3.5 text-[14px] text-[var(--nakma-dark)] outline-none placeholder:text-[rgba(22,17,13,0.35)] focus:border-[var(--nakma-olive)]"
              />
            </div>
            <button className="nakma-body mt-5 w-full rounded-2xl bg-[var(--nakma-dark)] py-4 text-[11px] uppercase tracking-[0.28em] text-white shadow-[0_6px_20px_rgba(22,17,13,0.18)] transition hover:opacity-88">
              Send Inquiry
            </button>
            <a
              href="https://wa.me/50686060252"
              target="_blank"
              rel="noreferrer"
              className="nakma-body mt-4 flex h-[48px] items-center justify-center gap-2 rounded-2xl border border-[rgba(22,17,13,0.12)] text-[11px] uppercase tracking-[0.24em] text-[var(--nakma-dark)] transition hover:bg-[var(--nakma-dark)]/5"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </a>
          </aside>

        </div>
      </div>
    </section>
  );
}

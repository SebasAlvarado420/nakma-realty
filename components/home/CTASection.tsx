"use client";

import Link from "next/link";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/constants";
import { useLang } from "@/lib/i18n";

export default function CTASection() {
  const { lang, t } = useLang();
  return (
    <section className="relative overflow-hidden bg-[var(--nakma-bg)] px-4 py-24 lg:py-36">
      {/* Background image with overlay */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1800&q=75"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          style={{ opacity: 0.12 }}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--nakma-bg)] via-transparent to-[var(--nakma-bg)]" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <p className="nakma-body text-[10px] uppercase tracking-[0.46em] text-[var(--nakma-olive)]">
          {t("cta.eyebrow")}
        </p>

        <h2 className="nakma-display mx-auto mt-6 max-w-2xl text-[38px] leading-[1.06] tracking-[-0.04em] text-[var(--nakma-dark)] md:text-[54px] lg:text-[64px]">
          {lang === "es" ? (
            <>
              Encuentra una propiedad que se sienta{" "}
              <span className="text-[var(--nakma-earth)]">conectada a la tierra.</span>
            </>
          ) : (
            <>
              Find a property that feels{" "}
              <span className="text-[var(--nakma-earth)]">connected to the land.</span>
            </>
          )}
        </h2>

        <p className="nakma-body mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-[var(--nakma-dark)]/60">
          {lang === "es"
            ? "Ya sea que busques un refugio privado, una oportunidad de inversión o tu primer hogar en Costa Rica, nuestro equipo está aquí para guiarte."
            : "Whether you're looking for a private retreat, an investment opportunity, or your first home in Costa Rica, our team is here to guide you."}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/listings"
            className="nakma-body inline-flex h-[56px] items-center rounded-full bg-[var(--nakma-dark)] px-9 text-[12px] uppercase tracking-[0.28em] text-white shadow-[0_12px_40px_rgba(22,17,13,0.18)] transition-all hover:opacity-88 hover:-translate-y-0.5"
          >
            {t("cta.explore")}
          </Link>
          <Link
            href="/contact-us"
            className="nakma-body inline-flex h-[56px] items-center rounded-full border border-[var(--nakma-dark)]/28 px-9 text-[12px] uppercase tracking-[0.28em] text-[var(--nakma-dark)] transition-all hover:bg-[var(--nakma-dark)] hover:text-white hover:-translate-y-0.5"
          >
            {t("cta.contact")}
          </Link>
        </div>

        <p className="nakma-body mt-12 text-[11px] uppercase tracking-[0.32em] text-[var(--nakma-dark)]/38">
          {lang === "es"
            ? "Con raíces en Costa Rica · Curado con intención"
            : "Rooted in Costa Rica · Curated with intention"}
        </p>
      </div>
    </section>
  );
}

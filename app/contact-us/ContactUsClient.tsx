"use client";

import ContactForm from "@/components/contact/ContactForm";
import { SITE } from "@/lib/site";
import { useLang } from "@/lib/i18n";

export default function ContactUsClient() {
  const { t } = useLang();
  return (
    <div className="bg-[var(--nakma-bg)]">

      {/* ── Header ─────────────────────────────────────────── */}
      <section className="px-6 pb-0 pt-36 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="nakma-body text-[10px] uppercase tracking-[0.46em] text-[var(--nakma-olive)]">
            {t("contactpage.eyebrow")}
          </p>
          <h1 className="nakma-display mt-5 max-w-2xl text-[42px] leading-[1.04] tracking-[-0.04em] text-[var(--nakma-dark)] md:text-[58px]">
            {t("contactpage.title")}
          </h1>
          <p className="nakma-body mt-6 max-w-md text-[15px] leading-relaxed text-[var(--nakma-dark)]/60">
            {t("contactpage.intro")}
          </p>
        </div>
      </section>

      {/* ── Main content grid ───────────────────────────────── */}
      <section className="px-6 py-16 lg:px-16 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-[1.3fr_0.7fr] lg:gap-20 lg:items-start">

            {/* Form */}
            <ContactForm />

            {/* Contact sidebar */}
            <div className="space-y-6">
              {/* Info card */}
              <div className="rounded-[28px] border border-[var(--nakma-dark)]/8 bg-white/50 p-7">
                <p className="nakma-body text-[10px] uppercase tracking-[0.40em] text-[var(--nakma-olive)]">
                  {t("contactpage.info")}
                </p>
                <div className="mt-6 space-y-5">
                  <div>
                    <p className="nakma-body text-[11px] uppercase tracking-[0.28em] text-[var(--nakma-dark)]/48">{t("form.email")}</p>
                    <a href={`mailto:${SITE.email}`} className="nakma-body mt-1.5 block text-[15px] text-[var(--nakma-dark)] hover:text-[var(--nakma-olive)]">
                      {SITE.email}
                    </a>
                  </div>
                  <div>
                    <p className="nakma-body text-[11px] uppercase tracking-[0.28em] text-[var(--nakma-dark)]/48">WhatsApp</p>
                    <a href={SITE.whatsappUrl} target="_blank" rel="noreferrer" className="nakma-body mt-1.5 block text-[15px] text-[var(--nakma-dark)] hover:text-[var(--nakma-olive)]">
                      {SITE.whatsappDisplay}
                    </a>
                  </div>
                  <div>
                    <p className="nakma-body text-[11px] uppercase tracking-[0.28em] text-[var(--nakma-dark)]/48">{t("contactpage.social")}</p>
                    <div className="mt-1.5 flex gap-3 text-[14px]">
                      <a href={SITE.instagram} target="_blank" rel="noreferrer" className="nakma-body text-[var(--nakma-dark)] hover:text-[var(--nakma-olive)]">Instagram</a>
                      <a href={SITE.facebook} target="_blank" rel="noreferrer" className="nakma-body text-[var(--nakma-dark)] hover:text-[var(--nakma-olive)]">Facebook</a>
                    </div>
                  </div>
                  <div>
                    <p className="nakma-body text-[11px] uppercase tracking-[0.28em] text-[var(--nakma-dark)]/48">{t("contactpage.location")}</p>
                    <p className="nakma-body mt-1.5 text-[15px] text-[var(--nakma-dark)]">Costa Rica</p>
                  </div>
                </div>
              </div>

              {/* Response time */}
              <div className="rounded-[28px] bg-[var(--nakma-olive)]/10 p-7">
                <p className="nakma-display text-[15px] font-semibold text-[var(--nakma-dark)]">
                  {t("contactpage.respond")}
                </p>
                <p className="nakma-body mt-2 text-[13px] leading-relaxed text-[var(--nakma-dark)]/58">
                  {t("contactpage.respondBody")}
                </p>
              </div>

              {/* List your property */}
              <div className="rounded-[28px] border border-[var(--nakma-dark)]/8 bg-white/50 p-7">
                <p className="nakma-body text-[10px] uppercase tracking-[0.36em] text-[var(--nakma-olive)]">
                  {t("contactpage.owners")}
                </p>
                <p className="nakma-display mt-3 text-[18px] font-semibold leading-snug text-[var(--nakma-dark)]">
                  {t("contactpage.ownersTitle")}
                </p>
                <p className="nakma-body mt-3 text-[13px] leading-relaxed text-[var(--nakma-dark)]/58">
                  {t("contactpage.ownersBody")}
                </p>
                <a
                  href={`mailto:${SITE.email}`}
                  className="nakma-body mt-5 inline-flex h-[44px] items-center rounded-full border border-[var(--nakma-dark)]/22 px-5 text-[11px] uppercase tracking-[0.26em] text-[var(--nakma-dark)] transition hover:bg-[var(--nakma-dark)] hover:text-white"
                >
                  {t("contactpage.contactListing")}
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

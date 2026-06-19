import ContactForm from "@/components/contact/ContactForm";

export const metadata = {
  title: "Contact Us · NAKMA Realty",
  description: "Get in touch with NAKMA Realty — find your place in Costa Rica.",
};

export default function ContactUsPage() {
  return (
    <div className="bg-[var(--nakma-bg)]">

      {/* ── Header ─────────────────────────────────────────── */}
      <section className="px-6 pb-0 pt-36 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="nakma-body text-[10px] uppercase tracking-[0.46em] text-[var(--nakma-olive)]">
            Get In Touch
          </p>
          <h1 className="nakma-display mt-5 max-w-2xl text-[42px] leading-[1.04] tracking-[-0.04em] text-[var(--nakma-dark)] md:text-[58px]">
            Let's find your place in Costa Rica.
          </h1>
          <p className="nakma-body mt-6 max-w-md text-[15px] leading-relaxed text-[var(--nakma-dark)]/60">
            Tell us what you're looking for, and our team will guide you through selected opportunities that match your vision.
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
                  Contact Info
                </p>
                <div className="mt-6 space-y-5">
                  <div>
                    <p className="nakma-body text-[11px] uppercase tracking-[0.28em] text-[var(--nakma-dark)]/48">Email</p>
                    <a href="mailto:info@nakma.cr" className="nakma-body mt-1.5 block text-[15px] text-[var(--nakma-dark)] hover:text-[var(--nakma-olive)]">
                      info@nakma.cr
                    </a>
                  </div>
                  <div>
                    <p className="nakma-body text-[11px] uppercase tracking-[0.28em] text-[var(--nakma-dark)]/48">WhatsApp</p>
                    <a href="https://wa.me/50600000000" target="_blank" rel="noreferrer" className="nakma-body mt-1.5 block text-[15px] text-[var(--nakma-dark)] hover:text-[var(--nakma-olive)]">
                      +506 0000-0000
                    </a>
                  </div>
                  <div>
                    <p className="nakma-body text-[11px] uppercase tracking-[0.28em] text-[var(--nakma-dark)]/48">Location</p>
                    <p className="nakma-body mt-1.5 text-[15px] text-[var(--nakma-dark)]">Costa Rica</p>
                  </div>
                </div>
              </div>

              {/* Response time */}
              <div className="rounded-[28px] bg-[var(--nakma-olive)]/10 p-7">
                <p className="nakma-display text-[15px] font-semibold text-[var(--nakma-dark)]">
                  We respond within 24 hours.
                </p>
                <p className="nakma-body mt-2 text-[13px] leading-relaxed text-[var(--nakma-dark)]/58">
                  Your inquiry will be received by a member of our team — not an automated system.
                </p>
              </div>

              {/* List your property */}
              <div className="rounded-[28px] border border-[var(--nakma-dark)]/8 bg-white/50 p-7">
                <p className="nakma-body text-[10px] uppercase tracking-[0.36em] text-[var(--nakma-olive)]">
                  Property Owners
                </p>
                <p className="nakma-display mt-3 text-[18px] font-semibold leading-snug text-[var(--nakma-dark)]">
                  Looking to list your property with NAKMA?
                </p>
                <p className="nakma-body mt-3 text-[13px] leading-relaxed text-[var(--nakma-dark)]/58">
                  We work with a select portfolio of properties. If you believe yours fits our standards, we'd love to hear from you.
                </p>
                <a
                  href="mailto:listings@nakma.cr"
                  className="nakma-body mt-5 inline-flex h-[44px] items-center rounded-full border border-[var(--nakma-dark)]/22 px-5 text-[11px] uppercase tracking-[0.26em] text-[var(--nakma-dark)] transition hover:bg-[var(--nakma-dark)] hover:text-white"
                >
                  Contact for Listing
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

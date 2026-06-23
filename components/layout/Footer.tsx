"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import BrandName from "@/components/ui/BrandName";

const NAV = [
  { href: "/", key: "nav.home" },
  { href: "/listings", key: "nav.listings" },
  { href: "/about-us", key: "nav.about" },
  { href: "/our-team", key: "nav.team" },
  { href: "/contact-us", key: "nav.contact" },
];

const SOCIAL = [
  { href: SITE.instagram, label: "Instagram" },
  { href: SITE.facebook, label: "Facebook" },
  { href: SITE.whatsappUrl, label: "WhatsApp" },
];

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="bg-[var(--nakma-dark)] text-[var(--nakma-white)]">
      <div className="h-px bg-[var(--nakma-sand)]/20" />

      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:py-20">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <Link href="/" aria-label="NAKMA — Home">
              <BrandName className="nakma-brand text-[26px] tracking-[0.26em] text-[var(--nakma-bg)]" />
            </Link>
            <p className="nakma-body mt-5 max-w-xs text-[13px] leading-[1.85] text-white/45">
              {t("footer.tagline")}
            </p>
            <p className="nakma-body mt-8 text-[10px] uppercase tracking-[0.42em] text-[var(--nakma-sand)]/55">
              {t("footer.rooted")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="nakma-body text-[10px] uppercase tracking-[0.38em] text-[var(--nakma-sand)]/65">
              {t("footer.navigate")}
            </h3>
            <nav className="mt-5 flex flex-col gap-3">
              {NAV.map(({ href, key }) => (
                <Link
                  key={href}
                  href={href}
                  className="nakma-body text-[14px] text-white/55 transition-colors hover:text-white"
                >
                  {t(key)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div>
            <h3 className="nakma-body text-[10px] uppercase tracking-[0.38em] text-[var(--nakma-sand)]/65">
              {t("footer.social")}
            </h3>
            <div className="mt-5 flex flex-col gap-3">
              {SOCIAL.map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="nakma-body text-[14px] text-white/55 transition-colors hover:text-white"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="nakma-body text-[10px] uppercase tracking-[0.38em] text-[var(--nakma-sand)]/65">
              {t("footer.contact")}
            </h3>
            <div className="mt-5 space-y-3">
              <a href={`mailto:${SITE.email}`} className="nakma-body block text-[14px] text-white/55 transition-colors hover:text-white">
                {SITE.email}
              </a>
              <a href={SITE.whatsappUrl} target="_blank" rel="noreferrer" className="nakma-body block text-[14px] text-white/55 transition-colors hover:text-white">
                {SITE.whatsappDisplay}
              </a>
              <p className="nakma-body text-[14px] text-white/38">Costa Rica</p>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/8 pt-6 sm:flex-row sm:items-center">
          <p className="nakma-body text-[11px] uppercase tracking-[0.26em] text-white/28">
            © {new Date().getFullYear()} NAKMA Real Estate · Costa Rica
          </p>
          <p className="nakma-body text-[11px] text-white/22">{t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}

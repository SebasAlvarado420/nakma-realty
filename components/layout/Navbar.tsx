"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/i18n";
import BrandName from "@/components/ui/BrandName";

const navLinks = [
  { href: "/", key: "nav.home" },
  { href: "/listings", key: "nav.listings" },
  { href: "/about-us", key: "nav.about" },
  { href: "/our-team", key: "nav.team" },
  { href: "/contact-us", key: "nav.contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { lang, setLang, t } = useLang();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Only re-render when crossing the threshold (not on every scroll frame),
  // rAF-throttled — keeps scrolling smooth.
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const next = window.scrollY > 40;
        setScrolled((prev) => (prev === next ? prev : next));
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const navOpacity = 0.9;

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // On the homepage: transparent + light text until user scrolls past hero
  // On other pages: always solid
  const solid = !isHome || scrolled;

  const logoColor = solid ? "var(--nakma-dark)" : "var(--nakma-bg)";
  const linkColor = solid ? "var(--nakma-dark)" : "rgba(248,245,239,0.85)";
  const linkActiveColor = solid ? "var(--nakma-dark)" : "var(--nakma-bg)";
  const burgerColor = solid ? "var(--nakma-dark)" : "var(--nakma-bg)";

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[99999] transition-all duration-500"
        style={{
          backgroundColor: solid ? `rgba(255,255,255,${navOpacity})` : "transparent",
          borderBottom: solid
            ? `1px solid rgba(0,0,0,${0.07 * navOpacity})`
            : "1px solid transparent",
          boxShadow: solid ? `0 6px 24px rgba(0,0,0,${0.05 * navOpacity})` : "none",
          backdropFilter: solid ? "blur(16px)" : "none",
          WebkitBackdropFilter: solid ? "blur(16px)" : "none",
        }}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-10">
          {/* Logo */}
          <Link
            href="/"
            className="flex flex-col leading-none transition-colors duration-500"
            style={{ color: logoColor }}
            aria-label="NAKMA Real Estate — Home"
          >
            <BrandName className="nakma-brand text-[22px] tracking-[0.22em]" />
            <span className="nakma-body mt-0.5 text-[7px] uppercase tracking-[0.5em] opacity-75">
              Real Estate
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="nakma-body text-[11px] uppercase tracking-[0.30em] transition-all duration-400 hover:opacity-100"
                  style={{
                    color: isActive ? linkActiveColor : linkColor,
                    opacity: isActive ? 1 : undefined,
                  }}
                >
                  {t(link.key)}
                </Link>
              );
            })}
          </nav>

          {/* Language toggle + CTA (desktop) */}
          <div className="hidden items-center gap-4 md:flex">
            <div
              className="flex items-center gap-1.5 text-[11px] tracking-[0.18em]"
              style={{ color: linkColor }}
            >
              <button
                type="button"
                onClick={() => setLang("en")}
                className="transition-opacity"
                style={{ opacity: lang === "en" ? 1 : 0.45, fontWeight: lang === "en" ? 600 : 400 }}
              >
                EN
              </button>
              <span style={{ opacity: 0.4 }}>/</span>
              <button
                type="button"
                onClick={() => setLang("es")}
                className="transition-opacity"
                style={{ opacity: lang === "es" ? 1 : 0.45, fontWeight: lang === "es" ? 600 : 400 }}
              >
                ES
              </button>
            </div>
            <Link
              href="/contact-us"
              className="nakma-body inline-flex h-[38px] items-center rounded-full px-5 text-[10px] uppercase tracking-[0.28em] transition-all duration-400"
              style={{
                border: solid
                  ? "1px solid rgba(22,17,13,0.28)"
                  : "1px solid rgba(248,245,239,0.38)",
                color: solid ? "var(--nakma-dark)" : "var(--nakma-bg)",
              }}
            >
              {t("nav.contactBtn")}
            </Link>
          </div>

          {/* Mobile hamburger */}
          {!mobileOpen && (
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center md:hidden"
            >
              <div className="flex flex-col items-center gap-[5px]">
                <span
                  className="block h-[1.5px] w-[22px] transition-colors duration-500"
                  style={{ background: burgerColor }}
                />
                <span
                  className="block h-[1.5px] w-[22px] transition-colors duration-500"
                  style={{ background: burgerColor }}
                />
                <span
                  className="block h-[1.5px] w-[22px] transition-colors duration-500"
                  style={{ background: burgerColor }}
                />
              </div>
            </button>
          )}
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div
        className={`fixed inset-0 z-[100000] bg-[var(--nakma-bg)] transition-opacity duration-300 md:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-[72px] items-center justify-between px-5">
          <BrandName className="nakma-brand text-[21px] tracking-[0.22em] text-[var(--nakma-dark)]" />
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="flex h-10 w-10 items-center justify-center text-[30px] leading-none text-[var(--nakma-dark)]"
          >
            ×
          </button>
        </div>

        <nav className="flex flex-col px-5 pt-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nakma-body border-b border-black/8 py-5 text-[17px] text-[var(--nakma-dark)]"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 px-5 pt-6 text-[13px] tracking-[0.18em] text-[var(--nakma-dark)]">
          <button
            type="button"
            onClick={() => setLang("en")}
            style={{ opacity: lang === "en" ? 1 : 0.45, fontWeight: lang === "en" ? 600 : 400 }}
          >
            EN
          </button>
          <span style={{ opacity: 0.4 }}>/</span>
          <button
            type="button"
            onClick={() => setLang("es")}
            style={{ opacity: lang === "es" ? 1 : 0.45, fontWeight: lang === "es" ? 600 : 400 }}
          >
            ES
          </button>
        </div>

        <div className="px-5 pt-6">
          <Link
            href="/contact-us"
            className="nakma-body block w-full rounded-2xl bg-[var(--nakma-dark)] py-4 text-center text-[12px] uppercase tracking-[0.28em] text-white"
          >
            {t("nav.contact")}
          </Link>
        </div>
      </div>
    </>
  );
}

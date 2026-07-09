"use client";

import Link from "next/link";
import Image from "next/image";
import { teamMembers, localizedBio } from "@/data/team";
import { BLUR_DATA_URL } from "@/lib/constants";
import { useLang } from "@/lib/i18n";
import Reveal from "@/components/ui/Reveal";

export default function OurTeamClient() {
  const { t, lang } = useLang();
  return (
    <div className="bg-[var(--nakma-bg)]">

      {/* ── Header ─────────────────────────────────────── */}
      <section className="px-6 pb-16 pt-36 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="nakma-body text-[10px] uppercase tracking-[0.46em] text-[var(--nakma-olive)]">
            {t("team.eyebrow")}
          </p>
          <h1 className="nakma-display mt-5 max-w-2xl text-[42px] leading-[1.05] tracking-[-0.04em] text-[var(--nakma-dark)] md:text-[58px]">
            {t("team.title")}
          </h1>
          <p className="nakma-body mt-6 max-w-lg text-[15px] leading-relaxed text-[var(--nakma-dark)]/60">
            {t("team.intro")}
          </p>
        </div>
      </section>

      {/* ── Team grid ──────────────────────────────────── */}
      <section className="px-6 pb-24 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 sm:grid-cols-2">
            {teamMembers.map((member, i) => (
              <Reveal
                key={member.id}
                delay={i * 0.1}
                className="group overflow-hidden rounded-[28px] bg-white/70 shadow-[0_16px_48px_rgba(22,17,13,0.08)] transition-transform duration-300 hover:-translate-y-1"
              >
                <Link href={`/our-team/${member.slug}`} className="block">
                  <div className="relative h-[360px] overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <div className="p-7">
                    <p className="nakma-body text-[10px] uppercase tracking-[0.36em] text-[var(--nakma-olive)]">
                      {member.role}
                    </p>
                    <h2 className="nakma-display mt-2 text-[24px] font-semibold text-[var(--nakma-dark)] transition-colors group-hover:text-[var(--nakma-earth)]">
                      {member.name}
                    </h2>
                    <p className="nakma-body mt-4 line-clamp-4 text-[13px] leading-[1.8] text-[var(--nakma-dark)]/62">
                      {localizedBio(member, lang)}
                    </p>
                    {member.languages && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {member.languages.map((lang) => (
                          <span
                            key={lang}
                            className="rounded-full border border-[var(--nakma-dark)]/12 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--nakma-dark)]/60 nakma-body"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    )}
                    <span className="nakma-body mt-6 inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.24em] text-[var(--nakma-olive)] transition group-hover:text-[var(--nakma-dark)]">
                      {t("agent.viewProfile")}
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <section className="bg-[var(--nakma-dark)] px-6 py-20 text-center lg:px-16">
        <div className="mx-auto max-w-2xl">
          <p className="nakma-body text-[10px] uppercase tracking-[0.46em] text-[var(--nakma-sand)]/70">
            {t("team.workWith")}
          </p>
          <h2 className="nakma-display mt-5 text-[30px] leading-tight tracking-[-0.03em] text-[var(--nakma-bg)] md:text-[38px]">
            {t("team.ctaTitle")}
          </h2>
          <p className="nakma-body mt-5 text-[14px] leading-relaxed text-white/48">
            {t("team.ctaBody")}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact-us"
              className="nakma-body inline-flex h-[52px] items-center rounded-full bg-[var(--nakma-bg)] px-8 text-[12px] uppercase tracking-[0.28em] text-[var(--nakma-dark)] transition hover:opacity-90"
            >
              {t("team.getInTouch")}
            </Link>
            <Link
              href="/listings"
              className="nakma-body inline-flex h-[52px] items-center rounded-full border border-white/20 px-8 text-[12px] uppercase tracking-[0.28em] text-white transition hover:border-white/40"
            >
              {t("team.browseListings")}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

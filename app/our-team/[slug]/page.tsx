"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { getAgentBySlug } from "@/data/team";
import { useProperties } from "@/lib/propertiescontext";
import { useLang } from "@/lib/i18n";
import { BLUR_DATA_URL } from "@/lib/constants";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import PropertyCard from "@/components/property/PropertyCard";

function digits(s?: string) {
  return (s ?? "").replace(/[^0-9]/g, "");
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="nakma-display text-[32px] font-semibold leading-none text-[var(--nakma-dark)]">
        {value}
      </p>
      <p className="nakma-body mt-1.5 text-[10px] uppercase tracking-[0.24em] text-[var(--nakma-dark)]/50">
        {label}
      </p>
    </div>
  );
}

export default function AgentPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const agent = getAgentBySlug(slug);
  const { properties } = useProperties();
  const { t } = useLang();

  const listings = useMemo(
    () => (agent ? properties.filter((p) => p.agentId === agent.id) : []),
    [agent, properties]
  );
  const regions = useMemo(
    () => [...new Set(listings.map((p) => p.province).filter(Boolean))],
    [listings]
  );

  if (!agent) {
    return (
      <section className="flex min-h-screen items-center justify-center px-6 pb-20 pt-32">
        <div className="text-center">
          <p className="nakma-body text-[11px] uppercase tracking-[0.28em] text-[var(--nakma-olive)]">
            NAKMA Realty
          </p>
          <h1 className="nakma-display mt-4 text-4xl text-[var(--nakma-dark)]">
            {t("agent.notFound")}
          </h1>
          <Link
            href="/our-team"
            className="nakma-body mt-6 inline-block text-[13px] uppercase tracking-[0.2em] text-[var(--nakma-olive)] hover:underline"
          >
            ← {t("agent.back")}
          </Link>
        </div>
      </section>
    );
  }

  const wa = digits(agent.whatsapp);

  return (
    <div className="bg-[var(--nakma-bg)]">
      {/* Back link */}
      <div className="px-6 pt-28 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/our-team"
            className="nakma-body inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-[var(--nakma-dark)]/55 transition hover:text-[var(--nakma-dark)]"
          >
            <ArrowLeft className="h-4 w-4" /> {t("agent.back")}
          </Link>
        </div>
      </div>

      {/* Profile */}
      <section className="px-6 pb-14 pt-8 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[400px_1fr] lg:items-start lg:gap-16">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px] shadow-[0_24px_70px_rgba(22,17,13,0.14)]">
            <Image
              src={agent.image}
              alt={agent.name}
              fill
              sizes="(max-width: 1024px) 100vw, 400px"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className="object-cover object-top"
              priority
            />
          </div>

          <div>
            <p className="nakma-body text-[11px] uppercase tracking-[0.4em] text-[var(--nakma-olive)]">
              {agent.role}
            </p>
            <h1 className="nakma-display mt-3 text-[42px] leading-[1.02] tracking-[-0.03em] text-[var(--nakma-dark)] md:text-[56px]">
              {agent.name}
            </h1>

            <div className="mt-8 flex flex-wrap gap-10 border-y border-[var(--nakma-dark)]/10 py-6">
              <Stat value={listings.length} label={t("agent.listings")} />
              <Stat value={regions.length} label={t("agent.regions")} />
              <Stat value={agent.languages?.length ?? 0} label={t("agent.languages")} />
            </div>

            <p className="nakma-body mt-7 max-w-2xl text-[15px] leading-[1.9] text-[var(--nakma-dark)]/72">
              {agent.bio}
            </p>

            {agent.languages && (
              <div className="mt-6 flex flex-wrap gap-2">
                {agent.languages.map((l) => (
                  <span
                    key={l}
                    className="nakma-body rounded-full border border-[var(--nakma-dark)]/12 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--nakma-dark)]/60"
                  >
                    {l}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {agent.whatsapp && (
                <a
                  href={`https://wa.me/${wa}`}
                  target="_blank"
                  rel="noreferrer"
                  className="nakma-body inline-flex h-[48px] items-center gap-2.5 rounded-full bg-[#1FA855] px-6 text-[13px] font-medium text-white shadow-sm transition hover:bg-[#1c994d]"
                >
                  <WhatsAppIcon className="h-[18px] w-[18px]" /> WhatsApp
                </a>
              )}
              {agent.email && (
                <a
                  href={`mailto:${agent.email}`}
                  className="nakma-body inline-flex h-[48px] items-center gap-2.5 rounded-full border border-[var(--nakma-dark)]/22 px-6 text-[12px] uppercase tracking-[0.18em] text-[var(--nakma-dark)] transition hover:bg-[var(--nakma-dark)] hover:text-white"
                >
                  <Mail className="h-4 w-4" /> {t("agent.email")}
                </a>
              )}
              {agent.phone && (
                <a
                  href={`tel:${digits(agent.phone)}`}
                  className="nakma-body inline-flex h-[48px] items-center gap-2.5 rounded-full border border-[var(--nakma-dark)]/22 px-6 text-[12px] text-[var(--nakma-dark)] transition hover:bg-[var(--nakma-dark)] hover:text-white"
                >
                  <Phone className="h-4 w-4" /> {agent.phone}
                </a>
              )}
            </div>

            {agent.office && (
              <p className="nakma-body mt-4 inline-flex items-center gap-2 text-[13px] text-[var(--nakma-dark)]/55">
                <MapPin className="h-4 w-4" /> {agent.office}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Their properties */}
      <section className="border-t border-[var(--nakma-dark)]/8 px-6 py-16 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="nakma-display text-[28px] tracking-[-0.02em] text-[var(--nakma-dark)] md:text-[36px]">
            {t("agent.propertiesBy")}{" "}
            <span className="italic text-[var(--nakma-earth)]">{agent.name.split(" ")[0]}</span>.
          </h2>
          {listings.length > 0 ? (
            <div className="mt-10 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          ) : (
            <p className="nakma-body mt-6 text-[15px] text-[var(--nakma-dark)]/55">
              {t("agent.noProperties")}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Mail, Phone, MapPin, Send } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { useLang } from "@/lib/i18n";
import type { TeamMember } from "@/data/team";
import type { Property } from "@/types/property";

function digits(s?: string) {
  return (s ?? "").replace(/[^0-9]/g, "");
}

/**
 * NAKMA broker enquiry pop-up — our own take (not an LX clone): a calm,
 * editorial split panel. Left = the agent, rooted-in-Costa-Rica branding and a
 * one-tap WhatsApp / email. Right = a short enquiry form that (for now) opens a
 * pre-filled email to that specific agent. Wiring it to a real inbox/CRM is a
 * later step.
 */
export default function BrokerContactModal({
  agent,
  property,
  onClose,
}: {
  agent: TeamMember;
  property: Property;
  onClose: () => void;
}) {
  const { t, lang } = useLang();
  const agentFirst = agent.name.split(" ")[0];
  const defaultMessage =
    lang === "es"
      ? `Hola ${agentFirst}, me interesa ${property.title} (${property.code}). ¿Podrías darme más detalles?`
      : `Hi ${agentFirst}, I'm interested in ${property.title} (${property.code}). Could you share more details?`;

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(defaultMessage);

  // Close on ESC + lock background scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const waNumber = digits(agent.whatsapp);
  const waText = encodeURIComponent(defaultMessage);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const subject = `Inquiry · ${property.code} — ${property.title}`;
    const body =
      `Name: ${first} ${last}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email}\n\n` +
      `${message}\n\n— Sent from nakmarealty.com (${property.code})`;
    window.location.href = `mailto:${agent.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div
      className="fixed inset-0 z-[100001] flex items-start justify-center overflow-y-auto bg-[var(--nakma-dark)]/55 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="relative my-auto grid w-full max-w-3xl overflow-hidden rounded-[26px] bg-[var(--nakma-bg)] shadow-2xl md:grid-cols-[0.92fr_1.08fr]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/30 md:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* ── Broker / brand panel ─────────────────────────── */}
        <div className="flex flex-col bg-[var(--nakma-dark)] p-7 text-white sm:p-9">
          <p className="nakma-body text-[10px] uppercase tracking-[0.34em] text-[var(--nakma-sand)]">
            {t("modal.rooted")}
          </p>

          <div className="mt-7 flex items-center gap-4">
            <div className="relative h-[86px] w-[86px] shrink-0 overflow-hidden rounded-full ring-2 ring-white/20">
              <Image src={agent.image} alt={agent.name} fill sizes="86px" className="object-cover object-top" />
            </div>
            <div>
              <h3 className="nakma-display text-[22px] leading-tight">{agent.name}</h3>
              <p className="nakma-body mt-0.5 text-[11px] uppercase tracking-[0.18em] text-[var(--nakma-sand)]">
                {agent.role}
              </p>
            </div>
          </div>

          <div className="mt-7 space-y-3 border-t border-white/12 pt-6">
            {agent.email && (
              <a
                href={`mailto:${agent.email}`}
                className="nakma-body flex items-center gap-2.5 text-[13.5px] text-white/85 transition hover:text-white"
              >
                <Mail className="h-4 w-4 text-[var(--nakma-sand)]" /> {agent.email}
              </a>
            )}
            {agent.phone && (
              <a
                href={`tel:${digits(agent.phone)}`}
                className="nakma-body flex items-center gap-2.5 text-[13.5px] text-white/85 transition hover:text-white"
              >
                <Phone className="h-4 w-4 text-[var(--nakma-sand)]" /> {agent.phone}
              </a>
            )}
            {agent.office && (
              <p className="nakma-body flex items-center gap-2.5 text-[13.5px] text-white/65">
                <MapPin className="h-4 w-4 text-[var(--nakma-sand)]" /> {agent.office}
              </p>
            )}
            {agent.whatsapp && (
              <a
                href={`https://wa.me/${waNumber}?text=${waText}`}
                target="_blank"
                rel="noreferrer"
                className="nakma-body mt-1 flex h-[48px] items-center justify-center gap-2.5 rounded-xl bg-[#1FA855] text-[13px] font-semibold tracking-wide text-white shadow-md transition hover:bg-[#1c994d]"
              >
                <WhatsAppIcon className="h-[18px] w-[18px]" /> WhatsApp {agent.name.split(" ")[0]}
              </a>
            )}
          </div>

          <p className="nakma-body mt-auto pt-7 text-[12px] leading-relaxed text-white/55">
            {t("modal.realPerson")}
          </p>
        </div>

        {/* ── Enquiry form ─────────────────────────────────── */}
        <form onSubmit={submit} className="flex flex-col p-7 sm:p-9">
          <p className="nakma-body text-[10px] uppercase tracking-[0.32em] text-[var(--nakma-olive)]">
            {t("modal.eyebrow")}
          </p>
          <h2 className="nakma-display mt-2 text-[24px] leading-tight text-[var(--nakma-dark)]">
            {t("modal.title")}{" "}
            <span className="text-[var(--nakma-earth)]">{property.code}</span>
          </h2>
          <p className="nakma-body mt-1.5 text-[13px] text-[var(--nakma-dark)]/55">
            {property.title}
            {property.priceOnRequest
              ? ` · ${t("listing.priceOnRequest")}`
              : property.price
              ? ` · ${property.price}`
              : ""}
          </p>

          <div className="mt-6 grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                value={first}
                onChange={(e) => setFirst(e.target.value)}
                placeholder={t("modal.first")}
                required
                className="h-[46px] rounded-xl border border-[var(--nakma-dark)]/12 bg-white px-4 text-[14px] text-[var(--nakma-dark)] outline-none transition focus:border-[var(--nakma-olive)]"
              />
              <input
                value={last}
                onChange={(e) => setLast(e.target.value)}
                placeholder={t("modal.last")}
                className="h-[46px] rounded-xl border border-[var(--nakma-dark)]/12 bg-white px-4 text-[14px] text-[var(--nakma-dark)] outline-none transition focus:border-[var(--nakma-olive)]"
              />
            </div>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("modal.phone")}
              inputMode="tel"
              className="h-[46px] rounded-xl border border-[var(--nakma-dark)]/12 bg-white px-4 text-[14px] text-[var(--nakma-dark)] outline-none transition focus:border-[var(--nakma-olive)]"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("modal.email")}
              type="email"
              required
              className="h-[46px] rounded-xl border border-[var(--nakma-dark)]/12 bg-white px-4 text-[14px] text-[var(--nakma-dark)] outline-none transition focus:border-[var(--nakma-olive)]"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="min-h-[104px] rounded-xl border border-[var(--nakma-dark)]/12 bg-white px-4 py-3 text-[14px] text-[var(--nakma-dark)] outline-none transition focus:border-[var(--nakma-olive)]"
            />
          </div>

          <button
            type="submit"
            className="nakma-body mt-4 inline-flex h-[48px] items-center justify-center gap-2 rounded-full bg-[var(--nakma-dark)] text-[12px] uppercase tracking-[0.2em] text-white transition hover:bg-[var(--nakma-olive)]"
          >
            <Send className="h-4 w-4" /> {t("modal.send")}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="nakma-body mt-2 text-[12px] uppercase tracking-[0.18em] text-[var(--nakma-dark)]/45 transition hover:text-[var(--nakma-dark)]"
          >
            {t("modal.cancel")}
          </button>
        </form>
      </div>
    </div>
  );
}

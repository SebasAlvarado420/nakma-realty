"use client";

import { useState } from "react";

const INTERESTS = [
  "Residential Property",
  "Investment Land",
  "Ocean View Property",
  "Mountain Retreat",
  "Jungle / Eco Property",
  "Commercial Property",
  "Other",
];

const BUDGETS = [
  "Under $250,000",
  "$250,000 – $500,000",
  "$500,000 – $1,000,000",
  "$1,000,000 – $2,500,000",
  "$2,500,000+",
  "Open / Flexible",
];

const inputClass =
  "h-[52px] w-full rounded-2xl border border-[rgba(22,17,13,0.12)] bg-white/80 px-4 text-[var(--nakma-dark)] outline-none placeholder:text-[rgba(22,17,13,0.35)] focus:border-[var(--nakma-olive)] nakma-body text-[14px]";

type FormState = {
  name: string;
  email: string;
  phone: string;
  interest: string;
  budget: string;
  message: string;
};

const EMPTY: FormState = {
  name: "",
  email: "",
  phone: "",
  interest: "",
  budget: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim()) return setError("Please share your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return setError("Please enter a valid email address.");

    // No backend yet — compose a pre-filled email so the inquiry actually goes
    // somewhere. Swap for an API route / form service when the backend exists.
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.phone && `Phone: ${form.phone}`,
      form.interest && `Interested in: ${form.interest}`,
      form.budget && `Budget: ${form.budget}`,
      "",
      form.message,
    ]
      .filter(Boolean)
      .join("\n");

    const mailto = `mailto:info@nakma.cr?subject=${encodeURIComponent(
      `Property inquiry — ${form.name}`
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[32px] bg-white/65 p-10 text-center shadow-[0_20px_60px_rgba(22,17,13,0.09)]">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--nakma-olive)]/15">
          <svg
            className="h-8 w-8 text-[var(--nakma-olive)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h2 className="nakma-display mt-6 text-[24px] font-semibold text-[var(--nakma-dark)]">
          Thank you, {form.name.split(" ")[0]}.
        </h2>
        <p className="nakma-body mt-3 max-w-sm text-[14px] leading-relaxed text-[var(--nakma-dark)]/60">
          Your email app should have opened with your inquiry ready to send. A member of
          our team will get back to you within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => {
            setForm(EMPTY);
            setSent(false);
          }}
          className="nakma-body mt-8 inline-flex h-[48px] items-center rounded-full border border-[var(--nakma-dark)]/22 px-7 text-[11px] uppercase tracking-[0.26em] text-[var(--nakma-dark)] transition hover:bg-[var(--nakma-dark)] hover:text-white"
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[32px] bg-white/65 p-8 shadow-[0_20px_60px_rgba(22,17,13,0.09)] lg:p-12"
    >
      <h2 className="nakma-display text-[22px] font-semibold text-[var(--nakma-dark)]">
        Tell us about your search
      </h2>
      <p className="nakma-body mt-2 text-[13px] text-[var(--nakma-dark)]/55">
        Name and email are required — share as much else as you like.
      </p>

      <div className="mt-8 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="nakma-body block mb-2 text-[10px] uppercase tracking-[0.32em] text-[var(--nakma-dark)]/60">
              Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Your full name"
              className={inputClass}
            />
          </div>
          <div>
            <label className="nakma-body block mb-2 text-[10px] uppercase tracking-[0.32em] text-[var(--nakma-dark)]/60">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="your@email.com"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="nakma-body block mb-2 text-[10px] uppercase tracking-[0.32em] text-[var(--nakma-dark)]/60">
            Phone / WhatsApp
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+1 (000) 000-0000"
            className={inputClass}
          />
        </div>

        <div>
          <label className="nakma-body block mb-2 text-[10px] uppercase tracking-[0.32em] text-[var(--nakma-dark)]/60">
            I'm interested in
          </label>
          <select
            value={form.interest}
            onChange={(e) => update("interest", e.target.value)}
            className={inputClass}
          >
            <option value="">Select property type</option>
            {INTERESTS.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="nakma-body block mb-2 text-[10px] uppercase tracking-[0.32em] text-[var(--nakma-dark)]/60">
            Budget Range
          </label>
          <select
            value={form.budget}
            onChange={(e) => update("budget", e.target.value)}
            className={inputClass}
          >
            <option value="">Select budget range</option>
            {BUDGETS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="nakma-body block mb-2 text-[10px] uppercase tracking-[0.32em] text-[var(--nakma-dark)]/60">
            Message
          </label>
          <textarea
            rows={5}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="Tell us what you are looking for, or any questions you have..."
            className="w-full resize-none rounded-2xl border border-[rgba(22,17,13,0.12)] bg-white/80 px-4 py-4 text-[var(--nakma-dark)] outline-none placeholder:text-[rgba(22,17,13,0.35)] focus:border-[var(--nakma-olive)] nakma-body text-[14px]"
          />
        </div>

        {error && (
          <p className="nakma-body text-[13px] text-red-600/90">{error}</p>
        )}

        <button
          type="submit"
          className="nakma-body w-full rounded-2xl bg-[var(--nakma-dark)] py-4 text-[12px] uppercase tracking-[0.28em] text-white shadow-[0_8px_30px_rgba(22,17,13,0.18)] transition hover:opacity-88"
        >
          Send Message
        </button>
      </div>
    </form>
  );
}

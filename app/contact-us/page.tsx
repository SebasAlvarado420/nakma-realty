import type { Metadata } from "next";
import ContactUsClient from "./ContactUsClient";

export const metadata: Metadata = {
  title: "Contact NAKMA Realty — Costa Rica Real Estate Advisors",
  description:
    "Talk to NAKMA Realty about buying, selling, or listing property in Costa Rica. Reach our bilingual team by email or WhatsApp — a real person replies, never an automated system.",
  alternates: { canonical: "/contact-us" },
  openGraph: {
    type: "website",
    url: "https://nakmarealty.com/contact-us",
    title: "Contact NAKMA Realty · Costa Rica Real Estate",
    description:
      "Reach our bilingual Costa Rica real estate team by email or WhatsApp.",
  },
};

export default function ContactUsPage() {
  return <ContactUsClient />;
}

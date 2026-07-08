import type { Metadata } from "next";
import AboutUsClient from "./AboutUsClient";

export const metadata: Metadata = {
  title: "About NAKMA Realty — Natural, Refined Costa Rica Real Estate",
  description:
    "NAKMA Realty is a Costa Rica real estate agency rooted in the land — curating homes, condos, land, and investment properties with intention across Guanacaste, Puntarenas, and San José.",
  alternates: { canonical: "/about-us" },
  openGraph: {
    type: "website",
    url: "https://nakmarealty.com/about-us",
    title: "About NAKMA Realty · Costa Rica Real Estate",
    description:
      "Natural, refined real estate rooted in Costa Rica. Learn the story and philosophy behind NAKMA Realty.",
  },
};

export default function AboutUsPage() {
  return <AboutUsClient />;
}

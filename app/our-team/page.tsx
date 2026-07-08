import type { Metadata } from "next";
import OurTeamClient from "./OurTeamClient";

export const metadata: Metadata = {
  title: "Our Team — Costa Rica Real Estate Advisors",
  description:
    "Meet the NAKMA Realty team — bilingual, local real estate advisors guiding buyers and sellers across Guanacaste, Puntarenas, San José, and Costa Rica's Central Pacific.",
  alternates: { canonical: "/our-team" },
  openGraph: {
    type: "website",
    url: "https://nakmarealty.com/our-team",
    title: "Our Team · NAKMA Realty",
    description:
      "Bilingual, local Costa Rica real estate advisors — meet the people behind NAKMA Realty.",
  },
};

export default function OurTeamPage() {
  return <OurTeamClient />;
}

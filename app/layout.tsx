import "./globals.css";
import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Playfair_Display,
  Plus_Jakarta_Sans,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/providers";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

// Brand wordmark + editorial serif headlines (stand-in for "Tan Mon Cheri")
const brandSerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-brand-loaded",
  display: "swap",
});

// Display headings — elegant high-contrast luxury serif (stand-in for
// "Agrandir Grand"); italics available for editorial emphasis.
const displaySerif = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display-loaded",
  display: "swap",
});

// Body + UI labels (stand-in for "Gordita")
const bodySans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body-loaded",
  display: "swap",
});

// NOTE: replace this with the real production domain when it's live.
const SITE_URL = "https://nakmarealty.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "NAKMA Realty — Luxury Real Estate in Costa Rica",
    template: "%s · NAKMA Realty",
  },
  description:
    "Discover refined homes, land, and investment properties across Costa Rica's coasts, valleys, and rainforests. NAKMA Realty — natural, refined real estate rooted in Costa Rica.",
  keywords: [
    "Costa Rica real estate",
    "luxury homes Costa Rica",
    "Guanacaste properties",
    "beachfront property Costa Rica",
    "Costa Rica investment property",
    "Tamarindo real estate",
    "Santa Teresa homes",
    "oceanfront villas Costa Rica",
    "Costa Rica luxury villas",
  ],
  authors: [{ name: "NAKMA Realty" }],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["es_CR"],
    url: SITE_URL,
    siteName: "NAKMA Realty",
    title: "NAKMA Realty — Luxury Real Estate in Costa Rica",
    description:
      "Natural, refined real estate rooted in Costa Rica. Explore curated homes, land, and investment opportunities along the coast, valley, and rainforest.",
    images: [
      {
        url: "https://images.pexels.com/photos/17302366/pexels-photo-17302366.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "Costa Rica's Pacific coast — NAKMA Realty",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NAKMA Realty — Luxury Real Estate in Costa Rica",
    description: "Natural, refined real estate rooted in Costa Rica.",
    images: [
      "https://images.pexels.com/photos/17302366/pexels-photo-17302366.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop",
    ],
  },
};

// Structured data — helps search engines understand this is a Costa Rica
// real-estate agency and enables richer results + the sitelinks search box.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "RealEstateAgent",
      "@id": `${SITE_URL}/#agency`,
      name: "NAKMA Realty",
      description:
        "Natural, refined real estate rooted in Costa Rica — curated homes, land, and investment opportunities.",
      url: SITE_URL,
      email: "info@nakmarealty.com",
      telephone: "+506 8606-0252",
      priceRange: "$$$",
      currenciesAccepted: "USD",
      areaServed: [
        { "@type": "Country", name: "Costa Rica" },
        { "@type": "AdministrativeArea", name: "Guanacaste" },
        { "@type": "AdministrativeArea", name: "Puntarenas" },
        { "@type": "AdministrativeArea", name: "San José" },
        { "@type": "Place", name: "Central Pacific" },
      ],
      address: { "@type": "PostalAddress", addressCountry: "CR" },
      knowsLanguage: ["en", "es"],
      sameAs: [
        "https://www.instagram.com/nakma.realty",
        "https://www.facebook.com/share/1BMPUF416f/",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "NAKMA Realty",
      inLanguage: ["en", "es"],
      publisher: { "@id": `${SITE_URL}/#agency` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/listings?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${brandSerif.variable} ${displaySerif.variable} ${bodySans.variable}`}
    >
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
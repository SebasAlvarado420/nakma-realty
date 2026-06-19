import Link from "next/link";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/constants";
import Reveal from "@/components/ui/Reveal";

export const metadata = {
  title: "About Us · NAKMA Realty",
  description: "NAKMA Realty — natural, refined real estate rooted in Costa Rica.",
};

const PHILOSOPHY_ITEMS = [
  {
    number: "01",
    title: "Sense of Place",
    text: "Every property we represent was chosen because of its relationship with its surroundings. Land, light, vegetation, and design come together intentionally.",
  },
  {
    number: "02",
    title: "Curated, Not Aggregated",
    text: "We don't list every property available. We work with a focused portfolio of homes and land that meet our standards for quality, location, and long-term potential.",
  },
  {
    number: "03",
    title: "Personalized by Design",
    text: "Each client has a different vision. We listen before we recommend, and guide with local knowledge that only comes from living and working in Costa Rica.",
  },
];

const ALTERNATING = [
  {
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    tag: "Rooted in Costa Rica",
    title: "A country worth knowing deeply.",
    text: "Costa Rica is the reason we exist. From the Pacific coast to the cloud forests, from the Central Valley to the Caribbean shore — each region has its own character, and we know them well. Our team lives here, works here, and believes in what this country offers.",
  },
  {
    img: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
    tag: "How We Work",
    title: "Intentional at every step.",
    text: "From the first conversation to the final signature, we move with care. We evaluate properties for their architectural quality, their environmental context, their legal clarity, and their potential. If it does not meet our standards, we do not represent it.",
  },
];

export default function AboutUsPage() {
  return (
    <div className="bg-[var(--nakma-bg)]">
      <section className="relative overflow-hidden pt-[72px]">
        <div className="relative h-[70vh] min-h-[480px]">
          <Image
            src="https://images.unsplash.com/photo-1573790387438-4da905039392?auto=format&fit=crop&w=1800&q=80"
            alt="Costa Rica landscape"
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--nakma-dark)]/80 via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-6 pb-14 lg:px-16">
            <p className="nakma-body text-[10px] uppercase tracking-[0.46em] text-[var(--nakma-sand)]/80">
              About NAKMA Realty
            </p>
            <h1 className="nakma-display mt-4 max-w-3xl text-[42px] leading-[1.04] tracking-[-0.04em] text-[var(--nakma-bg)] md:text-[60px] lg:text-[72px]">
              Built around a sense of place.
            </h1>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:items-start">
            <div>
              <p className="nakma-body text-[10px] uppercase tracking-[0.46em] text-[var(--nakma-olive)]">Our Belief</p>
              <h2 className="nakma-display mt-5 text-[32px] leading-[1.08] tracking-[-0.03em] text-[var(--nakma-dark)] md:text-[40px]">
                The right property should feel connected to its surroundings.
              </h2>
            </div>
            <div className="space-y-5 text-[15px] leading-[1.85] text-[var(--nakma-dark)]/65 nakma-body lg:pt-2">
              <p>
                NAKMA Realty is built around a simple belief: the right property should feel connected to its surroundings. We focus on homes, land, and investment opportunities that reflect Costa Rica's natural beauty, architectural potential, and long-term value.
              </p>
              <p>
                We are not a transactional agency. We are a team of people who care about the places we represent, the clients we serve, and the future we are helping to shape — one property at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--nakma-dark)] px-6 py-20 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="nakma-body text-[10px] uppercase tracking-[0.46em] text-[var(--nakma-sand)]/70">Our Philosophy</p>
          <h2 className="nakma-display mt-5 max-w-xl text-[32px] leading-[1.08] tracking-[-0.03em] text-[var(--nakma-bg)] md:text-[40px]">
            How we think about real estate.
          </h2>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {PHILOSOPHY_ITEMS.map(({ number, title, text }, i) => (
              <Reveal key={number} delay={i * 0.12} className="rounded-[24px] border border-white/8 bg-white/5 p-8">
                <p className="nakma-body font-mono text-[11px] text-[var(--nakma-sand)]/60">{number}</p>
                <h3 className="nakma-display mt-4 text-[20px] font-semibold text-[var(--nakma-bg)]">{title}</h3>
                <p className="nakma-body mt-4 text-[13px] leading-[1.8] text-white/45">{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {ALTERNATING.map(({ img, tag, title, text }, i) => (
        <section key={tag} className="px-6 py-20 lg:px-16 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className={`grid gap-14 lg:grid-cols-2 lg:gap-20 lg:items-center ${i % 2 === 1 ? "lg:[&>*:first-child]:order-last" : ""}`}>
              <div className="relative h-[420px] overflow-hidden rounded-[28px] shadow-[0_32px_80px_rgba(22,17,13,0.14)]">
                <Image
                  src={img}
                  alt={title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="nakma-body text-[10px] uppercase tracking-[0.46em] text-[var(--nakma-olive)]">{tag}</p>
                <h2 className="nakma-display mt-5 text-[30px] leading-[1.1] tracking-[-0.03em] text-[var(--nakma-dark)] md:text-[38px]">{title}</h2>
                <p className="nakma-body mt-6 text-[15px] leading-[1.85] text-[var(--nakma-dark)]/65">{text}</p>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="border-t border-[var(--nakma-dark)]/8 px-6 py-20 text-center lg:px-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="nakma-display text-[30px] leading-tight tracking-[-0.03em] text-[var(--nakma-dark)] md:text-[38px]">
            Ready to find your place in Costa Rica?
          </h2>
          <p className="nakma-body mt-5 text-[15px] leading-relaxed text-[var(--nakma-dark)]/58">
            Our team is here to help you navigate the market with clarity and local expertise.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link href="/listings" className="nakma-body inline-flex h-[54px] items-center rounded-full bg-[var(--nakma-dark)] px-8 text-[12px] uppercase tracking-[0.28em] text-white transition hover:opacity-88">
              Explore Listings
            </Link>
            <Link href="/contact-us" className="nakma-body inline-flex h-[54px] items-center rounded-full border border-[var(--nakma-dark)]/28 px-8 text-[12px] uppercase tracking-[0.28em] text-[var(--nakma-dark)] transition hover:bg-[var(--nakma-dark)] hover:text-white">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

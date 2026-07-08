import type { Metadata } from "next";
import { getAgentBySlug } from "@/data/team";
import AgentPageClient from "./AgentPageClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const agent = getAgentBySlug(slug);

  if (!agent) {
    return {
      title: "Our Team",
      description: "Meet the NAKMA Realty team — your local guides to Costa Rica real estate.",
      alternates: { canonical: `/our-team/${slug}` },
    };
  }

  const description = `${agent.role} at NAKMA Realty. ${agent.bio ?? ""}`
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

  return {
    title: `${agent.name} — ${agent.role}`,
    description,
    alternates: { canonical: `/our-team/${agent.slug}` },
    openGraph: {
      type: "profile",
      url: `https://nakmarealty.com/our-team/${agent.slug}`,
      title: `${agent.name} · NAKMA Realty`,
      description,
      images: agent.image ? [{ url: agent.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${agent.name} · NAKMA Realty`,
      description,
      images: agent.image ? [agent.image] : undefined,
    },
  };
}

export default function AgentPage() {
  return <AgentPageClient />;
}

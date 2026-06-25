export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  languages?: string[];
  email?: string;
  phone?: string;
  whatsapp?: string;
  office?: string;
};

// Team members double as the "Real Estate Agents" shown on each listing.
export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Sergio Rodríguez",
    role: "Real Estate Advisor",
    bio: "Sergio guides clients through every step of buying in Costa Rica with patience, local knowledge, and a genuine eye for properties that fit each buyer's vision.",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
    languages: ["Spanish", "English"],
    email: "srodriguez@nakmarealty.com",
    phone: "+506 8606-0252",
    whatsapp: "+506 8606-0252",
    office: "NAKMA Realty",
  },
  {
    id: "2",
    name: "Jose Mario Alvarado",
    role: "Founder & Lead Advisor",
    bio: "Jose Mario leads NAKMA Realty with deep roots in Costa Rica and a calm, clear approach to every transaction — from the first conversation to the final signature.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    languages: ["Spanish", "English"],
    email: "info@nakmarealty.com",
    phone: "+506 8606-0252",
    whatsapp: "+506 8606-0252",
    office: "NAKMA Realty",
  },
  {
    id: "4",
    name: "Jenny Chaverri",
    role: "Client Relations & Property Specialist",
    bio: "Jenny brings warmth and precision to every client relationship, evaluating properties not just for their numbers but for how they feel to live in.",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
    languages: ["Spanish", "English"],
    email: "jchaverri@nakmarealty.com",
    phone: "+506 8606-0252",
    whatsapp: "+506 8606-0252",
    office: "NAKMA Realty",
  },
  {
    id: "3",
    name: "Marcel Torres",
    role: "Investment & Land Specialist",
    bio: "Marcel focuses on investment-oriented properties and land, with a strong grasp of the legal landscape and the long-term potential of each opportunity NAKMA represents.",
    image:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=600&q=80",
    languages: ["Spanish", "English"],
    email: "mtorres@nakmarealty.com",
    phone: "+506 8606-0252",
    whatsapp: "+506 8606-0252",
    office: "NAKMA Realty",
  },
];

export function getAgent(id?: string) {
  return teamMembers.find((m) => m.id === id) ?? teamMembers[0];
}

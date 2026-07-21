export type TeamMember = {
  id: string;
  /** URL-friendly slug for the agent's own page (/our-team/<slug>). */
  slug: string;
  name: string;
  role: string;
  /** English biography (default). */
  bio: string;
  /** Spanish biography — shown when the site language is ES. */
  bioEs?: string;
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
    slug: "sergio-rodriguez",
    name: "Sergio Rodríguez",
    role: "Real Estate Advisor",
    bio: "Sergio guides clients through every step of buying in Costa Rica with patience, local knowledge, and a genuine eye for properties that fit each buyer's vision.",
    bioEs: "Sergio acompaña a sus clientes en cada paso de la compra en Costa Rica con paciencia, conocimiento local y un ojo genuino para propiedades que encajan con la visión de cada comprador.",
    image:
      "https://lh3.googleusercontent.com/d/1LjKpwBSzcjN4wwXg6NcUnv576NvxHDsf=w1200",
    languages: ["Spanish", "English"],
    email: "srodriguez@nakmarealty.com",
    phone: "+506 8323-9320",
    whatsapp: "+506 8323-9320",
    office: "Costa Rica",
  },
  {
    id: "2",
    slug: "jose-mario-alvarado",
    name: "Jose Mario Alvarado",
    role: "Founder & Lead Advisor",
    bio: "Jose Mario leads NAKMA Realty with deep roots in Costa Rica and a calm, clear approach to every transaction — from the first conversation to the final signature.",
    bioEs: "Jose Mario lidera NAKMA Realty con raíces profundas en Costa Rica y un enfoque calmado y claro en cada transacción, desde la primera conversación hasta la firma final.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    languages: ["Spanish", "English"],
    email: "info@nakmarealty.com",
    phone: "+506 8606-0252",
    whatsapp: "+506 8606-0252",
    office: "Costa Rica",
  },
  {
    id: "4",
    slug: "jenny-chaverri",
    name: "Jenny Chaverri",
    role: "Client Relations & Property Specialist",
    bio: "Born and raised in Costa Rica, Jenny Chaverri earned a Bachelor's degree in Business Administration from the University of Costa Rica (UCR). She completed both her primary and secondary education in Costa Rica before beginning her professional career in business administration.\n\nSince graduating in 2019, Jenny has built a strong background in business management and client relations. Managing companies and working closely with clients has strengthened her leadership, negotiation, communication, and customer service skills, allowing her to provide a highly personalized and professional experience.\n\nReal estate has always been one of Jenny's greatest passions. From an early age, she was drawn to architecture, interior design, and exceptional homes, spending countless hours exploring real estate and design shows that inspired her career.\n\nToday, Jenny specializes in helping clients buy and sell luxury homes, investment properties, and land throughout Costa Rica. Whether searching for a primary residence, a vacation home, or an investment opportunity, clients can expect a seamless, transparent, and enjoyable experience from start to finish.\n\nFor Jenny, real estate is about much more than buying and selling properties—it is about helping people achieve their dreams and create the lifestyle they have always envisioned. Her commitment is to build lasting relationships based on trust, integrity, and exceptional service, ensuring every client feels informed, confident, and supported throughout the entire process.\n\nThere is nothing more rewarding to Jenny than seeing her clients achieve their goals and helping them find their perfect place in one of the most beautiful countries in the world.",
    bioEs: "Nacida y criada en Costa Rica, Jenny Chaverri obtuvo un Bachillerato en Administración de Empresas de la Universidad de Costa Rica (UCR). Completó su educación primaria y secundaria en Costa Rica antes de comenzar su carrera profesional en administración de empresas.\n\nDesde que se graduó en 2019, Jenny ha construido una sólida trayectoria en gestión empresarial y relaciones con clientes. Administrar empresas y trabajar de cerca con los clientes ha fortalecido su liderazgo, negociación, comunicación y servicio al cliente, permitiéndole ofrecer una experiencia altamente personalizada y profesional.\n\nLos bienes raíces siempre han sido una de las grandes pasiones de Jenny. Desde muy joven se sintió atraída por la arquitectura, el diseño de interiores y las casas excepcionales, dedicando incontables horas a explorar programas de bienes raíces y diseño que inspiraron su carrera.\n\nHoy, Jenny se especializa en ayudar a sus clientes a comprar y vender casas de lujo, propiedades de inversión y terrenos en toda Costa Rica. Ya sea que busquen una residencia principal, una casa de vacaciones o una oportunidad de inversión, los clientes pueden esperar una experiencia fluida, transparente y placentera de principio a fin.\n\nPara Jenny, los bienes raíces son mucho más que comprar y vender propiedades: se trata de ayudar a las personas a alcanzar sus sueños y crear el estilo de vida que siempre han imaginado. Su compromiso es construir relaciones duraderas basadas en la confianza, la integridad y un servicio excepcional, asegurando que cada cliente se sienta informado, seguro y acompañado durante todo el proceso.\n\nNo hay nada más gratificante para Jenny que ver a sus clientes alcanzar sus metas y ayudarlos a encontrar su lugar perfecto en uno de los países más hermosos del mundo.",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
    languages: ["Spanish", "English"],
    email: "jchaverri@nakmarealty.com",
    phone: "+506 8810-0797",
    whatsapp: "+506 8810-0797",
    office: "Costa Rica",
  },
  {
    id: "3",
    slug: "andre-torres",
    name: "André Torres",
    role: "Legal, Risk & Investment Specialist",
    bio: "Born and raised in Costa Rica, André Torres brings together a multidisciplinary background in business administration, legal studies, insurance, and strategic risk management to provide clients with a highly analytical and trustworthy approach to real estate. His career has been built around protecting assets, evaluating complex legal scenarios, and guiding high-value decisions with confidence and precision.\n\nBefore transitioning into luxury real estate, André developed extensive experience leading technical investigations, legal claims, and risk assessment processes for international corporations and one of Latin America's leading insurance companies. This experience gave him a deep understanding of legal due diligence, contract analysis, regulatory compliance, title-related considerations, and the risk factors that can significantly impact real estate investments.\n\nToday, André works directly with established developers throughout Costa Rica's Avellanas corridor, specializing in luxury residences, investment properties, and premium land opportunities. By collaborating closely with respected development teams, he provides clients with exclusive market insight, access to carefully selected projects, and a comprehensive understanding of each property's long-term investment potential.\n\nHis approach goes beyond traditional brokerage. Every transaction is supported by careful market analysis, legal awareness, risk evaluation, and a commitment to protecting his clients' interests throughout the entire acquisition process. Whether assisting first-time buyers, seasoned investors, or families seeking a second home in Costa Rica, André is dedicated to delivering transparent guidance, strategic advice, and a seamless purchasing experience.\n\nFor André, real estate is about far more than buying or selling property—it is about helping clients make informed decisions that create lasting value, financial security, and exceptional lifestyles in one of the world's most desirable destinations.",
    bioEs: "Nacido y criado en Costa Rica, André Torres combina una formación multidisciplinaria en administración de empresas, estudios legales, seguros y gestión estratégica de riesgos para ofrecer a sus clientes un enfoque altamente analítico y confiable en el sector inmobiliario. Su carrera se ha construido alrededor de la protección de activos, la evaluación de escenarios legales complejos y el acompañamiento en decisiones de alto valor con confianza y precisión.\n\nAntes de dedicarse a los bienes raíces de lujo, André desarrolló una amplia experiencia liderando investigaciones técnicas, reclamos legales y procesos de evaluación de riesgos para corporaciones internacionales y una de las principales aseguradoras de América Latina. Esta experiencia le dio un profundo entendimiento de la debida diligencia legal, el análisis de contratos, el cumplimiento normativo, las consideraciones relacionadas con títulos de propiedad y los factores de riesgo que pueden impactar significativamente las inversiones inmobiliarias.\n\nHoy, André trabaja directamente con desarrolladores consolidados a lo largo del corredor de Avellanas en Costa Rica, especializándose en residencias de lujo, propiedades de inversión y oportunidades de terrenos premium. Al colaborar de cerca con equipos de desarrollo de prestigio, ofrece a sus clientes información de mercado exclusiva, acceso a proyectos cuidadosamente seleccionados y una comprensión integral del potencial de inversión de cada propiedad a largo plazo.\n\nSu enfoque va más allá de la intermediación tradicional. Cada transacción se respalda con un análisis cuidadoso del mercado, conciencia legal, evaluación de riesgos y el compromiso de proteger los intereses de sus clientes durante todo el proceso de adquisición. Ya sea acompañando a compradores primerizos, inversionistas experimentados o familias que buscan una segunda casa en Costa Rica, André se dedica a brindar orientación transparente, asesoría estratégica y una experiencia de compra impecable.\n\nPara André, los bienes raíces son mucho más que comprar o vender una propiedad: se trata de ayudar a los clientes a tomar decisiones informadas que generen valor duradero, seguridad financiera y estilos de vida excepcionales en uno de los destinos más deseados del mundo.",
    image:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=600&q=80",
    languages: ["Spanish", "English"],
    email: "mtorres@nakmarealty.com",
    phone: "+506 6337-2493",
    whatsapp: "+506 6337-2493",
    office: "Costa Rica",
  },
];

export function getAgent(id?: string) {
  return teamMembers.find((m) => m.id === id) ?? teamMembers[0];
}

export function getAgentBySlug(slug?: string) {
  return teamMembers.find((m) => m.slug === slug);
}

/** Return the biography in the active language (falls back to English). */
export function localizedBio(m: TeamMember, lang: string) {
  return lang === "es" && m.bioEs ? m.bioEs : m.bio;
}

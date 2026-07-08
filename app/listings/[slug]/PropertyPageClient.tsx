"use client";

import { useParams } from "next/navigation";
import { useProperties } from "@/lib/propertiescontext";
import { useLang } from "@/lib/i18n";
import { getAgent } from "@/data/team";
import PropertyDetailLX from "@/components/property/PropertyDetailLX";

export default function PropertyPageClient() {
  const params = useParams();
  const { properties } = useProperties();
  const { t } = useLang();

  const slug = typeof params.slug === "string" ? params.slug : "";
  const property = properties.find((item) => item.slug === slug);

  if (!property) {
    return (
      <section className="flex min-h-screen items-center justify-center px-6 pt-32 pb-20">
        <div className="text-center">
          <p className="nakma-body text-[11px] uppercase tracking-[0.28em] text-[var(--nakma-olive)]">
            {t("listings.notFoundEyebrow")}
          </p>
          <h1 className="nakma-display mt-4 text-4xl text-[var(--nakma-dark)]">
            {t("listings.notFoundTitle")}
          </h1>
          <p className="nakma-body mt-4 text-[var(--nakma-dark)]/60">
            {t("listings.notFoundBody")}
          </p>
        </div>
      </section>
    );
  }

  const agent = getAgent(property.agentId);

  // Related: same province first, then fill with others.
  const sameProvince = properties.filter(
    (p) => p.id !== property.id && p.province === property.province
  );
  const others = properties.filter(
    (p) => p.id !== property.id && p.province !== property.province
  );
  const related = [...sameProvince, ...others].slice(0, 3);

  return <PropertyDetailLX property={property} agent={agent} related={related} />;
}

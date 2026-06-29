"use client";

import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { useLang } from "@/lib/i18n";

// Background (beach) video. Defaults to the web-optimized local file, but can
// be pointed at a CDN URL (Cloudflare Stream/R2) via env var — no code change.
const HERO_BG_VIDEO =
  process.env.NEXT_PUBLIC_HERO_BG_VIDEO || "/videos/videohero-web.mp4";

export default function HeroVideo() {
  const { t } = useLang();
  return (
    <ScrollExpandMedia
      mediaType="video"
      mediaSrc="/videos/nakma-hero.mp4"
      bgMediaSrc={HERO_BG_VIDEO}
      eyebrow="NAKMA REALTY · COSTA RICA"
      title={t("hero.title")}
      scrollToExpand={t("hero.scroll")}
      textBlend={false}
    />
  );
}

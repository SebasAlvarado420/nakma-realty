import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.0.21",
    "192.168.0.3",
    "192.168.1.1",
    "192.168.0.*",
    "10.0.0.*",
    "localhost",
    "*.trycloudflare.com",
    "*.loca.lt",
  ],
  images: {
    // Serve modern, much smaller formats and cache optimized images for a
    // month so repeat/return visits load instantly (fixes the "sometimes slow"
    // image loads — the first optimization is cached far longer).
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2678400,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "me7aitdbxq.ufs.sh" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // Supabase Storage (uploaded property photos)
      { protocol: "https", hostname: "hiqmowapbdaspcxgoduv.supabase.co" },
    ],
  },
};

export default nextConfig;

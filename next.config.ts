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
    // Vercel image optimization: modern formats + a long (31-day) cache so
    // images stay warm. Fewer responsive breakpoints = fewer variants to
    // optimize = more cache hits. (The real speed win is shrinking the stored
    // source files — see the admin/service-role image-shrink pass.)
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2678400,
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [128, 256, 384],
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

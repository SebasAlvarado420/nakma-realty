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
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "me7aitdbxq.ufs.sh" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      // Supabase Storage (uploaded property photos)
      { protocol: "https", hostname: "hiqmowapbdaspcxgoduv.supabase.co" },
    ],
  },
};

export default nextConfig;

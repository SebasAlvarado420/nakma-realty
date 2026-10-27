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
    // Hand every photo to its own origin CDN already resized (see
    // lib/image-loader.ts) — property photos via Supabase's Pro transform CDN,
    // stock via Unsplash/Pexels. This removes Vercel's optimizer from the path
    // (no ~1.2s cache-MISS on first view) and serves small files from a global,
    // persistent edge cache.
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    // Fewer responsive breakpoints → fewer distinct transforms → more CDN hits.
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [128, 256, 384],
  },
};

export default nextConfig;

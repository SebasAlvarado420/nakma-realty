// Custom next/image loader. Instead of routing every photo through Vercel's
// optimizer (which refetches the full-size source and pays a ~1.2s cache-MISS
// penalty on first view), we hand each image off to its own origin CDN already
// resized. Property photos go through Supabase's Pro Image-Transformation CDN
// (globally, persistently cached); stock photos use Unsplash/Pexels/Google
// sizing params. Net effect: small files, served fast from a global edge.

export default function cdnLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  const q = quality ?? 72;

  // data: URIs (blur placeholders) pass straight through.
  if (src.startsWith("data:")) return src;

  // Supabase Storage → the render (transform) endpoint.
  const objMarker = "/storage/v1/object/public/";
  if (src.includes("supabase.co") && src.includes(objMarker)) {
    const base = src.split("?")[0].replace(objMarker, "/storage/v1/render/image/public/");
    return `${base}?width=${width}&quality=${q}&resize=contain`;
  }

  // Unsplash supports its own imgix-style resizing.
  if (src.includes("images.unsplash.com") || src.includes("plus.unsplash.com")) {
    return `${src.split("?")[0]}?auto=format&fit=crop&w=${width}&q=${q}`;
  }

  // Pexels resizing.
  if (src.includes("images.pexels.com")) {
    return `${src.split("?")[0]}?auto=compress&cs=tinysrgb&w=${width}`;
  }

  // Google user content (team photos) use =w<width> sizing.
  if (src.includes("lh3.googleusercontent.com")) {
    return `${src.split("=")[0]}=w${width}`;
  }

  // Unknown host: return unchanged.
  return src;
}

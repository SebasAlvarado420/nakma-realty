// Downscale + recompress an image in the browser BEFORE it is uploaded, so the
// stored property photos are lightweight (dramatically faster page loads on all
// devices). Falls back to the original file if anything fails or the image is
// already small. Runs client-side only.
export async function downscaleImage(
  file: File,
  maxDim = 2000,
  quality = 0.82
): Promise<File> {
  if (typeof window === "undefined") return file;
  if (
    !file.type.startsWith("image/") ||
    file.type === "image/gif" ||
    file.type === "image/svg+xml"
  ) {
    return file;
  }
  try {
    const bitmap = await createImageBitmap(file);
    const { width, height } = bitmap;
    const scale = Math.min(1, maxDim / Math.max(width, height));

    // Already small and light — keep the original.
    if (scale >= 1 && file.size < 900_000) {
      bitmap.close?.();
      return file;
    }

    const w = Math.max(1, Math.round(width * scale));
    const h = Math.max(1, Math.round(height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close?.();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality)
    );
    if (!blob || blob.size >= file.size) return file; // no real gain

    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

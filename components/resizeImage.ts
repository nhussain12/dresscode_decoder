// Shrinks a picked photo so it's small enough to send to /api/style.
// Big phone photos can be 5–10MB; this makes them ~100–300KB.

const MAX_SIDE = 1024; // longest side, in pixels
const JPEG_QUALITY = 0.85;

export type ResizedImage = {
  data: string; // base64 JPEG, WITHOUT the "data:image/jpeg;base64," prefix
  previewUrl: string; // full data URL, used to show the polaroid thumbnail
};

export async function fileToJpegBase64(file: File): Promise<ResizedImage> {
  // 1. Load the file into an <img> so the browser decodes it.
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("couldn't read that image"));
      el.src = objectUrl;
    });

    // 2. Work out the new size, keeping the aspect ratio. Never upscale.
    const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
    const width = Math.round(img.naturalWidth * scale);
    const height = Math.round(img.naturalHeight * scale);

    // 3. Draw it onto a canvas at that size. White background so transparent PNGs don't turn black.
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas not supported");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    // 4. Export as JPEG. toDataURL gives "data:image/jpeg;base64,AAAA..."; the API wants only the part after the comma.
    const previewUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
    const data = previewUrl.slice(previewUrl.indexOf(",") + 1);
    return { data, previewUrl };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

"use client";
/* Browser helpers for the studio: access key storage + fetch wrapper + photo resize. */
const K = "wsy-key";
export function getKey(): string {
  try { return localStorage.getItem(K) || ""; } catch { return ""; }
}
export function setKey(k: string) {
  try { localStorage.setItem(K, k); } catch { /* storage unavailable: key lives for this tab only */ }
  (globalThis as { __wsyKey?: string }).__wsyKey = k;
}
export function clearKey() {
  try { localStorage.removeItem(K); } catch { /* ignore */ }
}
function key() {
  return getKey() || (globalThis as { __wsyKey?: string }).__wsyKey || "";
}

export async function api<T = Record<string, unknown>>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("x-license-key", key());
  if (init.body && typeof init.body === "string") headers.set("content-type", "application/json");
  const res = await fetch(path, { ...init, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error((data as { error?: string }).error || "Something went wrong.") as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return data as T;
}

/** Resize and compress a photo in the browser, then upload it. Returns the public URL.
    WebP is about half the size of a JPEG at the same quality; browsers that cannot encode WebP fall back to JPEG.
    Re-drawing on a canvas also strips EXIF, so a photo's GPS location never leaves the couple's phone. */
export async function uploadPhoto(file: File, max = 1200): Promise<string> {
  const blob = await resize(file, max);
  const fd = new FormData();
  fd.append("file", blob, blob.type === "image/webp" ? "photo.webp" : "photo.jpg");
  const res = await fetch("/api/upload", { method: "POST", body: fd, headers: { "x-license-key": key() } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Upload failed.");
  return data.url as string;
}

async function resize(file: File, max: number): Promise<Blob> {
  if (!/^image\//.test(file.type)) throw new Error("Please choose a photo file.");
  const bmp = await createImageBitmap(file).catch(() => null);
  if (!bmp) throw new Error("That photo could not be read. Try a JPG or PNG.");
  const s = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * s);
  c.height = Math.round(bmp.height * s);
  c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
  const encode = (type: string, q: number) => new Promise<Blob | null>((ok) => c.toBlob(ok, type, q));
  const webp = await encode("image/webp", 0.8);
  if (webp && webp.type === "image/webp") return webp; // some browsers silently return PNG for WebP
  const jpeg = await encode("image/jpeg", 0.82);
  if (!jpeg) throw new Error("Could not process photo.");
  return jpeg;
}

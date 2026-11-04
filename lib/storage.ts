import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { supa } from "./store";

/* Photo storage: Supabase Storage bucket "photos" (public) in production,
   .data/uploads served by /api/files/<name> locally. */
const BUCKET = "photos";
export const LOCAL_DIR = path.join(process.cwd(), ".data", "uploads");

export async function savePhoto(license_id: string, bytes: Buffer, type: string): Promise<string> {
  const ext = type === "image/png" ? "png" : type === "image/webp" ? "webp" : "jpg";
  const name = `${license_id.slice(0, 8)}-${randomUUID()}.${ext}`;
  const s = supa();
  if (s) {
    // every file name is unique and never overwritten, so guests' browsers and the CDN may keep it for a year:
    // a guest who opens the invitation again downloads no photos at all
    const { error } = await s.storage.from(BUCKET).upload(`${license_id}/${name}`, bytes, { contentType: type, upsert: false, cacheControl: "31536000" });
    if (error) throw error;
    return s.storage.from(BUCKET).getPublicUrl(`${license_id}/${name}`).data.publicUrl;
  }
  await fs.mkdir(LOCAL_DIR, { recursive: true });
  await fs.writeFile(path.join(LOCAL_DIR, name), bytes);
  return `/api/files/${name}`;
}

/** Remove an invitation's own photos from storage. Only paths inside this licence's folder are touched. */
export async function deletePhotos(license_id: string, urls: string[]): Promise<number> {
  const s = supa();
  if (s) {
    const paths = urls
      .map((u) => (u.split(`/object/public/${BUCKET}/`)[1] || "").split("?")[0])
      .filter((p) => p.startsWith(`${license_id}/`));
    if (!paths.length) return 0;
    const { data, error } = await s.storage.from(BUCKET).remove(paths);
    if (error) throw error;
    return data?.length ?? 0;
  }
  let n = 0;
  for (const u of urls) {
    const name = path.basename(u.replace(/^\/api\/files\//, ""));
    if (!u.startsWith("/api/files/") || !name.startsWith(license_id.slice(0, 8))) continue;
    await fs.unlink(path.join(LOCAL_DIR, name)).then(() => n++).catch(() => {});
  }
  return n;
}

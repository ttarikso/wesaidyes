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

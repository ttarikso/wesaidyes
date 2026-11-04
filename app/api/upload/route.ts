import { NextRequest, NextResponse } from "next/server";
import { bad, limited, requireLicense } from "@/lib/auth";
import { savePhoto } from "@/lib/storage";

const MAX = 1.5 * 1024 * 1024; // the browser shrinks photos to ~100–400 KB before upload; this caps anything that skipped it
const TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
  const lic = await requireLicense(req);
  if (lic instanceof NextResponse) return lic;
  if (limited(req, "upload", 120, 60 * 60 * 1000)) return bad("Upload limit reached. Please try again later.", 429);
  const form = await req.formData().catch(() => null);
  const f = form?.get("file");
  if (!f || typeof f === "string") return bad("No file received.");
  if (!TYPES.includes(f.type)) return bad("Please upload a JPG, PNG or WebP photo.");
  if (f.size > MAX) return bad("That photo is too large. Please try again, or use a smaller photo.");
  try {
    const url = await savePhoto(lic.id, Buffer.from(await f.arrayBuffer()), f.type);
    return NextResponse.json({ url });
  } catch {
    return bad("Upload failed. Please try again.", 500);
  }
}

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { LOCAL_DIR } from "@/lib/storage";

// Local development only: serves photos saved to .data/uploads.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const name = path.basename((await params).name);
  if (!/^[a-z0-9-]+\.(jpg|png|webp)$/i.test(name)) return new NextResponse("Not found", { status: 404 });
  try {
    const buf = await fs.readFile(path.join(LOCAL_DIR, name));
    const type = name.endsWith(".png") ? "image/png" : name.endsWith(".webp") ? "image/webp" : "image/jpeg";
    return new NextResponse(new Uint8Array(buf), { headers: { "content-type": type, "cache-control": "public, max-age=31536000, immutable" } });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}

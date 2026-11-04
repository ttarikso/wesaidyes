import { NextRequest, NextResponse } from "next/server";
import { bad, requireLicense } from "@/lib/auth";
import { getInvite, slugTaken, updateInvite } from "@/lib/store";
import { normalizeInvite, slugify } from "@/lib/defaults";
import { THEMES } from "@/lib/themes";
import { TRACKS } from "@/lib/music";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const lic = await requireLicense(req);
  if (lic instanceof NextResponse) return lic;
  const inv = await getInvite((await params).id, lic.id);
  if (!inv) return bad("Invitation not found", 404);
  return NextResponse.json({ invite: inv });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const lic = await requireLicense(req);
  if (lic instanceof NextResponse) return lic;
  const { id } = await params;
  const cur = await getInvite(id, lic.id);
  if (!cur) return bad("Invitation not found", 404);
  const b = await req.json().catch(() => ({}));
  const patch: Parameters<typeof updateInvite>[2] = {};
  if (b.data !== undefined) patch.data = normalizeInvite(b.data);
  if (typeof b.theme === "string" && THEMES.some((t) => t.id === b.theme)) patch.theme = b.theme;
  if (typeof b.music === "string" && (b.music === "none" || TRACKS.some((t) => t.id === b.music))) patch.music = b.music;
  if (typeof b.published === "boolean") patch.published = b.published;
  // the 45-day limit starts at the first publish and is never reset by unpublishing
  if (b.published === true && !cur.published_at) patch.published_at = new Date().toISOString();
  if (typeof b.slug === "string") {
    const s = slugify(b.slug);
    if (s.length < 3) return bad("The link name needs at least 3 letters or numbers.");
    if (s !== cur.slug && (await slugTaken(s, id))) return bad("That link is already taken. Try adding your wedding year, e.g. " + s + "-2027.");
    patch.slug = s;
  }
  const inv = await updateInvite(id, lic.id, patch);
  return NextResponse.json({ invite: inv });
}

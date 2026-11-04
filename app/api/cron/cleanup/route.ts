import { NextRequest, NextResponse } from "next/server";
import { listEverPublished, updateInvite } from "@/lib/store";
import { deletePhotos } from "@/lib/storage";
import { endsAt } from "@/lib/expiry";

/* Daily (vercel.json): 30 days after an invitation has ended, its photos are removed from storage.
   The couple's guest list and words stay. Vercel Cron sends "Authorization: Bearer $CRON_SECRET" when that
   variable is set; without it the route still only ever touches invitations that ended a month ago. */
const GRACE_DAYS = 30;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "Not allowed" }, { status: 401 });
  const now = Date.now();
  let invitations = 0, files = 0;
  for (const inv of await listEverPublished()) {
    const end = endsAt(inv);
    if (end === null || now < end + GRACE_DAYS * 86_400_000) continue;
    const d = inv.data;
    const urls = [d.heroPhoto, ...d.storyPhotos, ...d.gallery].filter(Boolean);
    if (!urls.length) continue;
    try {
      files += await deletePhotos(inv.license_id, urls);
      await updateInvite(inv.id, inv.license_id, { data: { ...d, heroPhoto: "", storyPhotos: [], gallery: [] } });
      invitations++;
    } catch { /* try again tomorrow */ }
  }
  return NextResponse.json({ ok: true, invitations, files });
}

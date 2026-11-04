import { NextRequest, NextResponse } from "next/server";
import { bad, requireLicense } from "@/lib/auth";
import { countRsvps, createInvite, listInvites } from "@/lib/store";
import { blankInvite } from "@/lib/defaults";
import { BRAND } from "@/lib/brand";

export async function GET(req: NextRequest) {
  const lic = await requireLicense(req);
  if (lic instanceof NextResponse) return lic;
  const invites = await listInvites(lic.id);
  const withCounts = await Promise.all(invites.map(async (i) => ({ ...i, rsvpCount: await countRsvps(i.id) })));
  const limit = (lic.etsy_quantity || 1) * BRAND.invitesPerOrder;
  return NextResponse.json({ invites: withCounts, limit });
}

export async function POST(req: NextRequest) {
  const lic = await requireLicense(req);
  if (lic instanceof NextResponse) return lic;
  const existing = await listInvites(lic.id);
  const limit = (lic.etsy_quantity || 1) * BRAND.invitesPerOrder;
  if (existing.length >= limit) {
    const noun = limit === 1 ? "invitation website" : "invitation websites";
    return bad(`Your order includes ${limit} ${noun}. Edit the one${limit > 1 ? "s" : ""} you already have.`);
  }
  const inv = await createInvite(lic.id, blankInvite());
  return NextResponse.json({ invite: inv });
}

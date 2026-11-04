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
  return NextResponse.json({ invites: withCounts, limit: BRAND.invitesPerOrder });
}

export async function POST(req: NextRequest) {
  const lic = await requireLicense(req);
  if (lic instanceof NextResponse) return lic;
  const existing = await listInvites(lic.id);
  if (existing.length >= BRAND.invitesPerOrder) return bad("Your order includes " + BRAND.invitesPerOrder + " invitation website. Edit the one you already have.");
  const inv = await createInvite(lic.id, blankInvite());
  return NextResponse.json({ invite: inv });
}

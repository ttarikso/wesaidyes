import { NextRequest, NextResponse } from "next/server";
import { bad, requireLicense } from "@/lib/auth";
import { deleteRsvp, getInvite, listRsvps } from "@/lib/store";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const lic = await requireLicense(req);
  if (lic instanceof NextResponse) return lic;
  const inv = await getInvite((await params).id, lic.id);
  if (!inv) return bad("Invitation not found", 404);
  return NextResponse.json({ rsvps: await listRsvps(inv.id) });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const lic = await requireLicense(req);
  if (lic instanceof NextResponse) return lic;
  const inv = await getInvite((await params).id, lic.id);
  if (!inv) return bad("Invitation not found", 404);
  const rid = req.nextUrl.searchParams.get("rsvp") || "";
  await deleteRsvp(rid, inv.id);
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listLicenses, setLicenseStatus } from "@/lib/store";

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  return NextResponse.json({ licenses: await listLicenses() });
}

export async function PATCH(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const b = await req.json().catch(() => ({}));
  if (!b.id || !["available", "claimed", "revoked"].includes(b.status)) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  await setLicenseStatus(b.id, b.status);
  return NextResponse.json({ ok: true });
}

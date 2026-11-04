import { NextRequest, NextResponse } from "next/server";
import { requireLicense } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const lic = await requireLicense(req);
  if (lic instanceof NextResponse) return lic;
  return NextResponse.json({ order_id: lic.order_id, email: lic.email });
}

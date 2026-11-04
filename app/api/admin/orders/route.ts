import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { addOrders } from "@/lib/store";

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const b = await req.json().catch(() => ({}));
  const text = String(b.text || "");
  // Accepts plain lists or Etsy's Orders CSV: grabs every 9+ digit number.
  const ids = Array.from(text.matchAll(/\b\d{9,12}\b/g)).map((m) => m[0]);
  return NextResponse.json(await addOrders(ids));
}

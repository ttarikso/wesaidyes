import { NextRequest, NextResponse } from "next/server";
import { redeem } from "@/lib/store";
import { bad, limited } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (limited(req, "redeem", 20)) return bad("Too many attempts. Please wait a few minutes.", 429);
  const body = await req.json().catch(() => ({}));
  const r = await redeem(body.orderId, body.email);
  if (!r.ok) return bad(r.error);
  return NextResponse.json(r);
}

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getEtsyAuth } from "@/lib/store";
import { isEtsyConfigured } from "@/lib/etsy";

export async function GET(req: NextRequest) {
  const gate = requireAdmin(req);
  if (gate) return gate;

  const auth = await getEtsyAuth();
  const configured = await isEtsyConfigured();

  return NextResponse.json({
    connected: Boolean(auth && auth.access_token),
    configured,
    lastRefreshed: auth?.updated_at || null,
    expiresAt: auth?.expires_at || null,
  });
}

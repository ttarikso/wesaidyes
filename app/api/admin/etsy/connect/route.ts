import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getEtsyEnv } from "@/lib/etsy";

export async function GET(req: NextRequest) {
  const secretParam = req.nextUrl.searchParams.get("secret");
  const expectedSecret = process.env.ADMIN_SECRET || (process.env.NODE_ENV !== "production" ? "dev" : "");
  if (!expectedSecret || secretParam !== expectedSecret) {
    return NextResponse.json({ error: "Not allowed" }, { status: 401 });
  }

  const env = getEtsyEnv();
  if (!env.keystring || !env.redirectUri) {
    return NextResponse.json({ error: "Etsy environment configuration missing (ETSY_KEYSTRING, ETSY_REDIRECT_URI)" }, { status: 500 });
  }

  const code_verifier = crypto.randomBytes(32).toString("base64url");
  const code_challenge = crypto.createHash("sha256").update(code_verifier).digest("base64url");
  const state = crypto.randomBytes(16).toString("hex");

  const url = new URL("https://www.etsy.com/oauth/connect");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", env.keystring);
  url.searchParams.set("redirect_uri", env.redirectUri);
  url.searchParams.set("scope", "transactions_r");
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", code_challenge);
  url.searchParams.set("code_challenge_method", "S256");

  const res = NextResponse.redirect(url.toString());
  res.cookies.set("etsy_oauth_state", JSON.stringify({ state, code_verifier }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/admin/etsy",
    maxAge: 600, // 10 minutes
  });

  return res;
}

import { NextRequest, NextResponse } from "next/server";
import { getEtsyEnv } from "@/lib/etsy";
import { saveEtsyAuth } from "@/lib/store";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const error = req.nextUrl.searchParams.get("error");
  const errorDesc = req.nextUrl.searchParams.get("error_description");

  if (error) {
    return new NextResponse(
      `<!DOCTYPE html><html><body><h1>Etsy Connection Failed</h1><p>${error}: ${errorDesc || ""}</p><p><a href="/admin">Back to Admin</a></p></body></html>`,
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  const cookieVal = req.cookies.get("etsy_oauth_state")?.value;
  if (!cookieVal) {
    return new NextResponse(
      `<!DOCTYPE html><html><body><h1>Session Expired</h1><p>State expired or missing cookie. Please reconnect from /admin.</p><p><a href="/admin">Back to Admin</a></p></body></html>`,
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  let parsedCookie: { state: string; code_verifier: string };
  try {
    parsedCookie = JSON.parse(cookieVal);
  } catch {
    return new NextResponse(
      `<!DOCTYPE html><html><body><h1>Invalid Session</h1><p><a href="/admin">Back to Admin</a></p></body></html>`,
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  if (!state || state !== parsedCookie.state || !code) {
    return new NextResponse(
      `<!DOCTYPE html><html><body><h1>Invalid OAuth State</h1><p><a href="/admin">Back to Admin</a></p></body></html>`,
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  const env = getEtsyEnv();
  const tokenUrl = "https://api.etsy.com/v3/public/oauth/token";
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: env.keystring,
    redirect_uri: env.redirectUri,
    code,
    code_verifier: parsedCookie.code_verifier,
  });

  const tokenRes = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "x-api-key": `${env.keystring}:${env.sharedSecret}`,
    },
    body: body.toString(),
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text().catch(() => "");
    console.error("Etsy token exchange failed:", tokenRes.status, errText);
    return new NextResponse(
      `<!DOCTYPE html><html><body><h1>Connection Failed</h1><p>Could not exchange code with Etsy (HTTP ${tokenRes.status}).</p><p><a href="/admin">Back to Admin</a></p></body></html>`,
      { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  const data = await tokenRes.json();
  const expiresIn = Number(data.expires_in) || 3600;
  const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

  await saveEtsyAuth({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: expiresAt,
  });

  const res = new NextResponse(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Etsy connected · We Said Yes</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #faf9f6; color: #1c1917; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { background: #fff; border: 1px solid #e7e5e4; border-radius: 16px; padding: 36px 32px; max-width: 440px; text-align: center; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
    h1 { font-size: 22px; font-weight: 600; margin: 0 0 12px; }
    p { font-size: 14px; color: #78716c; line-height: 1.5; margin: 0 0 28px; }
    a { display: inline-block; background: #1c1917; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 9999px; font-size: 14px; font-weight: 500; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Etsy connected</h1>
    <p>The shop&apos;s Etsy API is connected. Orders can now be automatically verified before studios are opened.</p>
    <a href="/admin">Return to Admin</a>
  </div>
</body>
</html>`,
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );

  res.cookies.set("etsy_oauth_state", "", {
    httpOnly: true,
    path: "/api/admin/etsy",
    maxAge: 0,
  });

  return res;
}

import test from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { GET as getInvites, POST as postInvites } from "@/lib/../app/api/invites/route";
import { GET as getEtsyConnect } from "@/lib/../app/api/admin/etsy/connect/route";
import { GET as getEtsyCallback } from "@/lib/../app/api/admin/etsy/callback/route";
import { GET as getEtsyStatus } from "@/lib/../app/api/admin/etsy/status/route";
import { GET as getCronCleanup } from "@/lib/../app/api/cron/cleanup/route";
import { redeem, saveEtsyAuth, licenseByKey, createInvite, getInvite } from "@/lib/store";
import { blankInvite } from "@/lib/defaults";

test("API Routes Integration Tests", async (t) => {
  process.env.ADMIN_SECRET = "super_secret_admin_123";
  process.env.CRON_SECRET = "cron_secret_456";
  process.env.ETSY_KEYSTRING = "test_keystring_123";
  process.env.ETSY_SHARED_SECRET = "test_secret_456";
  process.env.ETSY_SHOP_ID = "58103810";
  process.env.ETSY_LISTING_IDS = "4609341824,4610003418";
  process.env.ETSY_REDIRECT_URI = "https://wesaidyes.site/api/admin/etsy/callback";

  await saveEtsyAuth({
    access_token: "api_route_access_token",
    refresh_token: "api_route_refresh_token",
    expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
  });

  const originalFetch = globalThis.fetch;
  t.afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  await t.test("Etsy Connect route enforces secret and returns OAuth redirect with PKCE cookie", async () => {
    // Unauthorized without secret
    const unauthorizedReq = new NextRequest("http://localhost:3000/api/admin/etsy/connect");
    const resUnauthorized = await getEtsyConnect(unauthorizedReq);
    assert.strictEqual(resUnauthorized.status, 401);

    // Authorized with secret
    const authReq = new NextRequest("http://localhost:3000/api/admin/etsy/connect?secret=super_secret_admin_123");
    const resAuth = await getEtsyConnect(authReq);
    assert.strictEqual(resAuth.status, 307); // redirect

    const redirectLocation = resAuth.headers.get("location");
    assert.ok(redirectLocation);
    assert.ok(redirectLocation.includes("https://www.etsy.com/oauth/connect"));
    assert.ok(redirectLocation.includes("client_id=test_keystring_123"));
    assert.ok(redirectLocation.includes("scope=transactions_r"));
    assert.ok(redirectLocation.includes("code_challenge="));

    const cookieHeader = resAuth.headers.get("set-cookie");
    assert.ok(cookieHeader);
    assert.ok(cookieHeader.includes("etsy_oauth_state="));
  });

  await t.test("Etsy Status route returns connection details to admin", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/etsy/status", {
      headers: { "x-admin-secret": "super_secret_admin_123" },
    });
    const res = await getEtsyStatus(req);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.connected, true);
    assert.ok(data.lastRefreshed);
  });

  await t.test("Etsy Callback exchanges code and saves tokens", async () => {
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes("/oauth/token")) {
        return new Response(
          JSON.stringify({
            access_token: "exchanged_access_token_999",
            refresh_token: "exchanged_refresh_token_999",
            expires_in: 3600,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      return new Response("Not found", { status: 404 });
    };

    const cookieState = { state: "teststate123", code_verifier: "testverifier456" };
    const req = new NextRequest("http://localhost:3000/api/admin/etsy/callback?code=etsy_code_abc&state=teststate123", {
      headers: {
        cookie: `etsy_oauth_state=${encodeURIComponent(JSON.stringify(cookieState))}`,
      },
    });

    const res = await getEtsyCallback(req);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("Etsy connected"));
  });

  await t.test("Invitations limit respects etsy_quantity (multiplier * BRAND.invitesPerOrder)", async () => {
    // Mock Etsy to return quantity = 2
    globalThis.fetch = async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/receipts/5555555555")) {
        return new Response(
          JSON.stringify({
            receipt_id: 5555555555,
            is_paid: true,
            status: "paid",
            transactions: [{ listing_id: 4609341824, quantity: 2 }],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      return new Response("Not found", { status: 404 });
    };

    const redeemRes = await redeem("5555555555", "multi@example.com");
    assert.strictEqual(redeemRes.ok, true);
    if (!redeemRes.ok) return;

    const key = redeemRes.key;

    // GET /api/invites should return limit = 2
    const getReq = new NextRequest("http://localhost:3000/api/invites", {
      headers: { "x-license-key": key },
    });
    const getRes = await getInvites(getReq);
    const getData = await getRes.json();
    assert.strictEqual(getData.limit, 2);
    assert.strictEqual(getData.invites.length, 0);

    // Create 1st invite
    const postReq1 = new NextRequest("http://localhost:3000/api/invites", {
      method: "POST",
      headers: { "x-license-key": key },
    });
    const postRes1 = await postInvites(postReq1);
    assert.strictEqual(postRes1.status, 200);

    // Create 2nd invite
    const postReq2 = new NextRequest("http://localhost:3000/api/invites", {
      method: "POST",
      headers: { "x-license-key": key },
    });
    const postRes2 = await postInvites(postReq2);
    assert.strictEqual(postRes2.status, 200);

    // Attempting 3rd invite should be rejected with limit error
    const postReq3 = new NextRequest("http://localhost:3000/api/invites", {
      method: "POST",
      headers: { "x-license-key": key },
    });
    const postRes3 = await postInvites(postReq3);
    assert.strictEqual(postRes3.status, 400);
    const postData3 = await postRes3.json();
    assert.strictEqual(
      postData3.error,
      "Your order includes 2 invitation websites. Edit the ones you already have.",
    );
  });

  await t.test("Daily cleanup cron requires secret and checks refunds", async () => {
    // Unauthorized
    const unauthReq = new NextRequest("http://localhost:3000/api/cron/cleanup");
    const unauthRes = await getCronCleanup(unauthReq);
    assert.strictEqual(unauthRes.status, 401);

    // Authorized
    const authReq = new NextRequest("http://localhost:3000/api/cron/cleanup", {
      headers: { authorization: "Bearer cron_secret_456" },
    });
    const authRes = await getCronCleanup(authReq);
    assert.strictEqual(authRes.status, 200);
    const cronData = await authRes.json();
    assert.strictEqual(cronData.ok, true);
    assert.strictEqual(typeof cronData.refundsChecked, "number");
  });
});

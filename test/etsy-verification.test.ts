import test from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "fs";
import path from "path";
import { redeem, addOrders, getEtsyAuth, saveEtsyAuth, licenseByKey, listLicenses, revokeLicenseAndUnpublish } from "@/lib/store";
import { verifyReceipt, getAccessToken, isEtsyConfigured, fetchReceiptRefundStatus } from "@/lib/etsy";

const DB_FILE = path.join(process.cwd(), ".data", "db.json");

// Helper to reset the local JSON store for clean tests
async function resetLocalDB() {
  await fs.mkdir(path.dirname(DB_FILE), { recursive: true });
  await fs.writeFile(
    DB_FILE,
    JSON.stringify(
      {
        licenses: [],
        invitations: [],
        rsvps: [],
        etsy_auth: {
          id: 1,
          access_token: "initial_access_token",
          refresh_token: "initial_refresh_token",
          expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
      null,
      1,
    ),
  );
}

test("Etsy Order Verification Suite", async (t) => {
  // Set up Etsy environment variables
  process.env.ETSY_KEYSTRING = "test_keystring_123";
  process.env.ETSY_SHARED_SECRET = "test_secret_456";
  process.env.ETSY_SHOP_ID = "58103810";
  process.env.ETSY_LISTING_IDS = "4609341824,4609341825,4610003418";
  process.env.ETSY_REDIRECT_URI = "https://wesaidyes.site/api/admin/etsy/callback";
  process.env.NODE_ENV = "test";

  await resetLocalDB();

  // Save an initial valid Etsy auth state
  await saveEtsyAuth({
    access_token: "initial_access_token",
    refresh_token: "initial_refresh_token",
    expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
  });

  const originalFetch = globalThis.fetch;

  t.afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  await t.test("1. A made-up number (e.g. 1234567890) is refused with not-found message, and no licence row is created", async () => {
    globalThis.fetch = async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/receipts/1234567890")) {
        return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
      }
      return new Response("Not found", { status: 404 });
    };

    const res = await redeem("1234567890", "stranger@example.com");
    assert.strictEqual(res.ok, false);
    if (!res.ok) {
      assert.strictEqual(
        res.error,
        "We couldn't find this order. Check the number in Etsy under Purchases and reviews: it's the number after Order #.",
      );
    }

    const all = await listLicenses();
    assert.strictEqual(all.some((l) => l.order_id === "1234567890"), false);
  });

  await t.test("2. A real past order from the shop for a DIFFERENT listing is refused with other-listing message", async () => {
    globalThis.fetch = async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/receipts/2222222222")) {
        return new Response(
          JSON.stringify({
            receipt_id: 2222222222,
            is_paid: true,
            status: "completed",
            transactions: [
              { listing_id: 9999999999, quantity: 1 }, // different product
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      return new Response("Not found", { status: 404 });
    };

    const res = await redeem("2222222222", "different@example.com");
    assert.strictEqual(res.ok, false);
    if (!res.ok) {
      assert.strictEqual(
        res.error,
        "This order isn't for a We Said Yes invitation. Message us on Etsy if you think that's a mistake.",
      );
    }

    const all = await listLicenses();
    assert.strictEqual(all.some((l) => l.order_id === "2222222222"), false);
  });

  await t.test("3. A real order containing the We Said Yes listing opens the studio with correct source and etsy_quantity", async () => {
    globalThis.fetch = async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/receipts/3333333333")) {
        return new Response(
          JSON.stringify({
            receipt_id: 3333333333,
            is_paid: true,
            status: "paid",
            transactions: [
              { listing_id: 4609341824, quantity: 3 }, // We Said Yes listing, qty 3
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      return new Response("Not found", { status: 404 });
    };

    const res = await redeem("3333333333", "sarah@example.com");
    assert.strictEqual(res.ok, true);
    if (res.ok) {
      assert.match(res.key, /^WSY-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
      assert.strictEqual(res.recovered, false);

      const lic = await licenseByKey(res.key);
      assert.ok(lic);
      assert.strictEqual(lic.order_id, "3333333333");
      assert.strictEqual(lic.source, "etsy");
      assert.strictEqual(lic.etsy_quantity, 3);
      assert.strictEqual(lic.etsy_status, "paid");
      assert.ok(lic.verified_at);
    }
  });

  await t.test("4. Same order + same email signs back in; same order + different email is refused", async () => {
    // Same email signs back in (recovered = true)
    const res1 = await redeem("3333333333", "sarah@example.com");
    assert.strictEqual(res1.ok, true);
    if (res1.ok) {
      assert.strictEqual(res1.recovered, true);
    }

    // Different email is refused
    const res2 = await redeem("3333333333", "someoneelse@example.com");
    assert.strictEqual(res2.ok, false);
    if (!res2.ok) {
      assert.strictEqual(
        res2.error,
        "This order was already activated with a different email. Message us on Etsy if you need help.",
      );
    }
  });

  await t.test("5. Test order 9000000001 (pre-added, available) still works without calling Etsy", async () => {
    await addOrders(["9000000001"]);

    let etsyCalled = false;
    globalThis.fetch = async () => {
      etsyCalled = true;
      throw new Error("Etsy API should not be called for pre-seeded available orders!");
    };

    const res = await redeem("9000000001", "tester@example.com");
    assert.strictEqual(res.ok, true);
    assert.strictEqual(etsyCalled, false);
    if (res.ok) {
      assert.match(res.key, /^WSY-/);
      assert.strictEqual(res.recovered, false);
      const lic = await licenseByKey(res.key);
      assert.ok(lic);
      assert.strictEqual(lic.status, "claimed");
      assert.strictEqual(lic.source, "manual");
    }
  });

  await t.test("6. With Etsy unreachable (mock timeout), the buyer sees try-again message and no licence is created", async () => {
    globalThis.fetch = async () => {
      const err = new Error("The operation was aborted due to timeout");
      err.name = "TimeoutError";
      throw err;
    };

    const res = await redeem("6666666666", "timeout@example.com");
    assert.strictEqual(res.ok, false);
    if (!res.ok) {
      assert.strictEqual(
        res.error,
        "We couldn't reach Etsy to check your order. Please try again in a few minutes.",
      );
    }

    const all = await listLicenses();
    assert.strictEqual(all.some((l) => l.order_id === "6666666666"), false);
  });

  await t.test("7. An expired access token is refreshed and the new refresh token is saved", async () => {
    // Set token to have expired 10 minutes ago
    await saveEtsyAuth({
      access_token: "expired_token",
      refresh_token: "old_refresh_token_xyz",
      expires_at: new Date(Date.now() - 600 * 1000).toISOString(),
    });

    let tokenEndpointCalled = false;
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes("/oauth/token")) {
        tokenEndpointCalled = true;
        assert.strictEqual(init?.method, "POST");
        const bodyStr = String(init?.body || "");
        assert.ok(bodyStr.includes("grant_type=refresh_token"));
        assert.ok(bodyStr.includes("refresh_token=old_refresh_token_xyz"));
        return new Response(
          JSON.stringify({
            access_token: "freshly_refreshed_access_token_777",
            refresh_token: "brand_new_refresh_token_888",
            expires_in: 3600,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      return new Response("Not found", { status: 404 });
    };

    const token = await getAccessToken();
    assert.strictEqual(token, "freshly_refreshed_access_token_777");
    assert.strictEqual(tokenEndpointCalled, true);

    const savedAuth = await getEtsyAuth();
    assert.ok(savedAuth);
    assert.strictEqual(savedAuth.access_token, "freshly_refreshed_access_token_777");
    assert.strictEqual(savedAuth.refresh_token, "brand_new_refresh_token_888");
    assert.ok(new Date(savedAuth.expires_at).getTime() > Date.now());
  });

  await t.test("Unpaid and Refunded orders are properly rejected", async () => {
    // Unpaid / Payment processing
    globalThis.fetch = async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/receipts/7000000001")) {
        return new Response(
          JSON.stringify({
            receipt_id: 7000000001,
            is_paid: false,
            status: "payment processing",
            transactions: [{ listing_id: 4609341824, quantity: 1 }],
          }),
          { status: 200 },
        );
      }
      if (url.includes("/receipts/7000000002")) {
        return new Response(
          JSON.stringify({
            receipt_id: 7000000002,
            is_paid: true,
            status: "canceled",
            transactions: [{ listing_id: 4609341824, quantity: 1 }],
          }),
          { status: 200 },
        );
      }
      return new Response("Not found", { status: 404 });
    };

    const resUnpaid = await redeem("7000000001", "unpaid@example.com");
    assert.strictEqual(resUnpaid.ok, false);
    if (!resUnpaid.ok) {
      assert.strictEqual(resUnpaid.error, "Etsy is still processing your payment. Please try again in a few minutes.");
    }

    const resRefunded = await redeem("7000000002", "refunded@example.com");
    assert.strictEqual(resRefunded.ok, false);
    if (!resRefunded.ok) {
      assert.strictEqual(resRefunded.error, "This order was cancelled or refunded, so it can't be activated.");
    }
  });

  await t.test("Daily refund check identifies canceled / refunded orders", async () => {
    globalThis.fetch = async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/receipts/8000000001")) {
        return new Response(
          JSON.stringify({ receipt_id: 8000000001, status: "fully refunded", is_paid: true }),
          { status: 200 },
        );
      }
      if (url.includes("/receipts/8000000002")) {
        return new Response(
          JSON.stringify({ receipt_id: 8000000002, status: "completed", is_paid: true }),
          { status: 200 },
        );
      }
      return new Response("Not found", { status: 404 });
    };

    const refunded = await fetchReceiptRefundStatus("8000000001");
    assert.ok(refunded);
    assert.strictEqual(refunded.isCanceledOrRefunded, true);

    const normal = await fetchReceiptRefundStatus("8000000002");
    assert.ok(normal);
    assert.strictEqual(normal.isCanceledOrRefunded, false);
  });
});

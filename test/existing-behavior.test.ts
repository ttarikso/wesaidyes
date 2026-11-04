import test from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "fs";
import path from "path";
import { createInvite, updateInvite, addRsvp, listRsvps, listInvites, countRsvps, redeem } from "@/lib/store";
import { blankInvite } from "@/lib/defaults";
import { hasEnded, endsAt } from "@/lib/expiry";
import { BRAND } from "@/lib/brand";

const DB_FILE = path.join(process.cwd(), ".data", "db.json");

test("Existing Behavior & Expiry Test Suite", async (t) => {
  try {
    await fs.rm(path.dirname(DB_FILE), { recursive: true, force: true });
  } catch {}

  // 1. Studio end-to-end flow
  await t.test("Create invite, customize, publish, and RSVP", async () => {
    // In test / dev mode, auto-provision creates licence
    process.env.NODE_ENV = "test";
    const res = await redeem("9999999991", "bride@example.com");
    assert.strictEqual(res.ok, true);
    if (!res.ok) return;

    const data = blankInvite();
    data.partner1 = "Emma";
    data.partner2 = "Liam";
    data.date = "2027-06-20";

    const inv = await createInvite("test-license-id", data);
    assert.ok(inv.id);
    assert.strictEqual(inv.published, false);
    assert.ok(inv.slug.includes("emma-and-liam"));

    // Update invite (publish)
    const pubDate = new Date().toISOString();
    const updated = await updateInvite(inv.id, "test-license-id", {
      published: true,
      published_at: pubDate,
    });
    assert.ok(updated);
    assert.strictEqual(updated.published, true);
    assert.strictEqual(updated.published_at, pubDate);

    // RSVP flow
    const rsvp = await addRsvp({
      invitation_id: inv.id,
      name: "John Doe",
      email: "john@example.com",
      attending: true,
      guests: 1,
      guest_names: "Jane Doe",
      meal: "Fish",
      diet: "None",
      song: "Perfect - Ed Sheeran",
      message: "Congratulations!",
      custom: "",
    });
    assert.ok(rsvp.id);
    assert.strictEqual(rsvp.name, "John Doe");

    const rsvps = await listRsvps(inv.id);
    assert.strictEqual(rsvps.length, 1);
    assert.strictEqual(rsvps[0].name, "John Doe");

    const count = await countRsvps(inv.id);
    assert.strictEqual(count, 1);
  });

  // 2. Expiry logic (45-day publish limit and wedding + 7 days)
  await t.test("Expiry calculation rules", async () => {
    const data = blankInvite();
    data.date = "2027-06-20";

    const inv = {
      id: "inv-1",
      license_id: "lic-1",
      slug: "wedding-test",
      theme: "editorial",
      music: "none",
      published: true,
      published_at: new Date(Date.now() - 10 * 86_400_000).toISOString(), // published 10 days ago
      data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Not yet expired
    assert.strictEqual(hasEnded(inv), false);

    // Expired due to 45 days after publish:
    const invPublishedLongAgo = {
      ...inv,
      published_at: new Date(Date.now() - 46 * 86_400_000).toISOString(),
    };
    assert.strictEqual(hasEnded(invPublishedLongAgo), true);

    // Expired due to wedding + 7 days passed:
    const invPastWedding = {
      ...inv,
      published_at: new Date(Date.now() - 10 * 86_400_000).toISOString(),
      data: { ...data, date: "2026-10-01" }, // wedding was over a month ago
    };
    assert.strictEqual(hasEnded(invPastWedding), true);
  });
});

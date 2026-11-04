import { randomBytes, randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { EtsyAuth, Invitation, InviteData, License, Rsvp } from "./types";
import { slugify, RESERVED_SLUGS } from "./defaults";
import { DEFAULT_THEME } from "./themes";
import { isEtsyConfigured, verifyReceipt } from "./etsy";

/* Data store. Uses Supabase (service role, server only) when SUPABASE_URL and
   SUPABASE_SERVICE_ROLE_KEY are set; otherwise a local JSON file for development. */

const SB_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
let sb: SupabaseClient | null = null;
export function supa() {
  if (!SB_URL || !SB_KEY) return null;
  if (!sb) sb = createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });
  return sb;
}

interface DB {
  licenses: License[];
  invitations: Invitation[];
  rsvps: Rsvp[];
  etsy_auth?: EtsyAuth | null;
}
const FILE = path.join(process.cwd(), ".data", "db.json");

async function readDB(): Promise<DB> {
  try {
    const db = JSON.parse(await fs.readFile(FILE, "utf8")) as DB;
    db.licenses ||= [];
    db.invitations ||= [];
    db.rsvps ||= [];
    db.etsy_auth ||= null;
    for (const lic of db.licenses) {
      lic.source ||= lic.status === "claimed" ? "legacy" : "manual";
      lic.etsy_quantity ||= 1;
      lic.etsy_status ??= null;
      lic.verified_at ??= null;
    }
    return db;
  } catch {
    const db: DB = { licenses: [], invitations: [], rsvps: [], etsy_auth: null };
    await writeDB(db);
    return db;
  }
}
async function writeDB(db: DB) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(db, null, 1));
}

const ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function code(n: number) {
  return Array.from(randomBytes(n), (x) => ALPHA[x % ALPHA.length]).join("");
}
export const newKey = () => `WSY-${code(4)}-${code(4)}-${code(4)}`;
export const normOrder = (s: string) => String(s || "").replace(/[^0-9A-Za-z]/g, "").toUpperCase();
const normEmail = (s: string) => String(s || "").trim().toLowerCase();
const now = () => new Date().toISOString();

// ------------------------------------------------------------------ Etsy Auth
export async function getEtsyAuth(): Promise<EtsyAuth | null> {
  const s = supa();
  if (s) {
    const { data } = await s.from("etsy_auth").select("*").eq("id", 1).maybeSingle();
    return (data as EtsyAuth) || null;
  }
  return (await readDB()).etsy_auth || null;
}

export async function saveEtsyAuth(auth: {
  access_token: string;
  refresh_token: string;
  expires_at: string;
}): Promise<void> {
  const s = supa();
  const row: EtsyAuth = {
    id: 1,
    access_token: auth.access_token,
    refresh_token: auth.refresh_token,
    expires_at: auth.expires_at,
    updated_at: now(),
  };
  if (s) {
    await s.from("etsy_auth").upsert(row);
  } else {
    const db = await readDB();
    db.etsy_auth = row;
    await writeDB(db);
  }
}

// ------------------------------------------------------------------ licenses
export async function licenseByKey(key: string): Promise<License | null> {
  if (!key) return null;
  const s = supa();
  if (s) {
    const { data } = await s.from("licenses").select("*").eq("key", key).eq("status", "claimed").maybeSingle();
    return (data as License) || null;
  }
  return (await readDB()).licenses.find((l) => l.key === key && l.status === "claimed") || null;
}

export type RedeemResult = { ok: true; key: string; recovered: boolean } | { ok: false; error: string };

/** Etsy order number + email -> access key.
    - Revoked orders are refused.
    - Claimed orders allow sign-in with same email.
    - Pre-added orders in /admin (status = 'available') are claimed immediately without Etsy check.
    - Unknown orders are verified with Etsy API (real, paid, We Said Yes listing). */
export async function redeem(orderRaw: string, emailRaw: string): Promise<RedeemResult> {
  const order_id = normOrder(orderRaw);
  const email = normEmail(emailRaw);
  if (!order_id || order_id.length < 6 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: "Please enter your Etsy order number (at least 6 digits) and a valid email address." };
  }
  const s = supa();
  let lic: License | null;
  if (s) {
    const { data } = await s.from("licenses").select("*").eq("order_id", order_id).maybeSingle();
    lic = (data as License) || null;
  } else {
    lic = (await readDB()).licenses.find((l) => l.order_id === order_id) || null;
  }
  if (lic?.status === "revoked") {
    return { ok: false, error: "This order's access has been revoked. Please message us on Etsy if you need help." };
  }
  if (lic?.status === "claimed") {
    if (lic.email === email && lic.key) return { ok: true, key: lic.key, recovered: true };
    return { ok: false, error: "This order was already activated with a different email. Message us on Etsy if you need help." };
  }

  const key = newKey();
  const t = now();

  // Pre-added manual override / test orders (e.g. 9000000001)
  if (lic && lic.status === "available") {
    const patch = { status: "claimed" as const, email, key, claimed_at: t };
    if (s) {
      const { error } = await s.from("licenses").update(patch).eq("id", lic.id).eq("status", "available");
      if (error) return { ok: false, error: "Something went wrong. Please try again." };
    } else {
      const db = await readDB();
      Object.assign(db.licenses.find((l) => l.id === lic!.id)!, patch);
      await writeDB(db);
    }
    return { ok: true, key, recovered: false };
  }

  // Unknown order: check Etsy configuration
  const configured = await isEtsyConfigured();
  if (!configured) {
    if (process.env.NODE_ENV === "production") {
      return {
        ok: false,
        error: "We can't activate orders right now. Please message us on Etsy and we'll set you up.",
      };
    }
    // Development fallback so local tests and dev run without Etsy
    const row: License = {
      id: randomUUID(),
      order_id,
      email,
      key,
      status: "claimed",
      source: "manual",
      etsy_quantity: 1,
      created_at: t,
      claimed_at: t,
    };
    if (s) {
      const { error } = await s.from("licenses").insert(row);
      if (error) {
        return { ok: false, error: "This order was already activated with a different email. Message us on Etsy if you need help." };
      }
    } else {
      const db = await readDB();
      if (db.licenses.some((l) => l.order_id === order_id)) {
        return { ok: false, error: "This order was already activated with a different email. Message us on Etsy if you need help." };
      }
      db.licenses.push(row);
      await writeDB(db);
    }
    return { ok: true, key, recovered: false };
  }

  // Verify against Etsy API
  const verdict = await verifyReceipt(order_id);
  if (!verdict.ok) {
    switch (verdict.reason) {
      case "not_found":
        return {
          ok: false,
          error: "We couldn't find this order. Check the number in Etsy under Purchases and reviews: it's the number after Order #.",
        };
      case "other_listing":
        return {
          ok: false,
          error: "This order isn't for a We Said Yes invitation. Message us on Etsy if you think that's a mistake.",
        };
      case "refunded":
        return {
          ok: false,
          error: "This order was cancelled or refunded, so it can't be activated.",
        };
      case "unpaid":
        return {
          ok: false,
          error: "Etsy is still processing your payment. Please try again in a few minutes.",
        };
      case "unavailable":
        return {
          ok: false,
          error: "We couldn't reach Etsy to check your order. Please try again in a few minutes.",
        };
    }
  }

  const row: License = {
    id: randomUUID(),
    order_id,
    email,
    key,
    status: "claimed",
    source: "etsy",
    etsy_quantity: verdict.quantity,
    etsy_status: verdict.status,
    verified_at: t,
    created_at: t,
    claimed_at: t,
  };

  if (s) {
    const { error } = await s.from("licenses").insert(row);
    if (error) {
      // Handles race condition when two requests try inserting the same order_id
      return { ok: false, error: "This order was already activated with a different email. Message us on Etsy if you need help." };
    }
  } else {
    const db = await readDB();
    if (db.licenses.some((l) => l.order_id === order_id)) {
      return { ok: false, error: "This order was already activated with a different email. Message us on Etsy if you need help." };
    }
    db.licenses.push(row);
    await writeDB(db);
  }

  return { ok: true, key, recovered: false };
}

export async function addOrders(ids: string[]): Promise<{ added: number; skipped: number }> {
  const clean = Array.from(new Set(ids.map(normOrder).filter((x) => x.length >= 6)));
  const s = supa();
  if (s) {
    const { data: existing } = await s.from("licenses").select("order_id").in("order_id", clean);
    const have = new Set((existing || []).map((r: { order_id: string }) => r.order_id));
    const rows = clean.filter((x) => !have.has(x)).map((order_id) => ({
      order_id,
      status: "available",
      source: "manual",
      etsy_quantity: 1,
    }));
    if (rows.length) await s.from("licenses").insert(rows);
    return { added: rows.length, skipped: clean.length - rows.length };
  }
  const db = await readDB();
  const have = new Set(db.licenses.map((l) => l.order_id));
  let added = 0;
  for (const order_id of clean) {
    if (have.has(order_id)) continue;
    db.licenses.push({
      id: randomUUID(),
      order_id,
      email: null,
      key: null,
      status: "available",
      source: "manual",
      etsy_quantity: 1,
      created_at: now(),
      claimed_at: null,
    });
    added++;
  }
  await writeDB(db);
  return { added, skipped: clean.length - added };
}

export async function listLicenses(): Promise<License[]> {
  const s = supa();
  if (s) {
    const { data } = await s.from("licenses").select("*").order("created_at", { ascending: false }).limit(2000);
    return (data as License[]) || [];
  }
  return (await readDB()).licenses.slice().reverse();
}

export async function setLicenseStatus(id: string, status: License["status"]) {
  const s = supa();
  if (s) {
    await s.from("licenses").update({ status }).eq("id", id);
    return;
  }
  const db = await readDB();
  const l = db.licenses.find((x) => x.id === id);
  if (l) l.status = status;
  await writeDB(db);
}

/** Get Etsy-verified licenses from the last N days (for refund cron). */
export async function listEtsyLicensesForRefundCheck(sinceIso: string): Promise<License[]> {
  const s = supa();
  if (s) {
    const { data } = await s
      .from("licenses")
      .select("*")
      .eq("source", "etsy")
      .neq("status", "revoked")
      .gte("verified_at", sinceIso);
    return (data as License[]) || [];
  }
  const db = await readDB();
  return db.licenses.filter(
    (l) => l.source === "etsy" && l.status !== "revoked" && l.verified_at && l.verified_at >= sinceIso,
  );
}

/** Revoke a license and unpublish its invitations (e.g. on refund). */
export async function revokeLicenseAndUnpublish(licenseId: string): Promise<void> {
  const s = supa();
  if (s) {
    await s.from("licenses").update({ status: "revoked" }).eq("id", licenseId);
    await s.from("invitations").update({ published: false }).eq("license_id", licenseId);
    return;
  }
  const db = await readDB();
  const lic = db.licenses.find((l) => l.id === licenseId);
  if (lic) lic.status = "revoked";
  for (const inv of db.invitations) {
    if (inv.license_id === licenseId) {
      inv.published = false;
    }
  }
  await writeDB(db);
}

// ------------------------------------------------------------------ invitations
export async function listInvites(license_id: string): Promise<Invitation[]> {
  const s = supa();
  if (s) {
    const { data } = await s.from("invitations").select("*").eq("license_id", license_id).order("created_at");
    return (data as Invitation[]) || [];
  }
  return (await readDB()).invitations.filter((i) => i.license_id === license_id);
}

export async function getInvite(id: string, license_id: string): Promise<Invitation | null> {
  const s = supa();
  if (s) {
    const { data } = await s.from("invitations").select("*").eq("id", id).eq("license_id", license_id).maybeSingle();
    return (data as Invitation) || null;
  }
  return (await readDB()).invitations.find((i) => i.id === id && i.license_id === license_id) || null;
}

export async function inviteBySlug(slug: string): Promise<Invitation | null> {
  const s = supa();
  if (s) {
    const { data } = await s.from("invitations").select("*").eq("slug", slug).maybeSingle();
    return (data as Invitation) || null;
  }
  return (await readDB()).invitations.find((i) => i.slug === slug) || null;
}

export async function slugTaken(slug: string, exceptId?: string): Promise<boolean> {
  if (RESERVED_SLUGS.has(slug)) return true;
  const i = await inviteBySlug(slug);
  return !!i && i.id !== exceptId;
}

async function freeSlug(base: string, exceptId?: string) {
  const root = slugify(base) || "our-wedding";
  if (!(await slugTaken(root, exceptId))) return root;
  for (let n = 0; n < 20; n++) {
    const s = `${root}-${code(3).toLowerCase()}`;
    if (!(await slugTaken(s, exceptId))) return s;
  }
  return `${root}-${randomUUID().slice(0, 8)}`;
}

export async function createInvite(license_id: string, data: InviteData): Promise<Invitation> {
  const t = now();
  const row: Invitation = {
    id: randomUUID(),
    license_id,
    slug: await freeSlug(`${data.partner1}-and-${data.partner2}`),
    theme: DEFAULT_THEME,
    music: "first-light",
    published: false,
    published_at: null,
    data,
    created_at: t,
    updated_at: t,
  };
  const s = supa();
  if (s) {
    const { data: d, error } = await s.from("invitations").insert(row).select("*").single();
    if (error) throw error;
    return d as Invitation;
  }
  const db = await readDB();
  db.invitations.push(row);
  await writeDB(db);
  return row;
}

export async function updateInvite(
  id: string,
  license_id: string,
  patch: Partial<Pick<Invitation, "slug" | "theme" | "music" | "published" | "published_at" | "data">>,
): Promise<Invitation | null> {
  const p = { ...patch, updated_at: now() };
  const s = supa();
  if (s) {
    const { data } = await s.from("invitations").update(p).eq("id", id).eq("license_id", license_id).select("*").maybeSingle();
    return (data as Invitation) || null;
  }
  const db = await readDB();
  const i = db.invitations.find((x) => x.id === id && x.license_id === license_id);
  if (!i) return null;
  Object.assign(i, p);
  await writeDB(db);
  return i;
}

// ------------------------------------------------------------------ rsvps
export async function addRsvp(r: Omit<Rsvp, "id" | "created_at">): Promise<Rsvp> {
  const row: Rsvp = { ...r, id: randomUUID(), created_at: now() };
  const s = supa();
  if (s) {
    const { error } = await s.from("rsvps").insert(row);
    if (error) throw error;
    return row;
  }
  const db = await readDB();
  db.rsvps.push(row);
  await writeDB(db);
  return row;
}

export async function listRsvps(invitation_id: string): Promise<Rsvp[]> {
  const s = supa();
  if (s) {
    const { data } = await s.from("rsvps").select("*").eq("invitation_id", invitation_id).order("created_at", { ascending: false });
    return (data as Rsvp[]) || [];
  }
  return (await readDB()).rsvps.filter((r) => r.invitation_id === invitation_id).reverse();
}

export async function deleteRsvp(id: string, invitation_id: string) {
  const s = supa();
  if (s) { await s.from("rsvps").delete().eq("id", id).eq("invitation_id", invitation_id); return; }
  const db = await readDB();
  db.rsvps = db.rsvps.filter((r) => !(r.id === id && r.invitation_id === invitation_id));
  await writeDB(db);
}

export async function countRsvps(invitation_id: string): Promise<number> {
  const s = supa();
  if (s) {
    const { count } = await s.from("rsvps").select("id", { count: "exact", head: true }).eq("invitation_id", invitation_id);
    return count || 0;
  }
  return (await readDB()).rsvps.filter((r) => r.invitation_id === invitation_id).length;
}

/** Every invitation that has ever been published (for the daily clean-up). */
export async function listEverPublished(): Promise<Invitation[]> {
  const s = supa();
  if (s) {
    const { data } = await s.from("invitations").select("*").not("published_at", "is", null).limit(5000);
    return (data as Invitation[]) || [];
  }
  const db = await readDB();
  return db.invitations.filter((i) => !!i.published_at);
}

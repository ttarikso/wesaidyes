import { NextRequest, NextResponse } from "next/server";
import { licenseByKey } from "./store";
import type { License } from "./types";

export async function requireLicense(req: NextRequest): Promise<License | NextResponse> {
  const key = (req.headers.get("x-license-key") || "").trim().toUpperCase();
  const lic = await licenseByKey(key);
  if (!lic) return NextResponse.json({ error: "Your access key was not recognised. Please sign in again." }, { status: 401 });
  return lic;
}

export function requireAdmin(req: NextRequest): NextResponse | null {
  const secret = process.env.ADMIN_SECRET || (process.env.NODE_ENV !== "production" ? "dev" : "");
  if (!secret || req.headers.get("x-admin-secret") !== secret) return NextResponse.json({ error: "Not allowed" }, { status: 401 });
  return null;
}

export const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

const hits = new Map<string, { n: number; t: number }>();
/** Tiny in-memory limiter (per server instance). Returns true when over the limit. */
export function limited(req: NextRequest, bucket: string, max: number, windowMs = 10 * 60 * 1000) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const k = `${bucket}:${ip}`;
  const h = hits.get(k) || { n: 0, t: Date.now() };
  if (Date.now() - h.t > windowMs) { h.n = 0; h.t = Date.now(); }
  h.n++;
  hits.set(k, h);
  return h.n > max;
}

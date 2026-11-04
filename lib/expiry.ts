/* How long an invitation stays online.
   It ends 7 days after the wedding date, and never later than 45 days after it was first published.
   The 45 days start the first time the couple publishes; unpublishing and publishing again does not restart them. */
import type { Invitation } from "./types";

export const MAX_LIVE_DAYS = 45;
export const DAYS_AFTER_WEDDING = 7;
const DAY = 86_400_000;

/** The wedding day's last moment (UTC), or null when no valid date is set. */
function weddingEnd(date: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "")) return null;
  const t = Date.parse(`${date}T23:59:59Z`);
  return Number.isFinite(t) ? t : null;
}

/** When an invitation published at `publishedAt` (ms) ends. */
export function endFor(publishedAt: number, weddingDate: string): number {
  const cap = publishedAt + MAX_LIVE_DAYS * DAY;
  const w = weddingEnd(weddingDate);
  return w === null ? cap : Math.min(cap, w + DAYS_AFTER_WEDDING * DAY);
}

/** End time of a published invitation, or null if it has never been published. */
export function endsAt(inv: Pick<Invitation, "published_at" | "data">): number | null {
  if (!inv.published_at) return null;
  const p = Date.parse(inv.published_at);
  return Number.isFinite(p) ? endFor(p, inv.data.date) : null;
}

export function hasEnded(inv: Pick<Invitation, "published_at" | "data">, now = Date.now()): boolean {
  const e = endsAt(inv);
  return e !== null && now > e;
}

/** For a couple who has not published yet: publishing today would end the invitation before the wedding. */
export function publishTooEarly(weddingDate: string, now = Date.now()): { endsOn: number; publishFrom: number } | null {
  const w = weddingEnd(weddingDate);
  if (w === null) return null;
  const endsOn = endFor(now, weddingDate);
  if (endsOn >= w) return null;
  return { endsOn, publishFrom: w - MAX_LIVE_DAYS * DAY + DAY };
}

export function fmtDay(ms: number): string {
  return new Date(ms).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

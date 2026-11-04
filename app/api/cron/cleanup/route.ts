import { NextRequest, NextResponse } from "next/server";
import { listEverPublished, updateInvite, listEtsyLicensesForRefundCheck, revokeLicenseAndUnpublish } from "@/lib/store";
import { deletePhotos } from "@/lib/storage";
import { endsAt } from "@/lib/expiry";
import { fetchReceiptRefundStatus } from "@/lib/etsy";

/* Daily (vercel.json):
   1. 30 days after an invitation has ended, its photos are removed from storage.
   2. For licences verified in the last 60 days via Etsy, re-fetch receipt; if canceled
      or fully refunded, revoke the licence and unpublish invitations.
   Vercel Cron sends "Authorization: Bearer $CRON_SECRET" when set. */
const GRACE_DAYS = 30;
const REFUND_WINDOW_DAYS = 60;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Not allowed" }, { status: 401 });
  }

  const now = Date.now();
  let invitations = 0;
  let files = 0;

  // 1. Photo cleanup for ended invitations
  for (const inv of await listEverPublished()) {
    const end = endsAt(inv);
    if (end === null || now < end + GRACE_DAYS * 86_400_000) continue;
    const d = inv.data;
    const urls = [d.heroPhoto, ...d.storyPhotos, ...d.gallery].filter(Boolean);
    if (!urls.length) continue;
    try {
      files += await deletePhotos(inv.license_id, urls);
      await updateInvite(inv.id, inv.license_id, { data: { ...d, heroPhoto: "", storyPhotos: [], gallery: [] } });
      invitations++;
    } catch {
      /* try again tomorrow */
    }
  }

  // 2. Daily Etsy refund check (last 60 days)
  let refundsChecked = 0;
  let revokedCount = 0;
  try {
    const cutoff = new Date(now - REFUND_WINDOW_DAYS * 86_400_000).toISOString();
    const etsyLicenses = await listEtsyLicensesForRefundCheck(cutoff);

    for (const lic of etsyLicenses) {
      refundsChecked++;
      const res = await fetchReceiptRefundStatus(lic.order_id);
      if (res && res.isCanceledOrRefunded) {
        await revokeLicenseAndUnpublish(lic.id);
        revokedCount++;
      }
    }
  } catch (err) {
    console.warn("Daily Etsy refund check encountered an error, skipping quietly:", (err as Error).message);
  }

  return NextResponse.json({ ok: true, invitations, files, refundsChecked, revoked: revokedCount });
}

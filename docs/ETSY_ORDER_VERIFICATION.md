# Task: verify Etsy orders before opening a studio

Owner: DigitarMercato (We Said Yes). Written for the coding agent that has access to this repo, Vercel and the shop's Etsy API.

## Why

Today anyone can open a studio for free. `redeem()` in `lib/store.ts` creates a licence for **any** order number it has not seen before (see the comment "Unknown orders are auto-created"). Typing a made-up 10-digit number at `/redeem` gives a full invitation website without buying.

The fix: an order number only opens a studio if it is a **real, paid, not refunded Etsy order from our shop that contains the We Said Yes listing**. The buyer should still get in instantly, with no waiting for us.

## What must stay the same

- The buyer experience: `/redeem`, order number + email, instant access, the `WSY-XXXX-XXXX-XXXX` access key, signing back in with the same order number + email.
- Orders pre-added in `/admin` (licences with `status = 'available'`) keep working without an Etsy check. This is our manual override and how test orders work (test order `9000000001` is already in production).
- Revoked licences stay refused.
- Everything else in the app. Do not touch the invitation, studio UI, themes, landing page or expiry logic beyond what is listed here.

## Etsy API facts (Open API v3)

- An Etsy "order number" is the **receipt id**.
- Endpoint: `GET https://api.etsy.com/v3/application/shops/{shop_id}/receipts/{receipt_id}`. A receipt from another shop returns 404 here, which is what we want.
- Headers: `x-api-key: <keystring>:<shared_secret>` (both, colon-separated, on every request) and `Authorization: Bearer <access_token>`.
- OAuth 2 with PKCE, scope `transactions_r`. Access tokens last about 1 hour; refresh tokens about 90 days. A refresh response includes a `refresh_token`: always store the one returned, in case it changes.
- Useful receipt fields: `is_paid`, `status` (`paid`, `completed`, `open`, `payment processing`, `canceled`, `fully refunded`, `partially refunded`), `transactions[].listing_id`, `transactions[].quantity`, `create_timestamp`.
- `buyer_email` is usually `null` (Etsy grants it case by case). **Do not** use it to accept or refuse an order.

Check Etsy's current docs before coding; if anything above has changed, follow Etsy.

## Configuration (Vercel environment variables, server-side only, never `NEXT_PUBLIC_`)

| Variable | Value |
| --- | --- |
| `ETSY_KEYSTRING` | The app's keystring |
| `ETSY_SHARED_SECRET` | The app's shared secret |
| `ETSY_SHOP_ID` | DigitarMercato's numeric shop id |
| `ETSY_LISTING_IDS` | Comma-separated listing ids that sell We Said Yes (the main listing, plus any variants later) |
| `ETSY_REDIRECT_URI` | `https://wesaidyes.site/api/admin/etsy/callback` (register the same URL in the Etsy app) |

Existing variables stay: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_SECRET`, `NEXT_PUBLIC_INVITES_PER_ORDER`, `CRON_SECRET` (optional).

## Database (Supabase, project `wesaidyes`)

Run this as a migration (or in the SQL editor):

```sql
-- the shop's Etsy tokens; one row; only the server (service role) reads it
create table if not exists public.etsy_auth (
  id int primary key default 1 check (id = 1),
  access_token text not null,
  refresh_token text not null,
  expires_at timestamptz not null,
  updated_at timestamptz not null default now()
);
alter table public.etsy_auth enable row level security; -- no policies: anon/auth roles get nothing

-- what Etsy said about each verified order
alter table public.licenses add column if not exists source text not null default 'manual'; -- 'manual' | 'etsy' | 'legacy'
alter table public.licenses add column if not exists etsy_quantity int not null default 1;
alter table public.licenses add column if not exists etsy_status text;
alter table public.licenses add column if not exists verified_at timestamptz;
update public.licenses set source = 'legacy' where status = 'claimed' and source = 'manual';
```

Keep the local JSON store (`.data/db.json`, used when Supabase env is missing) working: give new fields defaults in code.

## Code changes

### 1. `lib/etsy.ts` (new)

- `getAccessToken()`: read `etsy_auth`; if `expires_at` is less than 2 minutes away, refresh at `https://api.etsy.com/v3/public/oauth/token` (`grant_type=refresh_token`, `client_id=ETSY_KEYSTRING`), then save the new access token, the returned refresh token and the new expiry. Guard against two refreshes at once (one in-flight promise per instance is enough).
- `verifyReceipt(orderId): Promise<Verdict>` with an 8-second timeout. Returns one of:
  - `{ ok: true, quantity, status }`: receipt found, `is_paid === true`, `status` is not `canceled` or `fully refunded`, and at least one transaction's `listing_id` is in `ETSY_LISTING_IDS`. `quantity` = sum of `quantity` over those matching transactions.
  - `{ ok: false, reason: 'not_found' }`: HTTP 404, or the id is not a positive integer.
  - `{ ok: false, reason: 'other_listing' }`: a real order, but not for We Said Yes.
  - `{ ok: false, reason: 'refunded' }`: `canceled` or `fully refunded`.
  - `{ ok: false, reason: 'unpaid' }`: not paid yet, or `payment processing`.
  - `{ ok: false, reason: 'unavailable' }`: network error, timeout, 401 after one refresh-and-retry, 429 or 5xx. Log the status code (never tokens).
- `isEtsyConfigured()`: all five `ETSY_*` variables present and an `etsy_auth` row exists.

### 2. `lib/store.ts` → `redeem()`

Keep the existing branches for `revoked`, `claimed` and `available`. Replace the "unknown order → auto-create" branch:

1. If Etsy is not configured: in production, refuse with *"We can't activate orders right now. Please message us on Etsy and we'll set you up."* In development (`NODE_ENV !== 'production'`), keep today's auto-create so local tests still run.
2. Otherwise call `verifyReceipt(order_id)`:
   - `ok` → insert the licence exactly as today (`status 'claimed'`, email, new key), plus `source 'etsy'`, `etsy_quantity`, `etsy_status`, `verified_at = now()`.
   - `not_found` → *"We couldn't find this order. Check the number in Etsy under Purchases and reviews: it's the number after Order #."*
   - `other_listing` → *"This order isn't for a We Said Yes invitation. Message us on Etsy if you think that's a mistake."*
   - `refunded` → *"This order was cancelled or refunded, so it can't be activated."*
   - `unpaid` → *"Etsy is still processing your payment. Please try again in a few minutes."*
   - `unavailable` → *"We couldn't reach Etsy to check your order. Please try again in a few minutes."* Do **not** create a licence.
3. Two people racing for the same order: the unique `order_id` constraint already blocks the second insert; turn that error into the existing "already activated with a different email" message.

The `/api/redeem` rate limit (20 attempts per 10 minutes per IP) stays.

### 3. Invitations per order

`app/api/invites/route.ts` uses `BRAND.invitesPerOrder` for both the limit and the "create" check. Make the limit `licence.etsy_quantity * BRAND.invitesPerOrder` (manual and legacy licences: `etsy_quantity` defaults to 1, so nothing changes for them). Update the message to say how many websites the order includes.

### 4. Connecting the shop once (admin only)

- `GET /api/admin/etsy/connect?secret=<ADMIN_SECRET>`: build the PKCE verifier/challenge and `state`, keep them in a short-lived httpOnly cookie, redirect to `https://www.etsy.com/oauth/connect` with `response_type=code`, `client_id`, `redirect_uri`, `scope=transactions_r`, `state`, `code_challenge`, `code_challenge_method=S256`.
- `GET /api/admin/etsy/callback`: check `state`, exchange `code` at `https://api.etsy.com/v3/public/oauth/token` (`grant_type=authorization_code`, `client_id`, `redirect_uri`, `code`, `code_verifier`), save the tokens to `etsy_auth`, show a plain "Etsy connected" page.
- On `/admin`, show one line: Etsy connected / not connected, and when the token was last refreshed.

### 5. Refunds after activation (daily)

Extend the existing daily cron (`app/api/cron/cleanup/route.ts`, scheduled in `vercel.json`) or add a second route and schedule: for licences with `source = 'etsy'` verified in the last 60 days, re-fetch the receipt; if it is now `canceled` or `fully refunded`, set `status = 'revoked'` and unpublish the licence's invitations (`published = false`). Skip quietly when Etsy is unavailable; try again the next day. Same `CRON_SECRET` check as the existing route.

### 6. Copy

On `/redeem`, under the order number field: *"The number after Order # in Etsy, under Purchases and reviews."* No other UI changes.

## Tests (must pass before merging)

1. A made-up number (e.g. `1234567890`) is refused with the not-found message, and no licence row is created.
2. A real past order from the shop for a **different** listing is refused with the other-listing message.
3. A real order that contains the We Said Yes listing opens the studio; the licence has `source = 'etsy'` and the right `etsy_quantity`.
4. The same order + same email signs back in; the same order + a different email is refused.
5. Test order `9000000001` (pre-added, `available`) still works without calling Etsy.
6. With Etsy unreachable (mock a timeout), the buyer sees the try-again message and no licence is created.
7. An expired access token is refreshed and the new refresh token is saved.
8. Existing behaviour is unchanged: the end-to-end flow in the studio (edit, upload, publish, guest RSVP, guest list, CSV) and the 45-day / wedding + 7 days expiry.
9. `npm run build` passes with no type errors.

## Done when

- Production refuses unknown order numbers, and real We Said Yes orders still open instantly.
- The Etsy shop is connected through `/api/admin/etsy/connect` and `/admin` shows it as connected.
- The changes are in a pull request with the migration, a short description and the test results.

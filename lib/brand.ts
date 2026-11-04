// Change the product name, shop and links here; everything else reads from this file.
export const BRAND = {
  name: "We Said Yes",
  short: "We Said Yes",
  tagline: "A digital wedding invitation website with music, countdown and RSVP. Pick a theme, fill in your details, share one link.",
  shop: "DigitarMercato",
  etsy: "https://digitarmercato.etsy.com",
  etsyShop: "https://digitarmercato.etsy.com",
  // how many invitation websites one Etsy order can create
  invitesPerOrder: Number(process.env.NEXT_PUBLIC_INVITES_PER_ORDER || 1),
};

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://wesaidyes.site").replace(/\/$/, "");

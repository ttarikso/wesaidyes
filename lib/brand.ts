// Change the product name, shop and links here; everything else reads from this file.
export const BRAND = {
  name: "We Said Yes",
  short: "We Said Yes",
  tagline: "A digital wedding invitation website with music, countdown and RSVP. Pick a theme, fill in your details, share one link.",
  shop: "DigitarMercato",
  etsy: "https://www.etsy.com/listing/4610003418/wedding-invitation-website-with-rsvp",
  etsyShop: "https://digitarmercato.etsy.com",
  // how many invitation websites one Etsy order can create
  invitesPerOrder: Number(process.env.NEXT_PUBLIC_INVITES_PER_ORDER || 1),
};

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://wesaidyes.site").replace(/\/$/, "");

// The one address search engines should index: the bare domain redirects here.
export const CANONICAL_URL = "https://www.wesaidyes.site";

// The facts search engines and AI answers quote. Keep in step with the Etsy listing.
export const FACTS = {
  // Etsy listing price. Change it here whenever it changes on Etsy: the page rows, llms.txt and the
  // structured data all read it, and Google expects the marked-up price to match the visible one.
  price: "29.00",
  currency: "USD",
  designs: 20,
  headingFonts: 6,
  songs: 20,
  daysAfterWedding: 7,
  maxDaysOnline: 45,
};
export const INDEXNOW_KEY = "5327c07f56466dcfc36b4b486813610c";

// Structured data (schema.org JSON-LD) for search engines and AI answers.
import { BRAND, CANONICAL_URL, FACTS } from "@/lib/brand";

export const abs = (path: string) => `${CANONICAL_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const ORG_ID = `${CANONICAL_URL}/#org`;
export const SITE_ID = `${CANONICAL_URL}/#website`;
export const PRODUCT_ID = `${CANONICAL_URL}/#product`;

export const organization = () => ({
  "@type": "Organization",
  "@id": ORG_ID,
  name: BRAND.name,
  url: CANONICAL_URL,
  logo: abs("/icon.png"),
  description: BRAND.tagline,
  sameAs: [BRAND.etsyShop, BRAND.etsy],
});

export const website = () => ({
  "@type": "WebSite",
  "@id": SITE_ID,
  name: BRAND.name,
  url: CANONICAL_URL,
  inLanguage: "en",
  publisher: { "@id": ORG_ID },
});

export const product = () => ({
  "@type": "Product",
  "@id": PRODUCT_ID,
  name: `${BRAND.name} wedding invitation website with RSVP`,
  brand: { "@type": "Brand", name: BRAND.name },
  description:
    `A digital wedding invitation website: guests tap a wax seal with the couple's initials, the envelope opens, music plays and the invitation unfolds into their photo, story, order of the day and an RSVP form. ` +
    `${FACTS.designs} designs, ${FACTS.headingFonts} heading fonts, ${FACTS.songs} original songs, no guest limit, one payment on Etsy.`,
  image: [abs("/opengraph-image.jpg"), abs("/designs/burgundy-rose-og.jpg"), abs("/designs/dusty-blue-og.jpg")],
  url: CANONICAL_URL,
  category: "Wedding invitations",
  sku: "WSY-INVITE-01",
  offers: {
    "@type": "Offer",
    url: BRAND.etsy,
    price: FACTS.price,
    priceCurrency: FACTS.currency,
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: { "@type": "Organization", name: BRAND.shop, url: BRAND.etsyShop },
  },
  additionalProperty: [
    { "@type": "PropertyValue", name: "Designs", value: FACTS.designs },
    { "@type": "PropertyValue", name: "Songs", value: FACTS.songs },
    { "@type": "PropertyValue", name: "Guest limit", value: "None" },
    { "@type": "PropertyValue", name: "Online until", value: `${FACTS.daysAfterWedding} days after the wedding, up to ${FACTS.maxDaysOnline} days from publishing` },
  ],
});

export const faqPage = (items: [string, string][], id?: string) => ({
  "@type": "FAQPage",
  ...(id ? { "@id": id } : {}),
  mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});

export const howTo = (steps: { name: string; text: string; image?: string }[]) => ({
  "@type": "HowTo",
  name: "How to make a wedding invitation website with We Said Yes",
  totalTime: "PT1H",
  step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text, ...(s.image ? { image: abs(s.image) } : {}) })),
});

export const breadcrumbs = (items: { name: string; path: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
});

export const graph = (...nodes: object[]) => ({ "@context": "https://schema.org", "@graph": nodes });

// /llms.txt: a plain summary of the product for AI assistants (llmstxt.org format).
import { BRAND, CANONICAL_URL, FACTS } from "@/lib/brand";
import { THEMES } from "@/lib/themes";
import { DESIGN_COPY } from "@/lib/designs";
import { GUIDES } from "@/lib/guides";
import { FACT_ROWS, FAQ } from "@/lib/content";

export const dynamic = "force-static";

export function GET() {
  const u = (p: string) => `${CANONICAL_URL}${p}`;
  const text = `# ${BRAND.name}

> ${BRAND.name} (${CANONICAL_URL.replace("https://", "")}) is a digital wedding invitation website with RSVP, sold on Etsy by ${BRAND.shop}. Guests tap a wax seal with the couple's initials, the envelope opens, music plays, and the invitation unfolds into the couple's photo, their story, the order of the day, the venue and a reply form. One payment of US$${FACTS.price} on Etsy, no subscription, no guest limit, no app or account for guests.

## Facts

${FACT_ROWS.map(([k, v]) => `- ${k}: ${v}`).join("\n")}
- How it works: buy on Etsy; enter the Etsy order number and email at ${u("/redeem")} to open the studio; choose a design and fill in names, date, venue, story, photos, schedule and questions with a live phone preview; publish and share one link by WhatsApp, text or email, or print it as a QR code.
- Not included: registry, seating chart, uploading your own song, more than one wedding per order.

## Main pages

- [Homepage](${u("/")}): what guests see, the designs, the songs, how it works, questions
- [Live demo](${u("/demo")}): a working invitation in every design and heading font
- [All designs](${u("/designs")}): the ${FACTS.designs} designs with phone screenshots
- [Buy on Etsy](${BRAND.etsy})

## Designs

${THEMES.map((t) => `- [${t.name}](${u(`/designs/${t.id}`)}): ${DESIGN_COPY[t.id]?.text || t.mood}`).join("\n")}

## Guides

${GUIDES.map((g) => `- [${g.title}](${u(`/guides/${g.slug}`)}): ${g.answer}`).join("\n")}

## Questions

${FAQ.map(([q, a]) => `- ${q} ${a}`).join("\n")}
`;
  return new Response(text, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}

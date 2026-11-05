import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BRAND, FACTS } from "@/lib/brand";
import { THEMES, getTheme } from "@/lib/themes";
import { DESIGN_COPY } from "@/lib/designs";
import { PageNav, SiteFooter } from "@/components/site/Chrome";
import Crumbs from "@/components/site/Crumbs";
import JsonLd from "@/components/site/JsonLd";
import { PRODUCT_ID, abs, breadcrumbs, graph } from "@/lib/seo";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return THEMES.map((t) => ({ id: t.id }));
}

const face = (stack: string) => stack.split(",")[0].replace(/"/g, "").replace(/ Variable$/, "");
const titleCase = (s: string) => s.replace(/\b(?!and\b)\w/g, (ch) => ch.toUpperCase());

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const t = THEMES.find((x) => x.id === id);
  const c = DESIGN_COPY[id];
  if (!t || !c) return {};
  return {
    title: { absolute: `${titleCase(c.keyword)} Website: ${t.name}` },
    description: `${t.name}, a ${c.keyword} website with RSVP. ${c.flowers}, ${c.seal.toLowerCase()}. Guests open the envelope, hear your song and reply from their phone.`,
    alternates: { canonical: `/designs/${id}` },
    openGraph: { url: `/designs/${id}`, images: [{ url: `/designs/${id}-og.jpg`, width: 1200, height: 630 }] },
  };
}

const INCLUDED = [
  "The envelope opening, with your initials in the wax seal",
  `Your choice of ${FACTS.songs} original songs, or none`,
  "A live countdown to the day",
  "Your story and photos as a small album",
  "The order of the day, with times and places",
  "The venue as a map link and a calendar file",
  "Dress code, accommodation and your own questions",
  "An RSVP form with plus-ones, meals and dietary needs",
];

export default async function Design({ params }: Props) {
  const { id } = await params;
  const t = THEMES.find((x) => x.id === id);
  const c = DESIGN_COPY[id];
  if (!t || !c) notFound();
  const i = THEMES.indexOf(t);
  const more = [1, 2, 3, 4].map((k) => THEMES[(i + k) % THEMES.length]);
  const crumbs = [{ name: "Home", path: "/" }, { name: "Designs", path: "/designs" }, { name: t.name, path: `/designs/${id}` }];
  const rows: [string, string][] = [
    ["Colours", c.colours],
    ["Flowers", c.flowers],
    ["Wax seal", c.seal],
    ["Typeface", `${face(getTheme(id).type.display)} for names and titles, or one of ${FACTS.headingFonts} other heading fonts`],
    ["Best for", c.bestFor],
    ["Price", `US$${FACTS.price} list price, one payment on Etsy, any number of guests`],
  ];
  return (
    <div className="site" id="top">
      <JsonLd data={graph(breadcrumbs(crumbs), {
        "@type": "Product",
        name: `${t.name} wedding invitation website`,
        description: c.text,
        image: [abs(`/designs/${id}-og.jpg`), abs(`/designs/${id}-env.webp`)],
        url: abs(`/designs/${id}`),
        color: c.colours,
        brand: { "@type": "Brand", name: BRAND.name },
        isVariantOf: { "@id": PRODUCT_ID },
        offers: { "@type": "Offer", url: BRAND.etsy, price: FACTS.price.toFixed(2), priceCurrency: FACTS.currency, availability: "https://schema.org/InStock" },
      })} />
      <PageNav />
      <Crumbs items={crumbs} />
      <header className="p-head">
        <h1 className="p-h1">{t.name} wedding invitation website</h1>
        <p className="p-lead">{c.text} Guests tap the seal, the envelope opens, your song begins and they reply from their phone.</p>
        <div className="p-acts">
          <Link href={`/demo?theme=${id}`} className="p-btn">Open the {t.name} demo</Link>
          <a href={BRAND.etsy} className="p-btn p-btn-ghost" target="_blank" rel="noopener noreferrer">Buy on Etsy</a>
        </div>
      </header>

      <section className="d-stage" style={{ ["--g" as string]: t.bg }} aria-label={`${t.name} on a phone`}>
        {[["env", "The sealed envelope, as a guest first sees it"], ["open", "The invitation opened: names, date and venue over the couple's photo"], ["story", "Our story, with photos as a small album"]].map(([k, alt]) => (
          <figure key={k} className="d-phone">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/designs/${id}-${k}.webp`} alt={`${t.name}: ${alt}`} width={780} height={1688} loading={k === "env" ? "eager" : "lazy"} />
          </figure>
        ))}
      </section>

      <section className="d-spec p-sec" aria-labelledby="spec-h">
        <h2 id="spec-h" className="facts-h">The design</h2>
        <dl className="facts-list">
          {rows.map(([k, v]) => <div key={k} className="facts-row"><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
      </section>

      <section className="p-sec" aria-labelledby="inc-h">
        <h2 id="inc-h" className="p-sec-h">Included with every design</h2>
        <ul className="d-inc">{INCLUDED.map((x) => <li key={x}>{x}</li>)}</ul>
      </section>

      <section className="p-sec" aria-labelledby="more-h">
        <h2 id="more-h" className="p-sec-h">More designs</h2>
        <ul className="d-grid">
          {more.map((m) => (
            <li key={m.id}>
              <Link href={`/designs/${m.id}`} className="d-card">
                <span className="d-card-media" style={{ ["--g" as string]: m.bg }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/designs/${m.id}-env.webp`} alt={`${m.name} wedding invitation envelope`} width={780} height={1688} loading="lazy" />
                </span>
                <span className="d-card-name">{m.name}</span>
                <span className="d-card-mood">{DESIGN_COPY[m.id]?.colours || m.mood}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p style={{ marginTop: 32 }}><Link href="/designs" className="p-btn p-btn-ghost">All twenty designs</Link></p>
      </section>
      <SiteFooter />
    </div>
  );
}

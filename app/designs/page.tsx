import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, FACTS } from "@/lib/brand";
import { THEMES } from "@/lib/themes";
import { DESIGN_COPY } from "@/lib/designs";
import { PageNav, SiteFooter } from "@/components/site/Chrome";
import Crumbs from "@/components/site/Crumbs";
import JsonLd from "@/components/site/JsonLd";
import { abs, breadcrumbs, graph } from "@/lib/seo";

export const metadata: Metadata = {
  title: "20 Wedding Invitation Website Designs",
  description: `Browse all ${FACTS.designs} We Said Yes wedding invitation designs: dusty blue, burgundy, sage green, black tie, lavender and more, each with its own paper, wax seal, flowers and fonts.`,
  alternates: { canonical: "/designs" },
  openGraph: { url: "/designs", images: ["/designs/burgundy-rose-og.jpg"] },
};

export default function Designs() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Designs", path: "/designs" }];
  return (
    <div className="site" id="top">
      <JsonLd data={graph(breadcrumbs(crumbs), {
        "@type": "CollectionPage", name: "Wedding invitation website designs", url: abs("/designs"),
        mainEntity: { "@type": "ItemList", itemListElement: THEMES.map((t, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/designs/${t.id}`), name: t.name })) },
      })} />
      <PageNav />
      <Crumbs items={crumbs} />
      <header className="p-head">
        <h1 className="p-h1">Twenty wedding invitation designs</h1>
        <p className="p-lead">Every design has its own paper, wax seal, flowers, colours and typefaces, and every one includes the envelope opening, music, countdown, schedule, map and RSVP form. Switch any time; your words and photos move with you.</p>
        <div className="p-acts">
          <Link href="/demo" className="p-btn">Try a Demo</Link>
          <a href={BRAND.etsy} className="p-btn p-btn-ghost" target="_blank" rel="noopener noreferrer">Buy on Etsy</a>
        </div>
      </header>
      <section className="p-sec" aria-label="All designs">
        <ul className="d-grid">
          {THEMES.map((t) => (
            <li key={t.id}>
              <Link href={`/designs/${t.id}`} className="d-card">
                <span className="d-card-media" style={{ ["--g" as string]: t.bg }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/designs/${t.id}-env.webp`} alt={`${t.name} wedding invitation envelope with a wax seal`} width={780} height={1688} loading="lazy" />
                </span>
                <span className="d-card-name">{t.name}</span>
                <span className="d-card-mood">{DESIGN_COPY[t.id]?.colours || t.mood}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <SiteFooter />
    </div>
  );
}

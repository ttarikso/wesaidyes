import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import { PageNav, SiteFooter } from "@/components/site/Chrome";
import Crumbs from "@/components/site/Crumbs";
import JsonLd from "@/components/site/JsonLd";
import { abs, breadcrumbs, graph } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Wedding Invitation and RSVP Guides",
  description: "Short, practical guides to wedding invitations: collecting RSVPs online, digital vs paper costs, invitation wording, sending by WhatsApp and when to send.",
  alternates: { canonical: "/guides" },
  openGraph: { url: "/guides" },
};

export default function Guides() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }];
  return (
    <div className="site" id="top">
      <JsonLd data={graph(breadcrumbs(crumbs), {
        "@type": "CollectionPage", name: "Wedding invitation guides", url: abs("/guides"),
        mainEntity: { "@type": "ItemList", itemListElement: GUIDES.map((g, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/guides/${g.slug}`), name: g.title })) },
      })} />
      <PageNav />
      <Crumbs items={crumbs} />
      <header className="p-head">
        <h1 className="p-h1">Wedding invitation guides</h1>
        <p className="p-lead">Plain answers to the questions couples ask while sending invitations: wording, timing, costs and collecting replies.</p>
      </header>
      <section className="p-sec" aria-label="All guides">
        <div className="g-list">
          {GUIDES.map((g) => (
            <Link key={g.slug} href={`/guides/${g.slug}`} className="g-item">
              <span className="g-item-title">{g.title}</span>
              <span className="g-item-desc">{g.description}</span>
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

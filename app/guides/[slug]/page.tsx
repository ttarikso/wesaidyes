import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BRAND } from "@/lib/brand";
import { GUIDES, getGuide, type Block } from "@/lib/guides";
import { PageNav, SiteFooter } from "@/components/site/Chrome";
import Crumbs from "@/components/site/Crumbs";
import JsonLd from "@/components/site/JsonLd";
import { ORG_ID, abs, breadcrumbs, faqPage, graph } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return {
    title: { absolute: g.seoTitle.length > 52 ? g.seoTitle : `${g.seoTitle} · ${BRAND.name}` },
    description: g.description,
    alternates: { canonical: `/guides/${slug}` },
    openGraph: { type: "article", url: `/guides/${slug}`, title: g.seoTitle, description: g.description, publishedTime: g.updated, modifiedTime: g.updated },
  };
}

function Body({ b }: { b: Block }) {
  if ("h2" in b) return <h2>{b.h2}</h2>;
  if ("p" in b) return <p>{b.p}</p>;
  if ("ul" in b) return <ul>{b.ul.map((x) => <li key={x}>{x}</li>)}</ul>;
  if ("ol" in b) return <ol>{b.ol.map((x) => <li key={x}>{x}</li>)}</ol>;
  if ("quote" in b) return <><blockquote className="g-quote">{b.quote}</blockquote>{b.note && <p className="g-quote-note">{b.note}</p>}</>;
  return (
    <div className="g-table">
      <table>
        {b.table.caption && <caption>{b.table.caption}</caption>}
        <thead><tr>{b.table.head.map((h, i) => <th key={i} scope="col">{h}</th>)}</tr></thead>
        <tbody>{b.table.rows.map((r, i) => <tr key={i}>{r.map((c, j) => (j === 0 ? <th key={j} scope="row">{c}</th> : <td key={j}>{c}</td>))}</tr>)}</tbody>
      </table>
    </div>
  );
}

const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();
  const crumbs = [{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }, { name: g.title, path: `/guides/${slug}` }];
  const others = GUIDES.filter((x) => x.slug !== slug).slice(0, 4);
  return (
    <div className="site" id="top">
      <JsonLd data={graph(
        breadcrumbs(crumbs),
        {
          "@type": "Article",
          headline: g.seoTitle,
          description: g.description,
          abstract: g.answer,
          url: abs(`/guides/${slug}`),
          mainEntityOfPage: abs(`/guides/${slug}`),
          datePublished: g.updated,
          dateModified: g.updated,
          inLanguage: "en",
          author: { "@id": ORG_ID },
          publisher: { "@id": ORG_ID },
          image: abs("/opengraph-image.jpg"),
          ...(g.sources ? { citation: g.sources.map((s) => ({ "@type": "CreativeWork", name: s.name, url: s.url })) } : {}),
        },
        faqPage(g.faq),
        { "@type": "Organization", "@id": ORG_ID, name: BRAND.name, url: abs("/") },
      )} />
      <PageNav />
      <Crumbs items={crumbs} />
      <header className="p-head">
        <h1 className="p-h1">{g.title}</h1>
        <p className="g-meta">Updated <time dateTime={g.updated}>{fmt(g.updated)}</time> · {g.read} min read · By {BRAND.name}</p>
      </header>
      <article className="g-art">
        <div className="g-col">
          <div className="g-answer">
            <span className="g-answer-k">The short answer</span>
            <p>{g.answer}</p>
          </div>
          {g.body.map((b, i) => <Body key={i} b={b} />)}

          <h2>Questions</h2>
          <dl className="g-faq">
            {g.faq.map(([q, a]) => <div key={q}><dt>{q}</dt><dd>{a}</dd></div>)}
          </dl>

          {g.sources && (
            <div className="g-src">
              Sources
              <ul>{g.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.name}</a></li>)}</ul>
            </div>
          )}

          <div className="g-cta">
            <p>See a wedding invitation guests open like a sealed envelope, then answer from their phone.</p>
            <div className="p-acts">
              <Link href="/demo" className="p-btn">Try a Demo</Link>
              <a href={BRAND.etsy} className="p-btn p-btn-ghost" target="_blank" rel="noopener noreferrer">Buy on Etsy</a>
            </div>
          </div>

          <h2>More guides</h2>
          <ul>{others.map((o) => <li key={o.slug}><Link href={`/guides/${o.slug}`}>{o.title}</Link></li>)}</ul>
        </div>
      </article>
      <SiteFooter />
    </div>
  );
}

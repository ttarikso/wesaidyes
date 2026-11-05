import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { GUIDES } from "@/lib/guides";
import { SiteMenu } from "@/components/site/parts";

/** The top bar of every page but the homepage (which pins its own over the designs). */
export function PageNav() {
  return (
    <header className="p-top">
      <nav className="h-nav p-nav" aria-label="Main">
        <Link href="/" className="h-mark">We said yes</Link>
        <span className="h-links">
          <Link href="/designs">Designs</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/#questions">Questions</Link>
          <a href={BRAND.etsy} target="_blank" rel="noopener noreferrer">Buy on Etsy</a>
        </span>
        <span className="h-acts">
          <Link href="/redeem" className="h-pill h-pill-ghost">Sign in</Link>
          <Link href="/demo" className="h-pill">Try a Demo</Link>
          <SiteMenu etsy={BRAND.etsy} />
        </span>
      </nav>
    </header>
  );
}

/** The footer shared by every marketing page. */
export function SiteFooter() {
  return (
    <footer className="foot">
      <p className="foot-name" aria-hidden>We said yes</p>
      <div className="foot-row">
        <ul className="foot-places">
          <li><Link href="/demo">Live demo</Link></li>
          <li><Link href="/designs">All twenty designs</Link></li>
          <li><a href={BRAND.etsy} target="_blank" rel="noopener noreferrer">Buy on Etsy</a></li>
        </ul>
        <div className="foot-cols">
          <ul>
            <li><Link href="/designs">Designs</Link></li>
            <li><Link href="/#songs">Songs</Link></li>
            <li><Link href="/#questions">Questions</Link></li>
            <li><Link href="/redeem">Activate an order</Link></li>
          </ul>
          <ul>
            <li><Link href="/guides">Guides</Link></li>
            {GUIDES.slice(0, 3).map((g) => <li key={g.slug}><Link href={`/guides/${g.slug}`}>{g.title.split(" (")[0].split(":")[0]}</Link></li>)}
          </ul>
          <ul>
            <li><a href={BRAND.etsy} target="_blank" rel="noopener noreferrer">Buy on Etsy</a></li>
            <li><a href={BRAND.etsyShop} target="_blank" rel="noopener noreferrer">{BRAND.shop} on Etsy</a></li>
          </ul>
        </div>
      </div>
      <div className="foot-legal">
        <span>© {new Date().getFullYear()} {BRAND.name}, made by {BRAND.shop}</span>
        <a href="#top" className="foot-top">Back to top</a>
      </div>
    </footer>
  );
}

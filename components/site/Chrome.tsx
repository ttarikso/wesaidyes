"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { GUIDES } from "@/lib/guides";
import { SiteMenu } from "@/components/site/parts";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { DEFAULT_LANGUAGE, isValidLanguage, type Language } from "@/lib/i18n/types";
import { getSiteI18n } from "@/lib/i18n/site";

/** The top bar of every page but the homepage (which pins its own over the designs). */
export function PageNav() {
  const [lang, setLang] = useState<Language>(DEFAULT_LANGUAGE);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("site-lang");
      if (isValidLanguage(saved)) setLang(saved);
    } catch {}
  }, []);
  const handleLang = (l: Language) => {
    setLang(l);
    try { localStorage.setItem("site-lang", l); } catch {}
  };
  const t = getSiteI18n(lang);

  return (
    <header className="p-top">
      <nav className="h-nav p-nav" aria-label="Main">
        <Link href="/" className="h-mark">We said yes</Link>
        <span className="h-links">
          <Link href="/designs">{t.nav.designs}</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/#questions">{t.nav.questions}</Link>
          <a href={BRAND.etsy} target="_blank" rel="noopener noreferrer">{t.nav.buyOnEtsy}</a>
          <LanguageSwitcher current={lang} onChange={handleLang} variant="site" />
        </span>
        <span className="h-acts">
          <Link href="/redeem" className="h-pill h-pill-ghost">{t.nav.signIn}</Link>
          <Link href={`/demo?lang=${lang}`} className="h-pill">{t.hero.openSample}</Link>
          <SiteMenu etsy={BRAND.etsy} lang={lang} onLangChange={handleLang} />
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

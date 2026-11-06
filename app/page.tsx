"use client";
import { useState } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { FACT_ROWS, FAQ } from "@/lib/content";
import { THEMES } from "@/lib/themes";
import { FaqIndex, HeroInk, LiveNames, Reveal, SiteMenu, SongList } from "@/components/site/parts";
import { SiteFooter } from "@/components/site/Chrome";
import JsonLd from "@/components/site/JsonLd";
import { faqPage, graph, howTo, organization, product, website } from "@/lib/seo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { DEFAULT_LANGUAGE, isValidLanguage, type Language } from "@/lib/i18n/types";
import { getSiteI18n } from "@/lib/i18n/site";

const PAPER = "#f7f9f8";
const RUN: { id: string; ground: string; ink: string; caption: string }[] = [
  { id: "dusty-blue", ground: "#485e75", ink: PAPER, caption: "Dusty Blue & Silver, with eucalyptus and a silver laurel seal" },
  { id: "emerald-gold", ground: "#1a4436", ink: "#ecdcae", caption: "Emerald & Gold, with white orchids and gold-leaf ferns" },
  { id: "blush-peony", ground: "#d1ada6", ink: "#3f1f22", caption: "Blush Peony, with peonies and a rose-gold seal" },
  { id: "plum-gold", ground: "#372031", ink: "#ecdcc0", caption: "Plum & Gold, with dark dahlias, blackberries and a gold seal" },
  { id: "black-tie", ground: "#191919", ink: PAPER, caption: "Black Tie, with calla lilies on black" },
];

export default function Home() {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("site-lang");
        if (isValidLanguage(saved)) return saved;
        const navLang = navigator.language.slice(0, 2);
        if (isValidLanguage(navLang)) return navLang;
      } catch {}
    }
    return DEFAULT_LANGUAGE;
  });

  const handleLangChange = (l: Language) => {
    setLang(l);
    if (typeof window !== "undefined") {
      try { localStorage.setItem("site-lang", l); } catch {}
    }
  };

  const t = getSiteI18n(lang);

  return (
    <div className="site" id="top">
      <JsonLd data={graph(organization(), website(), product(), faqPage(FAQ), howTo(t.steps.map((x) => ({ name: x.verb, text: x.text, image: x.img }))))} />
      <Reveal />
      <HeroInk />

      {/* 1. The pinned title over the designs */}
      <section className="h-run" style={{ ["--run-ink" as string]: RUN[0].ink, ["--run-ground" as string]: RUN[0].ground, ["--run-img" as string]: `url(/site/run-d-${RUN[0].id}.webp)`, ["--run-img-m" as string]: `url(/site/run-m-${RUN[0].id}.webp)`, ["--n" as string]: RUN.length }}>
        <div className="h-pin">
          <div className="h-band" aria-hidden />
          <nav className="h-nav" aria-label="Main">
            <Link href="/" className="h-mark">We said yes</Link>
            <span className="h-links">
              <Link href="/designs">{t.nav.designs}</Link>
              <Link href="/guides">Guides</Link>
              <a href="#questions">{t.nav.questions}</a>
              <a href={BRAND.etsy} target="_blank" rel="noopener noreferrer">{t.nav.buyOnEtsy}</a>
              <LanguageSwitcher current={lang} onChange={handleLangChange} variant="site" />
            </span>
            <span className="h-acts">
              <Link href="/redeem" className="h-pill h-pill-ghost">{t.nav.signIn}</Link>
              <Link href={`/demo?lang=${lang}`} className="h-pill">{t.hero.openSample}</Link>
              <SiteMenu etsy={BRAND.etsy} lang={lang} onLangChange={handleLangChange} />
            </span>
          </nav>
          {/* one heading for search: the name, then what it is */}
          <h1 className="h-h1">
            <span className="h-title" style={{ ["--char-len" as string]: t.hero.title.length }}>{t.hero.title}</span>
            <span className="h-lead">{t.hero.subtitle}</span>
          </h1>
          <Link href={`/demo?lang=${lang}`} className="h-btn">{t.hero.openSample}</Link>
        </div>
        <div className="h-panels">
          {RUN.map((r, i) => (
            <figure key={r.id} className="h-panel" data-ink={r.ink} data-ground={r.ground} data-img={`url(/site/run-d-${r.id}.webp)`} data-img-m={`url(/site/run-m-${r.id}.webp)`} style={{ background: r.ground }}>
              <picture>
                <source media="(max-width: 699px)" srcSet={`/site/run-m-${r.id}.webp`} width={780} height={1328} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/site/run-d-${r.id}.webp`} alt={`The ${THEMES.find((th) => th.id === r.id)?.name} envelope`} width={2880} height={1800} loading={i === 0 ? "eager" : "lazy"} fetchPriority={i === 0 ? "high" : undefined} />
              </picture>
              <figcaption style={{ color: r.ink }}>{r.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* 2. The live thing: type your names, open your own demo */}
      <section className="live" id="try" aria-labelledby="live-h">
        <div className="live-photo" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/site/live-envelope.webp" alt="" width={2400} height={1602} loading="lazy" />
        </div>
        <div className="live-card" data-reveal>
          <h2 id="live-h" className="live-h">{lang === "tr" ? "Kendi isimlerinizle deneyin" : lang === "es" ? "Pruébalo con vuestros nombres" : lang === "fr" ? "Essayez avec vos prénoms" : lang === "de" ? "Mit Ihren Namen ausprobieren" : "Try it with your names"}</h2>
          <p className="live-fact">{t.hero.badges}</p>
          <LiveNames labels={t.liveDemo} lang={lang} />
        </div>
      </section>

      {/* 3. What guests get: stacking sheets */}
      <section className="feat" id="designs" aria-labelledby="feat-h">
        <h2 id="feat-h" className="feat-h" data-reveal>{lang === "tr" ? "Misafirlerinizi ne bekliyor?" : lang === "es" ? "Lo que verán tus invitados" : lang === "fr" ? "Ce que vos invités découvrent" : lang === "de" ? "Das erleben Ihre Gäste" : "What your guests get"}</h2>
        <div className="sheets">
          {t.features.map((f, i) => (
            <article key={f.name} className={`sheet sheet-${i % 2 ? "b" : "a"}`} style={{ ["--i" as string]: i }}>
              <h3 className="sheet-name">{f.name}</h3>
              <p className="sheet-text">{f.text}</p>
              <figure className="sheet-media">
                {f.media === "video" ? (
                  <video src="/site/envelope.mp4" poster="/site/envelope-poster.jpg" autoPlay muted loop playsInline aria-label="The envelope opening on a phone" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.media} alt={f.name} loading="lazy" />
                )}
              </figure>
            </article>
          ))}
        </div>
      </section>

      {/* 4. The designs, by name, running off the edges */}
      <section aria-labelledby="band-h">
        <h2 id="band-h" className="sr-only">The twenty designs</h2>
        <div className="band">
          <div className="band-track" aria-hidden>
            {[0, 1].map((k) => (
              <span key={k}>
                {THEMES.map((th) => <span key={th.id} className="band-item">{th.name}<i className="band-dot" /></span>)}
              </span>
            ))}
          </div>
        </div>
        <p className="band-note" data-reveal>
          {lang === "tr" ? (
            <>Yirmi özel tasarım; her birine ait özel kağıt, balmumu mühür, çiçekler ve yazı tipleri: {THEMES.map((th, i) => <span key={th.id}>{i ? ", " : ""}<Link href={`/designs/${th.id}`}>{th.name}</Link></span>)}. İstediğiniz an değiştirin; metinleriniz ve fotoğraflarınız korunur. <Link href="/designs" className="band-all">Tüm yirmi tasarımı inceleyin</Link></>
          ) : lang === "es" ? (
            <>Veinte diseños exclusivos con su propio papel, sello de cera, flores y tipografías: {THEMES.map((th, i) => <span key={th.id}>{i ? ", " : ""}<Link href={`/designs/${th.id}`}>{th.name}</Link></span>)}. Cambia cuando quieras sin perder tus textos ni fotos. <Link href="/designs" className="band-all">Ver los veinte diseños</Link></>
          ) : lang === "fr" ? (
            <>Vingt modèles uniques avec papier, sceau de cire, fleurs et polices sur mesure : {THEMES.map((th, i) => <span key={th.id}>{i ? ", " : ""}<Link href={`/designs/${th.id}`}>{th.name}</Link></span>)}. Changez à tout moment en conservant vos textes et photos. <Link href="/designs" className="band-all">Voir les vingt modèles</Link></>
          ) : lang === "de" ? (
            <>Zwanzig Designs mit eigenem Papier, Wachssiegel, Blumen und Schriften: {THEMES.map((th, i) => <span key={th.id}>{i ? ", " : ""}<Link href={`/designs/${th.id}`}>{th.name}</Link></span>)}. Jederzeit wechselbar, Texte und Fotos bleiben erhalten. <Link href="/designs" className="band-all">Alle zwanzig Designs ansehen</Link></>
          ) : (
            <>Twenty designs, each with its own paper, wax seal, flowers and typefaces: {THEMES.map((th, i) => <span key={th.id}>{i ? ", " : ""}<Link href={`/designs/${th.id}`}>{th.name}</Link></span>)}. Switch any time; your words and photos stay. <Link href="/designs" className="band-all">See all twenty designs</Link></>
          )}
        </p>
      </section>

      {/* 5. The songs */}
      <section className="list" id="songs" aria-labelledby="songs-h" data-reveal>
        <h2 id="songs-h" className="list-h">{t.songs.heading}</h2>
        <SongList labels={{ stop: t.songs.stop, listen: t.songs.listen }} />
      </section>

      {/* 6. How it works: one verb at a time */}
      <section className="steps" aria-label="How it works">
        {t.steps.map((s) => (
          <div key={s.verb} className="step">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="step-img" src={s.img} alt={s.alt} loading="lazy" />
            <div className="step-pin"><h2 className="step-verb">{s.verb}</h2></div>
            <p className="step-text">{s.text}</p>
          </div>
        ))}
      </section>

      {/* 7. The facts, in one place */}
      <section className="facts" id="facts" aria-labelledby="facts-h" data-reveal>
        <h2 id="facts-h" className="facts-h">At a glance</h2>
        <dl className="facts-list">
          {FACT_ROWS.map(([k, v]) => <div key={k} className="facts-row"><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
      </section>

      {/* 8. Questions */}
      <section className="qa" id="questions" aria-labelledby="qa-h" data-reveal>
        <h2 id="qa-h" className="sr-only">Questions</h2>
        <FaqIndex items={t.faq.items} />
      </section>

      {/* 9. One word is the button */}
      <a className="cta" href={BRAND.etsy} target="_blank" rel="noopener noreferrer">
        <span className="cta-line">{t.cta.desc}</span>
        <svg className="cta-arrow" viewBox="0 0 48 48" aria-hidden><path d="M12 36 36 12M16 12h20v20" fill="none" stroke="currentColor" strokeWidth="3" /></svg>
        <span className="cta-word">{t.cta.buyOnEtsy}</span>
      </a>

      <SiteFooter />
    </div>
  );
}

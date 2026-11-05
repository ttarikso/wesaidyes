import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { THEMES } from "@/lib/themes";
import { FaqIndex, HeroInk, LiveNames, Reveal, SiteMenu, SongList } from "@/components/site/parts";

/* Marketing page · direction "The pinned poster" (taste-skill seed 273858182).
   Idea: the couple's own answer, "we said yes", holds still while their invitation changes through the designs beneath it. */

const PAPER = "#f7f9f8";
const RUN: { id: string; ground: string; ink: string; caption: string }[] = [
  { id: "dusty-blue", ground: "#485e75", ink: PAPER, caption: "Dusty Blue & Silver, with eucalyptus and a silver laurel seal" },
  { id: "emerald-gold", ground: "#1a4436", ink: "#ecdcae", caption: "Emerald & Gold, with white orchids and gold-leaf ferns" },
  { id: "blush-peony", ground: "#d1ada6", ink: "#3f1f22", caption: "Blush Peony, with peonies and a rose-gold seal" },
  { id: "plum-gold", ground: "#372031", ink: "#ecdcc0", caption: "Plum & Gold, with dark dahlias, blackberries and a gold seal" },
  { id: "black-tie", ground: "#191919", ink: PAPER, caption: "Black Tie, with calla lilies on black" },
];

const FEATURES = [
  { name: "The envelope opens", text: "Your initials are pressed into the wax seal. One tap and the flap lifts, the card slides out and your song begins.", media: "video" },
  { name: "The day, in order", text: "Ceremony, dinner, dancing: each with its time and place, the venue as a map link, and a calendar file in one tap.", media: "/site/frag-day.webp" },
  { name: "A countdown on every phone", text: "Days, hours, minutes and seconds to the wedding, live on each guest’s screen, under the words you choose.", media: "/site/frag-countdown.webp" },
  { name: "Every reply, in one list", text: "Guests answer with a plus-one, a meal and a song request. You see each reply as it arrives and can download the list as a spreadsheet.", media: "/site/frag-guests.webp" },
];

const STEPS = [
  { verb: "Buy", text: "Order it on Etsy. Your order number opens your own studio straight away, with no account to create.", img: "/site/couple-home.webp", alt: "A couple on a sofa setting up their invitation on a laptop" },
  { verb: "Write", text: "Pick a design, then add your names, date, venue, story and photos. Every change shows on the phone beside it.", img: "/site/write-editor.webp", alt: "The studio: design choices on the left, the invitation on a phone on the right" },
  { verb: "Send", text: "Publish, then send one link by WhatsApp, text or email, or print its QR code on your save-the-dates.", img: "/site/send-hero.webp", alt: "An opened invitation with the couple's names over their photograph" },
];

const FAQ: [string, string][] = [
  ["Do our guests need an app or an account?", "No. The invitation opens in any phone or computer browser from the link you send."],
  ["How long does the invitation stay online?", "Until 7 days after your wedding, for up to 45 days from the day you first publish it. Publish within about six weeks of the wedding and it stays online through the day."],
  ["Can we change details after sending the link?", "Yes. Change the time, the venue or anything else, and everyone sees the update on the same link."],
  ["How many guests can reply?", "As many as you invite. There is no limit on guests or replies."],
  ["Can we switch to another design later?", "At any time. Your names, words and photos move to the new design as they are."],
  ["Can we use our own song?", "Not yet. Choose one of the twenty original tracks, or turn the music off."],
  ["Which languages does it support?", "The section titles are in English. Every line you write yourself, your story and your details, can be in any language."],
  ["How do we get in after buying?", "Go to wesaidyes.site/redeem and enter your Etsy order number and email. Use the same two to sign in again on any device."],
];

export default function Home() {
  return (
    <div className="site" id="top">
      <Reveal />
      <HeroInk />

      {/* 1. The pinned title over the designs */}
      <section className="h-run" style={{ ["--run-ink" as string]: RUN[0].ink, ["--run-ground" as string]: RUN[0].ground, ["--run-img" as string]: `url(/site/run-d-${RUN[0].id}.webp)`, ["--run-img-m" as string]: `url(/site/run-m-${RUN[0].id}.webp)`, ["--n" as string]: RUN.length }}>
        <div className="h-pin">
          <div className="h-band" aria-hidden />
          <nav className="h-nav" aria-label="Main">
            <Link href="/" className="h-mark">We said yes</Link>
            <span className="h-links">
              <a href="#designs">Designs</a>
              <a href="#songs">Songs</a>
              <a href="#questions">Questions</a>
              <a href={BRAND.etsy} target="_blank" rel="noopener noreferrer">Buy on Etsy</a>
            </span>
            <span className="h-acts">
              <Link href="/redeem" className="h-pill h-pill-ghost">Sign in</Link>
              <Link href="/demo" className="h-pill">Try a Demo</Link>
              <SiteMenu etsy={BRAND.etsy} />
            </span>
          </nav>
          <h1 className="h-title">We said yes</h1>
          <p className="h-lead">A wedding invitation website your guests open like a sealed envelope, then answer from their phone.</p>
          <Link href="/demo" className="h-btn">Try a Demo</Link>
        </div>
        <div className="h-panels">
          {RUN.map((r, i) => (
            <figure key={r.id} className="h-panel" data-ink={r.ink} data-ground={r.ground} data-img={`url(/site/run-d-${r.id}.webp)`} data-img-m={`url(/site/run-m-${r.id}.webp)`} style={{ background: r.ground }}>
              {/* the design's own paper fills the whole screen; the envelope sits on it as it does for a guest */}
              <picture>
                <source media="(max-width: 699px)" srcSet={`/site/run-m-${r.id}.webp`} width={780} height={1328} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/site/run-d-${r.id}.webp`} alt={`The ${THEMES.find((t) => t.id === r.id)?.name} envelope`} width={2880} height={1800} loading={i === 0 ? "eager" : "lazy"} fetchPriority={i === 0 ? "high" : undefined} />
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
          <h2 id="live-h" className="live-h">Try it with your names</h2>
          <p className="live-fact">One payment on Etsy. No subscription, no app for your guests.</p>
          <LiveNames />
        </div>
      </section>

      {/* 3. What guests get: stacking sheets */}
      <section className="feat" id="designs" aria-labelledby="feat-h">
        <h2 id="feat-h" className="feat-h" data-reveal>What your guests get</h2>
        <div className="sheets">
          {FEATURES.map((f, i) => (
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
                {THEMES.map((t) => <span key={t.id} className="band-item">{t.name}<i className="band-dot" /></span>)}
              </span>
            ))}
          </div>
        </div>
        <p className="band-note" data-reveal>
          Twenty designs, each with its own paper, wax seal, flowers and typefaces: {THEMES.map((t) => t.name).join(", ")}. Switch any time; your words and photos stay.
        </p>
      </section>

      {/* 5. The songs */}
      <section className="list" id="songs" aria-labelledby="songs-h" data-reveal>
        <h2 id="songs-h" className="list-h">Twenty songs, written for these invitations</h2>
        <SongList />
      </section>

      {/* 6. How it works: one verb at a time */}
      <section className="steps" aria-label="How it works">
        {STEPS.map((s) => (
          <div key={s.verb} className="step">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="step-img" src={s.img} alt={s.alt} loading="lazy" />
            <div className="step-pin"><h2 className="step-verb">{s.verb}</h2></div>
            <p className="step-text">{s.text}</p>
          </div>
        ))}
      </section>

      {/* 7. Questions */}
      <section className="qa" id="questions" aria-labelledby="qa-h" data-reveal>
        <h2 id="qa-h" className="sr-only">Questions</h2>
        <FaqIndex items={FAQ} />
      </section>

      {/* 8. One word is the button */}
      <a className="cta" href={BRAND.etsy} target="_blank" rel="noopener noreferrer">
        <span className="cta-line">Buy it on Etsy and start your invitation today.</span>
        <svg className="cta-arrow" viewBox="0 0 48 48" aria-hidden><path d="M12 36 36 12M16 12h20v20" fill="none" stroke="currentColor" strokeWidth="3" /></svg>
        <span className="cta-word">Order</span>
      </a>

      {/* 9. Footer: the name first */}
      <footer className="foot">
        <p className="foot-name" aria-hidden>We said yes</p>
        <div className="foot-row">
          <ul className="foot-places">
            <li><Link href="/demo">Live demo</Link></li>
            <li><Link href="/redeem">Sign in to your studio</Link></li>
            <li><a href={BRAND.etsy} target="_blank" rel="noopener noreferrer">Buy on Etsy</a></li>
          </ul>
          <div className="foot-cols">
            <ul><li><a href="#designs">Designs</a></li><li><a href="#songs">Songs</a></li><li><a href="#questions">Questions</a></li></ul>
            <ul><li><Link href="/redeem">Activate an order</Link></li><li><Link href="/demo">See an invitation</Link></li></ul>
            <ul><li><a href={BRAND.etsy} target="_blank" rel="noopener noreferrer">Buy on Etsy</a></li></ul>
          </div>
        </div>
        <div className="foot-legal">
          <span>© {new Date().getFullYear()} {BRAND.name}, made by {BRAND.shop}</span>
          <a href="#top" className="foot-top">Back to top</a>
        </div>
      </footer>
    </div>
  );
}

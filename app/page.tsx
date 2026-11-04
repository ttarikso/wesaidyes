import Link from "next/link";
import { THEMES, themeAssets } from "@/lib/themes";
import { TRACKS } from "@/lib/music";
import { BRAND } from "@/lib/brand";
import { Logo } from "@/components/Brand";

const STEPS = [
  ["Buy on Etsy", "Get instant access with your Etsy order number. No app, no account to create."],
  ["Design it in minutes", "Pick one of our themes, add your names, date, venue, story and photos. See every change live on a phone preview."],
  ["Share one link", "Send your link by WhatsApp, text or email, or print the QR code. Guests open the envelope and RSVP from any phone or computer."],
];
const FEATURES = [
  ["Animated envelope", "Guests tap the wax seal with your initials and the envelope opens to reveal your invitation."],
  [`${TRACKS.length} music tracks`, "Original, royalty-free background music. Choose a song or turn it off."],
  ["RSVP & guest list", "Replies arrive instantly in your guest list: who's coming, plus-ones, meals, song requests. Download as a spreadsheet."],
  ["Live countdown", "Days, hours, minutes and seconds to your big day."],
  ["Story, schedule & FAQ", "Your love story with polaroid photos, the order of the day, map, dress code and answers to common questions."],
  ["Edit anytime", "Changed the time or the venue? Update it and everyone sees the new details on the same link."],
];

export default function Home() {
  return (
    <div className="studio">
      <header className="flex items-center gap-3 px-5 h-16 max-w-6xl mx-auto">
        <Logo />
        <nav className="ml-auto flex items-center gap-2">
          <Link href="/demo" className="s-btn s-btn-sm">Live demo</Link>
          <Link href="/redeem" className="s-btn s-btn-sm s-btn-primary">Sign in</Link>
        </nav>
      </header>

      <main>
        <section className="max-w-6xl mx-auto px-5 pt-10 pb-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs font-semibold tracking-[.25em] uppercase text-[var(--s-muted)]">Digital wedding invitation website</p>
            <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] mt-4">An invitation they open like a real envelope.</h1>
            <p className="text-lg text-[var(--s-muted)] mt-5 max-w-lg">{BRAND.tagline}</p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/demo" className="s-btn s-btn-lg s-btn-primary">Open the live demo</Link>
              <a href={BRAND.etsy} className="s-btn s-btn-lg">Buy on Etsy</a>
            </div>
            <p className="text-sm text-[var(--s-muted)] mt-4">Already purchased? <Link href="/redeem" className="underline">Activate your order</Link></p>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {THEMES.map((t, i) => {
              const a = themeAssets(t);
              return (
                <Link key={t.id} href={`/demo?theme=${t.id}`} className={`relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md hover:-translate-y-1 transition ${i % 2 ? "translate-y-6" : ""}`} style={{ background: `url(${a.paper}) center/cover ${t.bg}` }} aria-label={`${t.name} theme demo`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.seal} alt="" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 drop-shadow-md" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.floral} alt="" className="absolute -left-4 -bottom-4 w-[90%] drop-shadow" />
                </Link>
              );
            })}
          </div>
        </section>

        <section className="bg-[var(--s-surface)] border-y border-[var(--s-line)]">
          <div className="max-w-6xl mx-auto px-5 py-16">
            <h2 className="font-serif text-4xl text-center">How it works</h2>
            <div className="grid md:grid-cols-3 gap-5 mt-10">
              {STEPS.map(([t, d], i) => (
                <div key={t} className="s-card p-6 bg-[var(--s-bg)]">
                  <span className="font-script text-4xl text-[var(--s-accent)]">{i + 1}.</span>
                  <h3 className="font-semibold text-lg mt-1">{t}</h3>
                  <p className="text-[var(--s-muted)] mt-2 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-5 py-16">
          <h2 className="font-serif text-4xl text-center">Everything in one link</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {FEATURES.map(([t, d]) => (
              <div key={t} className="p-2">
                <h3 className="font-semibold text-lg">{t}</h3>
                <p className="text-[var(--s-muted)] mt-1.5 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/demo" className="s-btn s-btn-lg s-btn-primary">See it on your phone</Link>
          </div>
        </section>
      </main>
      <footer className="text-center text-sm text-[var(--s-muted)] pb-10">
        © {new Date().getFullYear()} {BRAND.name} · by <a href={BRAND.etsyShop} className="underline">{BRAND.shop}</a>
      </footer>
    </div>
  );
}

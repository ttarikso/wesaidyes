"use client";
import { useEffect, useRef, useState } from "react";
import { MOMENTS, TRACKS, fmtLength, trackUrl } from "@/lib/music";
import { slugify } from "@/lib/defaults";

/* The pinned hero: the title's ink follows the panel under it. */
export function HeroInk() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".h-run");
    const panels = Array.from(document.querySelectorAll<HTMLElement>(".h-panel"));
    if (!hero || !panels.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        const p = e.target as HTMLElement;
        hero.style.setProperty("--run-ink", p.dataset.ink || "");
        hero.style.setProperty("--run-ground", p.dataset.ground || "");
        hero.style.setProperty("--run-img", p.dataset.img || "none");
        hero.style.setProperty("--run-img-m", p.dataset.imgM || "none");
      }),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    panels.forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, []);
  return null;
}

/* Section entrances: heading, then text, then picture, once. */
export function Reveal() {
  useEffect(() => {
    document.documentElement.classList.add("js");
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-in")); return; }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
  return null;
}

/* The live thing: type your names, see them set as on the envelope, get your link, open your own demo. */
export function LiveNames({ labels }: { labels?: { partner1Label: string; partner2Label: string; openBtn: string } }) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const n1 = a.trim() || "Amelia";
  const n2 = b.trim() || "Julian";
  const slug = slugify(`${n1}-and-${n2}`) || "your-names";
  return (
    <form className="live-form" action="/demo" method="get">
      <p className="live-names" aria-live="polite">{n1} <i>&amp;</i> {n2}</p>
      <label className="live-field">
        <span>{labels?.partner1Label || "Your first name"}</span>
        <input name="a" value={a} onChange={(e) => setA(e.target.value)} placeholder="Amelia" autoComplete="given-name" maxLength={30} />
      </label>
      <label className="live-field">
        <span>{labels?.partner2Label || "Your partner’s first name"}</span>
        <input name="b" value={b} onChange={(e) => setB(e.target.value)} placeholder="Julian" maxLength={30} />
      </label>
      <p className="live-link" aria-live="polite">wesaidyes.site/i/<b>{slug}</b></p>
      <button className="live-go" type="submit">{labels?.openBtn || "Open your invitation"}</button>
    </form>
  );
}

/* The songs, at one type size, each playable. */
export function SongList({ labels }: { labels?: { stop: string; listen: string } } = {}) {
  const [playing, setPlaying] = useState<string | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const stop = () => { if (document.visibilityState === "hidden") { audio.current?.pause(); setPlaying(null); } };
    const leave = () => { audio.current?.pause(); setPlaying(null); };
    document.addEventListener("visibilitychange", stop);
    window.addEventListener("pagehide", leave);
    return () => { document.removeEventListener("visibilitychange", stop); window.removeEventListener("pagehide", leave); audio.current?.pause(); };
  }, []);
  function play(id: string) {
    if (!audio.current) audio.current = new Audio();
    const el = audio.current;
    if (playing === id) { el.pause(); setPlaying(null); return; }
    el.src = trackUrl(id);
    el.play().then(() => setPlaying(id)).catch(() => setPlaying(null));
    el.onended = () => setPlaying(null);
  }
  return (
    <div className="songs">
      {MOMENTS.map((m) => (
        <div key={m.id} className="songs-group">
          <h3 className="songs-moment">{m.label}</h3>
          <ul>
            {TRACKS.filter((t) => t.moment === m.id).map((t) => (
              <li key={t.id} className={playing === t.id ? "is-playing" : ""}>
                <span className="s-title">{t.title}</span>
                <span className="s-style">{t.style}</span>
                <span className="s-len">{fmtLength(t.seconds)}</span>
                <button className="s-play" onClick={() => play(t.id)} aria-label={playing === t.id ? `Stop ${t.title}` : `Listen to ${t.title}`}>
                  {playing === t.id ? (labels?.stop || "Stop") : (labels?.listen || "Listen")}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* Questions on the left, the selected answer large on the right. */
export function FaqIndex({ items }: { items: [string, string][] }) {
  const [sel, setSel] = useState(0);
  return (
    <div className="faq">
      <div className="faq-list" role="tablist" aria-orientation="vertical" aria-label="Questions">
        <p className="faq-label">Questions</p>
        {items.map(([q, a], i) => (
          <div key={q} className="faq-item">
            <button
              role="tab" aria-selected={sel === i} aria-controls="faq-answer"
              className="faq-q" onMouseEnter={() => setSel(i)} onFocus={() => setSel(i)} onClick={() => setSel(i)}
            >
              <span className="dot" aria-hidden />{q}
            </button>
            <p className="faq-inline" hidden={sel !== i}>{a}</p>
          </div>
        ))}
      </div>
      <div className="faq-pane" id="faq-answer" role="tabpanel" aria-live="polite">
        <p key={sel} className="faq-a">{items[sel][1]}</p>
      </div>
    </div>
  );
}

/* Phone menu: a two-line button that opens a full-screen sheet over the hero. */
export function SiteMenu({ etsy }: { etsy: string }) {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); btn.current?.focus(); };
  }, [open]);
  const close = () => setOpen(false);
  return (
    <>
      <button ref={btn} type="button" className="h-burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen((o) => !o)}>
        <i aria-hidden /><i aria-hidden />
      </button>
      <div id="site-menu" className="h-sheet" data-open={open || undefined} hidden={!open}>
        <ul>
          <li><a href="/designs" onClick={close}>Designs</a></li>
          <li><a href="/guides" onClick={close}>Guides</a></li>
          <li><a href="/#questions" onClick={close}>Questions</a></li>
          <li><a href="/redeem" onClick={close}>Sign in</a></li>
          <li><a href={etsy} target="_blank" rel="noopener noreferrer" onClick={close}>Buy on Etsy</a></li>
        </ul>
        <a className="h-sheet-cta" href="/demo">Try a Demo</a>
      </div>
    </>
  );
}

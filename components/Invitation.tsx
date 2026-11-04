"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { InviteData } from "@/lib/types";
import { getTheme, themeAssets, themeVars } from "@/lib/themes";
import { trackUrl } from "@/lib/music";
import { dateParts, fmtTime, icsFile, parseWhen } from "@/lib/format";
import { RsvpForm } from "./RsvpForm";

export type InviteMode = "live" | "preview";

interface Props {
  data: InviteData;
  theme: string;
  music: string;
  slug: string;
  mode?: InviteMode;
  /** start already opened (used by the studio preview "skip envelope" toggle) */
  startOpen?: boolean;
}

export default function Invitation({ data, theme, music, slug, mode = "live", startOpen = false }: Props) {
  const t = getTheme(theme);
  const a = themeAssets(t);
  const [stage, setStage] = useState<"closed" | "opening" | "open">(startOpen ? "open" : "closed");
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const hasMusic = music && music !== "none";

  useEffect(() => { if (startOpen) setStage("open"); }, [startOpen]);

  // keep the audio element in sync with the chosen track
  useEffect(() => {
    if (!audio.current) return;
    const wasPlaying = !audio.current.paused;
    audio.current.load();
    if (wasPlaying && hasMusic) audio.current.play().catch(() => setPlaying(false));
  }, [music, hasMusic]);

  function open() {
    if (stage !== "closed") return;
    setStage("opening");
    if (hasMusic && audio.current) {
      audio.current.volume = 0.7;
      audio.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
    window.setTimeout(() => setStage("open"), 3000);
  }

  function toggleMusic() {
    const el = audio.current;
    if (!el) return;
    if (el.paused) el.play().then(() => setPlaying(true)).catch(() => {});
    else { el.pause(); setPlaying(false); }
  }

  // lock page scroll while the envelope is showing
  useEffect(() => {
    document.documentElement.style.overflow = stage === "open" ? "" : "hidden";
    return () => { document.documentElement.style.overflow = ""; };
  }, [stage]);

  return (
    <div className={`inv inv-${t.id} stage-${stage}`} style={themeVars(t)}>
      <div className="inv-bg" aria-hidden />
      {hasMusic && <audio ref={audio} src={trackUrl(music)} loop preload="none" />}

      {stage !== "open" && <Envelope data={data} seal={a.seal} floral={a.floral} onOpen={open} opening={stage === "opening"} />}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="inv-deco inv-deco-a" src={a.floral} alt="" aria-hidden />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="inv-deco inv-deco-b" src={a.floral} alt="" aria-hidden />
      <main className="inv-main" aria-hidden={stage !== "open"}>
        <Content data={data} floral={a.floral} slug={slug} mode={mode} visible={stage === "open"} />
      </main>

      {hasMusic && stage === "open" && (
        <button className={`inv-music ${playing ? "is-playing" : ""}`} onClick={toggleMusic} aria-label={playing ? "Pause music" : "Play music"}>
          <span className="disc" aria-hidden>
            <span className="label" />
          </span>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden className="icon">
            {playing ? <path fill="currentColor" d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /> : <path fill="currentColor" d="M8 5.5v13l11-6.5z" />}
          </svg>
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ envelope */
function Envelope({ data, seal, floral, onOpen, opening }: { data: InviteData; seal: string; floral: string; onOpen: () => void; opening: boolean }) {
  const dp = dateParts(data.date);
  return (
    <div className={`env-screen ${opening ? "is-opening" : ""}`}>
      <div className="env-wrap">
        <p className="env-kicker">You are invited</p>
        <button type="button" className="env" onClick={onOpen} aria-label={data.openText || "Open the invitation"}>
          <span className="env-back" />
          <span className="env-letter">
            <span className="env-letter-host">{data.hostLine || "Please join us"}</span>
            <span className="env-letter-names">
              {data.partner1}
              <em>&amp;</em>
              {data.partner2}
            </span>
            {dp && <span className="env-letter-date">{dp.short}</span>}
          </span>
          <span className="env-front">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
              <path d="M0 100 L50 52 L100 100" fill="none" stroke="rgba(0,0,0,.16)" strokeWidth=".5" vectorEffect="non-scaling-stroke" />
              <path d="M0 100.8 L50 53 L100 100.8" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth=".5" vectorEffect="non-scaling-stroke" />
            </svg>
          </span>
          <span className="env-flap-wrap"><span className="env-flap" /></span>
          <span className="env-seal">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={seal} alt="" draggable={false} />
            <span className="env-seal-text">{data.initials || `${data.partner1[0] || ""}&${data.partner2[0] || ""}`}</span>
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="env-floral env-floral-a" src={floral} alt="" draggable={false} />
        </button>
        <h1 className="env-names">
          {data.partner1} <span>&amp;</span> {data.partner2}
        </h1>
        {dp && <p className="env-date">{dp.dots}</p>}
        <p className="env-cta">{data.openText || "Tap to open"}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ page */
function useReveal(visible: boolean) {
  useEffect(() => {
    if (!visible) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".rv:not(.in)"));
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  });
}

function Content({ data, floral, slug, mode, visible }: { data: InviteData; floral: string; slug: string; mode: InviteMode; visible: boolean }) {
  useReveal(visible);
  const dp = dateParts(data.date);
  const s = data.sections;
  const location = [data.venueName, data.venueAddress].filter(Boolean).join(", ");
  const mapHref = data.mapUrl || (location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}` : "");
  const [showPill, setShowPill] = useState(false);

  // floating RSVP button: visible after the hero, hidden while the RSVP form is on screen
  useEffect(() => {
    let rsvpInView = false;
    const on = () => setShowPill(window.scrollY > window.innerHeight * 0.9 && !rsvpInView);
    const el = document.getElementById("rsvp");
    const io = el && "IntersectionObserver" in window
      ? new IntersectionObserver(([e]) => { rsvpInView = e.isIntersecting; on(); }, { threshold: 0 })
      : null;
    if (el && io) io.observe(el);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); io?.disconnect(); };
  }, []);

  function addToCalendar() {
    const ics = icsFile({
      title: `${data.partner1} & ${data.partner2}'s Wedding`,
      date: data.date,
      time: data.time,
      location,
      description: data.inviteLine,
      url: typeof window !== "undefined" ? window.location.href : "",
    });
    if (!ics) return;
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const el = document.createElement("a");
    el.href = url;
    el.download = `${slug || "wedding"}.ics`;
    el.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  const storyPhotos = data.storyPhotos.filter(Boolean);
  const gallery = data.gallery.filter(Boolean);
  const schedule = data.schedule.filter((x) => x.title || x.time);
  const faqs = data.faqs.filter((f) => f.q);

  return (
    <>
      {/* HERO */}
      <section className="sec sec-hero">
        <div className="card hero-card rv">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hero-floral" src={floral} alt="" />
          {data.heroPhoto && (
            <div className="hero-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.heroPhoto} alt={`${data.partner1} and ${data.partner2}`} />
            </div>
          )}
          {data.hostLine && <p className="kicker">{data.hostLine}</p>}
          <h1 className="hero-names">
            <span>{data.partner1}</span>
            <em>&amp;</em>
            <span>{data.partner2}</span>
          </h1>
          {data.inviteLine && <p className="hero-line">{data.inviteLine}</p>}
          {dp && (
            <div className="hero-date">
              <span className="hd-side">{dp.weekday}</span>
              <span className="hd-mid">
                <span className="hd-month">{dp.month}</span>
                <span className="hd-day">{dp.day}</span>
                <span className="hd-year">{dp.year}</span>
              </span>
              <span className="hd-side">{data.time ? `at ${fmtTime(data.time)}` : " "}</span>
            </div>
          )}
          {data.venueName && <p className="hero-venue">{data.venueName}</p>}
          {data.venueAddress && <p className="hero-addr">{data.venueAddress}</p>}
          <div className="hero-actions">
            {data.rsvp.enabled && <a className="btn btn-solid" href="#rsvp">RSVP</a>}
            <button className="btn btn-line" onClick={addToCalendar} type="button">Add to calendar</button>
            {mapHref && <a className="btn btn-line" href={mapHref} target="_blank" rel="noreferrer">Directions</a>}
          </div>
        </div>
        <div className="scroll-hint" aria-hidden>
          <span />
        </div>
      </section>

      {/* COUNTDOWN */}
      {s.countdown && parseWhen(data.date, data.time) && (
        <section className="sec sec-band rv">
          <p className="band-script">{data.closingLine || "Counting down to forever"}</p>
          <Countdown date={data.date} time={data.time} />
        </section>
      )}

      {/* STORY */}
      {s.story && (data.storyText || storyPhotos.length > 0) && (
        <section className="sec" id="story">
          <div className="card rv">
            <Heading kicker="How it began" title={data.storyTitle || "Our Story"} />
            {storyPhotos.length > 0 && (
              <div className={`polas polas-${storyPhotos.length}`}>
                {storyPhotos.map((p, i) => (
                  <figure className="pola" key={p + i}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p} alt="" loading="lazy" />
                  </figure>
                ))}
              </div>
            )}
            {data.storyText && <p className="prose">{data.storyText}</p>}
          </div>
        </section>
      )}

      {/* SCHEDULE */}
      {s.schedule && schedule.length > 0 && (
        <section className="sec" id="schedule">
          <div className="card rv">
            <Heading kicker={dp?.long || "The big day"} title="Order of the Day" />
            <ol className="timeline">
              {schedule.map((x, i) => (
                <li key={i}>
                  <span className="tl-time">{fmtTime(x.time)}</span>
                  <span className="tl-dot" aria-hidden />
                  <span className="tl-body">
                    <strong>{x.title}</strong>
                    {x.note && <span>{x.note}</span>}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* DETAILS */}
      {s.details && (location || data.dressCode || data.accommodation) && (
        <section className="sec" id="details">
          <div className="card rv">
            <Heading kicker="Good to know" title="Wedding Details" />
            {location && (
              <div className="detail">
                <h3>The Venue</h3>
                {data.venueName && <p className="detail-strong">{data.venueName}</p>}
                {data.venueAddress && <p>{data.venueAddress}</p>}
                {location && (
                  <div className="map">
                    <iframe
                      title="Map"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`}
                    />
                  </div>
                )}
                {mapHref && <a className="btn btn-line btn-sm" href={mapHref} target="_blank" rel="noreferrer">Open in Maps</a>}
              </div>
            )}
            {data.dressCode && (
              <div className="detail">
                <h3>Dress Code</h3>
                <p>{data.dressCode}</p>
                {data.palette.length > 0 && (
                  <div className="swatches" aria-label="Suggested colours">
                    {data.palette.map((c, i) => <span key={i} style={{ background: c }} />)}
                  </div>
                )}
              </div>
            )}
            {data.accommodation && (
              <div className="detail">
                <h3>Accommodation</h3>
                <p>{data.accommodation}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* GALLERY */}
      {s.gallery && gallery.length > 0 && (
        <section className="sec sec-gallery rv" id="gallery">
          <p className="band-script">Moments</p>
          <div className="gallery">
            {gallery.map((p, i) => (
              <figure className="pola" key={p + i}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p} alt="" loading="lazy" />
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {s.faq && faqs.length > 0 && (
        <section className="sec" id="faq">
          <div className="card rv">
            <Heading kicker="Questions & answers" title="FAQs" />
            <div className="faqs">
              {faqs.map((f, i) => (
                <details key={i}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RSVP */}
      {data.rsvp.enabled && (
        <section className="sec" id="rsvp">
          <div className="card rv">
            <Heading kicker={data.rsvp.deadline ? `Kindly reply by ${dateParts(data.rsvp.deadline)?.short}` : "Will you join us?"} title="RSVP" />
            <RsvpForm settings={data.rsvp} slug={slug} preview={mode === "preview"} />
          </div>
        </section>
      )}

      {/* CLOSING */}
      <footer className="sec sec-close rv">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="close-floral" src={floral} alt="" />
        <p className="close-kicker">Sincerely yours,</p>
        <p className="close-names">
          {data.partner1} &amp; {data.partner2}
        </p>
        {dp && <p className="close-date">{dp.dots}</p>}
      </footer>

      {data.rsvp.enabled && (
        <a href="#rsvp" className={`rsvp-pill ${showPill ? "show" : ""}`}>
          RSVP
        </a>
      )}
    </>
  );
}

function Heading({ kicker, title }: { kicker?: string; title: string }) {
  return (
    <header className="h">
      {kicker && <p className="kicker">{kicker}</p>}
      <h2>{title}</h2>
      <svg className="orn" viewBox="0 0 120 12" aria-hidden>
        <path d="M2 6h44M74 6h44" stroke="currentColor" strokeWidth=".8" />
        <path d="M60 1.5c2.4 2.6 2.4 6.4 0 9-2.4-2.6-2.4-6.4 0-9z M52 6c2.6-2 5.2-2 8 0-2.8 2-5.4 2-8 0z M68 6c-2.6-2-5.2-2-8 0 2.8 2 5.4 2 8 0z" fill="currentColor" />
      </svg>
    </header>
  );
}

function Countdown({ date, time }: { date: string; time: string }) {
  const target = useMemo(() => parseWhen(date, time)?.getTime() || 0, [date, time]);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (now === null) return <div className="cd" style={{ visibility: "hidden" }}><span className="cd-u"><b>00</b><i>days</i></span></div>;
  const diff = Math.max(0, target - now);
  if (diff === 0) return <p className="cd-done">Today is the day!</p>;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const sec = Math.floor((diff / 1000) % 60);
  const u = (v: number, l: string) => (
    <span className="cd-u">
      <b>{String(v).padStart(2, "0")}</b>
      <i>{l}</i>
    </span>
  );
  return (
    <div className="cd" role="timer">
      {u(d, d === 1 ? "day" : "days")}
      {u(h, "hours")}
      {u(m, "minutes")}
      {u(sec, "seconds")}
    </div>
  );
}

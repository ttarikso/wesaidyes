"use client";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { InviteData } from "@/lib/types";
import { getTheme, scriptCase, themeAssets, themeVars, type Theme } from "@/lib/themes";
import SealText from "@/components/SealText";
import { getTrack, trackUrl } from "@/lib/music";
import { dateParts, fmtTime, icsFile, parseWhen } from "@/lib/format";
import { RsvpForm } from "./RsvpForm";
import { HeartRibbon } from "./HeartRibbon";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { type Language, DEFAULT_LANGUAGE, isValidLanguage } from "@/lib/i18n/types";
import { getInviteI18n, localizedDateParts } from "@/lib/i18n/invitation";

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

// how much each print in the story album is turned, in order; never the same twice in a row
const ALBUM_TILT = [-2.4, 1.8, -1.2, 2.6, -1.8, 1.2];

const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function Invitation({ data, theme, music, slug, mode = "live", startOpen = false }: Props) {
  const t = getTheme(theme);
  const a = themeAssets(t);
  const h = data.headingFont;
  data = h === "script" ? { ...data, partner1: scriptCase(data.partner1, h), partner2: scriptCase(data.partner2, h), initials: scriptCase(data.initials || "", h) } : data;
  const [stage, setStage] = useState<"closed" | "opening" | "open">(startOpen ? "open" : "closed");
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const hasMusic = !!music && music !== "none";

  const [lang, setLang] = useState<Language>(() => {
    if (isValidLanguage(data.language)) return data.language;
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(`invite-lang:${slug}`);
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
      try { localStorage.setItem(`invite-lang:${slug}`, l); } catch {}
    }
  };

  const i18n = getInviteI18n(lang);

  useEffect(() => { if (startOpen) setStage("open"); }, [startOpen]);
  useEffect(() => { document.documentElement.classList.add("js"); }, []);

  useEffect(() => {
    if (!audio.current) return;
    const was = !audio.current.paused;
    audio.current.load();
    if (was && hasMusic) audio.current.play().catch(() => setPlaying(false));
  }, [music, hasMusic]);

  // phones keep an <audio> playing in a background tab or after the page is left: stop it when the page is hidden,
  // pick it up again when the guest comes back, and stop for good when the invitation goes away
  useEffect(() => {
    let resume = false;
    const hide = () => { const el = audio.current; if (el && !el.paused) { resume = true; el.pause(); setPlaying(false); } };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") { hide(); return; }
      const el = audio.current;
      if (resume && el) { resume = false; el.play().then(() => setPlaying(true)).catch(() => setPlaying(false)); }
    };
    const onPageHide = () => { hide(); resume = false; };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    const el = audio.current;
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      el?.pause();
    };
  }, []);

  function open() {
    if (stage !== "closed") return;
    setStage("opening");
    if (hasMusic && audio.current) {
      audio.current.volume = 0.7;
      audio.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
    window.setTimeout(() => setStage("open"), 2600);
  }

  function toggleMusic() {
    const el = audio.current;
    if (!el) return;
    if (el.paused) el.play().then(() => setPlaying(true)).catch(() => {});
    else { el.pause(); setPlaying(false); }
  }

  useEffect(() => {
    document.documentElement.style.overflow = stage === "open" ? "" : "hidden";
    return () => { document.documentElement.style.overflow = ""; };
  }, [stage]);

  return (
    <div className={`inv stage-${stage}`} data-theme={t.id} data-skip={startOpen ? "" : undefined} style={themeVars(t, data.headingFont)}>
      {hasMusic && <audio ref={audio} src={trackUrl(music)} loop preload="none" />}
      {stage !== "open" && <Envelope data={data} theme={t} seal={a.seal} floral={a.floral} onOpen={open} opening={stage === "opening"} lang={lang} onLangChange={handleLangChange} />}
      <main className="inv-main" aria-hidden={stage !== "open"}>
        <Page data={data} floral={a.floral} slug={slug} mode={mode} open={stage !== "closed"} music={hasMusic ? music : ""} lang={lang} onLangChange={handleLangChange} />
      </main>
      {hasMusic && stage === "open" && (
        <button className={`iv-music ${playing ? "is-on" : ""}`} onClick={toggleMusic} aria-label={playing ? i18n.env.pauseMusic : i18n.env.playMusic}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            {playing ? <path fill="currentColor" d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /> : <path fill="currentColor" d="M8 5.5v13l11-6.5z" />}
          </svg>
          <span>{playing ? i18n.env.musicOn : i18n.env.musicOff}</span>
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ envelope */
function Envelope({ data, theme, seal, floral, onOpen, opening, lang, onLangChange }: { data: InviteData; theme: Theme; seal: string; floral: string; onOpen: () => void; opening: boolean; lang: Language; onLangChange: (l: Language) => void }) {
  const i18n = getInviteI18n(lang);
  const dp = localizedDateParts(data.date, lang);
  const initials = data.initials || `${data.partner1[0] || ""}&${data.partner2[0] || ""}`;
  return (
    <div className={`env-screen ${opening ? "is-opening" : ""}`}>
      <LanguageSwitcher current={lang} onChange={onLangChange} variant="envelope" />
      <div className="env-wrap">
        <button type="button" className="env" onClick={onOpen} aria-label={data.openText || i18n.env.openAria}>
          <span className="env-back" />
          <span className="env-letter">
            <span className="env-letter-names">{data.partner1} <i>&amp;</i> {data.partner2}</span>
            {dp && <span className="env-letter-date">{dp.short}</span>}
            <HeartRibbon className="env-letter-heart" />
          </span>
          <span className="env-front" />
          <span className="env-flap" />
          <span className="env-seal">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={seal} alt="" draggable={false} />
            <SealText theme={theme} heading={data.headingFont} text={initials} />
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="env-floral" src={floral} alt="" draggable={false} />
        </button>
        <p className="env-names">{data.partner1} <i>&amp;</i> {data.partner2}</p>
        {dp && <p className="env-date">{dp.long}</p>}
        <p className="env-cta">{data.openText || i18n.env.openCta}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ helpers */
/** Fit the two lines of the names to the width, same size for both, capped by the theme. */
function useMonument(deps: unknown[]) {
  const box = useRef<HTMLHeadingElement>(null);
  const fit = useCallback(() => {
    const h = box.current;
    if (!h) return;
    const lines = Array.from(h.querySelectorAll<HTMLElement>("[data-fit]"));
    if (!lines.length) return;
    const host = getComputedStyle(h).display === "contents" ? (h.parentElement as HTMLElement) : h;
    const cs = getComputedStyle(host);
    const W = host.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const phone = window.innerWidth < 700;
    const maxVw = parseFloat(getComputedStyle(h).getPropertyValue("--monument-max")) || 13;
    const cap = (window.innerWidth * (phone ? Math.max(maxVw, 17) : maxVw)) / 100;
    h.style.setProperty("--names-size", "100px");
    let size = cap;
    for (const l of lines) {
      const room = W * (l.dataset.fit === "indent" && !phone ? 0.72 : 1);
      const w = l.scrollWidth || 1;
      size = Math.min(size, (100 * room) / w);
    }
    h.style.setProperty("--names-size", `${Math.max(28, Math.floor(size))}px`);
  }, []);
  useIso(() => {
    fit();
    const on = () => fit();
    window.addEventListener("resize", on);
    document.fonts?.ready.then(on).catch(() => {});
    return () => window.removeEventListener("resize", on);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return box;
}

function useReveal(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-in")); return; }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  });
}

function splitStory(text: string, parts: number): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+["”’)]*\s*|[^.!?]+$/g)?.map((s) => s.trim()).filter(Boolean) || [];
  if (parts <= 1 || sentences.length <= 1) return [sentences.join(" ")];
  const out: string[] = Array.from({ length: parts }, () => "");
  sentences.forEach((s, i) => { const k = Math.min(parts - 1, Math.floor((i * parts) / sentences.length)); out[k] = (out[k] + " " + s).trim(); });
  return out;
}

/* ------------------------------------------------------------------ the page */
function Page({ data, floral, slug, mode, open, music, lang, onLangChange }: { data: InviteData; floral: string; slug: string; mode: InviteMode; open: boolean; music: string; lang: Language; onLangChange: (l: Language) => void }) {
  useReveal(open);
  const i18n = getInviteI18n(lang);
  const dp = localizedDateParts(data.date, lang);
  const s = data.sections;
  const names = useMonument([data.partner1, data.partner2, open]);
  const foot = useMonument([data.partner1, data.partner2, open]);
  const location = [data.venueName, data.venueAddress].filter(Boolean).join(", ");
  const mapHref = data.mapUrl || (location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}` : "");
  const storyPhotos = data.storyPhotos.filter(Boolean);
  const gallery = data.gallery.filter(Boolean);
  const schedule = data.schedule.filter((x) => x.title || x.time);
  const faqs = data.faqs.filter((f) => f.q);
  const storyParts = useMemo(() => splitStory(data.storyText, Math.max(1, storyPhotos.length)), [data.storyText, storyPhotos.length]);
  const track = music ? getTrack(music) : null;

  const nav = [
    s.story && (data.storyText || storyPhotos.length) ? [i18n.nav.story, "#story"] : null,
    s.schedule && schedule.length ? [i18n.nav.day, "#day"] : null,
    s.details && location ? [i18n.nav.details, "#venue"] : null,
    data.rsvp.enabled ? [i18n.nav.rsvp, "#rsvp"] : null,
  ].filter(Boolean) as [string, string][];

  function addToCalendar() {
    const ics = icsFile({
      title: `${data.partner1} & ${data.partner2}'s wedding`, date: data.date, time: data.time, location,
      description: data.inviteLine, url: typeof window !== "undefined" ? window.location.href : "",
    });
    if (!ics) return;
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const el = document.createElement("a");
    el.href = url; el.download = `${slug || "wedding"}.ics`; el.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  const when = [dp?.long, data.time ? `at ${fmtTime(data.time)}` : ""].filter(Boolean).join(" ");

  return (
    <>
      {/* HERO: the names as a monument */}
      <header className={`iv-hero ${data.heroPhoto ? "has-photo" : "g-paper"}`}>
        {data.heroPhoto ? (
          <figure className="iv-hero-pic" data-open>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.heroPhoto} alt={`${data.partner1} and ${data.partner2}`} fetchPriority="high" />
          </figure>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="iv-hero-floral" src={floral} alt="" aria-hidden />
        )}
        <nav className="iv-nav" aria-label="Sections">
          {nav.map(([l, h]) => <a key={h} href={h}>{l}</a>)}
          <LanguageSwitcher current={lang} onChange={onLangChange} variant="invite" />
        </nav>
        <h1 className="iv-names lines" ref={names}>
          <span className="line l1"><span data-line data-fit="full" style={{ ["--i" as string]: 0 }}>{data.partner1}</span></span>
          <span className="line l2"><span data-line data-fit="indent" style={{ ["--i" as string]: 1 }}><i className="amp">&amp;</i> {data.partner2}</span></span>
        </h1>
        <div className="iv-hero-mid" data-load>
          <p>{when}{data.venueName ? <><br />{[data.venueName, data.venueAddress.split(",").slice(-2).join(",").trim()].filter(Boolean).join(", ")}</> : null}</p>
          {data.rsvp.enabled ? <a className="iv-btn" href="#rsvp">{i18n.countdown.replyBtn}</a> : <button className="iv-btn" onClick={addToCalendar}>{i18n.countdown.addToCalendar}</button>}
        </div>
      </header>

      {/* INVITATION WORDING + COUNTDOWN */}
      <section className="iv-intro g-sheet" data-reveal>
        <p className="iv-statement" style={{ ["--i" as string]: 0 }}>
          {[data.hostLine, `${data.partner1} and ${data.partner2}`].filter(Boolean).join(", ")} {data.inviteLine}
        </p>
        <div className="iv-count" style={{ ["--i" as string]: 1 }}>
          {s.countdown && parseWhen(data.date, data.time) ? <Countdown date={data.date} time={data.time} line={data.closingLine} lang={lang} /> : <h2 className="iv-h">{dp?.long}</h2>}
          <div className="iv-row-actions">
            <button className="iv-link" onClick={addToCalendar} type="button">{i18n.countdown.addToCalendar}</button>
            {mapHref && <a className="iv-link" href={mapHref} target="_blank" rel="noreferrer">{i18n.countdown.directions}</a>}
          </div>
        </div>
      </section>

      {/* STORY: pinned title; the photos are prints mounted in an album, each laid down as it scrolls in */}
      {s.story && (data.storyText || storyPhotos.length > 0) && (
        storyPhotos.length > 0 ? (
          <section className="iv-story g-paper" id="story">
            <div className="iv-story-pin">
              <h2 className="iv-story-title">{data.storyTitle || i18n.nav.story}</h2>
            </div>
            <div className="iv-story-run">
              {storyPhotos.map((p, i) => (
                <figure className={`iv-portrait ${i % 2 ? "r" : "l"}`} key={p + i} data-reveal style={{ ["--rot" as string]: `${ALBUM_TILT[i % ALBUM_TILT.length]}deg` }}>
                  <div className="iv-print">
                    <div className="iv-print-photo">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p} alt="" loading="lazy" width={800} height={1000} />
                    </div>
                    <i className="iv-corner tl" aria-hidden /><i className="iv-corner tr" aria-hidden /><i className="iv-corner bl" aria-hidden /><i className="iv-corner br" aria-hidden />
                  </div>
                  {storyParts[i] && <figcaption>{storyParts[i]}</figcaption>}
                </figure>
              ))}
            </div>
          </section>
        ) : (
          <section className="iv-story-plain g-paper" id="story" data-reveal>
            <h2 className="iv-h" style={{ ["--i" as string]: 0 }}>{data.storyTitle || i18n.nav.story}</h2>
            <p className="iv-body" style={{ ["--i" as string]: 1 }}>{data.storyText}</p>
          </section>
        )
      )}

      {/* THE DAY: one type size */}
      {s.schedule && schedule.length > 0 && (
        <section className="iv-day g-sheet" id="day" data-reveal>
          <h2 className="iv-day-head" style={{ ["--i" as string]: 0 }}>{dp ? `${dp.weekday} ${dp.day} ${dp.month}` : i18n.sections.schedule}</h2>
          <ol className={`iv-lineup ${schedule.length < 8 ? "few" : ""}`} style={{ ["--i" as string]: 1 }}>
            {schedule.map((x, i) => (
              <li key={i}>
                <span className="lu-title">{x.title}</span>
                <span className="lu-note">{x.note}</span>
                <span className="lu-time">{fmtTime(x.time)}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* VENUE: address in display rows */}
      {s.details && (location || data.dressCode || data.accommodation) && (
        <section className="iv-venue g-paper" id="venue">
          <h2 className="sr-only">{i18n.sections.whereAndWhen}</h2>
          {location && (
            <div className="iv-rows" data-reveal>
              {data.venueName && <p className="iv-dr" style={{ ["--i" as string]: 0 }}>{data.venueName}</p>}
              {data.venueAddress && (
                <p className="iv-dr" style={{ ["--i" as string]: 1 }}>
                  <a href={mapHref} target="_blank" rel="noreferrer">{data.venueAddress}</a>
                </p>
              )}
              {dp && <p className="iv-dr" style={{ ["--i" as string]: 2 }}>{dp.weekday} {dp.day} {dp.month}{data.time ? `, ${fmtTime(data.time)}` : ""}</p>}
              {mapHref && (
                <p className="iv-dr iv-dr-go" style={{ ["--i" as string]: 3 }}>
                  <a href={mapHref} target="_blank" rel="noreferrer">
                    {i18n.countdown.directions}
                    <span className="iv-round" aria-hidden>
                      <svg viewBox="0 0 24 24" width="40%" height="40%"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2.2" /></svg>
                    </span>
                  </a>
                </p>
              )}
            </div>
          )}
          {(data.dressCode || data.accommodation) && (
            <div className="iv-notes" data-reveal>
              {data.dressCode && (
                <div style={{ ["--i" as string]: 0 }}>
                  <h3 className="iv-h3">{i18n.sections.dressCode}</h3>
                  <p className="iv-body">{data.dressCode}</p>
                  {data.palette.length > 0 && (
                    <div className="iv-swatches" aria-label="Suggested colours">
                      {data.palette.map((c, i) => <span key={i} style={{ background: c }} />)}
                    </div>
                  )}
                </div>
              )}
              {data.accommodation && (
                <div style={{ ["--i" as string]: 1 }}>
                  <h3 className="iv-h3">{i18n.sections.accommodation}</h3>
                  <p className="iv-body">{data.accommodation}</p>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* PHOTOGRAPHS: small frames, wide space */}
      {s.gallery && gallery.length > 0 && (
        <section className="iv-strip g-sheet" id="photos" data-reveal>
          <h2 className="iv-strip-title" style={{ ["--i" as string]: 0 }}>Photographs, {gallery.length}</h2>
          <div className="iv-strip-row" tabIndex={0} aria-label="Photographs, scroll sideways" style={{ ["--i" as string]: 1 }}>
            {gallery.map((p, i) => (
              <figure key={p + i}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p} alt="" loading="lazy" width={400} height={600} />
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* QUESTIONS */}
      {s.faq && faqs.length > 0 && (
        <section className="iv-faq g-paper" id="questions" data-reveal>
          <h2 className="iv-faq-head" style={{ ["--i" as string]: 0 }}>{i18n.sections.faq}</h2>
          <div className="iv-faq-list" style={{ ["--i" as string]: 1 }}>
            {faqs.map((f, i) => (
              <details key={i}>
                <summary>{f.q}<span className="chev" aria-hidden /></summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* RSVP on the inverted field */}
      {data.rsvp.enabled && (
        <section className="iv-rsvp g-inverse" id="rsvp" data-reveal>
          <h2 className="iv-rsvp-head lines" style={{ ["--i" as string]: 0 }}>
            <span className="line"><span>{i18n.rsvp.heading}</span></span>
          </h2>
          <div className="iv-rsvp-side" style={{ ["--i" as string]: 1 }}>
            <p className="iv-lead">
              {data.rsvp.deadline ? i18n.rsvp.replyBy(localizedDateParts(data.rsvp.deadline, lang)?.short || data.rsvp.deadline) : i18n.rsvp.replySoon}
            </p>
          </div>
          <div className="iv-rsvp-form" style={{ ["--i" as string]: 2 }}>
            <RsvpForm settings={data.rsvp} slug={slug} preview={mode === "preview"} lang={lang} />
          </div>
        </section>
      )}

      {/* FOOTER: the names return at full width */}
      <footer className="iv-foot g-inverse">
        <div className="iv-foot-cols">
          <div><p className="strong">{i18n.sections.whereAndWhen}</p><p>{dp?.long}</p>{data.time && <p>{fmtTime(data.time)}</p>}</div>
          {location && <div><p className="strong">{data.venueName || "Venue"}</p>{data.venueAddress && <p>{data.venueAddress}</p>}</div>}
          <div><p className="strong">{i18n.nav.rsvp}</p>{data.rsvp.enabled ? <p><a href="#rsvp">{i18n.footer.sendYourReply}</a></p> : <p>{i18n.footer.noReplyNeeded}</p>}{data.rsvp.deadline && <p>{i18n.footer.byDate(localizedDateParts(data.rsvp.deadline, lang)?.short || data.rsvp.deadline)}</p>}</div>
          {track && <div><p className="strong">Music</p><p>{track.title}</p><p>{track.style}</p></div>}
        </div>
        <p className="iv-foot-names" ref={foot} aria-label={`${data.partner1} and ${data.partner2}`}>
          <span data-fit="full">{data.partner1} <i className="amp">&amp;</i> {data.partner2}</span>
        </p>
        <p className="iv-legal">
          <span>{data.closingLine || "With love"}</span>
          <a href="https://wesaidyes.site" target="_blank" rel="noreferrer">Made with We Said Yes</a>
        </p>
      </footer>
    </>
  );
}

function Countdown({ date, time, line, lang = "en" }: { date: string; time: string; line: string; lang?: Language }) {
  const i18n = getInviteI18n(lang).countdown;
  const target = useMemo(() => parseWhen(date, time)?.getTime() || 0, [date, time]);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = now === null ? 0 : Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const sec = Math.floor((diff / 1000) % 60);
  return (
    <div className="iv-countdown" role="timer" aria-live="off">
      <h2 className="iv-days">{now === null ? " " : diff === 0 ? i18n.today : i18n.daysRemaining(d)}</h2>
      <p className="iv-ticks">{now === null || diff === 0 ? " " : `${h} ${i18n.hours}, ${m} ${i18n.minutes}, ${sec} ${i18n.seconds}`}</p>
      {line ? <p className="iv-soft">{line}</p> : <p className="iv-soft">{i18n.untilWedding}</p>}
    </div>
  );
}

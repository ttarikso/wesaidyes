"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Invitation, InviteData } from "@/lib/types";
import { THEMES, themeAssets } from "@/lib/themes";
import { TRACKS, trackUrl } from "@/lib/music";
import { api } from "@/lib/client";
import { Area, Photos, Section, Text, Toggle, Field } from "./fields";
import { SharePanel } from "./SharePanel";
import { Logo } from "@/components/Brand";

const TABS = [
  { id: "theme", label: "Theme", icon: "◐" },
  { id: "couple", label: "Couple & date", icon: "♡" },
  { id: "venue", label: "Venue", icon: "⌂" },
  { id: "story", label: "Story & photos", icon: "❋" },
  { id: "schedule", label: "Schedule", icon: "◷" },
  { id: "details", label: "Details & FAQ", icon: "✎" },
  { id: "music", label: "Music", icon: "♫" },
  { id: "rsvp", label: "RSVP form", icon: "✉" },
  { id: "share", label: "Publish & share", icon: "↗" },
] as const;
type Tab = (typeof TABS)[number]["id"];

export default function Editor({ initial }: { initial: Invitation }) {
  const router = useRouter();
  const [inv, setInv] = useState(initial);
  const [tab, setTab] = useState<Tab>("theme");
  const [save, setSave] = useState<"saved" | "saving" | "dirty" | "error">("saved");
  const [view, setView] = useState<"phone" | "desktop">("phone");
  const [skip, setSkip] = useState(false);
  const [nonce, setNonce] = useState(1);
  const [mobilePreview, setMobilePreview] = useState(false);
  const pending = useRef<Partial<Invitation>>({});
  const timer = useRef<number | null>(null);

  const flush = useCallback(async () => {
    const body = pending.current;
    pending.current = {};
    if (!Object.keys(body).length) return;
    setSave("saving");
    try {
      await api(`/api/invites/${inv.id}`, { method: "PATCH", body: JSON.stringify(body) });
      setSave(Object.keys(pending.current).length ? "dirty" : "saved");
    } catch (e) {
      if ((e as { status?: number }).status === 401) router.replace("/redeem");
      pending.current = { ...body, ...pending.current };
      setSave("error");
    }
  }, [inv.id, router]);

  function queue(patch: Partial<Invitation>) {
    pending.current = { ...pending.current, ...patch };
    setSave("dirty");
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(flush, 700);
  }

  const setData = (patch: Partial<InviteData>) => {
    setInv((p) => {
      const data = { ...p.data, ...patch };
      queue({ data });
      return { ...p, data };
    });
  };
  const setTop = (patch: Partial<Pick<Invitation, "theme" | "music">>) => {
    setInv((p) => ({ ...p, ...patch }));
    queue(patch);
  };

  // warn before leaving with unsaved changes
  useEffect(() => {
    const on = (e: BeforeUnloadEvent) => { if (save === "dirty" || save === "saving") { e.preventDefault(); } };
    window.addEventListener("beforeunload", on);
    return () => window.removeEventListener("beforeunload", on);
  }, [save]);

  const d = inv.data;

  return (
    <div className="studio flex flex-col h-dvh">
      {/* top bar */}
      <header className="flex items-center gap-3 px-4 md:px-6 h-16 border-b border-[var(--s-line)] bg-[var(--s-surface)] shrink-0">
        <Logo />
        <span className="hidden md:inline text-[var(--s-line)]">/</span>
        <Link href="/studio" className="hidden md:inline text-sm text-[var(--s-muted)] hover:text-[var(--s-ink)] no-underline truncate">
          {d.partner1} &amp; {d.partner2}
        </Link>
        <span className="ml-auto text-xs text-[var(--s-muted)] min-w-[64px] text-right" aria-live="polite">
          {save === "saving" ? "Saving…" : save === "dirty" ? "Editing…" : save === "error" ? <button className="text-[var(--s-err)] underline" onClick={flush}>Retry save</button> : "All changes saved"}
        </span>
        <Link href={`/studio/${inv.id}/guests`} className="s-btn s-btn-sm hidden sm:inline-flex">Guest list</Link>
        <button className="s-btn s-btn-sm s-btn-primary" onClick={() => setTab("share")}>{inv.published ? "Share" : "Publish"}</button>
      </header>

      <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
        {/* tabs */}
        <nav className="lg:w-56 shrink-0 border-b lg:border-b-0 lg:border-r border-[var(--s-line)] bg-[var(--s-surface)]">
          <div role="tablist" aria-label="Editor sections" className="flex lg:flex-col gap-1 p-2 lg:p-3 overflow-x-auto">
            {TABS.map((t) => (
              <button key={t.id} role="tab" aria-selected={tab === t.id} className="s-tab shrink-0 w-auto lg:w-full" onClick={() => setTab(t.id)}>
                <span aria-hidden className="w-4 text-center opacity-70">{t.icon}</span>
                {t.label}
              </button>
            ))}
            <Link href={`/studio/${inv.id}/guests`} className="s-tab shrink-0 w-auto lg:w-full no-underline sm:hidden">
              <span aria-hidden className="w-4 text-center opacity-70">☰</span>Guest list
            </Link>
          </div>
        </nav>

        {/* form */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          <div className="max-w-xl mx-auto p-4 md:p-6 space-y-4 pb-28">
            {tab === "theme" && <ThemePanel value={inv.theme} d={d} onChange={(theme) => setTop({ theme })} />}
            {tab === "couple" && <CouplePanel d={d} set={setData} />}
            {tab === "venue" && <VenuePanel d={d} set={setData} />}
            {tab === "story" && <StoryPanel d={d} set={setData} />}
            {tab === "schedule" && <SchedulePanel d={d} set={setData} />}
            {tab === "details" && <DetailsPanel d={d} set={setData} />}
            {tab === "music" && <MusicPanel value={inv.music} onChange={(music) => setTop({ music })} />}
            {tab === "rsvp" && <RsvpPanel d={d} set={setData} />}
            {tab === "share" && <SharePanel inv={inv} onSaved={(p) => setInv((x) => ({ ...x, ...p }))} beforePublish={flush} />}
          </div>
        </div>

        {/* preview */}
        <aside className="hidden lg:flex flex-col items-center gap-3 shrink-0 border-l border-[var(--s-line)] bg-[#ece4d8] p-5 xl:w-[560px] lg:w-[460px]">
          <PreviewBar view={view} setView={setView} skip={skip} setSkip={setSkip} replay={() => { setSkip(false); setNonce((n) => n + 1); }} />
          <PreviewFrame inv={inv} view={view} skip={skip} nonce={nonce} />
        </aside>
      </div>

      {/* mobile preview */}
      <button className="lg:hidden fixed bottom-5 right-5 z-20 s-btn s-btn-lg s-btn-primary shadow-lg" onClick={() => setMobilePreview(true)}>Preview</button>
      {mobilePreview && (
        <div className="lg:hidden fixed inset-0 z-30 bg-[#1a1715] flex flex-col">
          <div className="flex items-center gap-2 p-3">
            <button className="s-btn s-btn-sm" onClick={() => setMobilePreview(false)}>Close preview</button>
            <button className="s-btn s-btn-sm ml-auto" onClick={() => { setSkip(false); setNonce((n) => n + 1); }}>Replay envelope</button>
          </div>
          <div className="flex-1 min-h-0">
            <PreviewFrame inv={inv} view="full" skip={skip} nonce={nonce} />
          </div>
        </div>
      )}
    </div>
  );
}

function PreviewBar({ view, setView, skip, setSkip, replay }: { view: string; setView: (v: "phone" | "desktop") => void; skip: boolean; setSkip: (v: boolean) => void; replay: () => void }) {
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex rounded-full bg-[var(--s-surface)] border border-[var(--s-line)] p-0.5">
        {(["phone", "desktop"] as const).map((v) => (
          <button key={v} onClick={() => setView(v)} className={`px-3 h-8 rounded-full text-xs font-semibold capitalize ${view === v ? "bg-[var(--s-ink)] text-white" : "text-[var(--s-muted)]"}`}>{v}</button>
        ))}
      </div>
      <button className="s-btn s-btn-sm ml-auto" onClick={replay}>Replay envelope</button>
      <button className="s-btn s-btn-sm" onClick={() => setSkip(!skip)}>{skip ? "Show envelope" : "Skip envelope"}</button>
    </div>
  );
}

function PreviewFrame({ inv, view, skip, nonce }: { inv: Invitation; view: "phone" | "desktop" | "full"; skip: boolean; nonce: number }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(0);
  useEffect(() => {
    const on = (e: MessageEvent) => {
      if (e.origin === window.location.origin && e.data?.type === "preview-ready" && e.source === ref.current?.contentWindow) setReady((n) => n + 1);
    };
    window.addEventListener("message", on);
    return () => window.removeEventListener("message", on);
  }, []);
  useEffect(() => {
    if (!ready) return;
    ref.current?.contentWindow?.postMessage(
      { type: "invite-preview", data: inv.data, theme: inv.theme, music: inv.music, slug: inv.slug, skip, nonce },
      window.location.origin,
    );
  }, [ready, inv.data, inv.theme, inv.music, inv.slug, skip, nonce]);

  const frame = <iframe ref={ref} src="/preview" title="Invitation preview" />;
  if (view === "full") return <div className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0">{frame}</div>;
  return view === "phone" ? <div className="phone">{frame}</div> : <div className="desk">{frame}</div>;
}

/* ------------------------------------------------------------------ panels */
type P = { d: InviteData; set: (p: Partial<InviteData>) => void };

function ThemePanel({ value, d, onChange }: { value: string; d: InviteData; onChange: (v: string) => void }) {
  return (
    <Section title="Choose your theme" desc="Every theme includes its own envelope, wax seal, florals, colours and fonts. You can switch anytime; your text and photos stay.">
      <div className="grid grid-cols-2 gap-3">
        {THEMES.map((t) => {
          const a = themeAssets(t);
          const on = t.id === value;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              aria-pressed={on}
              className={`group text-left rounded-2xl overflow-hidden border transition ${on ? "border-[var(--s-ink)] ring-2 ring-[var(--s-ink)]" : "border-[var(--s-line)] hover:border-[#cbbcab]"}`}
            >
              <span className="relative block aspect-[4/3]" style={{ background: `url(${a.paper}) center/cover ${t.bg}` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.floral} alt="" className="absolute -left-[8%] -bottom-[14%] w-[72%] drop-shadow" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.seal} alt="" className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[34%] drop-shadow-md" />
                <span className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 text-[1.05rem]" style={{ fontFamily: `var(--f-${t.script})`, color: t.sealInk }}>
                  {d.initials || "A&J"}
                </span>
              </span>
              <span className="block px-3 py-2.5 bg-[var(--s-surface)]">
                <span className="block text-sm font-semibold">{t.name}</span>
                <span className="block text-xs text-[var(--s-muted)]">{t.mood}</span>
              </span>
            </button>
          );
        })}
      </div>
    </Section>
  );
}

function CouplePanel({ d, set }: P) {
  return (
    <>
      <Section title="The couple">
        <div className="grid grid-cols-2 gap-3">
          <Text label="First partner" value={d.partner1} max={60} onChange={(partner1) => set({ partner1 })} />
          <Text label="Second partner" value={d.partner2} max={60} onChange={(partner2) => set({ partner2 })} />
        </div>
        <Text label="Initials on the wax seal" hint="Short works best, e.g. A&J or AJ." value={d.initials} max={8} onChange={(initials) => set({ initials })} />
        <Photos label="Couple photo (optional)" hint="Shown in an arch frame at the top of your invitation." value={d.heroPhoto ? [d.heroPhoto] : []} max={1} onChange={(v) => set({ heroPhoto: v[0] || "" })} />
      </Section>
      <Section title="Date & time">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Wedding date"><input className="s-input" type="date" value={d.date} onChange={(e) => set({ date: e.target.value })} /></Field>
          <Field label="Start time"><input className="s-input" type="time" value={d.time} onChange={(e) => set({ time: e.target.value })} /></Field>
        </div>
      </Section>
      <Section title="Invitation wording">
        <Text label="Envelope button text" value={d.openText} max={60} onChange={(openText) => set({ openText })} placeholder="Tap to open the invitation" />
        <Text label="Opening line" value={d.hostLine} max={120} onChange={(hostLine) => set({ hostLine })} placeholder="Together with their families" />
        <Area label="Invitation line" rows={3} value={d.inviteLine} max={200} onChange={(inviteLine) => set({ inviteLine })} />
      </Section>
    </>
  );
}

function VenuePanel({ d, set }: P) {
  return (
    <Section title="Venue" desc="Guests see a map, an Open in Maps button and Add to calendar.">
      <Text label="Venue name" value={d.venueName} max={120} onChange={(venueName) => set({ venueName })} />
      <Text label="Address" value={d.venueAddress} max={200} onChange={(venueAddress) => set({ venueAddress })} hint="Type the full address so the map finds it." />
      <Text label="Map link (optional)" value={d.mapUrl} max={600} onChange={(mapUrl) => set({ mapUrl })} placeholder="https://maps.app.goo.gl/…" hint="Paste a Google Maps share link if you want the button to open an exact pin." />
    </Section>
  );
}

function StoryPanel({ d, set }: P) {
  const sec = d.sections;
  return (
    <>
      <Section title="Our story">
        <Toggle label="Show this section" checked={sec.story} onChange={(v) => set({ sections: { ...sec, story: v } })} />
        {sec.story && (
          <>
            <Text label="Title" value={d.storyTitle} max={60} onChange={(storyTitle) => set({ storyTitle })} />
            <Area label="Your story" rows={6} value={d.storyText} max={1500} onChange={(storyText) => set({ storyText })} />
            <Photos label="Story photos (up to 3)" value={d.storyPhotos} max={3} onChange={(storyPhotos) => set({ storyPhotos })} hint="Shown as polaroids above your story." />
          </>
        )}
      </Section>
      <Section title="Photo gallery">
        <Toggle label="Show this section" checked={sec.gallery} onChange={(v) => set({ sections: { ...sec, gallery: v } })} />
        {sec.gallery && <Photos label="Gallery photos (up to 9)" value={d.gallery} max={9} onChange={(gallery) => set({ gallery })} />}
      </Section>
    </>
  );
}

function SchedulePanel({ d, set }: P) {
  const sec = d.sections;
  const rows = d.schedule;
  const upd = (i: number, k: "time" | "title" | "note", v: string) => set({ schedule: rows.map((r, j) => (j === i ? { ...r, [k]: v } : r)) });
  return (
    <Section title="Order of the day">
      <Toggle label="Show this section" checked={sec.schedule} onChange={(v) => set({ sections: { ...sec, schedule: v } })} />
      {sec.schedule && (
        <div className="space-y-3">
          {rows.map((r, i) => (
            <div key={i} className="grid grid-cols-[96px_1fr_auto] gap-2 items-start">
              <input className="s-input" type="time" value={r.time} onChange={(e) => upd(i, "time", e.target.value)} aria-label="Time" />
              <div className="space-y-1.5">
                <input className="s-input" value={r.title} maxLength={60} onChange={(e) => upd(i, "title", e.target.value)} placeholder="Ceremony" aria-label="Title" />
                <input className="s-input !text-sm" value={r.note} maxLength={100} onChange={(e) => upd(i, "note", e.target.value)} placeholder="Location or note (optional)" aria-label="Note" />
              </div>
              <button className="s-btn s-btn-sm !px-2.5" onClick={() => set({ schedule: rows.filter((_, j) => j !== i) })} aria-label="Remove">✕</button>
            </div>
          ))}
          {rows.length < 10 && <button className="s-btn s-btn-sm" onClick={() => set({ schedule: [...rows, { time: "", title: "", note: "" }] })}>+ Add moment</button>}
        </div>
      )}
    </Section>
  );
}

function DetailsPanel({ d, set }: P) {
  const sec = d.sections;
  const faqs = d.faqs;
  return (
    <>
      <Section title="Countdown">
        <Toggle label="Show the live countdown" checked={sec.countdown} onChange={(v) => set({ sections: { ...sec, countdown: v } })} />
        <Text label="Line above the countdown" value={d.closingLine} max={120} onChange={(closingLine) => set({ closingLine })} />
      </Section>
      <Section title="Wedding details">
        <Toggle label="Show this section" hint="Venue map, dress code and accommodation." checked={sec.details} onChange={(v) => set({ sections: { ...sec, details: v } })} />
        {sec.details && (
          <>
            <Area label="Dress code" rows={3} value={d.dressCode} max={400} onChange={(dressCode) => set({ dressCode })} />
            <div>
              <span className="s-label">Colour palette for guests (optional)</span>
              <div className="flex flex-wrap items-center gap-2">
                {d.palette.map((c, i) => (
                  <span key={i} className="relative">
                    <input type="color" value={c} onChange={(e) => set({ palette: d.palette.map((x, j) => (j === i ? e.target.value : x)) })} className="size-10 rounded-full border border-[var(--s-line)] cursor-pointer p-0.5 bg-white" aria-label={`Colour ${i + 1}`} />
                    <button onClick={() => set({ palette: d.palette.filter((_, j) => j !== i) })} className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-white border border-[var(--s-line)] text-[10px]" aria-label="Remove colour">✕</button>
                  </span>
                ))}
                {d.palette.length < 6 && <button className="s-btn s-btn-sm" onClick={() => set({ palette: [...d.palette, "#c9b8a3"] })}>+ Colour</button>}
              </div>
            </div>
            <Area label="Accommodation & travel" rows={3} value={d.accommodation} max={800} onChange={(accommodation) => set({ accommodation })} />
          </>
        )}
      </Section>
      <Section title="FAQs">
        <Toggle label="Show this section" checked={sec.faq} onChange={(v) => set({ sections: { ...sec, faq: v } })} />
        {sec.faq && (
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-xl border border-[var(--s-line)] p-3 space-y-2 bg-white/60">
                <div className="flex gap-2">
                  <input className="s-input" value={f.q} maxLength={160} placeholder="Question" onChange={(e) => set({ faqs: faqs.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)) })} />
                  <button className="s-btn s-btn-sm !px-2.5 shrink-0" onClick={() => set({ faqs: faqs.filter((_, j) => j !== i) })} aria-label="Remove">✕</button>
                </div>
                <textarea className="s-input" rows={2} value={f.a} maxLength={600} placeholder="Answer" onChange={(e) => set({ faqs: faqs.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)) })} />
              </div>
            ))}
            {faqs.length < 12 && <button className="s-btn s-btn-sm" onClick={() => set({ faqs: [...faqs, { q: "", a: "" }] })}>+ Add question</button>}
          </div>
        )}
      </Section>
    </>
  );
}

function MusicPanel({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [playing, setPlaying] = useState<string | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  useEffect(() => () => audio.current?.pause(), []);
  function play(id: string) {
    if (!audio.current) audio.current = new Audio();
    const a = audio.current;
    if (playing === id) { a.pause(); setPlaying(null); return; }
    a.src = trackUrl(id);
    a.currentTime = 0;
    a.play().then(() => setPlaying(id)).catch(() => setPlaying(null));
    a.onended = () => setPlaying(null);
  }
  return (
    <Section title="Background music" desc="Plays softly once a guest opens the envelope. Guests can pause it anytime. All 20 tracks are original and royalty-free.">
      <div className="space-y-1.5">
        <label className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 cursor-pointer ${value === "none" ? "border-[var(--s-ink)] bg-white" : "border-[var(--s-line)]"}`}>
          <input type="radio" name="music" checked={value === "none"} onChange={() => onChange("none")} className="accent-[var(--s-accent)]" />
          <span className="text-sm font-medium">No music</span>
        </label>
        {TRACKS.map((t) => (
          <div key={t.id} className={`flex items-center gap-3 rounded-xl border px-3 py-2 ${value === t.id ? "border-[var(--s-ink)] bg-white" : "border-[var(--s-line)]"}`}>
            <label className="flex items-center gap-3 flex-1 cursor-pointer min-w-0">
              <input type="radio" name="music" checked={value === t.id} onChange={() => onChange(t.id)} className="accent-[var(--s-accent)]" />
              <span className="min-w-0">
                <span className="block text-sm font-medium truncate">{t.title}</span>
                <span className="block text-xs text-[var(--s-muted)]">{t.style}</span>
              </span>
            </label>
            <button className="s-btn s-btn-sm !w-9 !px-0" onClick={() => play(t.id)} aria-label={playing === t.id ? `Stop ${t.title}` : `Listen to ${t.title}`}>
              {playing === t.id ? "■" : "▶"}
            </button>
          </div>
        ))}
      </div>
    </Section>
  );
}

function RsvpPanel({ d, set }: P) {
  const r = d.rsvp;
  const u = (p: Partial<typeof r>) => set({ rsvp: { ...r, ...p } });
  return (
    <Section title="RSVP form" desc="Replies appear instantly in your Guest list, where you can also download them as a spreadsheet.">
      <Toggle label="Collect RSVPs" checked={r.enabled} onChange={(enabled) => u({ enabled })} />
      {r.enabled && (
        <>
          <Field label="Reply by (optional)" hint="After this date the form closes automatically.">
            <input className="s-input" type="date" value={r.deadline} onChange={(e) => u({ deadline: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Text label="'Yes' button" value={r.yesLabel} max={40} onChange={(yesLabel) => u({ yesLabel })} />
            <Text label="'No' button" value={r.noLabel} max={40} onChange={(noLabel) => u({ noLabel })} />
          </div>
          <div className="border-t border-[var(--s-line)] pt-4 space-y-3">
            <Toggle label="Ask about additional guests" checked={r.askGuests} onChange={(askGuests) => u({ askGuests })} />
            {r.askGuests && (
              <Field label="Most additional guests per reply">
                <select className="s-input" value={r.maxGuests} onChange={(e) => u({ maxGuests: Number(e.target.value) })}>
                  {Array.from({ length: 11 }, (_, i) => <option key={i} value={i}>{i === 0 ? "None (just the invitee)" : `+${i}`}</option>)}
                </select>
              </Field>
            )}
            <Toggle label="Ask for meal choice" checked={r.askMeal} onChange={(askMeal) => u({ askMeal })} />
            {r.askMeal && (
              <Text label="Meal options (comma separated)" value={r.mealOptions.join(", ")} onChange={(v) => u({ mealOptions: v.split(",").map((x) => x.trimStart()).slice(0, 6) })} />
            )}
            <Toggle label="Ask about allergies / dietary needs" checked={r.askDiet} onChange={(askDiet) => u({ askDiet })} />
            <Toggle label="Ask for a song request" checked={r.askSong} onChange={(askSong) => u({ askSong })} />
            <Toggle label="Allow a note for the couple" checked={r.askMessage} onChange={(askMessage) => u({ askMessage })} />
            <Text label="Your own question (optional)" value={r.customQuestion} max={160} placeholder="e.g. Will you join the welcome dinner on Friday?" onChange={(customQuestion) => u({ customQuestion })} />
          </div>
        </>
      )}
    </Section>
  );
}

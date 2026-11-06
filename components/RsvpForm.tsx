"use client";
import { useEffect, useState } from "react";
import type { RsvpSettings } from "@/lib/types";
import { getInviteI18n } from "@/lib/i18n/invitation";
import type { Language } from "@/lib/i18n/types";

const DEFAULT_YES_LABELS = new Set([
  "joyfully accepts",
  "yes, joyfully accept",
  "evet, mutlulukla katılıyorum",
  "sí, asistiré encantado/a",
  "si, asistiré encantado/a",
  "oui, avec grand plaisir",
  "ja, ich nehme gerne teil",
]);

const DEFAULT_NO_LABELS = new Set([
  "regretfully declines",
  "regretfully decline",
  "no, regretfully decline",
  "maalesef katılamıyorum",
  "no podré asistir",
  "non, je ne pourrai pas venir",
  "nein, leider kann ich nicht teilnehmen",
]);

export function RsvpForm({ settings: r, slug, preview, lang = "en" }: { settings: RsvpSettings; slug: string; preview: boolean; lang?: Language }) {
  const t = getInviteI18n(lang).rsvp;
  const isDefaultYes = !r.yesLabel || DEFAULT_YES_LABELS.has(r.yesLabel.trim().toLowerCase());
  const isDefaultNo = !r.noLabel || DEFAULT_NO_LABELS.has(r.noLabel.trim().toLowerCase());
  const yesText = isDefaultYes ? t.yes : r.yesLabel;
  const noText = isDefaultNo ? t.no : r.noLabel;

  const [attending, setAttending] = useState<boolean | null>(null);
  const [f, setF] = useState({ name: "", email: "", guests: 0, guest_names: "", meal: "", diet: "", song: "", message: "", custom: "", website: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState<{ name: string; attending: boolean } | null>(null);
  const [already, setAlready] = useState(false);
  const closed = !!r.deadline && new Date(r.deadline + "T23:59:59") < new Date();

  useEffect(() => {
    try { setAlready(!preview && !!localStorage.getItem(`rsvp:${slug}`)); } catch { /* storage unavailable */ }
  }, [slug, preview]);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: k === "guests" ? Number(e.target.value) : e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (f.name.trim().length < 2) return setErr(t.fullNamePlaceholder);
    if (attending === null) return setErr(t.attending);
    if (preview) { setDone({ name: f.name, attending }); return; }
    setBusy(true);
    try {
      const res = await fetch(`/api/rsvp/${encodeURIComponent(slug)}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...f, attending }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      try { localStorage.setItem(`rsvp:${slug}`, "1"); } catch { /* ignore */ }
      setDone({ name: f.name, attending });
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="rsvp-done" role="status">
        <p className="rsvp-done-script">{t.successTitle} {done.name.split(" ")[0]}!</p>
        <p>{done.attending ? t.successDesc : t.no}</p>
        {preview && <p className="rsvp-note">Preview mode: this reply was not saved.</p>}
        <button type="button" className="btn btn-line btn-sm" onClick={() => { setDone(null); setAttending(null); setF((p) => ({ ...p, name: "", guest_names: "", message: "" })); }}>
          {t.sendAnother}
        </button>
      </div>
    );
  }

  if (closed) return <p className="prose center">{t.replySoon}</p>;

  return (
    <form className="rsvp" onSubmit={submit} noValidate>
      {already && <p className="rsvp-note">{t.sendAnother}</p>}
      <label className="fld">
        <span>{t.fullName}</span>
        <input value={f.name} onChange={set("name")} autoComplete="name" placeholder={t.fullNamePlaceholder} required />
      </label>

      <div className="choice" role="radiogroup" aria-label={t.attending}>
        <button type="button" role="radio" aria-checked={attending === true} className={attending === true ? "on" : ""} onClick={() => setAttending(true)}>
          <span className="tick" aria-hidden />
          {yesText}
        </button>
        <button type="button" role="radio" aria-checked={attending === false} className={attending === false ? "on" : ""} onClick={() => setAttending(false)}>
          <span className="tick" aria-hidden />
          {noText}
        </button>
      </div>

      {attending && r.askGuests && r.maxGuests > 0 && (
        <label className="fld">
          <span>{t.additionalGuests}</span>
          <select value={f.guests} onChange={set("guests")}>
            {Array.from({ length: r.maxGuests + 1 }, (_, i) => (
              <option key={i} value={i}>{i === 0 ? "0" : `+${i}`}</option>
            ))}
          </select>
        </label>
      )}
      {attending && f.guests > 0 && (
        <label className="fld">
          <span>{t.guestNames}</span>
          <input value={f.guest_names} onChange={set("guest_names")} placeholder={t.guestNamesPlaceholder} />
        </label>
      )}
      {attending && r.askMeal && r.mealOptions.length > 0 && (
        <label className="fld">
          <span>{t.meal}</span>
          <select value={f.meal} onChange={set("meal")}>
            <option value="">{t.selectMeal}</option>
            {r.mealOptions.map((m) => <option key={m}>{m}</option>)}
          </select>
        </label>
      )}
      {attending && r.askDiet && (
        <label className="fld">
          <span>{t.dietary}</span>
          <input value={f.diet} onChange={set("diet")} placeholder={t.dietaryPlaceholder} />
        </label>
      )}
      {attending && r.askSong && (
        <label className="fld">
          <span>{t.song}</span>
          <input value={f.song} onChange={set("song")} placeholder={t.songPlaceholder} />
        </label>
      )}
      {r.customQuestion && (
        <label className="fld">
          <span>{r.customQuestion}</span>
          <input value={f.custom} onChange={set("custom")} />
        </label>
      )}
      {r.askMessage && (
        <label className="fld">
          <span>{t.message}</span>
          <textarea value={f.message} onChange={set("message")} rows={3} placeholder={t.messagePlaceholder} />
        </label>
      )}
      <label className="fld">
        <span>{t.email}</span>
        <input type="email" value={f.email} onChange={set("email")} autoComplete="email" placeholder={t.emailPlaceholder} />
      </label>
      <input className="hp" tabIndex={-1} autoComplete="off" value={f.website} onChange={set("website")} aria-hidden />

      {err && <p className="rsvp-err" role="alert">{err}</p>}
      <button className="btn btn-solid btn-wide" disabled={busy} type="submit">
        {busy ? t.submitting : t.submit}
      </button>
    </form>
  );
}

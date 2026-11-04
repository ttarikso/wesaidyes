"use client";
import { useEffect, useState } from "react";
import type { RsvpSettings } from "@/lib/types";

export function RsvpForm({ settings: r, slug, preview }: { settings: RsvpSettings; slug: string; preview: boolean }) {
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
    if (f.name.trim().length < 2) return setErr("Please enter your full name.");
    if (attending === null) return setErr("Please let us know if you can attend.");
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
        <p className="rsvp-done-script">Thank you, {done.name.split(" ")[0]}!</p>
        <p>{done.attending ? "Your reply has been received. We can't wait to celebrate with you." : "We're sorry you can't make it. You'll be in our hearts on the day."}</p>
        {preview && <p className="rsvp-note">Preview mode: this reply was not saved.</p>}
        <button type="button" className="btn btn-line btn-sm" onClick={() => { setDone(null); setAttending(null); setF((p) => ({ ...p, name: "", guest_names: "", message: "" })); }}>
          Reply for someone else
        </button>
      </div>
    );
  }

  if (closed) return <p className="prose center">The RSVP deadline has passed. Please contact the couple directly.</p>;

  return (
    <form className="rsvp" onSubmit={submit} noValidate>
      {already && <p className="rsvp-note">You have already replied from this device. You can send another reply for someone else.</p>}
      <label className="fld">
        <span>Full name</span>
        <input value={f.name} onChange={set("name")} autoComplete="name" placeholder="Your full name" required />
      </label>

      <div className="choice" role="radiogroup" aria-label="Will you attend?">
        <button type="button" role="radio" aria-checked={attending === true} className={attending === true ? "on" : ""} onClick={() => setAttending(true)}>
          <span className="tick" aria-hidden />
          {r.yesLabel}
        </button>
        <button type="button" role="radio" aria-checked={attending === false} className={attending === false ? "on" : ""} onClick={() => setAttending(false)}>
          <span className="tick" aria-hidden />
          {r.noLabel}
        </button>
      </div>

      {attending && r.askGuests && r.maxGuests > 0 && (
        <label className="fld">
          <span>Additional guests</span>
          <select value={f.guests} onChange={set("guests")}>
            {Array.from({ length: r.maxGuests + 1 }, (_, i) => (
              <option key={i} value={i}>{i === 0 ? "Just me" : `+${i} guest${i > 1 ? "s" : ""}`}</option>
            ))}
          </select>
        </label>
      )}
      {attending && f.guests > 0 && (
        <label className="fld">
          <span>Guest name{f.guests > 1 ? "s" : ""}</span>
          <input value={f.guest_names} onChange={set("guest_names")} placeholder={f.guests > 1 ? "Names, separated by commas" : "Your guest's full name"} />
        </label>
      )}
      {attending && r.askMeal && r.mealOptions.length > 0 && (
        <label className="fld">
          <span>Meal preference</span>
          <select value={f.meal} onChange={set("meal")}>
            <option value="">Choose one</option>
            {r.mealOptions.map((m) => <option key={m}>{m}</option>)}
          </select>
        </label>
      )}
      {attending && r.askDiet && (
        <label className="fld">
          <span>Allergies or dietary needs</span>
          <input value={f.diet} onChange={set("diet")} placeholder="Optional" />
        </label>
      )}
      {attending && r.askSong && (
        <label className="fld">
          <span>A song that will get you dancing</span>
          <input value={f.song} onChange={set("song")} placeholder="Optional" />
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
          <span>A note for the couple</span>
          <textarea value={f.message} onChange={set("message")} rows={3} placeholder="Optional" />
        </label>
      )}
      <label className="fld">
        <span>Email</span>
        <input type="email" value={f.email} onChange={set("email")} autoComplete="email" placeholder="Optional, for updates" />
      </label>
      <input className="hp" tabIndex={-1} autoComplete="off" value={f.website} onChange={set("website")} aria-hidden />

      {err && <p className="rsvp-err" role="alert">{err}</p>}
      <button className="btn btn-solid btn-wide" disabled={busy} type="submit">
        {busy ? "Sending…" : "Send reply"}
      </button>
    </form>
  );
}

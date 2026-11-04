"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Invitation } from "@/lib/types";
import { api, clearKey, getKey } from "@/lib/client";
import { dateParts } from "@/lib/format";
import { getTheme, themeAssets } from "@/lib/themes";
import { getTrack } from "@/lib/music";
import { Logo } from "@/components/Brand";

type Row = Invitation & { rsvpCount: number };

export default function Studio() {
  const r = useRouter();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [limit, setLimit] = useState(1);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState("");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin((process.env.NEXT_PUBLIC_SITE_URL || window.location.origin).replace(/\/$/, ""));
    if (!getKey()) { r.replace("/redeem"); return; }
    api<{ invites: Row[]; limit: number }>("/api/invites")
      .then(async (d) => {
        setLimit(d.limit);
        if (d.invites.length === 0) {
          const c = await api<{ invite: Invitation }>("/api/invites", { method: "POST" });
          r.replace(`/studio/${c.invite.id}`);
          return;
        }
        setRows(d.invites);
      })
      .catch((e) => (e.status === 401 ? r.replace("/redeem") : setErr(e.message)));
  }, [r]);

  async function create() {
    setBusy(true);
    try {
      const c = await api<{ invite: Invitation }>("/api/invites", { method: "POST" });
      r.push(`/studio/${c.invite.id}`);
    } catch (e) { setErr((e as Error).message); setBusy(false); }
  }
  async function copy(url: string) {
    try { await navigator.clipboard.writeText(url); setCopied(url); setTimeout(() => setCopied(""), 1600); } catch { /* the link stays selectable */ }
  }

  return (
    <div className="studio flex flex-col">
      <header className="s-top">
        <Logo height={26} />
        <button className="s-btn-text ml-auto text-[14px]" onClick={() => { clearKey(); r.push("/redeem"); }}>Sign out</button>
      </header>
      <main className="s-sheet flex-1 sm:mr-2 sm:mb-2 sm:ml-2 p-4 sm:p-6">
        {err && <p className="s-err mb-4">{err}</p>}
        {!rows && !err && (
          <div aria-label="Loading">
            <div className="h-[30px] w-48 rounded bg-[var(--raised)]" />
            <div className="h-5 w-80 rounded bg-[var(--raised)] mt-2" />
          </div>
        )}
        {rows?.map((i) => {
          const t = getTheme(i.theme);
          const a = themeAssets(t);
          const dp = dateParts(i.data.date);
          const url = `${origin}/i/${i.slug}`;
          const track = getTrack(i.music);
          return (
            <article key={i.id} className="space-y-6">
              <div className="flex flex-wrap items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="s-h1">{i.data.partner1} &amp; {i.data.partner2}</h1>
                    <span className={`s-pill ${i.published ? "s-pill-live" : "s-pill-draft"}`}>{i.published ? "Live" : "Draft"}</span>
                  </div>
                  <p className="s-sub mt-1">
                    {i.published
                      ? `Your invitation is live. ${i.rsvpCount === 0 ? "No replies yet." : `${i.rsvpCount} ${i.rsvpCount === 1 ? "reply" : "replies"} so far.`}`
                      : "Not sent yet. Publish it from the editor when it looks right."}
                  </p>
                </div>
                <Link href={`/studio/${i.id}`} className="s-btn s-btn-primary">Edit invitation</Link>
                <Link href={`/studio/${i.id}/guests`} className="s-btn">Guest list</Link>
              </div>

              <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-4">
                {/* the envelope guests will see, in this design */}
                <div className="s-well relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[340px] grid place-items-center" style={{ background: `url(${a.paper}) center/cover ${t.paperTone || "#fff"}`, backgroundBlendMode: "multiply" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.floral} alt="" className="absolute -left-[6%] -bottom-[12%] w-[62%]" />
                  <div className="relative text-center" style={{ color: t.onBg }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.seal} alt="" className="w-24 mx-auto" />
                    <p className="mt-4 text-[32px] leading-none" style={{ fontFamily: t.type.display, fontWeight: t.type.displayWeight, letterSpacing: t.type.displayTrack, textTransform: t.type.upper ? "uppercase" : "none" }}>
                      {i.data.partner1} &amp; {i.data.partner2}
                    </p>
                    {dp && <p className="mt-2 text-[14px]">{dp.long}</p>}
                  </div>
                </div>

                <dl className="s-panel divide-y divide-[var(--rule)] text-[14px]">
                  {([
                    ["Link", i.published ? (
                      <span className="flex items-center gap-3 min-w-0">
                        <a href={url} target="_blank" rel="noreferrer" className="truncate underline underline-offset-2 decoration-[var(--control)]">{url.replace(/^https?:\/\//, "")}</a>
                        <button className="s-btn s-btn-sm shrink-0" onClick={() => copy(url)}>{copied === url ? "Copied" : "Copy"}</button>
                      </span>
                    ) : <span className="text-[var(--muted)]">Appears when you publish</span>],
                    ["Replies", <span key="r" className="num">{i.rsvpCount}</span>],
                    ["Wedding date", dp ? dp.long : <span className="text-[var(--muted)]">–</span>],
                    ["Venue", i.data.venueName || <span className="text-[var(--muted)]">–</span>],
                    ["Design", t.name],
                    ["Music", track ? `${track.title}, ${track.style.toLowerCase()}` : "No music"],
                  ] as [string, React.ReactNode][]).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-4 px-4 min-h-[52px]">
                      <dt className="w-28 shrink-0 text-[var(--muted)]">{k}</dt>
                      <dd className="min-w-0 flex-1 m-0">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          );
        })}
        {rows && rows.length < limit && (
          <button className="s-btn mt-6" onClick={create} disabled={busy}>Create another invitation</button>
        )}
      </main>
    </div>
  );
}

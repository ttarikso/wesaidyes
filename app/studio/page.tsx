"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Invitation } from "@/lib/types";
import { api, clearKey, getKey } from "@/lib/client";
import { dateParts } from "@/lib/format";
import { getTheme, themeAssets } from "@/lib/themes";
import { Logo } from "@/components/Brand";

type Row = Invitation & { rsvpCount: number };

export default function Studio() {
  const r = useRouter();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [limit, setLimit] = useState(1);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!getKey()) { r.replace("/redeem"); return; }
    api<{ invites: Row[]; limit: number }>("/api/invites")
      .then(async (d) => {
        setLimit(d.limit);
        if (d.invites.length === 0) {
          // first visit: create the invitation straight away and open the editor
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

  return (
    <div className="studio">
      <header className="flex items-center gap-3 px-5 h-16 max-w-5xl mx-auto">
        <Logo />
        <button className="s-btn s-btn-sm ml-auto" onClick={() => { clearKey(); r.push("/redeem"); }}>Sign out</button>
      </header>
      <main className="max-w-5xl mx-auto px-5 pb-20">
        <h1 className="font-serif text-4xl mt-6">Your invitation</h1>
        <p className="text-[var(--s-muted)] mt-1">Edit your design, share your link and follow your RSVPs.</p>
        {err && <p className="s-err mt-6">{err}</p>}
        {!rows && !err && <p className="mt-10 text-[var(--s-muted)]">Loading…</p>}
        <div className="grid sm:grid-cols-2 gap-5 mt-8">
          {rows?.map((i) => {
            const t = getTheme(i.theme);
            const a = themeAssets(t);
            const dp = dateParts(i.data.date);
            return (
              <div key={i.id} className="s-card overflow-hidden">
                <div className="relative h-44" style={{ background: `url(${a.paper}) center/cover ${t.bg}` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.floral} alt="" className="absolute -right-6 -bottom-8 w-3/5 drop-shadow" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center" style={{ color: t.onBg }}>
                    <span className="text-4xl" style={{ fontFamily: `var(--f-${t.script})` }}>{i.data.partner1} &amp; {i.data.partner2}</span>
                    {dp && <span className="text-xs tracking-[.25em] uppercase mt-1">{dp.short}</span>}
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${i.published ? "bg-[#e7f0e4] text-[var(--s-ok)]" : "bg-[var(--s-soft)] text-[var(--s-muted)]"}`}>
                      <span className={`size-1.5 rounded-full ${i.published ? "bg-[var(--s-ok)]" : "bg-[var(--s-muted)]"}`} />
                      {i.published ? "Live" : "Draft"}
                    </span>
                    <span className="text-[var(--s-muted)]">{t.name}</span>
                    <span className="ml-auto text-[var(--s-muted)]">{i.rsvpCount} RSVP{i.rsvpCount === 1 ? "" : "s"}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/studio/${i.id}`} className="s-btn s-btn-primary">Edit invitation</Link>
                    <Link href={`/studio/${i.id}/guests`} className="s-btn">Guest list</Link>
                    {i.published && <a href={`/i/${i.slug}`} target="_blank" rel="noreferrer" className="s-btn">View live</a>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {rows && rows.length < limit && (
          <button className="s-btn mt-6" onClick={create} disabled={busy}>+ Create another invitation</button>
        )}
      </main>
    </div>
  );
}

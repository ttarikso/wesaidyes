"use client";
import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Invitation, Rsvp } from "@/lib/types";
import { api, getKey } from "@/lib/client";
import { Logo } from "@/components/Brand";

export default function Guests({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const r = useRouter();
  const [inv, setInv] = useState<Invitation | null>(null);
  const [rows, setRows] = useState<Rsvp[] | null>(null);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "yes" | "no">("all");
  const [err, setErr] = useState("");

  function load() {
    api<{ rsvps: Rsvp[] }>(`/api/invites/${id}/rsvps`).then((d) => setRows(d.rsvps)).catch((e) => setErr(e.message));
  }
  useEffect(() => {
    if (!getKey()) { r.replace("/redeem"); return; }
    api<{ invite: Invitation }>(`/api/invites/${id}`).then((d) => setInv(d.invite)).catch((e) => (e.status === 401 ? r.replace("/redeem") : setErr(e.message)));
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const stats = useMemo(() => {
    const list = rows || [];
    const yes = list.filter((x) => x.attending);
    return { replies: list.length, yes: yes.length, no: list.length - yes.length, people: yes.reduce((n, x) => n + 1 + x.guests, 0) };
  }, [rows]);

  const shown = (rows || []).filter((x) => (filter === "all" || (filter === "yes") === x.attending) && (!q || JSON.stringify(x).toLowerCase().includes(q.toLowerCase())));

  function csv() {
    const cols: (keyof Rsvp)[] = ["created_at", "name", "attending", "guests", "guest_names", "email", "meal", "diet", "song", "custom", "message"];
    const head = ["Replied", "Name", "Attending", "Extra guests", "Guest names", "Email", "Meal", "Dietary needs", "Song request", inv?.data.rsvp.customQuestion || "Custom answer", "Note"];
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = [head.map(esc).join(","), ...(rows || []).map((x) => cols.map((c) => esc(c === "attending" ? (x.attending ? "Yes" : "No") : c === "created_at" ? new Date(x.created_at).toLocaleString() : x[c])).join(","))];
    const url = URL.createObjectURL(new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = `rsvps-${inv?.slug || "wedding"}.csv`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  async function remove(x: Rsvp) {
    if (!window.confirm(`Delete the reply from ${x.name}?`)) return;
    await api(`/api/invites/${id}/rsvps?rsvp=${x.id}`, { method: "DELETE" }).catch((e) => setErr(e.message));
    load();
  }

  return (
    <div className="studio">
      <header className="flex items-center gap-3 px-5 h-16 max-w-6xl mx-auto">
        <Logo />
        <Link href={`/studio/${id}`} className="s-btn s-btn-sm ml-auto">← Back to editor</Link>
      </header>
      <main className="max-w-6xl mx-auto px-5 pb-20">
        <h1 className="font-serif text-4xl mt-4">Guest list</h1>
        <p className="text-[var(--s-muted)] mt-1">{inv ? `${inv.data.partner1} & ${inv.data.partner2}` : ""} · updates automatically</p>
        {err && <p className="s-err mt-4">{err}</p>}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {[["Attending (people)", stats.people], ["Accepted", stats.yes], ["Declined", stats.no], ["Total replies", stats.replies]].map(([l, v]) => (
            <div key={l as string} className="s-card p-4">
              <p className="text-xs font-semibold text-[var(--s-muted)] uppercase tracking-wider">{l}</p>
              <p className="text-3xl font-semibold mt-1 tabular-nums">{rows ? v : "–"}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-6">
          <input className="s-input !w-64" placeholder="Search name, meal, note…" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="flex rounded-full bg-[var(--s-surface)] border border-[var(--s-line)] p-0.5">
            {(["all", "yes", "no"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 h-8 rounded-full text-xs font-semibold ${filter === f ? "bg-[var(--s-ink)] text-white" : "text-[var(--s-muted)]"}`}>
                {f === "all" ? "All" : f === "yes" ? "Attending" : "Declined"}
              </button>
            ))}
          </div>
          <button className="s-btn s-btn-sm ml-auto" onClick={csv} disabled={!rows?.length}>Download spreadsheet (CSV)</button>
        </div>

        <div className="s-card mt-4 overflow-x-auto">
          {rows && shown.length === 0 ? (
            <p className="p-8 text-center text-[var(--s-muted)]">{rows.length === 0 ? "No replies yet. Share your link and they'll show up here." : "No replies match your search."}</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-[var(--s-muted)]">
                <tr className="border-b border-[var(--s-line)]">
                  <th className="p-3 font-semibold">Name</th><th className="p-3 font-semibold">Reply</th><th className="p-3 font-semibold">Guests</th>
                  <th className="p-3 font-semibold">Meal / diet</th><th className="p-3 font-semibold">Song</th><th className="p-3 font-semibold">Note</th><th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {shown.map((x) => (
                  <tr key={x.id} className="border-b border-[var(--s-line)] last:border-0 align-top">
                    <td className="p-3"><span className="font-semibold">{x.name}</span>{x.email && <span className="block text-xs text-[var(--s-muted)]">{x.email}</span>}<span className="block text-xs text-[var(--s-muted)]">{new Date(x.created_at).toLocaleDateString()}</span></td>
                    <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${x.attending ? "bg-[#e7f0e4] text-[var(--s-ok)]" : "bg-[#f8e7e3] text-[var(--s-err)]"}`}>{x.attending ? "Attending" : "Declined"}</span></td>
                    <td className="p-3">{x.guests ? `+${x.guests}` : "–"}{x.guest_names && <span className="block text-xs text-[var(--s-muted)]">{x.guest_names}</span>}</td>
                    <td className="p-3">{x.meal || "–"}{x.diet && <span className="block text-xs text-[var(--s-muted)]">{x.diet}</span>}</td>
                    <td className="p-3">{x.song || "–"}</td>
                    <td className="p-3 max-w-[280px]">{x.message || x.custom ? <>{x.custom && <span className="block text-xs text-[var(--s-muted)]">{x.custom}</span>}{x.message}</> : "–"}</td>
                    <td className="p-3 text-right"><button className="text-xs text-[var(--s-muted)] hover:text-[var(--s-err)]" onClick={() => remove(x)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

"use client";
import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Invitation, Rsvp } from "@/lib/types";
import { api, getKey } from "@/lib/client";
import { Logo } from "@/components/Brand";

const ago = (iso: string) => {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? "yesterday" : `${d} days ago`;
};

export default function Guests({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const r = useRouter();
  const [inv, setInv] = useState<Invitation | null>(null);
  const [rows, setRows] = useState<Rsvp[] | null>(null);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "yes" | "no">("all");
  const [err, setErr] = useState("");
  const [stamp, setStamp] = useState<Date | null>(null);

  function load() {
    api<{ rsvps: Rsvp[] }>(`/api/invites/${id}/rsvps`)
      .then((d) => { setRows(d.rsvps); setStamp(new Date()); setErr(""); })
      .catch((e) => setErr(e.message));
  }
  useEffect(() => {
    if (!getKey()) { r.replace("/redeem"); return; }
    api<{ invite: Invitation }>(`/api/invites/${id}`).then((d) => setInv(d.invite)).catch((e) => (e.status === 401 ? r.replace("/redeem") : setErr(e.message)));
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // every count is computed from the rows
  const stats = useMemo(() => {
    const list = rows || [];
    const yes = list.filter((x) => x.attending);
    const people = yes.reduce((n, x) => n + 1 + x.guests, 0);
    const noMeal = inv?.data.rsvp.askMeal ? yes.filter((x) => !x.meal).length : 0;
    return { replies: list.length, yes: yes.length, no: list.length - yes.length, people, plusOnes: people - yes.length, noMeal, last: list[0] };
  }, [rows, inv]);

  const shown = (rows || []).filter((x) => (filter === "all" || (filter === "yes") === x.attending) && (!q || JSON.stringify(x).toLowerCase().includes(q.toLowerCase())));

  const finding = !rows ? "" : stats.replies === 0
    ? "No replies yet. They appear here the moment a guest sends one."
    : [
        `${stats.people} ${stats.people === 1 ? "person is" : "people are"} coming`,
        stats.plusOnes ? `including ${stats.plusOnes} extra ${stats.plusOnes === 1 ? "guest" : "guests"}` : "",
      ].filter(Boolean).join(", ") + "." +
      (stats.noMeal ? ` ${stats.noMeal} accepted ${stats.noMeal === 1 ? "reply has" : "replies have"} no meal choice yet.` : "") +
      (stats.last ? ` Last reply ${ago(stats.last.created_at)} from ${stats.last.name}.` : "");

  function csv() {
    const cols: (keyof Rsvp)[] = ["created_at", "name", "attending", "guests", "guest_names", "email", "meal", "diet", "song", "custom", "message"];
    const head = ["Replied", "Name", "Attending", "Extra guests", "Guest names", "Email", "Meal", "Dietary needs", "Song request", inv?.data.rsvp.customQuestion || "Your question", "Note"];
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = [head.map(esc).join(","), ...(rows || []).map((x) => cols.map((c) => esc(c === "attending" ? (x.attending ? "Yes" : "No") : c === "created_at" ? new Date(x.created_at).toLocaleString() : x[c])).join(","))];
    const url = URL.createObjectURL(new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = `guest-list-${inv?.slug || "wedding"}.csv`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  async function remove(x: Rsvp) {
    if (!window.confirm(`Delete the reply from ${x.name}? This cannot be undone.`)) return;
    await api(`/api/invites/${id}/rsvps?rsvp=${x.id}`, { method: "DELETE" }).catch((e) => setErr(e.message));
    load();
  }

  const yesShare = stats.replies ? stats.yes / stats.replies : 0;

  return (
    <div className="studio flex flex-col">
      <header className="s-top">
        <Logo height={26} />
        <span className="text-[var(--muted)] hidden sm:inline truncate">{inv ? `${inv.data.partner1} & ${inv.data.partner2}` : ""}</span>
        <Link href={`/studio/${id}`} className="s-btn s-btn-sm ml-auto">Back to the editor</Link>
      </header>
      <main className="s-sheet flex-1 mr-0 sm:mr-2 mb-0 sm:mb-2 ml-0 sm:ml-2 p-4 sm:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="s-h1">Guest list</h1>
            <p className="s-sub mt-1 max-w-[72ch]" aria-live="polite">{finding || " "}</p>
          </div>
          <button className="s-btn s-btn-primary" onClick={csv} disabled={!rows?.length}>Download spreadsheet</button>
        </div>

        {err && <p className="s-err mt-4">{err} <button className="s-btn-text" onClick={load}>Retry</button></p>}

        {/* counts: one divided strip, the head count leads */}
        <div className="s-panel mt-6 grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] divide-x divide-y md:divide-y-0 divide-[var(--border)] overflow-hidden">
          {([
            ["Coming", stats.people, "people, extra guests included", true],
            ["Accepted", stats.yes, stats.yes === 1 ? "reply" : "replies", false],
            ["Declined", stats.no, stats.no === 1 ? "reply" : "replies", false],
            ["Replies", stats.replies, "in total", false],
          ] as [string, number, string, boolean][]).map(([l, v, unit, lead]) => (
            <div key={l} className="p-4 sm:p-5">
              <p className="text-[12px] text-[var(--muted)]">{l}</p>
              {rows ? (
                <p className={`num mt-1 ${lead ? "text-[32px] leading-[40px] font-semibold text-[var(--accent)]" : "text-[24px] leading-[32px] font-medium"}`}>{v}</p>
              ) : (
                <span className={`block mt-1 rounded bg-[var(--raised)] ${lead ? "h-10 w-16" : "h-8 w-12"}`} aria-hidden />
              )}
              <p className="text-[12px] text-[var(--muted)]">{unit}</p>
            </div>
          ))}
        </div>

        {/* the ratio of answers, at its true proportion */}
        {rows && stats.replies > 0 && (
          <div className="mt-4">
            <div className="flex h-2 rounded-full overflow-hidden bg-[var(--raised)]" role="img" aria-label={`${stats.yes} accepted, ${stats.no} declined`}>
              <span style={{ width: `${yesShare * 100}%` }} className="bg-[var(--accent)]" />
              <span style={{ width: `${(1 - yesShare) * 100}%` }} className="bg-[var(--control)]" />
            </div>
            <div className="flex justify-between mt-2 text-[12px] text-[var(--muted)] num">
              <span><span className="inline-block size-2 rounded-full bg-[var(--accent)] mr-1.5" />Accepted {stats.yes}</span>
              <span>Declined {stats.no}<span className="inline-block size-2 rounded-full bg-[var(--control)] ml-1.5" /></span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-8">
          <h2 className="s-h2 mr-auto">Replies</h2>
          <input className="s-input !w-full sm:!w-64 !h-8" placeholder="Search names, meals, notes" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search replies" />
          <div className="flex rounded-full border border-[var(--control)] p-0.5" role="group" aria-label="Filter replies">
            {(["all", "yes", "no"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f} className={`px-3 h-7 rounded-full text-[13px] font-medium ${filter === f ? "bg-[var(--primary)] text-white" : "text-[var(--muted)]"}`}>
                {f === "all" ? `All ${stats.replies}` : f === "yes" ? `Accepted ${stats.yes}` : `Declined ${stats.no}`}
              </button>
            ))}
          </div>
        </div>

        <div className="s-panel mt-3 overflow-hidden">
          {!rows ? (
            <div className="p-4 space-y-4" aria-label="Loading replies">
              {[0, 1, 2].map((i) => <div key={i} className="h-5 rounded bg-[var(--raised)]" />)}
            </div>
          ) : shown.length === 0 ? (
            <div className="p-4">
              <p className="rounded-[8px] border border-dashed border-[var(--control)] px-4 py-3 text-[var(--muted)]">
                {rows.length === 0 ? <>No replies yet. Send your link from <Link href={`/studio/${id}`} className="underline">Publish and share</Link>.</> : "No replies match this search."}
              </p>
            </div>
          ) : (
            <>
              <table className="s-table hidden md:table">
                <thead>
                  <tr><th>Name</th><th>Reply</th><th className="num">Extra guests</th><th>Meal and diet</th><th>Song</th><th>Note</th><th className="num">Received</th><th><span className="sr-only">Actions</span></th></tr>
                </thead>
                <tbody>
                  {shown.map((x) => (
                    <tr key={x.id}>
                      <td><span className="font-medium">{x.name}</span>{x.email && <span className="block text-[12px] text-[var(--muted)]">{x.email}</span>}</td>
                      <td><span className={`s-pill ${x.attending ? "s-pill-live" : "s-pill-no"}`}>{x.attending ? "Accepted" : "Declined"}</span></td>
                      <td className="num">{x.attending ? x.guests : <span className="text-[var(--muted)]">–</span>}{x.guest_names && <span className="block text-[12px] text-[var(--muted)]">{x.guest_names}</span>}</td>
                      <td>{x.meal || <span className="text-[var(--muted)]">–</span>}{x.diet && <span className="block text-[12px] text-[var(--muted)]">{x.diet}</span>}</td>
                      <td>{x.song || <span className="text-[var(--muted)]">–</span>}</td>
                      <td className="max-w-[260px]">{x.custom && <span className="block text-[12px] text-[var(--muted)]">{x.custom}</span>}{x.message || (!x.custom && <span className="text-[var(--muted)]">–</span>)}</td>
                      <td className="num text-[var(--muted)] whitespace-nowrap">{new Date(x.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</td>
                      <td className="text-right"><button className="s-btn-text text-[13px] text-[var(--muted)]" onClick={() => remove(x)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* phone: two-line rows, nothing dropped */}
              <ul className="md:hidden">
                {shown.map((x) => (
                  <li key={x.id} className="px-4 py-3 border-b border-[var(--rule)] last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{x.name}</span>
                      <span className={`s-pill ${x.attending ? "s-pill-live" : "s-pill-no"}`}>{x.attending ? "Accepted" : "Declined"}</span>
                      <span className="ml-auto num text-[13px] text-[var(--muted)]">{x.attending ? `+${x.guests}` : ""}</span>
                    </div>
                    <p className="text-[13px] text-[var(--muted)] mt-1">
                      {[x.guest_names, x.meal, x.diet, x.song && `Song: ${x.song}`, x.message].filter(Boolean).join(" · ") || new Date(x.created_at).toLocaleDateString()}
                    </p>
                    <button className="s-btn-text text-[13px] text-[var(--muted)] mt-1" onClick={() => remove(x)}>Delete</button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <p className="mt-3 text-[12px] text-[var(--muted)]">
          {stamp ? `Updated ${stamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, refreshes every 30 seconds.` : " "}{" "}
          {stamp && <button className="s-btn-text text-[12px]" onClick={load}>Refresh now</button>}
        </p>
      </main>
    </div>
  );
}

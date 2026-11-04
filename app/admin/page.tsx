"use client";
import { useState } from "react";
import type { License } from "@/lib/types";
import { Logo } from "@/components/Brand";

/* Seller admin: pre-add Etsy orders, see activations, revoke refunded orders. */
export default function Admin() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [rows, setRows] = useState<License[]>([]);
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");
  const [q, setQ] = useState("");

  const h = () => ({ "x-admin-secret": secret, "content-type": "application/json" });
  async function load() {
    const res = await fetch("/api/admin/licenses", { headers: h() });
    if (!res.ok) { setMsg("Wrong admin password."); return; }
    setAuthed(true); setMsg("");
    setRows((await res.json()).licenses);
  }
  async function add() {
    const res = await fetch("/api/admin/orders", { method: "POST", headers: h(), body: JSON.stringify({ text }) });
    const d = await res.json();
    setMsg(`Added ${d.added}, skipped ${d.skipped} (already there).`);
    setText(""); load();
  }
  async function status(id: string, s: License["status"]) {
    await fetch("/api/admin/licenses", { method: "PATCH", headers: h(), body: JSON.stringify({ id, status: s }) });
    load();
  }
  const shown = rows.filter((r) => !q || `${r.order_id} ${r.email}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="studio">
      <header className="px-5 h-16 flex items-center max-w-5xl mx-auto"><Logo /><span className="ml-3 text-sm text-[var(--s-muted)]">Admin</span></header>
      <main className="max-w-5xl mx-auto px-5 pb-20 space-y-5">
        {!authed ? (
          <form className="s-card p-6 max-w-sm space-y-3" onSubmit={(e) => { e.preventDefault(); load(); }}>
            <label className="block"><span className="s-label">Admin password</span><input className="s-input" type="password" value={secret} onChange={(e) => setSecret(e.target.value)} /></label>
            <button className="s-btn s-btn-primary w-full">Sign in</button>
            {msg && <p className="s-err">{msg}</p>}
          </form>
        ) : (
          <>
            <section className="s-card p-5 space-y-3">
              <h2 className="font-semibold">Add Etsy orders (optional)</h2>
              <p className="s-hint">New orders activate automatically. Pasting orders here is only needed if you want to pre-register them. Paste order numbers or the Etsy Orders CSV.</p>
              <textarea className="s-input" rows={4} value={text} onChange={(e) => setText(e.target.value)} />
              <button className="s-btn s-btn-primary" onClick={add} disabled={!text.trim()}>Add orders</button>
              {msg && <p className="s-ok">{msg}</p>}
            </section>
            <section className="s-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="font-semibold">Orders ({rows.length})</h2>
                <input className="s-input !w-60 ml-auto" placeholder="Search order or email" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs uppercase text-[var(--s-muted)]"><tr><th className="p-2">Order</th><th className="p-2">Email</th><th className="p-2">Status</th><th className="p-2">Activated</th><th className="p-2" /></tr></thead>
                  <tbody>
                    {shown.map((r) => (
                      <tr key={r.id} className="border-t border-[var(--s-line)]">
                        <td className="p-2 font-mono">{r.order_id}</td><td className="p-2">{r.email || "–"}</td><td className="p-2">{r.status}</td>
                        <td className="p-2">{r.claimed_at ? new Date(r.claimed_at).toLocaleDateString() : "–"}</td>
                        <td className="p-2 text-right">
                          {r.status !== "revoked" ? <button className="s-btn s-btn-sm" onClick={() => status(r.id, "revoked")}>Revoke</button>
                            : <button className="s-btn s-btn-sm" onClick={() => status(r.id, r.email ? "claimed" : "available")}>Restore</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import type { Invitation } from "@/lib/types";
import { api } from "@/lib/client";
import { slugify } from "@/lib/defaults";
import { Section, Toggle } from "./fields";

export function SharePanel({ inv, onSaved, beforePublish }: { inv: Invitation; onSaved: (p: Partial<Invitation>) => void; beforePublish: () => Promise<void> }) {
  const [origin, setOrigin] = useState("");
  const [slug, setSlug] = useState(inv.slug);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => setOrigin((process.env.NEXT_PUBLIC_SITE_URL || window.location.origin).replace(/\/$/, "")), []);
  const url = `${origin}/i/${inv.slug}`;

  useEffect(() => {
    if (!origin) return;
    QRCode.toDataURL(url, { width: 720, margin: 2, color: { dark: "#2a2421", light: "#ffffff" } }).then(setQr).catch(() => setQr(""));
  }, [url, origin]);

  async function patch(body: Partial<Invitation>, ok: string) {
    setErr(""); setMsg(""); setBusy(true);
    try {
      await beforePublish();
      const r = await api<{ invite: Invitation }>(`/api/invites/${inv.id}`, { method: "PATCH", body: JSON.stringify(body) });
      onSaved({ slug: r.invite.slug, published: r.invite.published });
      setSlug(r.invite.slug);
      setMsg(ok);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch { setErr("Could not copy automatically. Select the link and copy it."); }
  }

  const share = encodeURIComponent(`You're invited to the wedding of ${inv.data.partner1} & ${inv.data.partner2}! Open your invitation: ${url}`);
  const clean = slugify(slug);

  return (
    <>
      <Section title="Publish" desc="While unpublished, only you can see the invitation here in the studio.">
        <Toggle
          label={inv.published ? "Your invitation is live" : "Your invitation is not live yet"}
          hint={inv.published ? "Anyone with the link can open it and RSVP." : "Turn on when you're ready to share."}
          checked={inv.published}
          onChange={(published) => patch({ published }, published ? "Published! Your link is ready to share." : "Unpublished. The link now shows 'not found'.")}
        />
      </Section>

      <Section title="Your link" desc="Choose a short, memorable address. Letters, numbers and dashes only.">
        <div className="flex items-stretch rounded-xl border border-[var(--border)] bg-white overflow-hidden focus-within:border-[var(--accent)]">
          <span className="hidden sm:flex items-center px-3 text-sm text-[var(--muted)] bg-[var(--raised)] border-r border-[var(--border)] whitespace-nowrap">{origin.replace(/^https?:\/\//, "")}/i/</span>
          <input className="flex-1 min-w-0 px-3 py-2.5 outline-none text-[.95rem]" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase())} aria-label="Link name" />
          <button className="px-4 text-sm font-semibold text-[var(--accent)] disabled:opacity-40" disabled={busy || clean === inv.slug || clean.length < 3} onClick={() => patch({ slug }, "Link updated.")}>Save</button>
        </div>
        {slug && clean !== slug && <p className="s-hint">Will be saved as <b>{clean}</b></p>}
        {err && <p className="s-err">{err}</p>}
        {msg && <p className="s-ok">{msg}</p>}

        <div className="rounded-2xl bg-[var(--raised)] p-4 space-y-3">
          <p className="text-sm break-all font-medium">{url}</p>
          <div className="flex flex-wrap gap-2">
            <button className="s-btn s-btn-sm s-btn-primary" onClick={copy}>{copied ? "Copied!" : "Copy link"}</button>
            <a className="s-btn s-btn-sm" href={url} target="_blank" rel="noreferrer">{inv.published ? "Open invitation" : "Open (publish first)"}</a>
            <a className="s-btn s-btn-sm" href={`https://wa.me/?text=${share}`} target="_blank" rel="noreferrer">WhatsApp</a>
            <a className="s-btn s-btn-sm" href={`mailto:?subject=${encodeURIComponent("You're invited!")}&body=${share}`}>Email</a>
            <a className="s-btn s-btn-sm" href={`sms:?&body=${share}`}>Text message</a>
          </div>
        </div>
      </Section>

      <Section title="QR code" desc="Print it on save-the-date cards, table signs or a welcome board.">
        {qr ? (
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="QR code for your invitation" className="size-36 rounded-xl border border-[var(--border)] bg-white" />
            <a className="s-btn s-btn-sm" href={qr} download={`${inv.slug}-qr.png`}>Download QR (PNG)</a>
          </div>
        ) : <p className="s-hint">Generating…</p>}
      </Section>
    </>
  );
}

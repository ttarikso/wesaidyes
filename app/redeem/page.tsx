"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setKey } from "@/lib/client";
import { Logo } from "@/components/Brand";
import { BRAND } from "@/lib/brand";

export default function Redeem() {
  const r = useRouter();
  const [mode, setMode] = useState<"order" | "key">("order");
  const [orderId, setOrder] = useState("");
  const [email, setEmail] = useState("");
  const [key, setK] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      if (mode === "key") {
        const k = key.trim().toUpperCase();
        const res = await fetch("/api/me", { headers: { "x-license-key": k } });
        if (!res.ok) throw new Error("That access key was not recognised.");
        setKey(k);
      } else {
        const res = await fetch("/api/redeem", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ orderId, email }) });
        const d = await res.json();
        if (!res.ok) throw new Error(d.error);
        setKey(d.key);
      }
      r.push("/studio");
    } catch (e) {
      setErr((e as Error).message);
      setBusy(false);
    }
  }

  return (
    <div className="studio flex flex-col">
      <header className="px-5 h-16 flex items-center max-w-5xl mx-auto w-full"><Logo /></header>
      <main className="flex-1 grid place-items-center px-5 pb-16">
        <form onSubmit={submit} className="s-card w-full max-w-md p-7 space-y-5">
          <div className="flex rounded-full bg-[var(--s-soft)] p-1">
            {(["order", "key"] as const).map((m) => (
              <button key={m} type="button" onClick={() => { setMode(m); setErr(""); }} className={`flex-1 h-9 rounded-full text-sm font-semibold ${mode === m ? "bg-white shadow-sm" : "text-[var(--s-muted)]"}`}>
                {m === "order" ? "Etsy order" : "Access key"}
              </button>
            ))}
          </div>
          <div>
            <h1 className="font-serif text-3xl">{mode === "order" ? "Start your invitation" : "Welcome back"}</h1>
            <p className="text-sm text-[var(--s-muted)] mt-1.5">
              {mode === "order"
                ? "Enter the order number from your Etsy receipt (Purchases & reviews) and your email."
                : "Enter the WSY-XXXX-XXXX-XXXX key from your welcome screen."}
            </p>
          </div>
          {mode === "order" ? (
            <>
              <label className="block"><span className="s-label">Etsy order number</span><input className="s-input" inputMode="numeric" value={orderId} onChange={(e) => setOrder(e.target.value)} placeholder="e.g. 3456789012" required /></label>
              <label className="block"><span className="s-label">Email address</span><input className="s-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></label>
              <p className="s-hint">Use the same order number and email to sign back in on any device.</p>
            </>
          ) : (
            <label className="block"><span className="s-label">Access key</span><input className="s-input font-mono uppercase tracking-wider" value={key} onChange={(e) => setK(e.target.value)} placeholder="WSY-XXXX-XXXX-XXXX" required /></label>
          )}
          {err && <p className="s-err" role="alert">{err}</p>}
          <button className="s-btn s-btn-primary s-btn-lg w-full" disabled={busy}>{busy ? "Checking…" : "Continue"}</button>
          <p className="text-xs text-center text-[var(--s-muted)]">Don&apos;t have an order yet? <a href={BRAND.etsy} className="underline">Get it on Etsy</a> · <a href="/demo" className="underline">See the demo</a></p>
        </form>
      </main>
    </div>
  );
}

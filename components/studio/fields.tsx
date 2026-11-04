"use client";
import { useRef, useState } from "react";
import { uploadPhoto } from "@/lib/client";

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="s-label">{label}</span>
      {children}
      {hint && <p className="s-hint">{hint}</p>}
    </label>
  );
}

export function Text({ label, hint, value, onChange, placeholder, max, type = "text" }: {
  label: string; hint?: string; value: string; onChange: (v: string) => void; placeholder?: string; max?: number; type?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <input className="s-input" type={type} value={value} maxLength={max} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

export function Area({ label, hint, value, onChange, placeholder, max, rows = 4 }: {
  label: string; hint?: string; value: string; onChange: (v: string) => void; placeholder?: string; max?: number; rows?: number;
}) {
  return (
    <Field label={label} hint={hint}>
      <textarea className="s-input" rows={rows} value={value} maxLength={max} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

export function Toggle({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1">
      <div>
        <p className="text-[.92rem] font-medium">{label}</p>
        {hint && <p className="s-hint mt-0.5">{hint}</p>}
      </div>
      <button type="button" role="switch" aria-checked={checked} aria-label={label} className="s-switch mt-0.5" onClick={() => onChange(!checked)} />
    </div>
  );
}

export function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="s-card p-5 space-y-4">
      <header>
        <h2 className="text-[1.05rem] font-semibold">{title}</h2>
        {desc && <p className="s-hint mt-1">{desc}</p>}
      </header>
      {children}
    </section>
  );
}

/** One or more photos with upload, reorder (left/right) and remove. */
export function Photos({ value, onChange, max, label, hint }: { value: string[]; onChange: (v: string[]) => void; max: number; label: string; hint?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(0);
  const [err, setErr] = useState("");

  async function pick(files: FileList | null) {
    if (!files?.length) return;
    setErr("");
    const list = Array.from(files).slice(0, max - value.length);
    setBusy(list.length);
    const out = [...value];
    for (const f of list) {
      try { out.push(await uploadPhoto(f)); onChange([...out]); }
      catch (e) { setErr((e as Error).message); }
      setBusy((n) => n - 1);
    }
    if (input.current) input.current.value = "";
  }
  const move = (i: number, d: number) => {
    const n = [...value];
    const j = i + d;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n);
  };

  return (
    <div>
      <span className="s-label">{label}</span>
      <div className="grid grid-cols-3 gap-2">
        {value.map((src, i) => (
          <div key={src + i} className="relative group aspect-[4/5] rounded-lg overflow-hidden border border-[var(--s-line)] bg-[var(--s-soft)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex justify-between p-1 bg-gradient-to-t from-black/55 to-transparent">
              <span className="flex gap-1">
                {max > 1 && i > 0 && <button type="button" onClick={() => move(i, -1)} className="size-7 rounded-full bg-white/90 text-xs" aria-label="Move left">←</button>}
                {max > 1 && i < value.length - 1 && <button type="button" onClick={() => move(i, 1)} className="size-7 rounded-full bg-white/90 text-xs" aria-label="Move right">→</button>}
              </span>
              <button type="button" onClick={() => onChange(value.filter((_, k) => k !== i))} className="size-7 rounded-full bg-white/90 text-xs" aria-label="Remove photo">✕</button>
            </div>
          </div>
        ))}
        {Array.from({ length: busy }).map((_, i) => (
          <div key={"b" + i} className="aspect-[4/5] rounded-lg border border-dashed border-[var(--s-line)] grid place-items-center text-xs text-[var(--s-muted)] animate-pulse">Uploading…</div>
        ))}
        {value.length + busy < max && (
          <button type="button" onClick={() => input.current?.click()} className="aspect-[4/5] rounded-lg border border-dashed border-[#cdbfae] grid place-items-center text-[var(--s-muted)] hover:bg-[var(--s-soft)] transition">
            <span className="text-center text-xs leading-tight"><span className="block text-2xl leading-none mb-1">+</span>Add photo</span>
          </button>
        )}
      </div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/heic" multiple={max > 1} hidden onChange={(e) => pick(e.target.files)} />
      {hint && <p className="s-hint">{hint}</p>}
      {err && <p className="s-hint !text-[var(--s-err)]">{err}</p>}
    </div>
  );
}

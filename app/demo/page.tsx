"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Invitation from "@/components/Invitation";
import { demoInvite } from "@/lib/demo";
import { HEADING_FONTS, THEMES } from "@/lib/themes";
import { BRAND } from "@/lib/brand";

export default function Demo() {
  const [theme, setTheme] = useState(THEMES[0].id);
  const [nonce, setNonce] = useState(0);
  const [skip, setSkip] = useState(false);
  const [bare, setBare] = useState(false);
  const [data, setData] = useState(demoInvite);
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("theme");
    if (t && THEMES.some((x) => x.id === t)) setTheme(t);
    const q = new URLSearchParams(window.location.search);
    if (q.get("open") === "1") setSkip(true);
    if (q.get("bare") === "1") setBare(true);
    const font = q.get("font"); if (font) setData((d) => ({ ...d, headingFont: font }));
    const a = (q.get("a") || "").trim().slice(0, 30), b = (q.get("b") || "").trim().slice(0, 30);
    if (a || b) setData((d) => ({ ...d, partner1: a || d.partner1, partner2: b || d.partner2, initials: `${(a || d.partner1)[0]}&${(b || d.partner2)[0]}`.toUpperCase() }));
    const i = (q.get("i") || "").trim().slice(0, 8); if (i) setData((d) => ({ ...d, initials: i }));
  }, []);
  return (
    <>
      <Invitation key={nonce} data={data} theme={theme} music="first-light" slug="demo" mode="preview" startOpen={skip} />
      {!bare && <nav aria-label="Demo" className="demo-bar fixed z-50 flex items-center gap-2 sm:gap-3 bg-[#f7f9f8] text-[#06525c] px-3 sm:px-6 py-1.5 text-[14px] left-0 right-0 top-0 h-12" style={{ fontFamily: "var(--f-sans)" }}>
        <Link href="/" className="pl-1 pr-1 font-semibold no-underline whitespace-nowrap hover:underline underline-offset-4" aria-label="We said yes, back to the homepage">
          <span aria-hidden className="mr-1.5">&larr;</span>We said yes
        </Link>
        <span className="text-[#2f737d] hidden md:inline md:mr-auto">Live demo: this is what your guests receive</span>
        <select aria-label="Theme" value={theme} onChange={(e) => { setTheme(e.target.value); setNonce((n) => n + 1); }} className="min-w-0 flex-1 md:flex-none bg-[#ebf0ee] px-3 py-2 text-[#06525c]">
          {THEMES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <select aria-label="Heading font" value={data.headingFont || ""} onChange={(e) => { const headingFont = e.target.value; setData((d) => ({ ...d, headingFont })); }} className="min-w-0 hidden sm:block md:flex-none bg-[#ebf0ee] px-3 py-2 text-[#06525c]">
          <option value="">Theme font</option>
          {HEADING_FONTS.map((f) => <option key={f.id} value={f.id}>{f.name} font</option>)}
        </select>
        <a href={BRAND.etsy} target="_blank" rel="noopener noreferrer" className="bg-[#06525c] text-[#f7f9f8] px-4 py-2 font-semibold no-underline whitespace-nowrap hover:opacity-90 transition-opacity">Buy on Etsy</a>
      </nav>}
      {!bare && <style>{`@media (max-width: 639px) { .inv .iv-music { top: 60px; } }
        .inv-main { padding-top: 48px; } .inv .iv-hero { min-height: calc(100svh - 48px); }`}</style>}
    </>
  );
}

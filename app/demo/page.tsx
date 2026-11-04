"use client";
import { useEffect, useState } from "react";
import Invitation from "@/components/Invitation";
import { demoInvite } from "@/lib/demo";
import { THEMES } from "@/lib/themes";
import { BRAND } from "@/lib/brand";

export default function Demo() {
  const [theme, setTheme] = useState(THEMES[0].id);
  const [nonce, setNonce] = useState(0);
  const [data] = useState(demoInvite);
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("theme");
    if (t && THEMES.some((x) => x.id === t)) setTheme(t);
  }, []);
  return (
    <>
      <Invitation key={nonce} data={data} theme={theme} music="first-light" slug="demo" mode="preview" />
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-white/92 backdrop-blur px-2 py-1.5 shadow-lg text-[13px] font-[var(--f-sans)]" style={{ fontFamily: "var(--f-sans)" }}>
        <span className="pl-2 font-semibold text-[#2a2421] hidden sm:inline">Live demo</span>
        <select aria-label="Theme" value={theme} onChange={(e) => { setTheme(e.target.value); setNonce((n) => n + 1); }} className="rounded-full border border-[#e6dccf] bg-white px-3 py-1.5 text-[#2a2421]">
          {THEMES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <a href={BRAND.etsy} className="rounded-full bg-[#8a5546] text-white px-3 py-1.5 font-semibold no-underline whitespace-nowrap">Get yours</a>
      </div>
    </>
  );
}

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Invitation from "@/components/Invitation";
import { demoInvite } from "@/lib/demo";
import { HEADING_FONTS, THEMES } from "@/lib/themes";
import { BRAND } from "@/lib/brand";
import { DEFAULT_LANGUAGE, isValidLanguage, LANGUAGES, type Language } from "@/lib/i18n/types";

export default function Demo() {
  const [theme, setTheme] = useState(THEMES[0].id);
  const [nonce, setNonce] = useState(0);
  const [skip, setSkip] = useState(false);
  const [bare, setBare] = useState(false);
  const [lang, setLang] = useState<Language>(DEFAULT_LANGUAGE);
  const [data, setData] = useState(() => demoInvite(DEFAULT_LANGUAGE));

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const t = q.get("theme");
    if (t && THEMES.some((x) => x.id === t)) setTheme(t);
    if (q.get("open") === "1") setSkip(true);
    if (q.get("bare") === "1") setBare(true);

    const qLang = q.get("lang");
    let initialLang: Language = DEFAULT_LANGUAGE;
    if (isValidLanguage(qLang)) {
      initialLang = qLang;
    } else {
      try {
        const stored = localStorage.getItem("site-lang");
        if (isValidLanguage(stored)) initialLang = stored;
      } catch {}
    }
    setLang(initialLang);

    const font = q.get("font");
    const a = (q.get("a") || "").trim().slice(0, 30);
    const b = (q.get("b") || "").trim().slice(0, 30);
    const i = (q.get("i") || "").trim().slice(0, 8);

    const fresh = demoInvite(initialLang);
    setData({
      ...fresh,
      headingFont: font || fresh.headingFont,
      partner1: a || fresh.partner1,
      partner2: b || fresh.partner2,
      initials: i || (a || b ? `${(a || fresh.partner1)[0]}&${(b || fresh.partner2)[0]}`.toUpperCase() : fresh.initials),
    });
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    setData((prev) => {
      const fresh = demoInvite(newLang);
      return {
        ...fresh,
        headingFont: prev.headingFont,
        partner1: prev.partner1,
        partner2: prev.partner2,
        initials: prev.initials,
      };
    });
    setNonce((n) => n + 1);
    try {
      localStorage.setItem("site-lang", newLang);
      localStorage.setItem("invite-lang:demo", newLang);
    } catch {}
  };

  return (
    <>
      <Invitation
        key={nonce}
        data={data}
        theme={theme}
        music="first-light"
        slug="demo"
        mode="preview"
        startOpen={skip}
        lang={lang}
        onLangChange={handleLanguageChange}
      />
      {!bare && (
        <nav
          aria-label="Demo"
          className="demo-bar fixed z-50 flex items-center gap-1.5 sm:gap-3 bg-[#f7f9f8] text-[#06525c] px-2 sm:px-6 py-1.5 text-[13px] sm:text-[14px] left-0 right-0 top-0 h-12 shadow-sm"
          style={{ fontFamily: "var(--f-sans)" }}
        >
          <Link
            href="/"
            className="pl-1 pr-1 font-semibold no-underline whitespace-nowrap hover:underline underline-offset-4 shrink-0 flex items-center gap-1"
            aria-label="We said yes, back to the homepage"
          >
            <span aria-hidden>&larr;</span>
            <span className="hidden sm:inline">We said yes</span>
          </Link>

          <span className="text-[#2f737d] hidden lg:inline mr-auto truncate">Live demo: this is what your guests receive</span>

          <select
            aria-label="Language"
            value={lang}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
            className="min-w-0 bg-[#ebf0ee] px-2 sm:px-3 py-1.5 text-[#06525c] font-medium rounded border-0 cursor-pointer"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.nativeName}
              </option>
            ))}
          </select>

          <select
            aria-label="Theme"
            value={theme}
            onChange={(e) => {
              setTheme(e.target.value);
              setNonce((n) => n + 1);
            }}
            className="min-w-0 flex-1 sm:flex-none max-w-[140px] sm:max-w-none bg-[#ebf0ee] px-2 sm:px-3 py-1.5 text-[#06525c] rounded border-0 cursor-pointer truncate"
          >
            {THEMES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <select
            aria-label="Heading font"
            value={data.headingFont || ""}
            onChange={(e) => {
              const headingFont = e.target.value;
              setData((d) => ({ ...d, headingFont }));
            }}
            className="min-w-0 hidden md:block bg-[#ebf0ee] px-2 sm:px-3 py-1.5 text-[#06525c] rounded border-0 cursor-pointer"
          >
            <option value="">Theme font</option>
            {HEADING_FONTS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} font
              </option>
            ))}
          </select>

          <a
            href={BRAND.etsy}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#06525c] text-[#f7f9f8] px-2.5 sm:px-4 py-1.5 font-semibold no-underline whitespace-nowrap hover:opacity-90 transition-opacity rounded shrink-0 ml-auto sm:ml-0 text-xs sm:text-sm"
          >
            Buy on Etsy
          </a>
        </nav>
      )}
      {!bare && (
        <style>{`
          .demo-bar ~ .inv .env-lang-row { top: 58px !important; }
          @media (max-width: 639px) { .inv .iv-music { top: 60px; } }
          .inv-main { padding-top: 48px; }
          .inv .iv-hero { min-height: calc(100svh - 48px); }
        `}</style>
      )}
    </>
  );
}

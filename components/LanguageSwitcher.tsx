"use client";
import { useEffect, useRef, useState } from "react";
import { LANGUAGES, type Language } from "@/lib/i18n/types";

interface Props {
  current: Language;
  onChange: (lang: Language) => void;
  variant?: "site" | "invite" | "envelope";
  className?: string;
}

export function LanguageSwitcher({ current, onChange, variant = "site", className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  // Variant "envelope": Clean inline row on the envelope screen
  if (variant === "envelope") {
    return (
      <div className={`env-lang-row ${className}`} role="radiogroup" aria-label="Language">
        {LANGUAGES.map((l) => {
          const active = l.code === current;
          return (
            <button
              key={l.code}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={(e) => {
                e.stopPropagation();
                onChange(l.code);
              }}
              className={`env-lang-btn ${active ? "is-active" : ""}`}
              title={l.name}
            >
              <span className="lang-code">{l.code.toUpperCase()}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Variant "invite": Sits inside .iv-nav or top corner of invitation
  if (variant === "invite") {
    const activeMeta = LANGUAGES.find((l) => l.code === current) || LANGUAGES[0];
    return (
      <div ref={ref} className={`iv-lang-dropdown ${className}`}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="iv-lang-trigger"
          aria-expanded={open}
          aria-label="Change language"
          title="Change language"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
          <span>{activeMeta.code.toUpperCase()}</span>
          <span className="caret" aria-hidden>▾</span>
        </button>
        {open && (
          <div className="iv-lang-menu" role="menu">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                role="menuitem"
                className={`iv-lang-item ${l.code === current ? "is-active" : ""}`}
                onClick={() => {
                  onChange(l.code);
                  setOpen(false);
                }}
              >
                <span className="lang-flag">{l.flag}</span>
                <span className="lang-native">{l.nativeName}</span>
                {l.code === current && <span className="lang-check">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Variant "site": Landing page nav dropdown
  const activeMeta = LANGUAGES.find((l) => l.code === current) || LANGUAGES[0];
  return (
    <div ref={ref} className={`site-lang-dropdown keep ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="site-lang-trigger keep"
        aria-expanded={open}
        aria-label="Change language"
      >
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
        <span>{activeMeta.nativeName}</span>
        <span className="caret" aria-hidden>▾</span>
      </button>
      {open && (
        <div className="site-lang-menu" role="menu">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              role="menuitem"
              className={`site-lang-item ${l.code === current ? "is-active" : ""}`}
              onClick={() => {
                onChange(l.code);
                setOpen(false);
              }}
            >
              <span className="lang-flag">{l.flag}</span>
              <span className="lang-native">{l.nativeName}</span>
              {l.code === current && <span className="lang-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

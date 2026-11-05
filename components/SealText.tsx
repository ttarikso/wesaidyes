"use client";
import { useEffect, useState } from "react";
import { SEAL_INK, headingType, type Theme } from "@/lib/themes";

type Fit = { size: number; x: number; y: number };
const fits = new Map<string, Fit>();

/**
 * The initials pressed into the wax seal. Fills its (square) parent: the letters are measured by their
 * ink, not their line box, so any typeface sits in the optical centre of the seal and any length fits
 * inside its inner ring.
 */
export default function SealText({ theme, heading, text }: { theme: Theme; heading?: string; text: string }) {
  const y = headingType(theme, heading);
  const seal = SEAL_INK[theme.art] || { ink: theme.sealInk, edge: "rgba(255,255,255,.4)", x: 50, y: 50, dark: false };
  const t = (y.upper ? text.toUpperCase() : text).trim();
  const weight = y.sealWeight;
  const key = `${y.display}|${weight}|${t}|${seal.x}|${seal.y}`;
  const [fit, setFit] = useState<Fit | null>(() => fits.get(key) || null);

  useEffect(() => {
    const known = fits.get(key);
    if (known) { setFit(known); return; }
    setFit(null);
    if (!t) return;
    let dead = false;
    const font = `${weight} 100px ${y.display}`;
    const ready = document.fonts ? document.fonts.load(font, t).catch(() => []) : Promise.resolve([]);
    ready.then(() => {
      if (dead) return;
      const ctx = document.createElement("canvas").getContext("2d");
      if (!ctx) return;
      ctx.font = font;
      const m = ctx.measureText(t);
      const w = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
      const h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
      if (!w || !h) return;
      // the inner ring of every seal is about half its width: keep the letters inside 44 x 22 of 100
      const k = Math.min(44 / w, 22 / h);
      const f = {
        size: 100 * k,
        x: seal.x - ((m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2) * k,
        y: seal.y + ((m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2) * k,
      };
      fits.set(key, f);
      setFit(f);
    });
    return () => { dead = true; };
  }, [key, t, weight, y.display, seal.x, seal.y]);

  return (
    <svg className="seal-text" viewBox="0 0 100 100" aria-hidden focusable="false"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}>
      {fit && (
        <g style={{ fontFamily: y.display, fontWeight: weight, fontSize: fit.size, fontKerning: "normal" }}>
          <text x={fit.x} y={fit.y + fit.size * 0.03} fill={seal.edge} opacity={seal.dark ? 0.85 : 0.7}>{t}</text>
          {/* a script's hairlines vanish at seal size: a thin stroke gives them the weight of pressed wax */}
          <text x={fit.x} y={fit.y} fill={seal.ink} stroke={heading === "script" ? seal.ink : undefined} strokeWidth={heading === "script" ? fit.size * 0.018 : undefined} strokeLinejoin="round">{t}</text>
        </g>
      )}
    </svg>
  );
}

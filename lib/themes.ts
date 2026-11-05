/* Theme catalogue. A theme = paper texture + wax seal + floral art + colours + a type system.
   Type systems come from the taste-skill library (one tested setting per face), chosen per mood.
   To add a theme: drop <art>-paper.webp, <art>-seal.webp, <art>-floral.webp into public/themes,
   make sure its faces are loaded in app/layout.tsx (Fontsource) or styles/fonts.css (Fontshare),
   and add an entry below. */

export interface TypeSystem {
  id: string; // taste-skill library id
  display: string; // CSS font-family stack for the names and headings
  displayWeight: number;
  displayTrack: string; // letter-spacing at display size
  displayLead: number;
  upper: boolean; // names set in capitals
  connectorItalic: boolean; // "&" and small joining words in italic of the display face
  sealWeight: number; // weight for the initials pressed into the wax
  text: string; // CSS font-family stack for everything else
  textTrack: string;
  bodyLead: number;
  monumentMax: number; // largest the names may get, in vw
}

export interface Theme {
  id: string;
  name: string;
  mood: string;
  art: string; // asset prefix in /public/themes
  bg: string; // the coloured paper (page ground), as rendered after paperTone
  paperTone?: string; // multiplied over the paper texture to deepen it (keeps body text at 4.5:1)
  onBg: string; // ink on the coloured paper
  onBgSoft: string; // secondary ink on the coloured paper (still 4.5:1)
  card: string; // the ivory sheet (one tone step for sections)
  ink: string; // ink on the ivory sheet
  accent: string; // one accent, used on the ivory sheet only
  sealInk: string; // initials on the wax seal
  type: TypeSystem;
}

const T = {
  newsreader: {
    id: "newsreader-light", display: '"Newsreader Variable", Georgia, serif', displayWeight: 420, displayTrack: "-0.025em", displayLead: 0.95,
    upper: false, connectorItalic: false, sealWeight: 400, text: '"Newsreader Variable", Georgia, serif', textTrack: "0", bodyLead: 1.6, monumentMax: 14,
  },
  sentient: {
    id: "sentient-light", display: '"Sentient", Georgia, serif', displayWeight: 450, displayTrack: "-0.01em", displayLead: 1.0,
    upper: false, connectorItalic: false, sealWeight: 400, text: '"Sentient", Georgia, serif', textTrack: "0", bodyLead: 1.55, monumentMax: 12,
  },
  boska: {
    id: "boska-roman-italic", display: '"Boska", Georgia, serif', displayWeight: 450, displayTrack: "-0.015em", displayLead: 0.95,
    upper: false, connectorItalic: true, sealWeight: 500, text: '"Boska", Georgia, serif', textTrack: "0.005em", bodyLead: 1.5, monumentMax: 14,
  },
  bricolage: {
    id: "bricolage-contrast", display: '"Bricolage Grotesque Variable", "Helvetica Neue", Arial, sans-serif', displayWeight: 600, displayTrack: "-0.04em", displayLead: 0.92,
    upper: false, connectorItalic: false, sealWeight: 600, text: '"Bricolage Grotesque Variable", "Helvetica Neue", Arial, sans-serif', textTrack: "0", bodyLead: 1.5, monumentMax: 13,
  },
  zodiak: {
    id: "zodiak-hairline", display: '"Zodiak", Georgia, serif', displayWeight: 300, displayTrack: "0", displayLead: 1.0,
    upper: true, connectorItalic: false, sealWeight: 400, text: '"Hanken Grotesk Variable", "Helvetica Neue", Arial, sans-serif', textTrack: "0", bodyLead: 1.5, monumentMax: 11,
  },
  gambarino: {
    id: "gambarino-general", display: '"Gambarino", Georgia, serif', displayWeight: 400, displayTrack: "-0.02em", displayLead: 0.92,
    upper: false, connectorItalic: false, sealWeight: 400, text: '"General Sans", "Helvetica Neue", Arial, sans-serif', textTrack: "0", bodyLead: 1.5, monumentMax: 15,
  },
  imbue: {
    id: "imbue-albert", display: '"Imbue Variable", Georgia, serif', displayWeight: 500, displayTrack: "-0.01em", displayLead: 0.92,
    upper: true, connectorItalic: false, sealWeight: 500, text: '"Albert Sans Variable", "Helvetica Neue", Arial, sans-serif', textTrack: "0", bodyLead: 1.55, monumentMax: 15,
  },
  bodoni: {
    id: "bodoni-jost", display: '"Bodoni Moda Variable", Didot, Georgia, serif', displayWeight: 600, displayTrack: "-0.01em", displayLead: 0.95,
    upper: true, connectorItalic: false, sealWeight: 500, text: '"Jost Variable", "Helvetica Neue", Arial, sans-serif', textTrack: "0.01em", bodyLead: 1.6, monumentMax: 12,
  },
  erode: {
    id: "erode-sharp", display: '"Erode", Georgia, serif', displayWeight: 500, displayTrack: "-0.025em", displayLead: 0.95,
    upper: false, connectorItalic: false, sealWeight: 500, text: '"Erode", Georgia, serif', textTrack: "0", bodyLead: 1.5, monumentMax: 14,
  },
} satisfies Record<string, TypeSystem>;

const GOLD_INK = "rgba(92,64,10,.88)";

/* Heading faces the couple may pick instead of their theme's own. They change the names, the
   section titles and the seal initials; body text stays the theme's. */
type HeadingFace = Pick<TypeSystem, "display" | "displayWeight" | "displayTrack" | "displayLead" | "upper" | "connectorItalic" | "sealWeight" | "monumentMax">;
export const HEADING_FONTS: { id: string; name: string; note: string; face: HeadingFace }[] = [
  { id: "classic", name: "Classic", note: "Bodoni, in capitals", face: { display: T.bodoni.display, displayWeight: 600, displayTrack: "-0.01em", displayLead: 0.95, upper: true, connectorItalic: false, sealWeight: 500, monumentMax: 12 } },
  { id: "garamond", name: "Romantic", note: "Cormorant Garamond", face: { display: '"Cormorant Garamond Variable", Garamond, Georgia, serif', displayWeight: 500, displayTrack: "-0.015em", displayLead: 0.95, upper: false, connectorItalic: true, sealWeight: 600, monumentMax: 15 } },
  { id: "script", name: "Calligraphy", note: "Pinyon Script", face: { display: '"Pinyon Script", "Snell Roundhand", cursive', displayWeight: 400, displayTrack: "0", displayLead: 1.2, upper: false, connectorItalic: false, sealWeight: 400, monumentMax: 13 } },
  { id: "deco", name: "Art Deco", note: "Imbue, tall capitals", face: { display: T.imbue.display, displayWeight: 500, displayTrack: "-0.01em", displayLead: 0.92, upper: true, connectorItalic: false, sealWeight: 500, monumentMax: 15 } },
  { id: "editorial", name: "Editorial", note: "Zodiak, fine capitals", face: { display: T.zodiak.display, displayWeight: 300, displayTrack: "0", displayLead: 1.0, upper: true, connectorItalic: false, sealWeight: 400, monumentMax: 11 } },
  { id: "modern", name: "Modern serif", note: "Gambarino", face: { display: T.gambarino.display, displayWeight: 400, displayTrack: "-0.02em", displayLead: 0.92, upper: false, connectorItalic: false, sealWeight: 400, monumentMax: 15 } },
];
export const headingFace = (id?: string) => HEADING_FONTS.find((f) => f.id === id)?.face;

export const THEMES: Theme[] = [
  { id: "dusty-blue", name: "Dusty Blue & Silver", mood: "Eucalyptus and a silver laurel seal", art: "blue",
    bg: "#4c627a", paperTone: "#cccccc", onBg: "#f3f5f7", onBgSoft: "#e2e7ed", card: "#eef1f4", ink: "#26364a", accent: "#3f5a7a", sealInk: "rgba(42,60,84,.86)", type: T.newsreader },
  { id: "olive-grove", name: "Olive Grove", mood: "White garden roses and olive branches", art: "olive",
    bg: "#566235", paperTone: "#ebebeb", onBg: "#f2f3ee", onBgSoft: "#e1e3d8", card: "#eff0eb", ink: "#2f3520", accent: "#4f5c2e", sealInk: "rgba(28,36,12,.86)", type: T.sentient },
  { id: "blush-peony", name: "Blush Peony", mood: "Peonies and a rose-gold seal", art: "blush",
    bg: "#e8c4c0", onBg: "#4f2a2d", onBgSoft: "#6a3d40", card: "#f5f0f0", ink: "#4a2a2c", accent: "#9a4f55", sealInk: "rgba(110,52,56,.82)", type: T.boska },
  { id: "desert-boho", name: "Desert Boho", mood: "Pampas grass and terracotta wax", art: "terracotta",
    bg: "#8c5139", paperTone: "#c2c2c2", onBg: "#fbf5f2", onBgSoft: "#f6e4dc", card: "#f3efed", ink: "#4a2a19", accent: "#93472b", sealInk: "rgba(80,30,12,.86)", type: T.bricolage },
  { id: "midnight-gold", name: "Midnight & Gold", mood: "Gold leaf, magnolia and stars", art: "navy",
    bg: "#1c2541", onBg: "#e9dcb4", onBgSoft: "#d6cba9", card: "#eff0f4", ink: "#161d33", accent: "#7d5f1c", sealInk: "rgba(96,66,12,.9)", type: T.zodiak },
  { id: "burgundy-rose", name: "Burgundy Rose", mood: "Wine-dark roses for autumn and winter", art: "burgundy",
    bg: "#6b1f2a", onBg: "#f5ecec", onBgSoft: "#e8d5d5", card: "#f3eeef", ink: "#3d1219", accent: "#7a2333", sealInk: "rgba(54,6,14,.86)", type: T.gambarino },
  { id: "provence-lavender", name: "Provence Lavender", mood: "Lavender, wisteria and sweet peas", art: "lavender",
    bg: "#b7a6cf", onBg: "#2c2342", onBgSoft: "#3f3458", card: "#f2f0f5", ink: "#2c2342", accent: "#5a4780", sealInk: "rgba(66,48,98,.82)", type: T.imbue },
  { id: "black-tie", name: "Black Tie", mood: "Calla lilies on black", art: "noir",
    bg: "#151515", onBg: "#f1f1ef", onBgSoft: "#cfcfcb", card: "#f0f0ee", ink: "#151515", accent: "#151515", sealInk: "rgba(225,225,225,.82)", type: T.bodoni },
  // the luxury collection: jewel tones, metallic wax and soft neutrals
  { id: "emerald-gold", name: "Emerald & Gold", mood: "White orchids and gold-leaf ferns", art: "emerald",
    bg: "#1e4a3b", onBg: "#ecdcae", onBgSoft: "#d9caa1", card: "#eef1ee", ink: "#15352a", accent: "#6f5418", sealInk: GOLD_INK, type: T.bodoni },
  { id: "ivory-pearl", name: "Ivory Pearl", mood: "White roses, lily of the valley and a pearl seal", art: "pearl",
    bg: "#ebe5d9", onBg: "#3a3226", onBgSoft: "#574c3c", card: "#f6f3ee", ink: "#3a3226", accent: "#7d5f2a", sealInk: "rgba(120,108,92,.8)", type: T.erode },
  { id: "champagne-gold", name: "Champagne & Gold", mood: "Cream ranunculus and gilded eucalyptus", art: "champagne",
    bg: "#d6c3a1", onBg: "#3b2d1a", onBgSoft: "#4e3e29", card: "#f5f1ea", ink: "#3b2d1a", accent: "#7a5618", sealInk: "rgba(110,78,30,.85)", type: T.imbue },
  { id: "marble-gold", name: "Marble & Gold", mood: "White tulips on Carrara marble", art: "marble",
    bg: "#e9e8e5", onBg: "#2a2a2a", onBgSoft: "#474744", card: "#f4f3f1", ink: "#2a2a2a", accent: "#7b5d1a", sealInk: GOLD_INK, type: T.zodiak },
  { id: "plum-gold", name: "Plum & Gold", mood: "Dark dahlias, blackberries and gold", art: "plum",
    bg: "#3c2237", onBg: "#ecdcc0", onBgSoft: "#dccab0", card: "#f3eff2", ink: "#2e1a29", accent: "#6e3c62", sealInk: GOLD_INK, type: T.gambarino },
  { id: "mocha-cream", name: "Mocha & Cream", mood: "Café-au-lait roses and a bronze seal", art: "mocha",
    bg: "#4a3226", onBg: "#f3e9dc", onBgSoft: "#e3d3c0", card: "#f4efea", ink: "#3a281d", accent: "#74492a", sealInk: "rgba(70,34,14,.85)", type: T.sentient },
  { id: "slate-silver", name: "Slate & Silver", mood: "White anemones and dusty miller", art: "slate",
    bg: "#4b5159", onBg: "#f1f2f3", onBgSoft: "#dde0e3", card: "#eff0f2", ink: "#262a30", accent: "#4b5159", sealInk: "rgba(50,54,60,.8)", type: T.erode },
  { id: "peacock-gold", name: "Peacock & Gold", mood: "Peacock feathers and white roses", art: "peacock",
    bg: "#0f4448", onBg: "#ead9a8", onBgSoft: "#d7c89f", card: "#edf2f1", ink: "#0d3236", accent: "#0f5a60", sealInk: GOLD_INK, type: T.zodiak },
  { id: "ice-blue", name: "Ice Blue & Silver", mood: "White roses and frosted leaves", art: "ice",
    bg: "#cfdbe3", onBg: "#22344a", onBgSoft: "#33465c", card: "#f1f4f7", ink: "#22344a", accent: "#3f6083", sealInk: "rgba(64,86,110,.8)", type: T.newsreader },
  { id: "ivory-noir", name: "Ivory & Noir", mood: "White peonies and black wax", art: "ivorynoir",
    bg: "#efebe3", onBg: "#151515", onBgSoft: "#3a3a37", card: "#f7f5f1", ink: "#151515", accent: "#151515", sealInk: "rgba(230,230,228,.85)", type: T.bodoni },
  { id: "sage-gold", name: "Sage & Gold", mood: "Ivory roses and eucalyptus", art: "sage",
    bg: "#8e9b85", onBg: "#121a10", onBgSoft: "#1d271b", card: "#f1f3ef", ink: "#2a3326", accent: "#4f6045", sealInk: GOLD_INK, type: T.boska },
  { id: "dusty-mauve", name: "Dusty Mauve", mood: "Mauve roses and a rose-gold seal", art: "mauve",
    bg: "#7d5e6b", onBg: "#fbf6f8", onBgSoft: "#f6edf1", card: "#f5f1f3", ink: "#3e2a32", accent: "#7d4f62", sealInk: "rgba(110,52,46,.8)", type: T.imbue },
];

export const DEFAULT_THEME = THEMES[0].id;

export function getTheme(id: string | undefined): Theme {
  return THEMES.find((t) => t.id === id) || THEMES[0];
}

export function themeAssets(t: Theme) {
  return {
    paper: `/themes/${t.art}-paper.webp`, // 1000px, for small previews
    paperM: `/themes/${t.art}-paper-m.webp`, // 2400 x 3600, phones and tablets
    paperD: `/themes/${t.art}-paper-4k.webp`, // 3600 x 5400, desktop and retina screens
    seal: `/themes/${t.art}-seal.webp`,
    floral: `/themes/${t.art}-floral.webp`,
    card: `/themes/ivory-paper.webp`,
  };
}

export function themeVars(t: Theme, heading?: string): React.CSSProperties {
  const a = themeAssets(t);
  const y: TypeSystem = { ...t.type, ...headingFace(heading) };
  return {
    ["--bg" as string]: t.bg,
    ["--on-bg" as string]: t.onBg,
    ["--on-bg-soft" as string]: t.onBgSoft,
    ["--card" as string]: t.card,
    ["--ink" as string]: t.ink,
    ["--accent" as string]: t.accent,
    ["--seal-ink" as string]: t.sealInk,
    ["--paper-m" as string]: `url(${a.paperM})`,
    ["--paper-d" as string]: `url(${a.paperD})`,
    ["--paper-tone" as string]: t.paperTone || "#ffffff",
    ["--f-display" as string]: y.display,
    // small italic captions stay readable: a script face is for names and titles only
    ["--f-caption" as string]: heading === "script" ? t.type.text : y.display,
    ["--f-text" as string]: y.text,
    ["--display-weight" as string]: String(y.displayWeight),
    ["--display-track" as string]: y.displayTrack,
    ["--display-lead" as string]: String(y.displayLead),
    ["--display-case" as string]: y.upper ? "uppercase" : "none",
    ["--amp-style" as string]: y.connectorItalic ? "italic" : "normal",
    ["--seal-weight" as string]: String(y.sealWeight),
    ["--text-track" as string]: y.textTrack,
    ["--body-lead" as string]: String(y.bodyLead),
    ["--monument-max" as string]: `${y.monumentMax}vw`,
  };
}

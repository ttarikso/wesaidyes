/* Theme catalogue. A theme = paper texture + wax seal + floral art + colours + fonts.
   To add a theme: drop <id>-paper.webp, <id>-seal.webp, <id>-floral.webp into
   public/themes and add an entry below. Font keys map to CSS variables in app/layout.tsx. */

export type ScriptFont = "greatvibes" | "pinyon" | "parisienne" | "allura";
export type SerifFont = "cormorant" | "playfair" | "cinzel";

export interface Theme {
  id: string;
  name: string;
  mood: string;
  art: string; // asset prefix in /public/themes
  bg: string; // fallback colour of the paper
  onBg: string; // text on the coloured paper
  onBgSoft: string;
  card: string; // ivory card colour
  ink: string; // body text on card
  accent: string; // headings, buttons on card
  accentInk: string; // text on accent buttons
  line: string; // hairlines on card
  sealInk: string; // initials on the wax seal
  script: ScriptFont;
  serif: SerifFont;
}

export const THEMES: Theme[] = [
  {
    id: "dusty-blue", name: "Dusty Blue & Silver", mood: "Classic · Eucalyptus", art: "blue",
    bg: "#5f7a99", onBg: "#f6f3ec", onBgSoft: "rgba(246,243,236,.78)", card: "#faf7f1", ink: "#33445a",
    accent: "#4f6a8a", accentInk: "#ffffff", line: "rgba(79,106,138,.28)", sealInk: "rgba(42,60,84,.82)",
    script: "pinyon", serif: "cormorant",
  },
  {
    id: "olive-grove", name: "Olive Grove", mood: "Garden · White roses", art: "olive",
    bg: "#5d6b3a", onBg: "#f7f3e6", onBgSoft: "rgba(247,243,230,.8)", card: "#fbf8ef", ink: "#3b4226",
    accent: "#5d6b3a", accentInk: "#ffffff", line: "rgba(93,107,58,.3)", sealInk: "rgba(32,40,16,.8)",
    script: "greatvibes", serif: "cormorant",
  },
  {
    id: "blush-peony", name: "Blush Peony", mood: "Romantic · Rose gold", art: "blush",
    bg: "#e8c4c0", onBg: "#6a3b3e", onBgSoft: "rgba(106,59,62,.75)", card: "#fdf9f6", ink: "#5a3a3b",
    accent: "#b4686d", accentInk: "#ffffff", line: "rgba(180,104,109,.3)", sealInk: "rgba(120,60,64,.75)",
    script: "parisienne", serif: "cormorant",
  },
  {
    id: "desert-boho", name: "Desert Boho", mood: "Boho · Pampas grass", art: "terracotta",
    bg: "#b86a4b", onBg: "#fbf1e6", onBgSoft: "rgba(251,241,230,.82)", card: "#fbf6ee", ink: "#55331f",
    accent: "#a5573a", accentInk: "#ffffff", line: "rgba(165,87,58,.3)", sealInk: "rgba(90,36,16,.8)",
    script: "allura", serif: "playfair",
  },
  {
    id: "midnight-gold", name: "Midnight & Gold", mood: "Luxury · Celestial", art: "navy",
    bg: "#1c2541", onBg: "#f0e3bf", onBgSoft: "rgba(240,227,191,.8)", card: "#fbf8f0", ink: "#1c2541",
    accent: "#a8822f", accentInk: "#ffffff", line: "rgba(168,130,47,.35)", sealInk: "rgba(110,78,18,.85)",
    script: "greatvibes", serif: "cinzel",
  },
  {
    id: "burgundy-rose", name: "Burgundy Rose", mood: "Moody · Autumn & winter", art: "burgundy",
    bg: "#6b1f2a", onBg: "#f6e7dc", onBgSoft: "rgba(246,231,220,.8)", card: "#fbf6f1", ink: "#4a1620",
    accent: "#7a2333", accentInk: "#ffffff", line: "rgba(122,35,51,.28)", sealInk: "rgba(60,8,16,.82)",
    script: "pinyon", serif: "playfair",
  },
  {
    id: "provence-lavender", name: "Provence Lavender", mood: "Soft · Lavender fields", art: "lavender",
    bg: "#b7a6cf", onBg: "#3c3156", onBgSoft: "rgba(60,49,86,.75)", card: "#fcfaf7", ink: "#3c3156",
    accent: "#6d5a91", accentInk: "#ffffff", line: "rgba(109,90,145,.3)", sealInk: "rgba(72,54,104,.75)",
    script: "parisienne", serif: "cormorant",
  },
  {
    id: "black-tie", name: "Black Tie", mood: "Modern · Calla lilies", art: "noir",
    bg: "#151515", onBg: "#f2efe8", onBgSoft: "rgba(242,239,232,.72)", card: "#fbfaf7", ink: "#1b1b1b",
    accent: "#1b1b1b", accentInk: "#ffffff", line: "rgba(27,27,27,.22)", sealInk: "rgba(220,220,220,.78)",
    script: "allura", serif: "cinzel",
  },
];

export const DEFAULT_THEME = THEMES[0].id;

export function getTheme(id: string | undefined): Theme {
  return THEMES.find((t) => t.id === id) || THEMES[0];
}

export function themeAssets(t: Theme) {
  return {
    paper: `/themes/${t.art}-paper.webp`,
    seal: `/themes/${t.art}-seal.webp`,
    floral: `/themes/${t.art}-floral.webp`,
    card: `/themes/ivory-paper.webp`,
  };
}

export function themeVars(t: Theme): React.CSSProperties {
  const a = themeAssets(t);
  return {
    ["--bg" as string]: t.bg,
    ["--on-bg" as string]: t.onBg,
    ["--on-bg-soft" as string]: t.onBgSoft,
    ["--card" as string]: t.card,
    ["--ink" as string]: t.ink,
    ["--accent" as string]: t.accent,
    ["--accent-ink" as string]: t.accentInk,
    ["--line" as string]: t.line,
    ["--seal-ink" as string]: t.sealInk,
    ["--paper-img" as string]: `url(${a.paper})`,
    ["--card-img" as string]: `url(${a.card})`,
    ["--script" as string]: `var(--f-${t.script})`,
    ["--serif" as string]: `var(--f-${t.serif})`,
  };
}

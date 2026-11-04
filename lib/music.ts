/* Royalty-free background music. All tracks are original, AI-generated (Magnific / Google Lyria)
   for this product, instrumental, ~2.5 minutes, looped on the invitation. Files: public/music/<id>.mp3 */
export interface Track { id: string; title: string; style: string; seconds: number; moment: "ceremony" | "dinner" | "party" }

export const TRACKS: Track[] = [
  { id: "first-light", title: "First Light", style: "Solo piano", seconds: 176, moment: "ceremony" },
  { id: "garden-processional", title: "Garden Processional", style: "String quartet", seconds: 149, moment: "ceremony" },
  { id: "aisle-of-light", title: "Aisle of Light", style: "Violin & piano", seconds: 158, moment: "ceremony" },
  { id: "eternal-canon", title: "Eternal Canon", style: "Strings & harp", seconds: 174, moment: "ceremony" },
  { id: "evermore", title: "Evermore", style: "Cello & piano", seconds: 148, moment: "ceremony" },
  { id: "our-story", title: "Our Story", style: "Cinematic orchestra", seconds: 175, moment: "ceremony" },
  { id: "fairytale", title: "Fairytale", style: "Harp & celesta", seconds: 166, moment: "ceremony" },
  { id: "first-dance-waltz", title: "First Dance Waltz", style: "Piano & strings waltz", seconds: 147, moment: "party" },
  { id: "quiet-morning", title: "Quiet Morning", style: "Ambient piano", seconds: 173, moment: "dinner" },
  { id: "keepsake", title: "Keepsake", style: "Music box & strings", seconds: 146, moment: "dinner" },
  { id: "sunlit-promise", title: "Sunlit Promise", style: "Acoustic guitar", seconds: 158, moment: "dinner" },
  { id: "seaside-vows", title: "Seaside Vows", style: "Spanish guitar", seconds: 164, moment: "dinner" },
  { id: "desert-sunset", title: "Desert Sunset", style: "Boho acoustic", seconds: 155, moment: "dinner" },
  { id: "happily-ever-after", title: "Happily Ever After", style: "Uplifting acoustic", seconds: 153, moment: "party" },
  { id: "sunny-side-love", title: "Sunny Side Love", style: "Ukulele & glockenspiel", seconds: 143, moment: "party" },
  { id: "soft-glow", title: "Soft Glow", style: "Indie pop", seconds: 155, moment: "party" },
  { id: "cozy-hearts", title: "Cozy Hearts", style: "Lo-fi", seconds: 145, moment: "party" },
  { id: "candlelight", title: "Candlelight", style: "Jazz piano trio", seconds: 177, moment: "dinner" },
  { id: "velvet-evening", title: "Velvet Evening", style: "Vintage lounge", seconds: 175, moment: "dinner" },
  { id: "grand-entrance", title: "Grand Entrance", style: "Brass & strings", seconds: 132, moment: "party" },
];

export const MOMENTS = [
  { id: "ceremony", label: "For the ceremony" },
  { id: "dinner", label: "For dinner and drinks" },
  { id: "party", label: "For the first dance and after" },
] as const;
export const fmtLength = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export const trackUrl = (id: string) => `/music/${id}.mp3`;
export const getTrack = (id: string) => TRACKS.find((t) => t.id === id) || null;

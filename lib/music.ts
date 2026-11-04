/* Royalty-free background music. All tracks are original, AI-generated (Magnific / Google Lyria)
   for this product, instrumental, ~2.5 minutes, looped on the invitation. Files: public/music/<id>.mp3 */
export interface Track { id: string; title: string; style: string }

export const TRACKS: Track[] = [
  { id: "first-light", title: "First Light", style: "Solo piano" },
  { id: "garden-processional", title: "Garden Processional", style: "String quartet" },
  { id: "aisle-of-light", title: "Aisle of Light", style: "Violin & piano" },
  { id: "eternal-canon", title: "Eternal Canon", style: "Strings & harp" },
  { id: "evermore", title: "Evermore", style: "Cello & piano" },
  { id: "our-story", title: "Our Story", style: "Cinematic orchestra" },
  { id: "fairytale", title: "Fairytale", style: "Harp & celesta" },
  { id: "first-dance-waltz", title: "First Dance Waltz", style: "Piano & strings waltz" },
  { id: "quiet-morning", title: "Quiet Morning", style: "Ambient piano" },
  { id: "keepsake", title: "Keepsake", style: "Music box & strings" },
  { id: "sunlit-promise", title: "Sunlit Promise", style: "Acoustic guitar" },
  { id: "seaside-vows", title: "Seaside Vows", style: "Spanish guitar" },
  { id: "desert-sunset", title: "Desert Sunset", style: "Boho acoustic" },
  { id: "happily-ever-after", title: "Happily Ever After", style: "Uplifting acoustic" },
  { id: "sunny-side-love", title: "Sunny Side Love", style: "Ukulele & glockenspiel" },
  { id: "soft-glow", title: "Soft Glow", style: "Indie pop" },
  { id: "cozy-hearts", title: "Cozy Hearts", style: "Lo-fi" },
  { id: "candlelight", title: "Candlelight", style: "Jazz piano trio" },
  { id: "velvet-evening", title: "Velvet Evening", style: "Vintage lounge" },
  { id: "grand-entrance", title: "Grand Entrance", style: "Brass & strings" },
];

export const trackUrl = (id: string) => `/music/${id}.mp3`;
export const getTrack = (id: string) => TRACKS.find((t) => t.id === id) || null;

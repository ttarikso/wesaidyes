import type { Metadata, Viewport } from "next";
import { Allura, Cinzel, Cormorant_Garamond, DM_Sans, Great_Vibes, Parisienne, Pinyon_Script, Playfair_Display } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/invite.css";
import { BRAND } from "@/lib/brand";

const greatvibes = Great_Vibes({ subsets: ["latin", "latin-ext"], weight: "400", variable: "--f-greatvibes", display: "swap" });
const pinyon = Pinyon_Script({ subsets: ["latin"], weight: "400", variable: "--f-pinyon", display: "swap" });
const parisienne = Parisienne({ subsets: ["latin", "latin-ext"], weight: "400", variable: "--f-parisienne", display: "swap" });
const allura = Allura({ subsets: ["latin", "latin-ext"], weight: "400", variable: "--f-allura", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--f-cormorant", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--f-playfair", display: "swap" });
const cinzel = Cinzel({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600"], variable: "--f-cinzel", display: "swap" });
const sans = DM_Sans({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700"], variable: "--f-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://wesaidyes.site"),
  title: `${BRAND.name} · Digital Wedding Invitation Website`,
  description: BRAND.tagline,
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fonts = [greatvibes, pinyon, parisienne, allura, cormorant, playfair, cinzel, sans].map((f) => f.variable).join(" ");
  return (
    <html lang="en" className={fonts}>
      <body>{children}</body>
    </html>
  );
}

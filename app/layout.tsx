import type { Metadata, Viewport } from "next";
// Fonts are bundled with the app so builds never depend on a font CDN being reachable.
// Google families via Fontsource; Fontshare families (Boska, Zodiak, Sentient, Gambarino, General Sans) in styles/fonts.css.
import "@fontsource-variable/newsreader/opsz.css";
import "@fontsource-variable/newsreader/opsz-italic.css";
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource-variable/bodoni-moda/opsz.css";
import "@fontsource-variable/bodoni-moda/opsz-italic.css";
import "@fontsource-variable/imbue/opsz.css";
import "@fontsource-variable/jost/wght.css";
import "@fontsource-variable/hanken-grotesk/wght.css";
import "@fontsource-variable/albert-sans/wght.css";
import "@fontsource-variable/cormorant-garamond/wght.css";
import "@/styles/fonts.css";
import "@/styles/globals.css";
import "@/styles/invite.css";
import "@/styles/site.css";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://wesaidyes.site"),
  title: `${BRAND.name} · Digital Wedding Invitation Website`,
  description: BRAND.tagline,
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

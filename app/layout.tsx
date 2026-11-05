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
import { BRAND, CANONICAL_URL } from "@/lib/brand";

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_URL),
  title: { default: `${BRAND.name} · Wedding Invitation Website with RSVP`, template: `%s · ${BRAND.name}` },
  description: BRAND.tagline,
  applicationName: BRAND.name,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: BRAND.name, locale: "en_US", url: "/" },
  twitter: { card: "summary_large_image" },
  // Search Console and Bing Webmaster codes, set in the host's environment once the owner verifies the site
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

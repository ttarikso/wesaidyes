import type { Metadata, Viewport } from "next";
// Fonts are bundled with the app (Fontsource) so builds never depend on Google Fonts being reachable.
import "@fontsource/great-vibes/400.css";
import "@fontsource/pinyon-script/400.css";
import "@fontsource/parisienne/400.css";
import "@fontsource/allura/400.css";
import "@fontsource-variable/cormorant-garamond/wght.css";
import "@fontsource-variable/cormorant-garamond/wght-italic.css";
import "@fontsource-variable/playfair-display/wght.css";
import "@fontsource-variable/playfair-display/wght-italic.css";
import "@fontsource-variable/cinzel/wght.css";
import "@fontsource-variable/dm-sans/wght.css";
import "@/styles/globals.css";
import "@/styles/invite.css";
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

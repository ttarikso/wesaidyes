import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Demo: Open a Digital Wedding Invitation",
  description: "Open a real We Said Yes invitation: tap the wax seal, hear the music, read the day's schedule and try the RSVP form. Switch between all 20 designs and 6 heading fonts.",
  alternates: { canonical: "/demo" },
  openGraph: { url: "/demo" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

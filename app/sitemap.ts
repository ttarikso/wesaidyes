import type { MetadataRoute } from "next";
import { CANONICAL_URL } from "@/lib/brand";
import { THEMES } from "@/lib/themes";
import { GUIDES } from "@/lib/guides";

const UPDATED = new Date("2026-11-05");

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${CANONICAL_URL}${p}`;
  return [
    { url: u("/"), lastModified: UPDATED, changeFrequency: "weekly", priority: 1 },
    { url: u("/demo"), lastModified: UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: u("/designs"), lastModified: UPDATED, changeFrequency: "monthly", priority: 0.9 },
    ...THEMES.map((t) => ({ url: u(`/designs/${t.id}`), lastModified: UPDATED, changeFrequency: "monthly" as const, priority: 0.7, images: [u(`/designs/${t.id}-og.jpg`)] })),
    { url: u("/guides"), lastModified: UPDATED, changeFrequency: "monthly", priority: 0.7 },
    ...GUIDES.map((g) => ({ url: u(`/guides/${g.slug}`), lastModified: new Date(g.updated), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}

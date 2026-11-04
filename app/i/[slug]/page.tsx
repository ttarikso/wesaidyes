import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { inviteBySlug } from "@/lib/store";
import { dateParts } from "@/lib/format";
import { getTheme, themeAssets } from "@/lib/themes";
import Invitation from "@/components/Invitation";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const inv = await inviteBySlug((await params).slug);
  if (!inv || !inv.published) return { title: "Invitation" };
  const d = inv.data;
  const dp = dateParts(d.date);
  const title = `${d.partner1} & ${d.partner2} · You're invited`;
  const description = [dp?.long, d.venueName].filter(Boolean).join(" · ");
  const image = d.heroPhoto || themeAssets(getTheme(inv.theme)).floral;
  return { title, description, openGraph: { title, description, images: [image] }, robots: { index: false, follow: false } };
}

export default async function Page({ params }: Props) {
  const inv = await inviteBySlug((await params).slug);
  if (!inv || !inv.published) notFound();
  return <Invitation data={inv.data} theme={inv.theme} music={inv.music} slug={inv.slug} />;
}

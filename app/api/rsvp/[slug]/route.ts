import { NextRequest, NextResponse } from "next/server";
import { bad, limited } from "@/lib/auth";
import { addRsvp, inviteBySlug } from "@/lib/store";

type Ctx = { params: Promise<{ slug: string }> };
const s = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");

export async function POST(req: NextRequest, { params }: Ctx) {
  if (limited(req, "rsvp", 30)) return bad("Too many replies from this device. Please try again later.", 429);
  const inv = await inviteBySlug((await params).slug);
  if (!inv || !inv.published || !inv.data.rsvp.enabled) return bad("RSVP is not open for this invitation.", 404);
  const r = inv.data.rsvp;
  if (r.deadline && new Date(r.deadline + "T23:59:59") < new Date()) return bad("The RSVP deadline has passed. Please contact the couple directly.");
  const b = await req.json().catch(() => ({}));
  if (s(b.website, 50)) return NextResponse.json({ ok: true }); // honeypot
  const name = s(b.name, 100);
  if (name.length < 2) return bad("Please enter your full name.");
  if (typeof b.attending !== "boolean") return bad("Please let us know if you can attend.");
  const guests = b.attending && r.askGuests ? Math.max(0, Math.min(r.maxGuests, Math.floor(Number(b.guests) || 0))) : 0;
  await addRsvp({
    invitation_id: inv.id,
    name,
    email: s(b.email, 160),
    attending: b.attending,
    guests,
    guest_names: guests ? s(b.guest_names, 300) : "",
    meal: b.attending && r.askMeal ? s(b.meal, 60) : "",
    diet: b.attending && r.askDiet ? s(b.diet, 300) : "",
    song: b.attending && r.askSong ? s(b.song, 160) : "",
    message: r.askMessage ? s(b.message, 1000) : "",
    custom: r.customQuestion ? s(b.custom, 500) : "",
  });
  return NextResponse.json({ ok: true });
}

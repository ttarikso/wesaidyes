import type { InviteData, RsvpSettings, Sections } from "./types";

export const DEFAULT_RSVP: RsvpSettings = {
  enabled: true,
  deadline: "",
  yesLabel: "Joyfully accepts",
  noLabel: "Regretfully declines",
  askGuests: true,
  maxGuests: 1,
  askMeal: false,
  mealOptions: ["Meat", "Fish", "Vegetarian"],
  askDiet: true,
  askSong: true,
  askMessage: true,
  customQuestion: "",
};

export const DEFAULT_SECTIONS: Sections = {
  countdown: true,
  story: true,
  schedule: true,
  details: true,
  gallery: true,
  faq: true,
};

export function blankInvite(): InviteData {
  const d = new Date();
  d.setMonth(d.getMonth() + 8);
  return {
    partner1: "Amelia",
    partner2: "Julian",
    initials: "A&J",
    date: d.toISOString().slice(0, 10),
    time: "16:00",
    openText: "Tap to open the invitation",
    hostLine: "Together with their families",
    inviteLine: "request the pleasure of your company at the celebration of their marriage",
    venueName: "The Garden Estate",
    venueAddress: "12 Rosewood Lane, Napa, California",
    mapUrl: "",
    heroPhoto: "",
    storyTitle: "Our Story",
    storyText:
      "We met on a rainy afternoon in a tiny bookshop and never stopped talking. Years of adventures, quiet Sundays and one very nervous question later, we're getting married, and we would love for you to be there.",
    storyPhotos: [],
    schedule: [
      { time: "16:00", title: "Ceremony", note: "Rose Garden" },
      { time: "17:00", title: "Cocktail Hour", note: "The Terrace" },
      { time: "18:30", title: "Dinner & Toasts", note: "Grand Hall" },
      { time: "20:30", title: "Dancing", note: "Until late" },
    ],
    dressCode: "Formal attire. We kindly ask our guests to wear soft, muted tones.",
    palette: ["#c9b8a3", "#8a9a8c", "#5f7a99", "#e8d8c9", "#a37e6c"],
    accommodation: "We have reserved a block of rooms at a nearby hotel. Please mention our names when booking.",
    gallery: [],
    faqs: [
      { q: "Can I bring a plus one?", a: "Your invitation will show how many seats are reserved for you in the RSVP form." },
      { q: "Are children welcome?", a: "We love your little ones, but we have chosen to make our day an adults-only celebration." },
      { q: "Is there parking?", a: "Yes, free parking is available at the venue." },
    ],
    closingLine: "We can't wait to celebrate with you",
    rsvp: { ...DEFAULT_RSVP },
    sections: { ...DEFAULT_SECTIONS },
  };
}

const str = (v: unknown, max = 400) => (typeof v === "string" ? v.slice(0, max) : "");
const bool = (v: unknown, d: boolean) => (typeof v === "boolean" ? v : d);
const urls = (v: unknown, n: number) =>
  Array.isArray(v) ? v.filter((x) => typeof x === "string" && /^(https?:\/\/|\/)/.test(x)).slice(0, n).map((x) => x.slice(0, 600)) : [];
const hex = (v: unknown) => (typeof v === "string" && /^#[0-9a-fA-F]{6}$/.test(v) ? v : null);

/** Merge anything a client sends onto a valid InviteData, trimming lengths. */
export function normalizeInvite(raw: unknown): InviteData {
  const b = blankInvite();
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const rr = (r.rsvp && typeof r.rsvp === "object" ? r.rsvp : {}) as Record<string, unknown>;
  const rs = (r.sections && typeof r.sections === "object" ? r.sections : {}) as Record<string, unknown>;
  const has = (k: string) => k in r;
  const s = (k: keyof InviteData, max = 400) => (has(k) ? str(r[k], max) : (b[k] as string));
  return {
    partner1: s("partner1", 60),
    partner2: s("partner2", 60),
    initials: s("initials", 8),
    date: /^\d{4}-\d{2}-\d{2}$/.test(str(r.date)) ? str(r.date) : b.date,
    time: /^\d{2}:\d{2}$/.test(str(r.time)) ? str(r.time) : has("time") ? "" : b.time,
    openText: s("openText", 60),
    hostLine: s("hostLine", 120),
    inviteLine: s("inviteLine", 200),
    venueName: s("venueName", 120),
    venueAddress: s("venueAddress", 200),
    mapUrl: /^https?:\/\//.test(str(r.mapUrl)) ? str(r.mapUrl, 600) : "",
    heroPhoto: urls([r.heroPhoto], 1)[0] || "",
    storyTitle: s("storyTitle", 60),
    storyText: s("storyText", 1500),
    storyPhotos: has("storyPhotos") ? urls(r.storyPhotos, 3) : b.storyPhotos,
    schedule: Array.isArray(r.schedule)
      ? r.schedule.slice(0, 10).map((x: Record<string, unknown>) => ({ time: str(x?.time, 10), title: str(x?.title, 60), note: str(x?.note, 100) }))
      : b.schedule,
    dressCode: s("dressCode", 400),
    palette: Array.isArray(r.palette) ? (r.palette.map(hex).filter(Boolean) as string[]).slice(0, 6) : b.palette,
    accommodation: s("accommodation", 800),
    gallery: has("gallery") ? urls(r.gallery, 9) : b.gallery,
    faqs: Array.isArray(r.faqs)
      ? r.faqs.slice(0, 12).map((x: Record<string, unknown>) => ({ q: str(x?.q, 160), a: str(x?.a, 600) }))
      : b.faqs,
    closingLine: s("closingLine", 120),
    rsvp: {
      enabled: bool(rr.enabled, b.rsvp.enabled),
      deadline: /^\d{4}-\d{2}-\d{2}$/.test(str(rr.deadline)) ? str(rr.deadline) : "",
      yesLabel: "yesLabel" in rr ? str(rr.yesLabel, 40) || b.rsvp.yesLabel : b.rsvp.yesLabel,
      noLabel: "noLabel" in rr ? str(rr.noLabel, 40) || b.rsvp.noLabel : b.rsvp.noLabel,
      askGuests: bool(rr.askGuests, b.rsvp.askGuests),
      maxGuests: Math.max(0, Math.min(10, Number(rr.maxGuests ?? b.rsvp.maxGuests) || 0)),
      askMeal: bool(rr.askMeal, b.rsvp.askMeal),
      mealOptions: Array.isArray(rr.mealOptions) ? rr.mealOptions.map((x) => str(x, 40)).filter(Boolean).slice(0, 6) : b.rsvp.mealOptions,
      askDiet: bool(rr.askDiet, b.rsvp.askDiet),
      askSong: bool(rr.askSong, b.rsvp.askSong),
      askMessage: bool(rr.askMessage, b.rsvp.askMessage),
      customQuestion: str(rr.customQuestion, 160),
    },
    sections: {
      countdown: bool(rs.countdown, true),
      story: bool(rs.story, true),
      schedule: bool(rs.schedule, true),
      details: bool(rs.details, true),
      gallery: bool(rs.gallery, true),
      faq: bool(rs.faq, true),
    },
  };
}

export function slugify(s: string) {
  return s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, "-and-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export const RESERVED_SLUGS = new Set(["admin", "api", "studio", "redeem", "demo", "i", "help", "www", "login"]);

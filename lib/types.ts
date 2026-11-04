export interface License {
  id: string;
  order_id: string;
  email: string | null;
  key: string | null;
  status: "available" | "claimed" | "revoked";
  source?: "manual" | "etsy" | "legacy";
  etsy_quantity?: number;
  etsy_status?: string | null;
  verified_at?: string | null;
  created_at: string;
  claimed_at: string | null;
}

export interface EtsyAuth {
  id: number;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  updated_at: string;
}

export type EtsyVerdict =
  | { ok: true; quantity: number; status: string }
  | { ok: false; reason: "not_found" | "other_listing" | "refunded" | "unpaid" | "unavailable" };

export interface ScheduleItem { time: string; title: string; note: string }
export interface Faq { q: string; a: string }

export interface RsvpSettings {
  enabled: boolean;
  deadline: string; // yyyy-mm-dd or ""
  yesLabel: string;
  noLabel: string;
  askGuests: boolean;
  maxGuests: number; // additional guests allowed per reply
  askMeal: boolean;
  mealOptions: string[];
  askDiet: boolean;
  askSong: boolean;
  askMessage: boolean;
  customQuestion: string; // "" = off
}

export interface Sections {
  countdown: boolean;
  story: boolean;
  schedule: boolean;
  details: boolean;
  gallery: boolean;
  faq: boolean;
}

export interface InviteData {
  partner1: string;
  partner2: string;
  initials: string; // shown on the wax seal, e.g. "A&J"
  date: string; // yyyy-mm-dd
  time: string; // HH:mm (24h)
  openText: string;
  hostLine: string; // "Together with their families"
  inviteLine: string; // "request the pleasure of your company at their wedding"
  venueName: string;
  venueAddress: string;
  mapUrl: string;
  heroPhoto: string;
  storyTitle: string;
  storyText: string;
  storyPhotos: string[];
  schedule: ScheduleItem[];
  dressCode: string;
  palette: string[]; // dress code colour swatches (hex)
  accommodation: string;
  gallery: string[];
  faqs: Faq[];
  closingLine: string;
  rsvp: RsvpSettings;
  sections: Sections;
}

export interface Invitation {
  id: string;
  license_id: string;
  slug: string;
  theme: string;
  music: string; // track id or "none"
  published: boolean;
  published_at?: string | null; // first publish; the 45-day limit counts from here (lib/expiry.ts)
  data: InviteData;
  created_at: string;
  updated_at: string;
}

export interface Rsvp {
  id: string;
  invitation_id: string;
  name: string;
  email: string;
  attending: boolean;
  guests: number; // additional guests
  guest_names: string;
  meal: string;
  diet: string;
  song: string;
  message: string;
  custom: string;
  created_at: string;
}

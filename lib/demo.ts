import { blankInvite } from "./defaults";
import type { InviteData } from "./types";

/** Sample content for /demo (the Etsy "try before you buy" link). */
export function demoInvite(): InviteData {
  const b = blankInvite();
  return {
    ...b,
    partner1: "Amelia",
    partner2: "Julian",
    initials: "A&J",
    heroPhoto: "/demo/hero.webp",
    storyPhotos: ["/demo/story-1.webp", "/demo/story-2.webp", "/demo/story-3.webp"],
    gallery: ["/demo/gallery-1.webp", "/demo/story-1.webp", "/demo/story-2.webp", "/demo/hero.webp"],
    rsvp: { ...b.rsvp, askMeal: true, maxGuests: 2 },
  };
}

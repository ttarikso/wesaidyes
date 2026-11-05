// Homepage questions and facts; also read by /llms.txt.
import { FACTS } from "@/lib/brand";

export const FAQ: [string, string][] = [
  ["Do our guests need an app or an account?", "No. The invitation opens in any phone or computer browser from the link you send."],
  ["How long does the invitation stay online?", "Until 7 days after your wedding, for up to 45 days from the day you first publish it. Publish within about six weeks of the wedding and it stays online through the day."],
  ["Can we change details after sending the link?", "Yes. Change the time, the venue or anything else, and everyone sees the update on the same link."],
  ["How many guests can reply?", "As many as you invite. There is no limit on guests or replies."],
  ["Can we switch to another design later?", "At any time. Your names, words and photos move to the new design as they are."],
  ["Can we use our own song?", "Not yet. Choose one of the twenty original tracks, or turn the music off."],
  ["Which languages does it support?", "The section titles are in English. Every line you write yourself, your story and your details, can be in any language."],
  ["How do we get in after buying?", "Go to wesaidyes.site/redeem and enter your Etsy order number and email. Use the same two to sign in again on any device."],
];

export const FACT_ROWS: [string, string][] = [
  ["Buying", "One payment on Etsy. No subscription. See the Etsy listing for the current price."],
  ["What you get", "One wedding invitation website with an envelope opening, music, countdown, your story and photos, the order of the day, a map link, a calendar file and an RSVP form."],
  ["Designs", `${FACTS.designs} designs, each with its own paper, wax seal, flowers and typefaces, plus ${FACTS.headingFonts} heading fonts to choose from.`],
  ["Songs", `${FACTS.songs} original tracks, or no music.`],
  ["Replies", "Attendance, plus-ones with names, meal choice, dietary needs, a song request and a note. Download every reply as a spreadsheet."],
  ["Guests", "No limit on guests or replies. Guests need no app and no account."],
  ["Online for", `Until ${FACTS.daysAfterWedding} days after your wedding, for up to ${FACTS.maxDaysOnline} days from the day you first publish.`],
  ["Languages", "Section titles are in English; everything you write can be in any language."],
];

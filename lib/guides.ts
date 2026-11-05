// Guides at /guides/[slug]. Each opens with a short answer (what search engines and AI answers quote),
// then the detail, a few questions, and the sources for any figure taken from elsewhere.

export type Block =
  | { h2: string }
  | { p: string }
  | { ul: string[] }
  | { ol: string[] }
  | { quote: string; note?: string }
  | { table: { head: string[]; rows: string[][]; caption?: string } };

export type Guide = {
  slug: string;
  title: string; // the H1, phrased as the question people search
  seoTitle: string;
  description: string;
  answer: string; // two or three sentences, the direct answer
  updated: string; // ISO date
  read: number; // minutes
  body: Block[];
  faq: [string, string][];
  sources?: { name: string; url: string }[];
};

export const GUIDES: Guide[] = [
  {
    slug: "how-to-collect-wedding-rsvps-online",
    title: "How to collect wedding RSVPs online",
    seoTitle: "How to Collect Wedding RSVPs Online (Step by Step)",
    description: "A simple way to collect wedding RSVPs online: one link with a reply form for attendance, plus-ones, meals and dietary needs, and one list that fills itself in.",
    answer: "Send each guest one link to a wedding invitation website with a reply form, and set a reply-by date three to four weeks before the wedding. Ask only what you need to plan (attendance, plus-ones, meal choice, dietary needs) and keep every answer in one list you can download for the caterer and the seating plan.",
    updated: "2026-11-05",
    read: 5,
    body: [
      { h2: "1. Decide what you need to know" },
      { p: "Every question on the form is one more thing a guest has to answer, so ask only what changes your plans. Most couples need four things:" },
      { ul: [
        "Attending or not, which is the one answer you need from everyone.",
        "Plus-ones: whether the guest is bringing someone, and that person's name.",
        "Meal choice, if your caterer serves set menus.",
        "Dietary needs and allergies, as free text, so nothing is lost in a tick box.",
      ] },
      { p: "Optional extras guests enjoy: a song request for the dance floor and a short note to the couple. They cost nothing to answer and often become the best part of the guest list." },
      { h2: "2. Put the form where the invitation is" },
      { p: "The fewer steps between opening the invitation and replying, the more replies you get on time. A reply form on the invitation itself works better than a separate form or a link to another site: the guest reads the date and place, taps Reply, answers, and is done." },
      { p: "Guests should not need an app or an account. Anything that asks them to sign up before replying will cost you answers, especially from older relatives." },
      { h2: "3. Set a reply-by date" },
      { p: "Most planners set the reply-by date three to four weeks before the wedding. That leaves time to give the caterer final numbers, finish the seating plan and chase anyone who has not answered. Show the date clearly on the invitation and again next to the reply button." },
      { h2: "4. Send one link to everyone" },
      { p: "Send the same link by WhatsApp, text message or email, whichever each guest actually reads. For guests who prefer paper, print the link as a QR code on a save-the-date or a small card. One link also means one place to update if the time or venue changes." },
      { h2: "5. Keep every reply in one list" },
      { p: "Replies should arrive in a single guest list with a running count: how many are coming, how many declined, how many extra guests. Being able to download that list as a spreadsheet saves retyping it for the caterer, the venue and the seating chart." },
      { h2: "6. Follow up before the deadline" },
      { p: "A week before the reply-by date, look at who has not answered and send a short personal message with the same link. A friendly nudge from the couple works better than an automatic reminder." },
      { h2: "How We Said Yes handles this" },
      { p: "We Said Yes is a wedding invitation website with the reply form built in. Guests open a sealed envelope, read the day's details and reply in under a minute: attending, plus-ones with names, meal, dietary needs, a song request and a note, with an optional reply-by date. Every answer appears in your guest list as it arrives, and you can download the list as a spreadsheet. There is no limit on guests or replies." },
    ],
    faq: [
      ["What is a good RSVP deadline for a wedding?", "Three to four weeks before the wedding is the usual choice. It gives you time to send final numbers to the caterer and venue and to finish the seating plan."],
      ["Should we ask guests about dietary requirements on the RSVP?", "Yes. Ask in a free-text field so guests can describe allergies and needs in their own words, and pass the list to your caterer."],
      ["Do guests need an account to RSVP online?", "They should not. The best online RSVP forms open from a link in any phone browser and take a minute to fill in."],
      ["Can older guests reply online?", "Most can when the form is simple and opens straight from a message. For anyone who cannot, take their answer by phone and add it to the list yourself."],
    ],
  },
  {
    slug: "digital-vs-paper-wedding-invitations",
    title: "Digital vs paper wedding invitations: cost, etiquette and what guests prefer",
    seoTitle: "Digital vs Paper Wedding Invitations: Cost and Etiquette",
    description: "How digital and paper wedding invitations compare on cost, time, etiquette and RSVPs, with real price figures and when each makes sense.",
    answer: "Digital wedding invitations cost far less than paper (often a single fee instead of several dollars per invitation plus postage), arrive instantly and collect RSVPs for you. Paper still suits very formal weddings and guests who expect a keepsake; many couples now send a digital invitation to everyone and post a few printed ones to grandparents.",
    updated: "2026-11-05",
    read: 6,
    body: [
      { h2: "What paper invitations cost" },
      { p: "Printed invitations are priced per piece. Paperless Post, summarising stationery price guides, puts a stationery-store invitation at roughly $7 each before inserts, and design-studio invitations at $10 to $30 each, with studio packages often starting around $1,000. Shipping and postage can add about $50 to $60 per 100 invitations, and RSVP cards need return postage too." },
      { h2: "What digital invitations cost" },
      { p: "Digital services use three pricing models:" },
      { table: {
        head: ["Model", "Example", "Typical cost for 100 guests"],
        rows: [
          ["Free website, often linked to a registry", "Zola, The Knot, Joy", "Free"],
          ["Per guest or per mailing", "Paperless Post, Greenvelope", "About $25 to $120 per send (Paperless Post); $99 per mailing (Greenvelope)"],
          ["One payment per invitation", "We Said Yes", "One Etsy payment, any number of guests"],
        ],
        caption: "Prices as published by each service in 2026; see sources below.",
      } },
      { h2: "Etiquette: is a digital wedding invitation acceptable?" },
      { p: "Yes. Digital invitations are now common for every kind of wedding, and wedding etiquette guides treat them as acceptable as long as the invitation is personal and complete: the couple's names, the date and time, the venue, what to wear, and a clear way to reply. What still reads as impersonal is a bare group message with no invitation at all." },
      { p: "Two habits keep a digital invitation feeling special: send it individually rather than to a group chat, and give it a design that feels like stationery rather than a form." },
      { h2: "Where digital is clearly better" },
      { ul: [
        "RSVPs come back on their own, with meals and dietary needs, instead of being chased by phone.",
        "Changes reach everyone: a new start time or venue updates on the same link.",
        "Guests abroad receive it the same day, with no international postage.",
        "The map, calendar file and day schedule are one tap away on the guest's phone.",
      ] },
      { h2: "Where paper still wins" },
      { ul: [
        "A physical keepsake for the couple and their families.",
        "Very formal or traditional weddings where the family expects engraved stationery.",
        "Guests who do not use a smartphone or email.",
      ] },
      { h2: "The mixed approach" },
      { p: "Many couples send the digital invitation to everyone and print a small number for grandparents and close family, often with a QR code that opens the same invitation and reply form. You keep one guest list and still hand a few people something to hold." },
    ],
    faq: [
      ["Are digital wedding invitations tacky?", "No. They are widely used and accepted. What matters is that the invitation is complete, personal and sent individually."],
      ["How much can we save with digital invitations?", "For 100 guests, printed invitations at $7 to $30 each plus postage come to several hundred to several thousand dollars. Digital options range from free to around $100, or a single fixed payment."],
      ["Can we print a digital invitation?", "Yes. Most couples print the link as a QR code on a card for guests who prefer paper, so everyone replies to the same list."],
    ],
    sources: [
      { name: "Paperless Post: How much do wedding invitations cost?", url: "https://www.paperlesspost.com/blog/how-much-do-wedding-invitations-cost/" },
      { name: "Carly: Paperless Post pricing 2026", url: "https://www.usecarly.com/blog/paperless-post-pricing/" },
      { name: "Greenvelope: How much does Greenvelope cost?", url: "https://www.greenvelope.com/resources/how-much-does-greenvelope-cost" },
      { name: "Zola: The best online wedding RSVP tools", url: "https://www.zola.com/expert-advice/best-online-wedding-rsvp-tools" },
    ],
  },
  {
    slug: "what-to-write-on-a-wedding-invitation",
    title: "What to write on a wedding invitation (with wording examples)",
    seoTitle: "What to Write on a Wedding Invitation: Wording Examples",
    description: "The seven things every wedding invitation says, in order, with formal, relaxed and parent-hosted wording examples you can copy.",
    answer: "A wedding invitation says who is hosting, the invitation line, the couple's names, the date and time, the venue and city, what follows the ceremony, and how to reply. Formal invitations spell out the date and time in words; relaxed ones use numerals and a warmer line such as “We'd love you to celebrate with us”.",
    updated: "2026-11-05",
    read: 5,
    body: [
      { h2: "The seven parts, in order" },
      { ol: [
        "The hosts: the couple, their families, or both.",
        "The invitation line: “request the pleasure of your company” or a warmer equivalent.",
        "The couple's names.",
        "The date and time.",
        "The venue and the town or city.",
        "What follows: “Reception to follow”, “Dinner and dancing to follow”.",
        "How and by when to reply.",
      ] },
      { p: "Dress code, accommodation and travel details traditionally go on a separate card or, today, on the wedding website the invitation links to." },
      { h2: "Formal wording" },
      { quote: "Together with their families\nAmelia Hart and Julian Moreau\nrequest the pleasure of your company\nat the celebration of their marriage\nSaturday, the fifth of June\ntwo thousand twenty-seven\nat four o'clock in the afternoon\nThe Garden Estate, Napa, California\nReception to follow", note: "Formal: date and time in words, no abbreviations." },
      { h2: "Relaxed wording" },
      { quote: "Amelia & Julian are getting married!\nWe'd love you to celebrate with us\nSaturday 5 June 2027, 4 PM\nThe Garden Estate, Napa\nDinner, drinks and dancing to follow", note: "Relaxed: numerals and a personal line are fine." },
      { h2: "Hosted by parents" },
      { quote: "Mr and Mrs David Hart\nrequest the pleasure of your company\nat the marriage of their daughter\nAmelia\nto\nJulian Moreau\n…", note: "The hosts' names come first; the bride's surname is left out because it matches her parents'." },
      { h2: "Small rules that make it read right" },
      { ul: [
        "“The honour of your presence” is traditionally used for a religious ceremony, “the pleasure of your company” for anything else.",
        "Write times as “four o'clock” on formal invitations, never “4:00 p.m.”.",
        "Put the city, but leave the full street address for the website or details card.",
        "Say who is invited: addressing the invitation to a named guest, or “and guest”, answers the plus-one question before anyone asks.",
        "Give the reply-by date, usually three to four weeks before the wedding.",
      ] },
      { h2: "On a wedding invitation website" },
      { p: "A digital invitation follows the same order but has room for more: your story, photos, the order of the day with times, the venue on a map, dress code and accommodation, and a reply form. On We Said Yes the opening line, the invitation line and every detail are yours to write, in any language." },
    ],
    faq: [
      ["Do you put “and guest” on a wedding invitation?", "Only if the guest may bring someone. Naming the plus-one, or writing “and guest”, tells them clearly; leaving it off means the invitation is for them alone."],
      ["Should a wedding invitation include the registry?", "Traditionally no. Put registry details on your wedding website instead and link to it."],
      ["Is it OK to write the date in numerals?", "Yes for relaxed invitations. Formal invitations spell out the day, the date and the year in words."],
    ],
  },
  {
    slug: "send-wedding-invitations-by-text-or-whatsapp",
    title: "How to send wedding invitations by text or WhatsApp",
    seoTitle: "How to Send Wedding Invitations by Text or WhatsApp",
    description: "How to send a wedding invitation by WhatsApp, text or email so it feels personal: a short message, one link per guest, a reply-by date and a follow-up.",
    answer: "Send each guest a short personal message with one link to your invitation website, not a group message. Include their name, one line about the day, the link and the reply-by date, then send a friendly reminder a week before the deadline to anyone who has not replied.",
    updated: "2026-11-05",
    read: 4,
    body: [
      { h2: "Send it one by one" },
      { p: "A message in a group chat reads like an announcement. The same link sent to each guest by name reads like an invitation. WhatsApp's broadcast lists and most email tools let you send individually without retyping everything." },
      { h2: "A message you can copy" },
      { quote: "Dear Sophie, we're getting married on 5 June 2027 in Napa and we would love you to be there. Your invitation is here: wesaidyes.site/i/amelia-and-julian\nPlease reply by 8 May. Amelia & Julian" },
      { p: "Keep it to three lines. The invitation itself carries the details, so the message only needs to make the guest open it." },
      { h2: "Make the link look good" },
      { p: "When you paste a link into WhatsApp or iMessage, the app shows a preview card with an image and a title. Check the preview before sending to everyone: it is the first thing your guests see. We Said Yes invitations show the couple's names and photo in that preview." },
      { h2: "For guests who prefer paper" },
      { p: "Print the same link as a QR code on a save-the-date or a small card. Everyone ends up on the same invitation and the same reply form, so you still have one guest list." },
      { h2: "Timing" },
      { p: "Digital invitations can go out a little later than paper ones because they arrive instantly: six to eight weeks before the wedding is typical, earlier for guests who need to travel. Send everyone on the same day so nobody feels like a second-round guest." },
      { h2: "Follow up kindly" },
      { p: "A week before the reply-by date, message anyone who has not answered: “Hi Tom, just checking you got our invitation. Here is the link again, we'd love to know by Friday.” Most late replies are simply missed messages." },
    ],
    faq: [
      ["Is it rude to send a wedding invitation by WhatsApp?", "No, as long as it is sent personally to each guest with a proper invitation behind the link, not as a bare group message."],
      ["Should the WhatsApp message include all the details?", "No. Keep the message short and let the invitation carry the date, venue, schedule and reply form."],
      ["How do we invite guests who don't use smartphones?", "Call them, or post a printed card with a QR code and add their answer to your guest list yourself."],
    ],
  },
  {
    slug: "when-to-send-wedding-invitations",
    title: "When to send wedding invitations and set the RSVP deadline",
    seoTitle: "When to Send Wedding Invitations (and the RSVP Deadline)",
    description: "A simple wedding invitation timeline: when to send save-the-dates, invitations and reminders, and when to set the RSVP deadline, for local, destination and overseas guests.",
    answer: "Send wedding invitations six to eight weeks before the wedding, closer to six weeks when guests reply online, and nine to ten weeks ahead for guests travelling from abroad. Set the RSVP deadline about three to four weeks before the day.",
    updated: "2026-11-05",
    read: 4,
    body: [
      { h2: "The timeline" },
      { table: {
        head: ["When", "What"],
        rows: [
          ["6 to 12 months before", "Save-the-dates, especially for destination weddings and guests who will fly in"],
          ["9 to 10 weeks before", "Invitations to guests travelling from overseas"],
          ["6 to 8 weeks before", "Invitations to everyone else (6 weeks is enough with online replies)"],
          ["4 to 5 weeks before", "Gentle reminder to anyone who has not opened or replied"],
          ["3 to 4 weeks before", "RSVP deadline"],
          ["2 to 3 weeks before", "Final numbers to the caterer and venue; seating plan"],
        ],
      } },
      { p: "The Knot recommends six to eight weeks for invitations, aiming closer to six with digital RSVPs, nine to ten weeks for overseas guests, and about eight weeks for destination and holiday weddings." },
      { h2: "Why online replies shorten the timeline" },
      { p: "Paper RSVP cards need time to travel back. With a reply form on the invitation, guests answer the day they open it, so you can send a little later and still have your numbers in time." },
      { h2: "Short engagements" },
      { p: "If you are skipping save-the-dates, send invitations earlier instead: around three months ahead gives guests time to book travel and time off." },
      { h2: "Changes after sending" },
      { p: "With a paper invitation a change means a second mailing. With an invitation website, update the time or venue and everyone sees it on the same link; send a short message to tell guests something changed." },
    ],
    faq: [
      ["Is two months too early to send wedding invitations?", "No. Eight weeks is the traditional standard. Earlier is fine for destination weddings or guests who need to travel."],
      ["How long should guests have to RSVP?", "About three to five weeks after receiving the invitation, with the deadline three to four weeks before the wedding."],
      ["Do we still need save-the-dates if we send digital invitations?", "Only if guests need to plan travel well ahead. For local weddings a digital invitation sent eight weeks out is usually enough."],
    ],
    sources: [{ name: "The Knot: When to send wedding invitations", url: "https://www.theknot.com/content/when-to-send-wedding-invitations" }],
  },
  {
    slug: "we-said-yes-vs-zola-paperless-post-greenvelope",
    title: "We Said Yes vs Zola, Paperless Post and Greenvelope",
    seoTitle: "We Said Yes vs Zola, Paperless Post and Greenvelope (2026)",
    description: "An honest comparison of We Said Yes with Zola, Paperless Post and Greenvelope: pricing models, RSVP features, design and which suits which couple.",
    answer: "Zola is a free all-in-one wedding website with registry and planning tools; Paperless Post and Greenvelope send designed digital cards priced by guests or mailings; We Said Yes is one designed invitation website, opened from a wax-sealed envelope with music, with RSVP built in, for one payment on Etsy and no guest limit.",
    updated: "2026-11-05",
    read: 6,
    body: [
      { h2: "At a glance" },
      { table: {
        head: ["", "We Said Yes", "Zola", "Paperless Post", "Greenvelope"],
        rows: [
          ["What it is", "Invitation website with envelope opening, music and RSVP", "Wedding website, registry and planning tools", "Digital card sent by email or text", "Digital card in an animated envelope"],
          ["Price model", "One payment on Etsy", "Free website and RSVP", "Free designs free up to 50 sends; otherwise per guest in coins", "Per mailing by guest count, or yearly membership"],
          ["Example: 100 guests", "One payment, any number of guests", "Free", "About $46 (Basic) to $120 (All Access) per card", "$99 single mailing"],
          ["RSVP", "Attendance, plus-ones, meals, dietary needs, song request, note; spreadsheet download", "Multiple events, guest restrictions, reminders, seating chart", "Yes", "Yes"],
          ["Music", "20 original songs", "No", "No", "No"],
          ["Guest app or account", "Not needed", "Not needed to RSVP", "Not needed", "Not needed"],
          ["How long online", "Until 7 days after the wedding, up to 45 days from publishing", "Ongoing", "Per event", "Per mailing"],
        ],
        caption: "Competitor details as published in 2026; check each service for current prices.",
      } },
      { h2: "Choose Zola (or The Knot, or Joy) if…" },
      { p: "You want a free, long-lived wedding website that also runs your registry, several events, a seating chart and planning checklists. These are full planning platforms; the invitation is one part of them." },
      { h2: "Choose Paperless Post or Greenvelope if…" },
      { p: "You want to send a designed card by email or text with tracking, and you are comfortable paying per guest or per mailing. Both have large design libraries, and Paperless Post's free designs cost nothing for small guest lists." },
      { h2: "Choose We Said Yes if…" },
      { p: "You want the invitation itself to be the moment: guests tap a wax seal with your initials, the envelope opens, your song plays, and the invitation unfolds into your photo, your story, the order of the day and a reply form. You pay once on Etsy, invite as many people as you like and see every reply in one list." },
      { h2: "What We Said Yes does not do" },
      { ul: [
        "No registry and no seating chart; link to your registry from the invitation instead.",
        "One invitation website per order, for one wedding.",
        "Section titles are in English (everything you write can be in any language).",
        "You choose from 20 original songs; your own song cannot be uploaded yet.",
        "It stays online until 7 days after the wedding, up to 45 days from first publishing, so publish within about six weeks of the day.",
      ] },
    ],
    faq: [
      ["Is Zola's wedding website really free?", "Yes. Zola lists its wedding website and RSVP tool as free; it earns from its registry and other services."],
      ["How much does Paperless Post cost for a wedding?", "Free designs are free for the first 50 invitations; beyond that each design costs a number of coins per guest. For 100 guests a card costs roughly $46 to $120 depending on the features."],
      ["How much does Greenvelope cost?", "Greenvelope lists $99 for a single mailing to up to 100 guests and $249 for up to 250, with yearly memberships for several mailings."],
      ["Can We Said Yes and Zola be used together?", "Yes. Some couples send a We Said Yes invitation and link to their Zola registry from it."],
    ],
    sources: [
      { name: "Zola: The best online wedding RSVP tools", url: "https://www.zola.com/expert-advice/best-online-wedding-rsvp-tools" },
      { name: "Carly: Paperless Post pricing 2026", url: "https://www.usecarly.com/blog/paperless-post-pricing/" },
      { name: "Greenvelope: How much does Greenvelope cost?", url: "https://www.greenvelope.com/resources/how-much-does-greenvelope-cost" },
    ],
  },
];

export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);
